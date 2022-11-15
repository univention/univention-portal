"""Update notification model

Revision ID: 2b7d4561b06a
Revises: c83d839fbaad
Create Date: 2022-11-15 07:57:27.133725

"""
from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision = '2b7d4561b06a'
down_revision = 'c83d839fbaad'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'notification',
        sa.Column('sourceUid', sqlmodel.sql.sqltypes.GUID(), nullable=False)
    )
    op.add_column(
        'notification',
        sa.Column('targetUid', sqlmodel.sql.sqltypes.GUID(), nullable=False)
    )
    op.add_column(
        'notification',
        sa.Column('details', sqlmodel.sql.sqltypes.AutoString(), nullable=True)
    )
    op.add_column(
        'notification',
        sa.Column('notificationType', sqlmodel.sql.sqltypes.AutoString(), nullable=True)
    )    
    op.add_column(
        'notification',
        sa.Column('sticky', sa.BOOLEAN, nullable=True)
    )
    op.add_column(
        'notification',
        sa.Column('needsConfirmation', sa.BOOLEAN, nullable=True),
    )
    op.drop_column('notification', 'source_uuid')
    op.drop_column('notification', 'target_uuid')
    op.drop_column('notification', 'type')
    op.drop_column('notification', 'send_time')
    pass


def downgrade() -> None:
    pass
