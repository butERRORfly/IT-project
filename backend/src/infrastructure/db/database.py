from asyncio import current_task
from datetime import datetime
from typing import Annotated
from typing import List

from sqlalchemy import String, DateTime
from sqlalchemy import func, ForeignKey
from sqlalchemy import text, Integer
from sqlalchemy.ext.asyncio import async_scoped_session
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, declared_attr, Mapped, mapped_column, relationship

from backend.src.configurator.config import get_db_url

DATABASE_URL = get_db_url()

engine = create_async_engine(DATABASE_URL)
async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

Session = async_scoped_session(async_session_maker, scopefunc=current_task)

int_pk = Annotated[int, mapped_column(primary_key=True)]
str_pk = Annotated[str, mapped_column(primary_key=True)]
created_at = Annotated[datetime, mapped_column(DateTime(timezone=True), server_default=func.now())]
updated_at = Annotated[datetime, mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())]
str_uniq = Annotated[str, mapped_column(String, unique=True, nullable=False)]
str_null_true = Annotated[str, mapped_column(String, nullable=True)]
role_type = Annotated[int, mapped_column(Integer, default=0, server_default=text('0'), nullable=False)]
str_not_null = Annotated[str, mapped_column(String, nullable=False)]


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return f"{cls.__name__.lower()}s"

    created_at: Mapped[created_at]
    updated_at: Mapped[updated_at]


class Role(Base):
    id: Mapped[int_pk]
    name: Mapped[str_uniq]
    description: Mapped[str_null_true]

    users: Mapped[List["User"]] = relationship(back_populates="role_rel")

    def __repr__(self):
        return f"{self.__class__.__name__}(id={self.id}, name='{self.name}')"


class User(Base):
    id: Mapped[int_pk]
    phone_number: Mapped[str_uniq]
    first_name: Mapped[str_not_null]
    last_name: Mapped[str_not_null]
    email: Mapped[str_uniq]
    password: Mapped[str_not_null]
    role_id: Mapped[int] = mapped_column(Integer, ForeignKey("roles.id"), default=1, server_default=text('1'))
    ways: Mapped[List["Way"]] = relationship(back_populates="user")
    role_rel: Mapped["Role"] = relationship(back_populates="users")

    def __repr__(self):
        return f"{self.__class__.__name__}(id={self.id}, phone_number='{self.phone_number}', email='{self.email}')"


class WayParameter(Base):
    id: Mapped[int_pk]
    way_id: Mapped[int] = mapped_column(Integer, ForeignKey("ways.id"), nullable=False)
    place: Mapped[str_null_true]
    to: Mapped[str_null_true]
    out: Mapped[str_null_true]
    airto: Mapped[str_null_true]
    airout: Mapped[str_null_true]

    icao: Mapped[str_null_true] = mapped_column(String, ForeignKey("icao.icao"))
    icao1: Mapped[str_null_true] = mapped_column(String, ForeignKey("icao.icao"))

    hotel: Mapped[str_null_true]
    price: Mapped[str_null_true]
    type: Mapped[str_null_true]

    way: Mapped["Way"] = relationship(back_populates="parameters")
    airport_icao_rel: Mapped["Airport"] = relationship(foreign_keys=[icao], back_populates="way_params_as_icao")
    airport_icao1_rel: Mapped["Airport"] = relationship(foreign_keys=[icao1], back_populates="way_params_as_icao1")

    def __repr__(self):
        return f"{self.__class__.__name__}(id={self.id})"


class Way(Base):
    id: Mapped[int_pk]
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    parameters: Mapped[List["WayParameter"]] = relationship(back_populates="way")

    user: Mapped["User"] = relationship(back_populates="ways")

    def __repr__(self):
        return f"{self.__class__.__name__}(id={self.id}, user_id={self.user_id})"


class Airport(Base):
    __tablename__ = 'icao'

    icao: Mapped[str_pk]
    name: Mapped[str_not_null]

    way_params_as_icao: Mapped[List["WayParameter"]] = relationship(
        back_populates="airport_icao_rel",
        foreign_keys="[WayParameter.icao]"
    )
    way_params_as_icao1: Mapped[List["WayParameter"]] = relationship(
        back_populates="airport_icao1_rel",
        foreign_keys="[WayParameter.icao1]"
    )

    def __repr__(self):
        return f"{self.__class__.__name__}(icao='{self.icao}', name='{self.name}')"