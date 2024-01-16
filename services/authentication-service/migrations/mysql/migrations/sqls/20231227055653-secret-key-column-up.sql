ALTER TABLE user_credentials
ADD IF NOT EXISTS secret_key VARCHAR(100);
