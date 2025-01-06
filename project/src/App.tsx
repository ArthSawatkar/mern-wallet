import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Wallet, Send, CreditCard, History, Settings as SettingsIcon, LogOut } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import SendMoney from './pages/SendMoney';
import AddMoney from './pages/AddMoney';
import Transactions from './pages/Transactions';
import SettingsPage from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-indigo-600">PayWallet</h1>
          </div>
          <nav className="mt-6">
            <NavLink to="/" icon={<Wallet />} text="Dashboard" />
            <NavLink to="/send" icon={<Send />} text="Send Money" />
            <NavLink to="/add-money" icon={<CreditCard />} text="Add Money" />
            <NavLink to="/transactions" icon={<History />} text="Transactions" />
            <NavLink to="/settings" icon={<SettingsIcon />} text="Settings" />
            <button
              onClick={signOut}
              className="flex items-center px-6 py-3 text-gray-500 hover:bg-gray-100 w-full"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/send" element={<SendMoney />} />
              <Route path="/add-money" element={<AddMoney />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

function NavLink({ to, icon, text }: { to: string; icon: React.ReactNode; text: string }) {
  return (
    <a
      href={to}
      className="flex items-center px-6 py-3 text-gray-500 hover:bg-gray-100"
    >
      {icon}
      <span className="mx-3">{text}</span>
    </a>
  );
}

export default App;