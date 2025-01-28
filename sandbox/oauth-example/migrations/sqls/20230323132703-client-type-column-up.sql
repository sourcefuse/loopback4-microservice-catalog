/* Replace with your SQL commands */

ALTER TABLE main.auth_clients
ADD IF NOT EXISTS client_type varchar(100) DEFAULT 'public';
