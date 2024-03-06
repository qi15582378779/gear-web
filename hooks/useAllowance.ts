import { useEffect, useState, useCallback } from 'react';
import { useWallet } from '@/hooks';
import { ERC20 } from '@/sdk';
import Bignumber from 'bignumber.js';

export const useAllowance = (token: ERC20, contract_address: string): [string, () => void] => {
  const { account } = useWallet();
  const [allowance, setAllowance] = useState<string>('');
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const fetchAllowance = useCallback(async () => {
    const info = await token.info();
    let allowance = await token.allowance(account, contract_address);
    setAllowance(new Bignumber(allowance).shiftedBy(-1 * info.decimals).toFixed());
  }, [token, contract_address, account]);

  useEffect(() => {
    if (token && contract_address) {
      if (token.address === ZERO_ADDRESS) return;
      fetchAllowance().catch((err) => console.error(`Failed to fetch allowance: ${err}`));
    }
  }, [token, contract_address, account, fetchAllowance]);

  return [allowance, fetchAllowance];
};

export const useAllowanceByToken = (): [string, (token: ERC20, contract_address: string) => void] => {
  const { account } = useWallet();
  const [allowance, setAllowance] = useState<string>('');
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const fetchAllowance = useCallback(
    async (token: ERC20, contract_address: string) => {
      try {
        if (token.address === ZERO_ADDRESS) return;
        const info = await token.info();
        let allowance = await token.allowance(account, contract_address);
        setAllowance(new Bignumber(allowance).shiftedBy(-1 * info.decimals).toFixed());
      } catch (err: any) {
        console.error(`Failed to fetch allowance: ${err.message}`);
      }
    },
    [account]
  );

  return [allowance, fetchAllowance];
};
