Create user devpanel with PASSWORD 'devpanel';

-- Para pruebas se dieron todos los privilegions. En produccion se debe restringir por rol.
Grant all privileges on database "devpanel" to devpanel;

DROP TABLE IF EXISTS app_user;

CREATE TABLE app_user (
    id UUID NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT pk_app_user PRIMARY KEY (id),
    CONSTRAINT uq_app_user_email UNIQUE (email),
    CONSTRAINT chk_app_user_role
        CHECK (role IN ('ADMIN', 'USER')),
    CONSTRAINT chk_app_user_status
        CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX idx_app_user_status
    ON app_user (status);