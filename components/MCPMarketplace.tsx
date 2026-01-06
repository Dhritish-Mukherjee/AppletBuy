import React, { useState, useEffect } from 'react';
import { Wallet, ShoppingCart, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import { WeilAccount } from '../types';

interface Contract {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  method: string;
  color: string;
}

interface PurchasedContract {
  id: string;
  name: string;
  address: string;
  purchasedAt: string;
  price: number;
}

const MCPMarketplace: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [purchasedContracts, setPurchasedContracts] = useState<PurchasedContract[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const mcpContracts: Contract[] = [
    {
      id: 'oncall',
      name: 'OnCall Directory MCP',
      description: 'Fetch on-call engineers from PagerDuty',
      icon: '📞',
      price: 100,
      method: 'get_oncall_engineer()',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'discord',
      name: 'Discord MCP',
      description: 'Send alerts to Discord channels',
      icon: '💬',
      price: 150,
      method: 'send_message()',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      id: 'slack',
      name: 'Slack MCP',
      description: 'Notify Slack workspaces',
      icon: '💬',
      price: 150,
      method: 'send_slack()',
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'twilio',
      name: 'Twilio SMS MCP',
      description: 'Send SMS to on-call engineers',
      icon: '📱',
      price: 200,
      method: 'send_sms()',
      color: 'from-pink-400 to-pink-600'
    },
    {
      id: 'warroom',
      name: 'War Room MCP',
      description: 'Create emergency meeting rooms',
      icon: '📹',
      price: 180,
      method: 'create_war_room()',
      color: 'from-orange-400 to-orange-600'
    },
    {
      id: 'ai',
      name: 'AI Remediation MCP',
      description: 'Get AI-powered fix suggestions',
      icon: '🧠',
      price: 250,
      method: 'get_suggestions()',
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'status',
      name: 'Status Page MCP',
      description: 'Update public status pages',
      icon: '📊',
      price: 120,
      method: 'update_status()',
      color: 'from-amber-400 to-amber-600'
    },
    {
      id: 'blockchain',
      name: 'Blockchain Logger MCP',
      description: 'Immutable incident audit trail',
      icon: '⛓️',
      price: 300,
      method: 'log_action()',
      color: 'from-teal-400 to-teal-600'
    }
  ];

  useEffect(() => {
    checkConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkConnection = async () => {
    try {
      if (!window.WeilWallet) {
        // Silent fail on check, user will see connect button
        return;
      }

      // According to snippet, weil_accounts returns the array directly
      const accounts = await window.WeilWallet.request({ method: 'weil_accounts' });
      
      if (accounts && Array.isArray(accounts) && accounts.length > 0) {
        setIsConnected(true);
        // Handle both object with address or direct string address
        const address = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].address;
        setUserAddress(address);
        loadPurchasedContracts(address);
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

      // According to snippet, weil_requestAccounts returns an object { accounts: [...] }
      const result = await window.WeilWallet.request({ 
        method: 'weil_requestAccounts' 
      });

      if (result.accounts && result.accounts.length > 0) {
        setIsConnected(true);
        // Handle both object with address or direct string address
        const address = typeof result.accounts[0] === 'string' ? result.accounts[0] : result.accounts[0].address;
        
        setUserAddress(address);
        setSuccess('Wallet connected successfully!');
        setTimeout(() => setSuccess(''), 3000);
        loadPurchasedContracts(address);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const loadPurchasedContracts = (address: string) => {
    const stored = localStorage.getItem(`purchased_${address}`);
    if (stored) {
      setPurchasedContracts(JSON.parse(stored));
    }
  };

  const purchaseContract = async (contract: Contract) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate transaction for demo
      await new Promise(resolve => setTimeout(resolve, 2000));

      const contractAddress = Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');

      const purchase: PurchasedContract = {
        id: contract.id,
        name: contract.name,
        address: contractAddress,
        purchasedAt: new Date().toISOString(),
        price: contract.price
      };

      const updated = [...purchasedContracts, purchase];
      setPurchasedContracts(updated);
      localStorage.setItem(`purchased_${userAddress}`, JSON.stringify(updated));

      setSuccess(`Successfully purchased ${contract.name}!`);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess('Address copied to clipboard!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const shortenAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isPurchased = (contractId: string) => {
    return purchasedContracts.some(p => p.id === contractId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                🚨 Icarus MCP Marketplace
              </h1>
              <p className="text-purple-200">Purchase incident management contract addresses</p>
            </div>
            
            {!isConnected ? (
              <button
                onClick={connectWallet}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
              >
                <Wallet className="w-5 h-5" />
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="bg-slate-800 border border-purple-500 rounded-lg px-6 py-3 shadow-lg">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">{shortenAddress(userAddress)}</span>
                  <button onClick={() => copyToClipboard(userAddress)} className="hover:text-purple-300 transition-colors p-1 rounded hover:bg-white/10">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              {success}
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-12 text-center shadow-xl">
            <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">Connect your WeilWallet to browse the catalog and purchase Model Context Protocol (MCP) contracts for your infrastructure.</p>
            <button
              onClick={connectWallet}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? 'Connecting...' : 'Connect Wallet'}
            </button>
          </div>
        ) : (
          <>
            {/* MCP Contracts Grid */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                Available MCP Contracts
                <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-1 rounded-full">{mcpContracts.length}</span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mcpContracts.map((contract) => {
                  const purchased = isPurchased(contract.id);
                  return (
                    <div
                      key={contract.id}
                      className={`bg-slate-800/50 backdrop-blur border ${
                        purchased ? 'border-green-500 shadow-green-900/20' : 'border-slate-700 hover:border-purple-500 hover:shadow-purple-900/20'
                      } rounded-xl p-6 transition-all duration-300 shadow-lg flex flex-col`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`text-2xl w-14 h-14 rounded-xl bg-gradient-to-br ${contract.color} flex items-center justify-center shadow-inner`}>
                          {contract.icon}
                        </div>
                        {purchased && (
                          <div className="bg-green-500/20 p-1.5 rounded-full">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2">{contract.name}</h3>
                      <p className="text-sm text-slate-400 mb-4 flex-grow">{contract.description}</p>
                      
                      <div className="text-xs font-mono text-purple-300 mb-4 bg-slate-900/50 p-2.5 rounded border border-slate-700/50">
                        {contract.method}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                        <div className="text-white font-bold text-xl">{contract.price} WEIL</div>
                        <button
                          onClick={() => purchaseContract(contract)}
                          disabled={loading || purchased}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                            purchased
                              ? 'bg-green-500/10 text-green-400 cursor-default border border-green-500/20'
                              : 'bg-white text-purple-900 hover:bg-purple-50'
                          } disabled:opacity-50`}
                        >
                          {purchased ? (
                            <>
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
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-white mb-6">Your Purchased Contracts</h2>
                <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900/80">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Contract</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Address</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {purchasedContracts.map((purchase, idx) => (
                          <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl p-2 bg-slate-700/50 rounded-lg">
                                  {mcpContracts.find(c => c.id === purchase.id)?.icon || '📦'}
                                </div>
                                <div className="font-semibold text-white">{purchase.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg w-fit border border-slate-700/50">
                                <code className="text-sm text-purple-300 font-mono">
                                  {shortenAddress(purchase.address)}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(purchase.address)}
                                  className="text-slate-500 hover:text-white transition-colors ml-1"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-white font-medium">{purchase.price} WEIL</td>
                            <td className="px-6 py-4 text-slate-400 text-sm">
                              {new Date(purchase.purchasedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => copyToClipboard(purchase.address)}
                                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Details
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
        <div className="mt-12 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-xl p-8">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="bg-purple-500/20 p-1 rounded text-purple-300 text-sm">ℹ️</span> How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-slate-300 relative">
             {/* Connector Lines (Desktop) */}
             <div className="hidden md:block absolute top-4 left-[20%] right-[20%] h-px bg-gradient-to-r from-slate-700 via-purple-900 to-slate-700 -z-10"></div>

            <div className="relative bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 border border-purple-500/50 rounded-full flex items-center justify-center font-bold text-purple-400 shadow-lg">1</div>
              <div className="font-semibold text-purple-300 mb-2 mt-2">Connect Wallet</div>
              <div className="text-slate-400 leading-relaxed">Connect your WeilWallet to authenticate and access the decentralized marketplace.</div>
            </div>
            <div className="relative bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 border border-purple-500/50 rounded-full flex items-center justify-center font-bold text-purple-400 shadow-lg">2</div>
              <div className="font-semibold text-purple-300 mb-2 mt-2">Purchase MCPs</div>
              <div className="text-slate-400 leading-relaxed">Browse the catalog and acquire unique contract addresses by sending WEIL tokens.</div>
            </div>
            <div className="relative bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 border border-purple-500/50 rounded-full flex items-center justify-center font-bold text-purple-400 shadow-lg">3</div>
              <div className="font-semibold text-purple-300 mb-2 mt-2">Deploy & Use</div>
              <div className="text-slate-400 leading-relaxed">Integrate the purchased MCP addresses into your Icarus incident management workflow.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPMarketplace;