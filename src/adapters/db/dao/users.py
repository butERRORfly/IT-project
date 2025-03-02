from src.adapters.db.dao.base import BaseDAO
from src.domain.models.users.users import User


class UsersDAO(BaseDAO):
    model = User