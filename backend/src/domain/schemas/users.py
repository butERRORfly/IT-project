from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class UserRegister(BaseModel):
    email: EmailStr = Field(..., description="Электронная почта")
    password: str = Field(..., min_length=5, max_length=50, description="Пароль, от 5 до 50 знаков")
    phone_number: str = Field(..., description="Номер телефона в международном формате, начинающийся с '+'")
    first_name: str = Field(..., min_length=3, max_length=50, description="Имя, от 3 до 50 символов")
    last_name: str = Field(..., min_length=3, max_length=50, description="Фамилия, от 3 до 50 символов")
    role_id: int = Field(default=1, description="ID роли пользователя (1 - user, 2 - admin)", ge=1, le=2)

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        if not re.match(r'^\+\d{5,15}$', value):
            raise ValueError('Номер телефона должен начинаться с "+" и содержать от 5 до 15 цифр')
        return value

class User(BaseModel):
    id: int = Field(..., description="ID пользователя")
    email: EmailStr = Field(..., description="Электронная почта")
    phone_number: str = Field(..., description="Номер телефона")
    first_name: str = Field(..., description="Имя")
    last_name: str = Field(..., description="Фамилия")
    role_id: int = Field(..., description="Роль пользователя")
    is_active: bool = Field(default=True, description="Активен ли пользователь")


class UserAuth(BaseModel):
    email: EmailStr = Field(..., description="Электронная почта")
    password: str = Field(..., min_length=5, max_length=50, description="Пароль, от 5 до 50 знаков")


class UserChangeRole(BaseModel):
    email: EmailStr = Field(..., description="Электронная почта")