ALTER TABLE auth_clients
ADD IF NOT EXISTS client_type VARCHAR(100) DEFAULT 'public';
