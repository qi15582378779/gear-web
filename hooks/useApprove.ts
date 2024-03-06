import { useCallback, useEffect, useMemo, useState } from 'react';
import Bignumber from 'bignumber.js';
import { useAllowance, useAllowanceByToken } from './useAllowance';
import useTransactionMined from './useTransactionMined';
import { TransactionState, ApprovalState } from '@/typings';
import { ERC20 } from '@/sdk';

export const useApprove = (token: ERC20, contract_address: string, amount: number): [ApprovalState, () => void, boolean] => {
  const [currentAllowance, fetchAllowance] = useAllowance(token, contract_address);
  const [transactionState, { awaitTransactionMined }] = useTransactionMined();
  const [erc20, setErc20] = useState<ERC20 | null>(token);
  const [loading, setLoading] = useState<boolean>(false);
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const approvalState: ApprovalState = useMemo(() => {
    if (token?.address === ZERO_ADDRESS) {
      return ApprovalState.APPROVED;
    } else if (new Bignumber(currentAllowance).gte(amount)) {
      return ApprovalState.APPROVED;
    } else if (transactionState === TransactionState.PENDING) {
      return ApprovalState.PENDING;
    } else if (transactionState === TransactionState.SUCCESS) {
      return ApprovalState.APPROVED;
    }
    return ApprovalState.NOT_APPROVED;
  }, [currentAllowance, token, amount]);

  useEffect(() => {
    if (transactionState === TransactionState.SUCCESS) {
      fetchAllowance();
    }
    [TransactionState.SUCCESS, TransactionState.FAIL].includes(transactionState) && setLoading(false);
  }, [transactionState, fetchAllowance]);

  const Approve = useCallback(async () => {
    setLoading(true);
    try {
      const info = await token.info();
      let transaction = token.approve(contract_address, new Bignumber(amount).shiftedBy(info.decimals).toFixed());
      await awaitTransactionMined(transaction);
    } catch (e: any) {
      console.error('Approve error', e);
      setLoading(false);
      throw e;
    }
  }, [token, contract_address, awaitTransactionMined]);

  return [approvalState, Approve, loading];
};

export const useApproveByToken = (): [{ approvalState: ApprovalState; transactionState: TransactionState }, { approve: (approveAmount?: number) => Promise<any>; getAllowance: (token: ERC20, contractAddress: string, amount: number) => void }, boolean] => {
  const [currentAllowance, fetchAllowance] = useAllowanceByToken();
  const [transactionState, { awaitTransactionMined }] = useTransactionMined();
  const [amount, setAmount] = useState<number>(0);
  const [token, setToken] = useState<ERC20>();
  const [contractAddress, setContractAddress] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const approvalState: ApprovalState = useMemo(() => {
    console.log('currentAllowance', currentAllowance, amount);
    if (token?.address === ZERO_ADDRESS) {
      return ApprovalState.APPROVED;
    } else if (new Bignumber(currentAllowance).gte(amount)) {
      return ApprovalState.APPROVED;
    } else if (transactionState === TransactionState.PENDING) {
      return ApprovalState.PENDING;
    } else if (transactionState === TransactionState.SUCCESS) {
      return ApprovalState.APPROVED;
    }
    return ApprovalState.NOT_APPROVED;
  }, [currentAllowance, token, amount]);

  const getAllowance = (token: ERC20, contractAddress: string, amount: number) => {
    setToken(token);
    setContractAddress(contractAddress);
    setAmount(amount);
    fetchAllowance(token, contractAddress);
  };

  useEffect(() => {
    if (transactionState === TransactionState.SUCCESS) {
      fetchAllowance(token!, contractAddress);
    }
    [TransactionState.SUCCESS, TransactionState.FAIL].includes(transactionState) && setLoading(false);
  }, [transactionState, fetchAllowance]);

  const approve = useCallback(
    async (approveAmount?: number) => {
      try {
        if (!token) return;
        setLoading(true);
        const _amount = approveAmount || amount;
        const info = await token!.info();
        let transaction = token!.approve(contractAddress, new Bignumber(_amount).shiftedBy(info.decimals).toFixed());
        await awaitTransactionMined(transaction);
      } catch (e: any) {
        console.error('Approve error', e);
        setLoading(false);
        throw e;
      }
    },
    [token, contractAddress, awaitTransactionMined]
  );

  return [{ approvalState, transactionState }, { approve, getAllowance }, loading];
};
