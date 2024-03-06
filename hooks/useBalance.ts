import { useState, useCallback } from 'react';
import { ERC20 } from '@/sdk';
import BigNumber from 'bignumber.js';
import { useWallet } from '@/hooks';

function useBalance(): [string | number, (token: string, user?: string) => Promise<any>] {
  const { wallet, account } = useWallet();
  const [balance, setBalance] = useState<string | number>('');
  const getBalance = async (token: string, user?: string) => {
    try {
      const erc20Token = new ERC20(wallet, token);
      const tokenInfo = await erc20Token.info();
      const result = await erc20Token.balanceOf(user || account);
      const _balance = Number(new BigNumber(result).shiftedBy(-1 * tokenInfo.decimals).toFixed(4, 1));
      setBalance(_balance);
      return _balance;
    } catch (e: any) {
      console.error('getBalance error:', e.message);
      throw new Error(e.message);
    }
  };
  return [balance, getBalance];
}

export default useBalance;
