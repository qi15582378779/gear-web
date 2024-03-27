import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { setBalance } from './actions';
import tokens from '@/utils/tokens.json';
import { AppState, useAppDispatch } from '../index';
// import { useBalance, useWallet } from '@/hooks';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function useUserBalance(): [{ [key: string]: any }, () => void] {
  const dispatch = useAppDispatch();
  // const { account, chainId } = useWallet();
  const { wallet, publicKey, connected } = useWallet();
  const { connection } = useConnection();

  // const [, getBalance] = useBalance();

  const balance = useSelector<AppState, AppState['base']['balance']>((state: AppState) => state.base.balance);
  const getUserBalance = useCallback(async () => {
    try {
      const balance = await connection.getBalance(publicKey!);
      dispatch(
        setBalance({
          sol: balance / LAMPORTS_PER_SOL
        })
      );
    } catch (e: any) {
      console.error('getUserBalance error', e.message);
    }
  }, [dispatch, connected]);

  return [balance, getUserBalance];
}
