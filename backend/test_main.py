import pytest
from fastapi.testclient import TestClient
from main import app, response_cache

client = TestClient(app)


def test_chat_assistant_timeline():
    """Timeline queries should return a response mentioning process begins."""
    response = client.post("/api/assistant", json={"query": "what is the timeline?"})
    assert response.status_code == 200
    assert "process begins" in response.json()["response"]


def test_chat_assistant_registration():
    """Registration queries should return a response mentioning age requirement."""
    response = client.post("/api/assistant", json={"query": "how to register?"})
    assert response.status_code == 200
    assert "18 years old" in response.json()["response"]


def test_chat_assistant_general():
    """General queries should return a response mentioning the Election Assistant."""
    response = client.post("/api/assistant", json={"query": "hello"})
    assert response.status_code == 200
    assert "Election Assistant" in response.json()["response"]


def test_security_headers():
    """All responses should include required security headers."""
    response = client.get("/api/health")
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"


def test_health_endpoint_fields():
    """Health endpoint should return all required metadata fields."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "VoteWise Backend"
    assert "version" in data
    assert "ai_model" in data


def test_response_caching():
    """Identical queries should return the same response (cache hit)."""
    response_cache._cache.clear()
    query = {"query": "what is early voting?"}
    first = client.post("/api/assistant", json=query).json()["response"]
    second = client.post("/api/assistant", json=query).json()["response"]
    assert first == second


def test_cors_headers_options():
    """CORS preflight should allow the Vite dev server origin."""
    res = client.options("/api/assistant", headers={
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    })
    assert res.status_code == 200
    assert res.headers.get("access-control-allow-origin") == "http://localhost:5173"


def test_workflow_rate_limiting():
    """Sustained bursts of requests should trigger a 429 rate limit response."""
    hit_limit = False
    for _ in range(25):
        res = client.post("/api/assistant", json={"query": "safe"})
        if res.status_code == 429:
            hit_limit = True
            break
        assert res.status_code == 200

    assert hit_limit, "Rate limit of 429 was never reached"
