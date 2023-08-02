/* Replace with your SQL commands */

ALTER TABLE main.auth_clients
ADD
    client_type varchar(100) DEFAULT 'public';
