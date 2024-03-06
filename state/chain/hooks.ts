import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { AppState, useAppDispatch } from '../index';
import { chainLogin, chainLogout, setWalletAddress, setConnected, setChainId, setShowWallet, setWalletStatus, setNewWalletInfo } from './actions';
import { chainWallet } from '../../sdk/index';

export function useConnectWallet(): [string, (type: string, options?: { [key: string]: any }) => void] {
  const dispatch = useAppDispatch();
  const [, handWalletStatus] = useWalletStatus();
  const [, handWalletModal] = useWalletModal();

  const walletAddress = useSelector<AppState, AppState['chain']['walletAddress']>((state: AppState) => state.chain.walletAddress);
  const superChainIds = useSelector<AppState, AppState['chain']['superChainIds']>((state: AppState) => state.chain.superChainIds);

  const connectWallet = useCallback(
    (type: string, options?: { [key: string]: any }) => {
      handWalletStatus(true);
      chainWallet
        .connect(type, options)
        .then((acc: any[]) => {
          console.log('connectWallet----', acc);
          let is = acc && acc.length > 0;
          let account = is ? acc[0] : '';
          let isConnect = chainWallet.isConnected();
          handWalletModal(false);
          dispatch(setConnected(true));
          dispatch(
            chainLogin({
              address: account,
              connect: isConnect
            })
          );
          return isConnect;
        })
        .catch((e: any) => {
          console.log('e', e.message);
          if (e.message === 'ChainWallet No Provider!' || !e.message) {
            handWalletStatus(false);
          }
        });
    },
    [dispatch]
  );

  return [walletAddress, connectWallet];
}

export function useWalletStatus(): [boolean, (flag: boolean) => void] {
  const dispatch = useAppDispatch();
  const walletStatus = useSelector<AppState, AppState['chain']['walletStatus']>((state: AppState) => state.chain.walletStatus);

  const handWalletStatus = useCallback(
    (flag: boolean) => {
      dispatch(setWalletStatus(flag));
    },
    [dispatch]
  );

  return [walletStatus, handWalletStatus];
}

export function useDisconnectWallet(): [boolean, () => void] {
  const dispatch = useAppDispatch();

  const connected = useSelector<AppState, AppState['chain']['connected']>((state: AppState) => state.chain.connected);

  const disconnectWallet = useCallback(async () => {
    await chainWallet.disconnect();
    dispatch(chainLogout());
  }, [dispatch]);

  return [connected, disconnectWallet];
}

export function useIsChain(): [string, (changeChainId: string) => Promise<any>] {
  const chainId = useSelector<AppState, AppState['chain']['chainId']>((state: AppState) => state.chain.chainId);
  const isChain = useCallback(
    (changeChainId: string) => {
      if (chainId !== changeChainId) {
        return chainWallet.switchNetwork(Number(changeChainId)).then((res: boolean) => {
          console.log('switchNetwork =====', chainId, changeChainId, res);
          if (!res) {
            return Promise.reject({ isSuccess: false, msg: 'error' });
          }
          return Promise.reject({ isSuccess: true, msg: 'success' });
        });
      } else {
        return Promise.resolve();
      }
    },
    [chainId]
  );

  return [chainId, isChain];
}

export function useWalletAddress(): [string, (address: string) => void] {
  const dispatch = useAppDispatch();
  const walletAddress = useSelector<AppState, AppState['chain']['walletAddress']>((state: AppState) => state.chain.walletAddress);
  const handWalletAddress = useCallback(
    (address: string) => {
      dispatch(setWalletAddress(address));
    },
    [dispatch]
  );

  return [walletAddress, handWalletAddress];
}

export function useConnected(): [boolean, (address: boolean) => void] {
  const dispatch = useAppDispatch();
  const connected = useSelector<AppState, AppState['chain']['connected']>((state: AppState) => state.chain.connected);
  const handConnect = useCallback(
    (isConnect: boolean) => {
      dispatch(setConnected(isConnect));
    },
    [dispatch]
  );

  return [connected, handConnect];
}

export function useChainId(): [string, (address: string | number) => void] {
  const dispatch = useAppDispatch();
  const chainId = useSelector<AppState, AppState['chain']['chainId']>((state: AppState) => state.chain.chainId);
  const handChainId = useCallback(
    (chainId: string | number) => {
      dispatch(setChainId(chainId));
    },
    [dispatch]
  );

  return [chainId, handChainId];
}

export function useWalletModal(): [boolean, (flag: boolean) => void] {
  const dispatch = useAppDispatch();
  const [, handWalletStatus] = useWalletStatus();

  const showWallet = useSelector<AppState, AppState['chain']['showWallet']>((state: AppState) => state.chain.showWallet);
  const handWallet = useCallback(
    (flag: boolean) => {
      handWalletStatus(true);
      dispatch(setShowWallet(flag));
    },
    [dispatch]
  );

  return [showWallet, handWallet];
}

export function useSuperChainIds(): [number[]] {
  const superChainIds = useSelector<AppState, AppState['chain']['superChainIds']>((state: AppState) => state.chain.superChainIds);
  return [superChainIds];
}

export function useNewWalletInfo(): [{ walletInfo: Record<string, any> }, (wallet: Record<string, any>) => void] {
  const dispatch = useAppDispatch();
  const walletInfo = useSelector<AppState, AppState['chain']['newWalletInfo']>((state: AppState) => state.chain.newWalletInfo);

  const handleWalletInfo = useCallback(
    (wallet: Record<string, any>) => {
      dispatch(setNewWalletInfo(wallet));
    },
    [dispatch]
  );

  return [{ walletInfo }, handleWalletInfo];
}
