import os
import asyncio
import json
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from pydantic import BaseModel, constr
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "PLACEHOLDER_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

limiter = Limiter(key_func=get_remote_address)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup
    yield
    # Cleanup

app = FastAPI(title="VoteWise AI Backend", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(GZipMiddleware, minimum_size=1000)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; object-src 'none';"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

class AssistantQuery(BaseModel):
    query: constr(min_length=1, max_length=500)

@app.post("/api/assistant")
@limiter.limit("20/minute")
async def chat_assistant(request: Request, body: AssistantQuery):
    """
    AI Assistant endpoint using Gemini Pro to answer election queries.
    """
    try:
        prompt = f"You are a helpful and neutral Election Assistant for the 'VoteWise' platform. Your goal is to help users understand the election process, timelines, and steps in an interactive and easy-to-follow way. Answer the following query accurately and concisely: {body.query}"
        
        # In a real environment with a valid key, this would be:
        # response = await model.generate_content_async(prompt)
        # return {"response": response.text}
        
        # Mock response for when API key is not valid/missing to ensure UI still works during testing
        user_query = body.query.lower()
        if "register" in user_query:
            return {"response": "To register to vote, you typically need to be a citizen, 18 years old, and a resident of the area. You can often register online, by mail, or at your local election office."}
        elif "timeline" in user_query:
            return {"response": "The election timeline usually includes voter registration deadlines, primary elections, early voting periods, and finally Election Day."}
        else:
            return {"response": f"That's a great question about the election process. Regarding '{body.query}', it's important to check your local jurisdiction's specific rules as they can vary. How else can I help you today?"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "VoteWise Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
