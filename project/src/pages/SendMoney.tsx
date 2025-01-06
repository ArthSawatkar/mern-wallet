import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

function SendMoney() {
  const { user } = useAuth();
  const [receiverEmail, setReceiverEmail] = useState('');
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
      // Get receiver's user ID
      const { data: receiver, error: receiverError } = await supabase
        .from('users')
        .select('id, wallet_balance')
        .eq('email', receiverEmail)
        .single();

      if (receiverError || !receiver) {
        throw new Error('Receiver not found');
      }

      // Get sender's current balance
      const { data: sender, error: senderError } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (senderError || !sender) {
        throw new Error('Could not fetch your balance');
      }

      const transferAmount = parseFloat(amount);
      if (transferAmount > sender.wallet_balance) {
        throw new Error('Insufficient balance');
      }

      // Create transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          sender_id: user.id,
          receiver_id: receiver.id,
          amount: transferAmount,
          type: 'TRANSFER',
          status: 'COMPLETED'
        });

      if (transactionError) {
        throw transactionError;
      }

      // Update balances
      const { error: updateError } = await supabase
        .from('users')
        .update({ wallet_balance: sender.wallet_balance - transferAmount })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      const { error: receiverUpdateError } = await supabase
        .from('users')
        .update({ wallet_balance: receiver.wallet_balance + transferAmount })
        .eq('id', receiver.id);

      if (receiverUpdateError) {
        throw receiverUpdateError;
      }

      setSuccess(true);
      setReceiverEmail('');
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
          <Send className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold">Send Money</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
          Money sent successfully!
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
            Recipient's Email
          </label>
          <input
            type="email"
            value={receiverEmail}
            onChange={(e) => setReceiverEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

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
          {loading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
}

export default SendMoney;