# flake8: noqa

"""add notification popup

Revision ID: 9a6b4364a7f7
Revises: 7e3f5108c506
Create Date: 2023-01-08 20:38:55.325515

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '9a6b4364a7f7'
down_revision = '7e3f5108c506'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('notification', sa.Column('popup', sa.Boolean(), nullable=True))
    op.execute('UPDATE notification SET popup = true')
    op.alter_column('notification', 'popup', nullable=False)


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('notification', 'popup')
    # ### end Alembic commands ###
