import { WeilWalletConnection } from '@weilliptic/weil-sdk';

/**
 * Connects to the Weil Wallet extension.
 * @returns The wallet address as a hex string.
 */
export async function connectWallet(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Must be called in browser');
  }

  const provider = (window as any).WeilWallet;

  if (!provider) {
    throw new Error('WeilWallet not found. Please install the wallet extension.');
  }

  try {
    // Trigger the wallet connection popup.
    // Different wallet standards use different method names. We try the most common ones.
    if (typeof provider.enable === 'function') {
      await provider.enable();
    } else if (typeof provider.connect === 'function') {
      await provider.connect();
    } else if (typeof provider.request === 'function') {
       // EIP-1193 pattern
       try {
         await provider.request({ method: 'eth_requestAccounts' });
       } catch (e) {
         // Fallback for non-EVM standard wallets using request
         await provider.request({ method: 'connect' });
       }
    }

    // Initialize SDK wrapper
    const wallet = new WeilWalletConnection({
      walletProvider: provider,
    }) as any;

    // Some SDK wrappers might require an explicit connect call
    if (typeof wallet.connect === 'function') {
      await wallet.connect();
    }

    // Attempt to retrieve the address from various possible properties/methods
    let address = '';
    
    if (typeof wallet.getAddress === 'function') {
      address = await wallet.getAddress();
    } else if (wallet.address) {
      address = wallet.address;
    } else if (typeof wallet.getAccounts === 'function') {
      const accounts = await wallet.getAccounts();
      if (Array.isArray(accounts) && accounts.length > 0) {
         // specific handling if accounts are objects or strings
         address = typeof accounts[0] === 'string' ? accounts[0] : accounts[0].address;
      }
    } 
    
    // Fallback to provider direct access if SDK fails
    if (!address) {
       address = provider.selectedAddress || provider.address;
    }

    if (!address) {
      throw new Error("Wallet connected but address could not be retrieved. Please check wallet permissions.");
    }

    return address;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

/**
 * Helper to fetch a file and convert it to a hex string.
 */
async function fetchToHex(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${url} (Status: ${response.status})`);
  }
  const buffer = await response.arrayBuffer();
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Deploys a contract using the Weil SDK.
 * @param wasmUrl URL to the .wasm file
 * @param widlUrl URL to the .widl file
 * @returns Object containing the deployed contract address
 */
export async function deployContract(wasmUrl: string, widlUrl: string): Promise<{ contractAddress: string }> {
  const provider = (window as any).WeilWallet;

  if (!provider) {
    throw new Error('Wallet not connected');
  }

  const wallet = new WeilWalletConnection({
    walletProvider: provider,
  }) as any;

  try {
    // 1. Fetch files and convert to HEX
    const [binHex, widlHex] = await Promise.all([
      fetchToHex(wasmUrl),
      fetchToHex(widlUrl)
    ]);

    // 2. Deploy via SDK
    const result = await wallet.contracts.deploy(
      binHex,
      widlHex,
      {
        author: 'MCP Marketplace'
      }
    );

    console.log('Contract Deployment Result:', result);

    const contractAddress = result.address || result.contractAddress || (typeof result === 'string' ? result : '');

    if (!contractAddress) {
      console.warn("Could not parse contract address from result", result);
      return { contractAddress: "deployment-successful-unknown-address" };
    }

    return { contractAddress };

  } catch (error) {
    console.error('Contract deployment error:', error);
    throw error;
  }
}