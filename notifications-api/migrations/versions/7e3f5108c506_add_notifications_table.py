"""Add notifications table

Revision ID: 7e3f5108c506
Revises:
Create Date: 2022-12-28 20:22:16.722561

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '7e3f5108c506'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('notification',
    sa.Column('data', sa.JSON(), nullable=True),
    sa.Column('sourceUid', sqlmodel.sql.sqltypes.GUID(), nullable=False),
    sa.Column('targetUid', sqlmodel.sql.sqltypes.GUID(), nullable=False),
    sa.Column('title', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('details', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('severity', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('sticky', sa.Boolean(), nullable=True),
    sa.Column('needsConfirmation', sa.Boolean(), nullable=True),
    sa.Column('notificationType', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('id', sqlmodel.sql.sqltypes.GUID(), nullable=False),
    sa.Column('receiveTime', sa.DateTime(), nullable=False),
    sa.Column('readTime', sa.DateTime(), nullable=True),
    sa.Column('sseSendTime', sa.DateTime(), nullable=True),
    sa.Column('confirmationTime', sa.DateTime(), nullable=True),
    sa.Column('expireTime', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('notification')
    # ### end Alembic commands ###
