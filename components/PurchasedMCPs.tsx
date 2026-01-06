import React from 'react';
import { Check } from 'lucide-react';
import { PurchasedMCP } from '../types';

interface PurchasedMCPsProps {
  mcps: PurchasedMCP[];
}

const PurchasedMCPs: React.FC<PurchasedMCPsProps> = ({ mcps }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Check className="text-green-400" />
        Your Deployed MCPs
      </h2>
      <div className="space-y-4">
        {mcps.map(mcp => (
          <div key={mcp.id} className="bg-slate-900 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mcp.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{mcp.name}</h3>
                  <p className="text-slate-400 text-sm">
                    Purchased {new Date(mcp.purchasedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <span className="text-green-400 text-sm font-semibold">
                ${mcp.price}
              </span>
            </div>
            <div className="bg-slate-800 rounded p-3 mt-3">
              <p className="text-slate-400 text-xs mb-1">Contract Address:</p>
              <code className="text-cyan-400 font-mono text-xs break-all">
                {mcp.contractAddress}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PurchasedMCPs;