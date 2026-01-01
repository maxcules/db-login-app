-- Create database (optional but recommended)
CREATE DATABASE IF NOT EXISTS appdb;
USE appdb;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tokens table (tokens stored in DB as required)
CREATE TABLE IF NOT EXISTS tokens (
  token VARCHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tokens_user_id (user_id),
  CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Default user
-- Email: admin@example.com
-- Password: Admin123!
-- bcrypt hash generated with cost=10
INSERT INTO users (email, password_hash)
VALUES (
  'admin@example.com',
  '$2b$10$PdosChJ8A4.swzUKQqO7SuC8EblRqMkEAshoH/FcAT5tpunQED2Um'
)
ON DUPLICATE KEY UPDATE email = email;