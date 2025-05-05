"""create icao table

Revision ID: 1e936c62b64c
Revises: 8f1d60ebee8c
Create Date: 2025-05-05 20:50:29.319618

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import csv
import os


# revision identifiers, used by Alembic.
revision: str = '1e936c62b64c'
down_revision: Union[str, None] = '8f1d60ebee8c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Создаем таблицу
    op.create_table(
        'icao',
        sa.Column('icao', sa.String(50), nullable=True),
        sa.Column('airport', sa.String(128), nullable=True),
        schema='public'
    )

    csv_path = os.path.join(os.path.dirname(__file__), "..", 'data', 'icao.csv')

    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f, delimiter=';', fieldnames=['icao', 'airport'])
        rows = [dict(row) for row in reader]

        if rows:
            op.bulk_insert(
                sa.table(
                    'icao',
                    sa.column('icao'),
                    sa.column('airport')
                ),
                rows
            )


def downgrade() -> None:
    pass
