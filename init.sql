-- Script de inicialización para crear el rol de usuario en PostgreSQL
CREATE ROLE flowboard_user WITH LOGIN PASSWORD 'flowboard_password';
ALTER ROLE flowboard_user CREATEDB;
