import React, { useState, useEffect } from 'react';
import { Wallet, ShoppingCart, CheckCircle, AlertCircle, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { WeilWalletConnection } from '@weilliptic/weil-sdk';

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [purchasedContracts, setPurchasedContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const TREASURY_ADDRESS = 'dd8adf2deabf470c5d4d578abc0072b8be3e68dafe72ac29e434fb0cb5e1b6a1';

  // MCP Contract addresses - REPLACE WITH REAL ADDRESSES FROM BACKEND
  const mcpContracts = [
    {
      id: 'oncall',
      name: 'OnCall Directory MCP',
      description: 'Fetch on-call engineers from PagerDuty',
      icon: '📞',
      price: 100,
      method: 'get_oncall_engineer()',
      color: 'from-yellow-400 to-yellow-600',
      address: 'DUMMY_ADDRESS_1' // TODO: Replace with real address
    },
    {
      id: 'discord',
      name: 'Discord MCP',
      description: 'Send alerts to Discord channels',
      icon: '💬',
      price: 150,
      method: 'send_message()',
      color: 'from-indigo-400 to-indigo-600',
      address: 'DUMMY_ADDRESS_2' // TODO: Replace with real address
    },
    {
      id: 'slack',
      name: 'Slack MCP',
      description: 'Notify Slack workspaces',
      icon: '💬',
      price: 150,
      method: 'send_slack()',
      color: 'from-purple-400 to-purple-600',
      address: 'DUMMY_ADDRESS_3' // TODO: Replace with real address
    },
    {
      id: 'twilio',
      name: 'Twilio SMS MCP',
      description: 'Send SMS to on-call engineers',
      icon: '📱',
      price: 200,
      method: 'send_sms()',
      color: 'from-pink-400 to-pink-600',
      address: 'DUMMY_ADDRESS_4' // TODO: Replace with real address
    },
    {
      id: 'warroom',
      name: 'War Room MCP',
      description: 'Create emergency meeting rooms',
      icon: '📹',
      price: 180,
      method: 'create_war_room()',
      color: 'from-orange-400 to-orange-600',
      address: 'DUMMY_ADDRESS_5' // TODO: Replace with real address
    },
    {
      id: 'ai',
      name: 'AI Remediation MCP',
      description: 'Get AI-powered fix suggestions',
      icon: '🧠',
      price: 250,
      method: 'get_suggestions()',
      color: 'from-green-400 to-green-600',
      address: 'DUMMY_ADDRESS_6' // TODO: Replace with real address
    },
    {
      id: 'status',
      name: 'Status Page MCP',
      description: 'Update public status pages',
      icon: '📊',
      price: 120,
      method: 'update_status()',
      color: 'from-amber-400 to-amber-600',
      address: 'DUMMY_ADDRESS_7' // TODO: Replace with real address
    },
    {
      id: 'blockchain',
      name: 'Blockchain Logger MCP',
      description: 'Immutable incident audit trail',
      icon: '⛓️',
      price: 300,
      method: 'log_action()',
      color: 'from-teal-400 to-teal-600',
      address: 'DUMMY_ADDRESS_8' // TODO: Replace with real address
    }
  ];

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.WeilWallet) {
        console.log('WeilWallet not found');
        return;
      }

      const accounts = await window.WeilWallet.request({ method: 'weil_accounts' });
      if (accounts && accounts.length > 0) {
        const walletConnection = new WeilWalletConnection({
          walletProvider: window.WeilWallet,
        });
        setWallet(walletConnection);
        setIsConnected(true);
        setUserAddress(accounts[0].address);
        loadPurchasedContracts(accounts[0].address);
      }
    } catch (err) {
      console.error('Check connection error:', err);
    }
  };

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    try {
      if (!window.WeilWallet) {
        throw new Error('WeilWallet not found. Please install the extension.');
      }

      const result = await window.WeilWallet.request({ 
        method: 'weil_requestAccounts' 
      });

      if (result.accounts && result.accounts.length > 0) {
        const walletConnection = new WeilWalletConnection({
          walletProvider: window.WeilWallet,
        });
        setWallet(walletConnection);
        setIsConnected(true);
        setUserAddress(result.accounts[0].address);
        setSuccess('Wallet connected successfully!');
        setTimeout(() => setSuccess(''), 3000);
        loadPurchasedContracts(result.accounts[0].address);
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchasedContracts = (address) => {
    const stored = localStorage.getItem(`purchased_${address}`);
    if (stored) {
      setPurchasedContracts(JSON.parse(stored));
    }
  };

  const purchaseContract = async (contract) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!wallet) {
        throw new Error('Wallet not connected');
      }

      // TODO: REPLACE WITH REAL TRANSACTION ONCE YOU GET THE METHOD FROM DISCORD
      // Example of what it might look like:
      /*
      const result = await wallet.contracts.execute(
        TREASURY_ADDRESS,
        'transfer', // or whatever method Discord tells you
        { 
          amount: contract.price,
          to: TREASURY_ADDRESS,
          // add other params as needed
        }
      );
      console.log('Transaction result:', result);
      
      // Handle Result response
      let resultData = result;
      if (result && typeof result === 'object' && 'txn_result' in result && typeof result.txn_result === 'string') {
        resultData = JSON.parse(result.txn_result);
      }
      
      if (resultData && typeof resultData === 'object' && 'Err' in resultData) {
        throw new Error(typeof resultData.Err === 'string' ? resultData.Err : JSON.stringify(resultData.Err));
      }
      */

      // TEMPORARY: Simulate transaction for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const purchase = {
        id: contract.id,
        name: contract.name,
        address: contract.address,
        purchasedAt: new Date().toISOString(),
        price: contract.price
      };

      const updated = [...purchasedContracts, purchase];
      setPurchasedContracts(updated);
      localStorage.setItem(`purchased_${userAddress}`, JSON.stringify(updated));

      setSuccess(`Successfully purchased ${contract.name}!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Address copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const shortenAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  const isPurchased = (contractId) => {
    return purchasedContracts.some(p => p.id === contractId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                🚨 Icarus MCP Marketplace
              </h1>
              <p className="text-purple-200 text-sm md:text-base">
                Purchase incident management contract addresses
              </p>
            </div>
            
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </>
                )}
              </button>
            ) : (
              <div className="bg-slate-800 border border-purple-500 rounded-lg px-4 md:px-6 py-3">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-mono">{shortenAddress(userAddress)}</span>
                  <button 
                    onClick={() => copyToClipboard(userAddress)} 
                    className="hover:text-purple-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-start gap-2 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-start gap-2 mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{success}</span>
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 md:p-12 text-center">
            <Wallet className="w-12 h-12 md:w-16 md:h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6 text-sm md:text-base">
              Connect your WeilWallet to browse and purchase MCP contracts
            </p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting...
                </span>
              ) : (
                'Connect Wallet'
              )}
            </button>
          </div>
        ) : (
          <>
            {/* MCP Contracts Grid */}
            <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Available MCP Contracts</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {mcpContracts.map((contract) => {
                  const purchased = isPurchased(contract.id);
                  return (
                    <div
                      key={contract.id}
                      className={`bg-slate-800/50 backdrop-blur border ${
                        purchased ? 'border-green-500' : 'border-slate-700'
                      } rounded-xl p-6 hover:border-purple-500 transition-all`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`text-3xl md:text-4xl w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gradient-to-br ${contract.color} flex items-center justify-center`}>
                          {contract.icon}
                        </div>
                        {purchased && (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                        )}
                      </div>
                      
                      <h3 className="text-base md:text-lg font-bold text-white mb-2">{contract.name}</h3>
                      <p className="text-xs md:text-sm text-slate-400 mb-3">{contract.description}</p>
                      <div className="text-xs font-mono text-purple-300 mb-4 bg-slate-900/50 p-2 rounded break-all">
                        {contract.method}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-white font-bold text-lg md:text-xl">{contract.price} WEIL</div>
                        <button
                          onClick={() => purchaseContract(contract)}
                          disabled={loading || purchased}
                          className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                            purchased
                              ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                          } disabled:opacity-50`}
                        >
                          {loading && !purchased ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : purchased ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Owned
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4" />
                              Buy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Purchased Contracts */}
            {purchasedContracts.length > 0 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Your Purchased Contracts</h2>
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900/50">
                        <tr>
                          <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-300">Contract</th>
                          <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-300">Address</th>
                          <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-300">Price</th>
                          <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-300 hidden md:table-cell">Purchased</th>
                          <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-semibold text-purple-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchasedContracts.map((purchase, idx) => (
                          <tr key={idx} className="border-t border-slate-700 hover:bg-slate-700/30">
                            <td className="px-4 md:px-6 py-4">
                              <div className="flex items-center gap-2 md:gap-3">
                                <div className="text-xl md:text-2xl">
                                  {mcpContracts.find(c => c.id === purchase.id)?.icon}
                                </div>
                                <div className="font-semibold text-white text-sm md:text-base">{purchase.name}</div>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <div className="flex items-center gap-2">
                                <code className="text-xs md:text-sm text-purple-300 font-mono">
                                  {shortenAddress(purchase.address)}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(purchase.address)}
                                  className="text-slate-400 hover:text-purple-300 transition-colors"
                                >
                                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 md:px-6 py-4 text-white text-sm md:text-base">{purchase.price} WEIL</td>
                            <td className="px-4 md:px-6 py-4 text-slate-400 text-xs md:text-sm hidden md:table-cell">
                              {new Date(purchase.purchasedAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 md:px-6 py-4">
                              <button
                                onClick={() => copyToClipboard(purchase.address)}
                                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-xs md:text-sm font-semibold transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
                                <span className="hidden sm:inline">View</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-white mb-3">ℹ️ How It Works</h3>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4 text-xs md:text-sm text-slate-300">
            <div>
              <div className="font-semibold text-purple-300 mb-1">1. Connect Wallet</div>
              <div>Connect your WeilWallet to access the marketplace</div>
            </div>
            <div>
              <div className="font-semibold text-purple-300 mb-1">2. Purchase MCPs</div>
              <div>Buy contract addresses by sending WEIL tokens</div>
            </div>
            <div>
              <div className="font-semibold text-purple-300 mb-1">3. Use in Icarus</div>
              <div>Copy addresses and paste into your incident management system</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;