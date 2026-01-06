import React, { useState } from 'react';
import { Wallet, AlertCircle } from 'lucide-react';
import { connectWallet } from '../lib/weil';

interface WalletConnectProps {
  connected: boolean;
  address: string;
  onConnect: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ connected, address, onConnect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');
    
    try {
      const walletAddress = await connectWallet();
      onConnect(walletAddress);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  if (connected) {
    return (
      <div className="mb-8 text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-6 py-4 inline-flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-300">Connected:</span>
          <code className="text-green-400 font-mono text-sm">
            {address.slice(0, 8)}...{address.slice(-8)}
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <button
        onClick={handleConnect}
        disabled={loading}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 mx-auto transition-all shadow-lg disabled:opacity-50"
      >
        <Wallet size={24} />
        {loading ? 'Connecting...' : 'Connect Weil Wallet'}
      </button>

      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center gap-3 max-w-md mx-auto">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-300 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;