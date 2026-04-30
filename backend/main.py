import os
import logging
import hashlib
from collections import OrderedDict
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

# Structured logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
)
logger = logging.getLogger('votewise')

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "PLACEHOLDER_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

limiter = Limiter(key_func=get_remote_address)


class LRUCache:
    """
    A simple Least-Recently-Used (LRU) cache for memoizing AI responses.
    Reduces redundant API calls for repeated identical queries.
    """
    def __init__(self, capacity: int = 128):
        self._cache = OrderedDict()
        self._capacity = capacity

    def get(self, key: str):
        if key not in self._cache:
            return None
        self._cache.move_to_end(key)
        return self._cache[key]

    def put(self, key: str, value: str):
        if key in self._cache:
            self._cache.move_to_end(key)
        self._cache[key] = value
        if len(self._cache) > self._capacity:
            self._cache.popitem(last=False)


response_cache = LRUCache(capacity=128)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info('VoteWise backend starting up...')
    yield
    logger.info('VoteWise backend shutting down.')


app = FastAPI(
    title="VoteWise AI Backend",
    description="Gemini-powered election assistant API for the VoteWise civic education platform.",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Injects security headers on every HTTP response."""
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
    """Request body schema for the /api/assistant endpoint."""
    query: constr(min_length=1, max_length=500)


def _build_fallback_response(user_query: str) -> str:
    """
    Generates a structured fallback response when the Gemini API is
    unavailable. Matches keyword patterns for civic topics.

    :param user_query: The lowercased user query string.
    :returns: A relevant, informative response string.
    """
    if "register" in user_query:
        return (
            "To register to vote, you typically need to be a citizen, 18 years old, "
            "and a resident of the area. You can often register online, by mail, "
            "or at your local election office."
        )
    if "timeline" in user_query or "when" in user_query or "schedule" in user_query:
        return (
            "The election process begins with voter registration, followed by primary "
            "elections, early voting periods, and culminates on Election Day. "
            "Key milestones in this process include candidate debates and ballot finalization."
        )
    if "id" in user_query or "identification" in user_query:
        return (
            "Most states require a government-issued photo ID such as a driver's license, "
            "passport, or state-issued ID card. Some states also accept utility bills or "
            "bank statements as proof of residence."
        )
    if "mail" in user_query or "absentee" in user_query:
        return (
            "Mail-in and absentee voting are available in most states. Contact your "
            "local election authority to request a ballot and confirm deadlines."
        )
    return (
        f"As your VoteWise Election Assistant, I can help with that query about "
        f"'{user_query}'. Specific rules vary by jurisdiction — please verify with "
        f"your local election office for the most accurate information."
    )


@app.post("/api/assistant")
@limiter.limit("20/minute")
async def chat_assistant(request: Request, body: AssistantQuery):
    """
    AI Assistant endpoint using Gemini Pro to answer election queries.
    Results are cached by query hash to reduce redundant API calls.
    """
    cache_key = hashlib.md5(body.query.lower().encode()).hexdigest()
    cached = response_cache.get(cache_key)
    if cached:
        logger.info('Cache hit for query hash: %s', cache_key)
        return {"response": cached}

    try:
        prompt = (
            "You are a helpful and neutral Election Assistant for the 'VoteWise' platform. "
            "Your goal is to help users understand the election process, timelines, and steps "
            "in an interactive and easy-to-follow way. Answer the following query accurately "
            f"and concisely: {body.query}"
        )
        response = await model.generate_content_async(prompt)
        answer = response.text
        response_cache.put(cache_key, answer)
        logger.info('Gemini response generated for query hash: %s', cache_key)
        return {"response": answer}

    except Exception as e:
        logger.warning('Gemini API unavailable, using fallback. Error: %s', str(e))
        fallback = _build_fallback_response(body.query.lower())
        response_cache.put(cache_key, fallback)
        return {"response": fallback}


@app.get("/api/health")
async def health_check():
    """Returns service health status and version metadata."""
    return {
        "status": "healthy",
        "service": "VoteWise Backend",
        "version": "1.0.0",
        "ai_model": "gemini-pro",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
