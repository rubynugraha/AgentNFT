/**
 * Safely detect and access window.ethereum to avoid conflicts with multiple wallet extensions
 */
export function getEthereumProvider() {
  try {
    if (typeof window === 'undefined') return null;

    const anyWindow = window as any;

    // Check if ethereum is available
    if (!anyWindow.ethereum) return null;

    // If there are multiple providers, prefer MetaMask or the first one
    if (anyWindow.ethereum.providers && anyWindow.ethereum.providers.length > 0) {
      // Look for MetaMask first
      const metaMask = anyWindow.ethereum.providers.find((p: any) => p.isMetaMask);
      if (metaMask) return metaMask;

      // Otherwise use the first provider
      return anyWindow.ethereum.providers[0];
    }

    // Single provider
    return anyWindow.ethereum;
  } catch (error) {
    console.warn('Error accessing ethereum provider:', error);
    return null;
  }
}

/**
 * Check if Ethereum provider is available
 */
export function hasEthereumProvider(): boolean {
  return getEthereumProvider() !== null;
}