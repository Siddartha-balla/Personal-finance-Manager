CREATE DATABASE IF NOT EXISTS personal_finance_manager;

USE personal_finance_manager;

-- USERS TABLE

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CATEGORIES TABLE

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- INCOME TABLE

CREATE TABLE IF NOT EXISTS income (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    source VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    income_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_income_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT positive_income_amount
        CHECK (amount > 0)
);

-- EXPENSES TABLE

CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description VARCHAR(255),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_expense_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_expense_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE RESTRICT,

    CONSTRAINT positive_expense_amount
        CHECK (amount > 0)
);

-- DEFAULT EXPENSE CATEGORIES

INSERT IGNORE INTO categories (name) VALUES
('Food'),
('Rent'),
('Shopping'),
('Travel'),
('Bills'),
('Education'),
('Entertainment'),
('Healthcare'),
('Transportation'),
('Other');

-- INDEXES

CREATE INDEX idx_income_user
ON income(user_id);

CREATE INDEX idx_income_date
ON income(user_id, income_date);

CREATE INDEX idx_expenses_user
ON expenses(user_id);

CREATE INDEX idx_expenses_date
ON expenses(user_id, expense_date);

CREATE INDEX idx_expenses_category
ON expenses(category_id);