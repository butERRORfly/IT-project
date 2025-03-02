from src.infrastructure.db.dao.base import BaseDAO
from src.infrastructure.db.database import User


class UsersDAO(BaseDAO):
    model = User
