import { createContext, FC, ReactElement, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';
import { useConnectWallet, useWalletAddress, useChainId, useSuperChainIds } from 'state/chain/hooks';
import { chainWallet, ChainWallet, getFactory, constants, getCell } from '@/sdk/index';
import { WalletContextApi } from './types';

import { getConfig } from '@/common/config';

export const WalletContext = createContext<WalletContextApi<ChainWallet> | undefined>(undefined);

type WalletProps = {
  children: ReactNode;
};

export const WalletProvider: FC<WalletProps> = ({ children }): ReactElement => {
  const [wallet] = useState(chainWallet);
  const [walletAddress, connectWallet] = useConnectWallet();
  const [, setWalletAddress] = useWalletAddress();
  const [chainId, setChainId] = useChainId();
  const scan: Record<string, string> = useMemo(
    () => ({
      56: 'https://bscscan.com/',
      97: 'https://testnet.bscscan.com/'
    }),
    []
  );
  const greenfieldscanScan: Record<string, string> = useMemo(
    () => ({
      56: 'https://bscscan.greenfieldscan.com/',
      97: 'https://testnet.greenfieldscan.com/'
    }),
    []
  );

  const walletReady: boolean = useMemo(() => {
    return !!chainId && Number(chainId) !== 0 && !!walletAddress;
  }, [chainId, walletAddress]);

  const factory = useMemo(() => {
    if (!walletReady) return null;
    if (!constants.CHAIN_CONTRACTS?.[chainId]?.Factory) return null;
    return getFactory(wallet, constants.CHAIN_CONTRACTS[chainId].Factory);
  }, [walletReady, wallet]);

  //   const cell = useMemo(() => {
  //     if (!walletReady) return null;
  //     return getCell(wallet, constants.CHAIN_CONTRACTS[chainId].Factory);
  //   }, [walletReady, wallet]);

  const onChainStatus = (): void => {
    chainWallet.onChainStatus(handleChainStatus);
  };

  const onChainChanged = (): void => {
    chainWallet.onChainChanged(handleChainChanged);
  };

  const onAccountsChanged = (): void => {
    chainWallet.onAccountsChanged(handleNewAccounts);
  };

  const handleNewAccounts = (acc: any) => {
    if (!acc.length) {
      // Storage.removeItem('account');
      return;
    }

    console.log('handleNewAccounts----', acc);
    let user = walletAddress;
    if (acc.length) {
      if (user !== acc[0]) {
        setWalletAddress(acc[0]);
      }
    }
  };

  const switchNetwork = async (chainId: number = getConfig('DEFAULT_CHAIN_ID')) => {
    try {
      await chainWallet.switchNetwork(chainId);
    } catch (e: any) {
      //   throw e;
      console.error('switchNetwork error', e.message);
    }
  };

  const handleChainChanged = async (_chainId: number | string) => {
    console.error('_chainId', _chainId);
    _chainId = String(Number(_chainId));
    if (chainId === _chainId || !_chainId) return;
    console.log('handleChainChanged network', Number(_chainId));

    console.error('getConfig', getConfig('SUPER_CHAIN_ID'), Number(chainId));
    if (!getConfig('SUPER_CHAIN_ID').includes(Number(_chainId))) {
      setChainId(0);
      // switchNetwork();
    } else {
      setChainId(_chainId);
    }
  };

  const handleChainStatus = (status: number): void => {
    if (status === 2) {
      console.error('connect success');
    } else {
    }
  };

  const openscan = useCallback(
    (value: string, type: string = 'tx') => {
      if (typeof window === 'undefined') return;
      window.open(`${scan[chainId]}${type}/${value}`);
    },
    [chainId, scan]
  );

  const openGreenfieldScan = useCallback(
    (value: string, type: string = 'tx') => {
      if (typeof window === 'undefined') return;
      window.open(`${greenfieldscanScan[chainId]}${type}/${value}`);
    },
    [chainId, scan]
  );

  const getScanAddress = useCallback(
    (value: string, type: string = 'tx') => {
      return `${scan[chainId]}${type}/${value}`;
    },
    [chainId, scan]
  );

  const getGreenfieldScanAddress = useCallback(
    (value: string, type: string = 'tx') => {
      return `${greenfieldscanScan[chainId]}${type}/${value}`;
    },
    [chainId, scan]
  );

  useEffect(() => {
    onChainStatus();
    onChainChanged();
    onAccountsChanged();

    // connectWallet('m');
    // const connected = window.localStorage.getItem('connected');
    // if (connected === 'true') {
    //   const connectChainType = window.localStorage.getItem('connectChainType');
    // connectWallet('m');
    // }
  }, []);

  return <WalletContext.Provider value={{ wallet, account: walletAddress, chainId, openscan, openGreenfieldScan, getScanAddress, getGreenfieldScanAddress, factory, walletReady, switchNetwork, scan }}>{children}</WalletContext.Provider>;
};
