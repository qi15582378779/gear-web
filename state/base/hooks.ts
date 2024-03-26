import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setBalance } from './actions';
import tokens from '@/utils/tokens.json';
import { AppState, useAppDispatch } from '../index';
// import { useBalance, useWallet } from '@/hooks';
import { useWallet } from '@solana/wallet-adapter-react';

export function useUserBalance(): [{ [key: string]: any }, () => void] {
  const dispatch = useAppDispatch();
  // const { account, chainId } = useWallet();
  const { wallet, publicKey, connected } = useWallet();

  // const [, getBalance] = useBalance();

  const balance = useSelector<AppState, AppState['base']['balance']>((state: AppState) => state.base.balance);
  const getUserBalance = useCallback(async () => {
    try {
      // const usdtInfo = (tokens as any)[chainId].USDT;
      // const bnbInfo = (tokens as any)[chainId].BNB;
      // const usdtBalance = await getBalance(usdtInfo.address, account);
      // const bnbBalance = await getBalance(bnbInfo.address, account);
      // dispatch(
      //   setBalance({
      //     bnb: bnbBalance,
      //     usdt: usdtBalance
      //   })
      // );
    } catch (e: any) {
      console.error('getUserBalance error', e.message);
    }
  }, [dispatch, connected]);

  return [balance, getUserBalance];
}
