import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../types';

function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-indigo-100 rounded-full">
          <History className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold">Transaction History</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found</div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {transactions.map((transaction) => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction} 
              userId={user.id} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction, userId }: { transaction: Transaction; userId: string }) {
  const isOutgoing = transaction.sender_id === userId;
  const amount = isOutgoing ? -transaction.amount : transaction.amount;

  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isOutgoing ? 'bg-red-100' : 'bg-green-100'}`}>
          {isOutgoing ? (
            <ArrowUpRight className="w-5 h-5 text-red-600" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-green-600" />
          )}
        </div>
        <div>
          <p className="font-medium">
            {transaction.type === 'ADD_MONEY' 
              ? 'Added Money' 
              : isOutgoing 
                ? 'Sent Money' 
                : 'Received Money'
            }
          </p>
          <p className="text-sm text-gray-500">
            {new Date(transaction.created_at).toLocaleDateString()} at{' '}
            {new Date(transaction.created_at).toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}>
          {isOutgoing ? '-' : '+'}₹{Math.abs(amount).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">{transaction.status}</p>
      </div>
    </div>
  );
}

export default Transactions;