import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import Header from './components/Header';
import WalletConnect from './components/WalletConnect';
import MCPCard from './components/MCPCard';
import PurchasedMCPs from './components/PurchasedMCPs';
import { MCPS } from './lib/mcpData';
import { MCP, PurchasedMCP } from './types';
import { deployContract } from './lib/weil';

const App: React.FC = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [purchasedMCPs, setPurchasedMCPs] = useState<PurchasedMCP[]>([]);
  const [loading, setLoading] = useState(false);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
    setWalletConnected(true);
  };

  const handlePurchase = async (mcp: MCP) => {
    setLoading(true);
    try {
      // Simulate deployment process
      const { contractAddress } = await deployContract('path/to/wasm', 'path/to/widl');
      
      setPurchasedMCPs(prev => [...prev, {
        ...mcp,
        contractAddress: contractAddress,
        purchasedAt: new Date().toISOString()
      }]);
    } catch (err) {
      console.error('Purchase failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const isPurchased = (mcpId: string) => purchasedMCPs.some(m => m.id === mcpId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        
        <WalletConnect 
          connected={walletConnected}
          address={walletAddress}
          onConnect={handleWalletConnect}
        />

        {walletConnected && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" />
                Premium Orchestrator
              </h2>
              <MCPCard
                mcp={MCPS[0]}
                onPurchase={handlePurchase}
                isPurchased={isPurchased(MCPS[0].id)}
                loading={loading}
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-6">Individual Service MCPs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {MCPS.slice(1).map(mcp => (
                <MCPCard
                  key={mcp.id}
                  mcp={mcp}
                  onPurchase={handlePurchase}
                  isPurchased={isPurchased(mcp.id)}
                  loading={loading}
                />
              ))}
            </div>

            {purchasedMCPs.length > 0 && (
              <PurchasedMCPs mcps={purchasedMCPs} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;