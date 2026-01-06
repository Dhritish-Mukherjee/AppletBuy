export interface WeilWalletRequest {
  method: string;
  params?: any[];
}

export interface WeilAccount {
  address: string;
  [key: string]: any;
}

export interface WeilWalletResult {
  accounts?: WeilAccount[] | string[];
  [key: string]: any;
}

declare global {
  interface WeilWalletProvider {
    request: (args: WeilWalletRequest) => Promise<any>;
  }
}
