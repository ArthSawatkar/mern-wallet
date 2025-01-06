import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

function AddMoney() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const transferAmount = parseFloat(amount);
      
      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          receiver_id: user.id,
          amount: transferAmount,
          type: 'ADD_MONEY',
          status: 'COMPLETED'
        });

      if (transactionError) {
        throw transactionError;
      }

      // Update user balance
      const { data: currentUser, error: balanceError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (balanceError) {
        throw balanceError;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          wallet_balance: currentUser.wallet_balance + transferAmount 
        })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setAmount('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-indigo-100 rounded-full">
          <CreditCard className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold">Add Money</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          Money added successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Amount (₹)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Add Money'}
        </button>
      </form>
    </div>
  );
}

export default AddMoney;