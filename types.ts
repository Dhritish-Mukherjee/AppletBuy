export interface MCP {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  icon: string;
  premium?: boolean;
  contractAddress?: string;
  purchasedAt?: string;
}

export interface PurchasedMCP extends MCP {
  contractAddress: string;
  purchasedAt: string;
}

export interface WalletState {
  connected: boolean;
  address: string;
}