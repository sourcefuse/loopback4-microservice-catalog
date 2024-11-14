CREATE TABLE main.jwt_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_id VARCHAR(100) UNIQUE NOT NULL,
    public_key TEXT NOT NULL,                -- Public key in PEM format
    private_key TEXT NOT NULL,               -- Private key in PEM format
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
