ALTER TABLE main.user_credentials
ADD IF NOT EXISTS secret_key varchar(100);
