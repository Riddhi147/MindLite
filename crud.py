# from sqlalchemy.orm import Session
# from models import User, Score
# from auth import hash_password, verify_password


# def create_user(db: Session, email, password, role):

#     user = User(
#         email=email,
#         password=hash_password(password),
#         role=role
#     )

#     db.add(user)
#     db.commit()
#     db.refresh(user)

#     return user


# def login_user(db: Session, email, password):

#     user = db.query(User).filter(User.email == email).first()

#     if not user:
#         return None

#     if not verify_password(password, user.password):
#         return None

#     return user


# def save_score(db: Session, user_id, game, score):

#     new_score = Score(
#         user_id=user_id,
#         game=game,
#         score=score
#     )

#     db.add(new_score)
#     db.commit()
#     db.refresh(new_score)

#     return new_score


# def get_scores(db: Session, user_id):

#     return db.query(Score).filter(
#         Score.user_id == user_id
#     ).all()
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from  .import models


def hash_password(password: str):
    return bcrypt.hash(password)


def verify_password(password: str, hashed: str):
    return bcrypt.verify(password, hashed)


def create_user(db: Session, email: str, password: str, role: str):
    user = models.User(
        email=email,
        password=hash_password(password),
        role=role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db: Session, email: str, password: str):

    user = db.query(models.User).filter(models.User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.password):
        return None

    return user


def save_score(db: Session, user_id: int, game: str, score: float):

    new_score = models.Score(
        user_id=user_id,
        game=game,
        score=score
    )

    db.add(new_score)
    db.commit()
    db.refresh(new_score)

    return new_score


def get_scores(db: Session, user_id: int):

    return db.query(models.Score).filter(models.Score.user_id == user_id).all()
def get_family_members(db, user_id):

    return db.query(models.FamilyMember).filter(
        models.FamilyMember.user_id == user_id
    ).all()
def create_family_member(db: Session, user_id: int, name: str, image_path: str):

    member = models.FamilyMember(
        user_id=user_id,
        name=name,
        image_path=image_path
    )

    db.add(member)
    db.commit()
    db.refresh(member)

    return member