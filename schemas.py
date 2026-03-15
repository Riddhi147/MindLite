from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ScoreRequest(BaseModel):
    user_id: int
    game: str
    score: float
