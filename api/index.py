"""Vercel entrypoint for the FastAPI backend.

The wrapper removes the public /api prefix before FastAPI resolves routes,
allowing existing routes such as /login to remain unchanged.
"""

from main import app as fastapi_app


class StripApiPrefix:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] in {"http", "websocket"}:
            path = scope.get("path", "")
            if path == "/api" or path.startswith("/api/"):
                scope = dict(scope)
                scope["path"] = path[4:] or "/"
        await self.app(scope, receive, send)


app = StripApiPrefix(fastapi_app)
