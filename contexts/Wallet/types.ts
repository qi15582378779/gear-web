export interface WalletContextApi<T> {
  wallet: T;
  account: string;
  chainId: string;
  factory: any;
  walletReady: boolean;
  switchNetwork: (chainId?: number) => Promise<any>;
  openscan: (value: string, type?: string) => void;
  openGreenfieldScan: (value: string, type?: string) => void;
  getScanAddress: (value: string, type?: string) => string;
  getGreenfieldScanAddress: (value: string, type?: string) => string;
  scan: Record<any, any>;
}
