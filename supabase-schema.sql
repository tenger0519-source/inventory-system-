-- Database schema for the inventory system

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  supplier VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  type VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  sector VARCHAR(100),
  unit VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  worker VARCHAR(255) NOT NULL,
  day VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction items table (for storing items in each transaction)
CREATE TABLE transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
  product VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id VARCHAR(255) PRIMARY KEY,
  type VARCHAR(50) NOT NULL CHECK (type IN ('move', 'message', 'general')),
  time VARCHAR(10) NOT NULL,
  action VARCHAR(255) NOT NULL,
  employee VARCHAR(255),
  product VARCHAR(255),
  quantity INTEGER,
  from_location VARCHAR(255),
  to_location VARCHAR(255),
  shelf VARCHAR(100),
  message TEXT,
  day VARCHAR(50),
  date DATE,
  week INTEGER,
  duration INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Move requests table
CREATE TABLE move_requests (
  id VARCHAR(255) PRIMARY KEY,
  product VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  from_location VARCHAR(255) NOT NULL,
  to_location VARCHAR(255) NOT NULL,
  shelf VARCHAR(100),
  requested_by VARCHAR(50) NOT NULL CHECK (requested_by IN ('manager', 'supplier')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_to VARCHAR(255)
);

-- Role requests table
CREATE TABLE role_requests (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  requested_role VARCHAR(50) NOT NULL CHECK (requested_role IN ('manager', 'employee', 'supplier')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product requests table
CREATE TABLE product_requests (
  id SERIAL PRIMARY KEY,
  from_user_id INTEGER REFERENCES users(id),
  to_user_id INTEGER REFERENCES users(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('give', 'take')),
  product VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_worker ON transactions(worker);
CREATE INDEX idx_tasks_employee ON tasks(employee);
CREATE INDEX idx_tasks_day ON tasks(day);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_move_requests_status ON move_requests(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_requests_updated_at BEFORE UPDATE ON role_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_requests_updated_at BEFORE UPDATE ON product_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial data
INSERT INTO users (name, password, roles) VALUES
('Bat', 'password123', ARRAY['employee']),
('Saraa', 'password123', ARRAY['manager']),
('Temuujin', 'password123', ARRAY['employee']),
('Nomin', 'password123', ARRAY['employee']),
('ABC Co', 'password123', ARRAY['supplier']),
('FoodSupply', 'password123', ARRAY['supplier']);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE move_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can restrict these later)
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access to products" ON products FOR ALL USING (true);
CREATE POLICY "Allow all access to transactions" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all access to transaction_items" ON transaction_items FOR ALL USING (true);
CREATE POLICY "Allow all access to tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all access to move_requests" ON move_requests FOR ALL USING (true);
CREATE POLICY "Allow all access to role_requests" ON role_requests FOR ALL USING (true);
CREATE POLICY "Allow all access to product_requests" ON product_requests FOR ALL USING (true);
