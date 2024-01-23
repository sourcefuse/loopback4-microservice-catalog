ALTER TABLE roles
DROP tenant_id,
DROP allowed_clients,
DROP description;

ALTER TABLE tenants
DROP website;

ALTER TABLE users
DROP photo_url,
DROP designation;
