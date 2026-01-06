import React from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { MCP } from '../types';

interface MCPCardProps {
  mcp: MCP;
  onPurchase: (mcp: MCP) => void;
  isPurchased: boolean;
  loading: boolean;
}

const MCPCard: React.FC<MCPCardProps> = ({ mcp, onPurchase, isPurchased, loading }) => {
  return (
    <div className={`
      bg-slate-800 border rounded-xl p-6 transition-all
      ${mcp.premium 
        ? 'border-yellow-500 shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-500/30' 
        : 'border-slate-700 hover:border-slate-600'
      }
      ${isPurchased ? 'opacity-75' : ''}
    `}>
      <div className="flex items-start justify-between mb-4">
        <span className="text-5xl">{mcp.icon}</span>
        {mcp.premium && (
          <span className="bg-yellow-500 text-slate-900 px-2 py-1 rounded text-xs font-bold">
            PREMIUM
          </span>
        )}
      </div>
      
      <h3 className="text-white font-bold text-lg mb-2">{mcp.name}</h3>
      <p className="text-slate-400 text-sm mb-4">{mcp.description}</p>
      
      <div className="space-y-2 mb-4">
        {mcp.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
            <span className="text-slate-300 text-xs">{feature}</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <span className="text-2xl font-bold text-white">${mcp.price}</span>
        <button
          onClick={() => onPurchase(mcp)}
          disabled={isPurchased || loading}
          className={`
            px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2
            ${isPurchased 
              ? 'bg-green-600 text-white cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
            disabled:opacity-50
          `}
        >
          {isPurchased ? (
            <>
              <Check size={16} />
              Purchased
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Deploy
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MCPCard;