/*
  # Initial Schema Setup for Digital Wallet

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - full_name (text)
      - wallet_balance (numeric)
      - created_at (timestamp)
    
    - transactions
      - id (uuid, primary key)
      - sender_id (uuid, foreign key)
      - receiver_id (uuid, foreign key)
      - amount (numeric)
      - type (enum)
      - status (enum)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Add policies for transaction access
*/

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('TRANSFER', 'ADD_MONEY', 'WITHDRAW');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  wallet_balance numeric DEFAULT 0 CHECK (wallet_balance >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id),
  receiver_id uuid REFERENCES users(id),
  amount numeric NOT NULL CHECK (amount > 0),
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id OR 
    type = 'ADD_MONEY'
  );