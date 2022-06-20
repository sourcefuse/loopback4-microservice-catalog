/* Replace with your SQL commands */
CREATE SCHEMA IF NOT EXISTS main;

SET search_path TO main,public;
GRANT ALL ON SCHEMA main TO public;

CREATE TABLE main.product
(
    id serial,
    name character varying NOT NULL,
    quantity numeric NOT NULL,
    PRIMARY KEY (id)
);
