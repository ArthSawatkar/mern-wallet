import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../types';

function Dashboard() {
  const { user } = useAuth();
  const [balance, setBalance] = React.useState(0);
  const [recentTransactions, setRecentTransactions] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    if (user) {
      fetchUserData();
      fetchRecentTransactions();
    }
  }, [user]);

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user data:', error);
      return;
    }

    setBalance(data.wallet_balance);
  };

  const fetchRecentTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    setRecentTransactions(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Balance Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-1">Current Balance</p>
            <h2 className="text-4xl font-bold">₹{balance.toFixed(2)}</h2>
          </div>
          <Wallet className="w-12 h-12 text-indigo-600" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <QuickAction
          icon={<ArrowUpRight className="w-6 h-6" />}
          title="Send Money"
          link="/send"
        />
        <QuickAction
          icon={<ArrowDownLeft className="w-6 h-6" />}
          title="Add Money"
          link="/add-money"
        />
        <QuickAction
          icon={<RefreshCw className="w-6 h-6" />}
          title="Transactions"
          link="/transactions"
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} userId={user.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, link }: { icon: React.ReactNode; title: string; link: string }) {
  return (
    <a
      href={link}
      className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 hover:bg-gray-50 transition-colors"
    >
      <div className="p-3 bg-indigo-100 rounded-full text-indigo-600">{icon}</div>
      <span className="font-medium">{title}</span>
    </a>
  );
}

function TransactionItem({ transaction, userId }: { transaction: Transaction; userId: string }) {
  const isOutgoing = transaction.sender_id === userId;
  const amount = isOutgoing ? -transaction.amount : transaction.amount;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
            {isOutgoing ? 'Sent to' : 'Received from'} {transaction.receiver_id}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(transaction.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className={`font-semibold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}>
        {isOutgoing ? '-' : '+'}₹{Math.abs(amount).toFixed(2)}
      </p>
    </div>
  );
}

export default Dashboard;