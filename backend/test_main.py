import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_chat_assistant_timeline():
    response = client.post("/api/assistant", json={"query": "what is the timeline?"})
    assert response.status_code == 200
    assert "process begins" in response.json()["response"]

def test_chat_assistant_registration():
    response = client.post("/api/assistant", json={"query": "how to register?"})
    assert response.status_code == 200
    assert "18 years old" in response.json()["response"]

def test_chat_assistant_general():
    response = client.post("/api/assistant", json={"query": "hello"})
    assert response.status_code == 200
    assert "Election Assistant" in response.json()["response"]

def test_security_headers():
    response = client.get("/api/assistant")
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"

def test_cors_headers_options():
    res = client.options("/api/assistant", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    })
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"

def test_workflow_rate_limiting():
    # Keep requesting until we hit 429
    hit_limit = False
    for _ in range(25):
        res = client.post("/api/assistant", json={"query": "safe"})
        if res.status_code == 429:
            hit_limit = True
            break
        assert res.status_code == 200
    
    assert hit_limit, "Rate limit of 429 was never reached"
