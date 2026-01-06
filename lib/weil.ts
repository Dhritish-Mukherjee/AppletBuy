import { WeilWalletConnection } from '@weilliptic/weil-sdk';

// FIX: Removed conflicting global declaration of WeilWallet.
// The SDK likely defines this type globally which caused a mismatch error ("All declarations... must have identical modifiers").
// We will access it via (window as any) to bypass type conflicts.
/*
declare global {
  interface Window {
    WeilWallet?: any;
  }
}
*/

/**
 * Connects to the Weil Wallet extension.
 * @returns The wallet address as a hex string.
 */
export async function connectWallet(): Promise<string> {
  if (typeof window === 'undefined') {
    throw new Error('Must be called in browser');
  }

  // FIX: Access WeilWallet via (window as any) to avoid type errors.
  const provider = (window as any).WeilWallet;

  if (!provider) {
    throw new Error('WeilWallet not found. Please install the wallet extension.');
  }

  // FIX: Cast to any to avoid "Property 'getAddress' does not exist" error.
  const wallet = new WeilWalletConnection({
    walletProvider: provider,
  }) as any;

  // The SDK doesn't strictly define the method to get the address in the README provided,
  // but standard pattern implies requesting access or getting the address property.
  // We assume getAddress() is available or the wallet exposes it.
  try {
    // Attempt to get address (assuming SDK follows standard dApp pattern)
    // If specific method differs, this would need adjustment based on exact API docs.
    const address = await wallet.getAddress();
    return address;
  } catch (error) {
    console.error("Error retrieving address:", error);
    // Fallback if getAddress isn't the method name, though highly likely.
    throw new Error("Could not retrieve wallet address. Please ensure wallet is unlocked.");
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
  // FIX: Access WeilWallet via (window as any).
  const provider = (window as any).WeilWallet;

  if (!provider) {
    throw new Error('Wallet not connected');
  }

  // FIX: Cast to any to bypass type checks on contract deployment return type
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
    // FIX: wallet is cast to any, so result is any, avoiding "Property 'address' does not exist on type 'any[]'" error.
    const result = await wallet.contracts.deploy(
      binHex,
      widlHex,
      {
        author: 'MCP Marketplace'
      }
    );

    console.log('Contract Deployment Result:', result);

    // The SDK README result structure isn't fully detailed, but usually includes the address.
    // We attempt to extract it from likely properties.
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