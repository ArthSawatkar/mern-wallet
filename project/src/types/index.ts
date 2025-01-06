export interface User {
  id: string;
  email: string;
  full_name: string;
  wallet_balance: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  type: 'TRANSFER' | 'ADD_MONEY' | 'WITHDRAW';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
}