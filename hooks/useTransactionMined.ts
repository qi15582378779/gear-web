import { useState } from 'react';
import { TransactionState } from '@/typings';
import { useWallet } from '@/hooks';
import { common } from '@/sdk/index';

type ITransactionMined = {
  transactionState: TransactionState;
  hash: string;
};

const _useTransactionMined = (): [
  TransactionState,
  {
    awaitReceiptByHash: (transactionHash: string) => void;
    awaitTransactionMined: (transactionHash: common.types.TransactionMethods<any>, transactionCallabck?: (transactionState: TransactionState) => void) => Promise<ITransactionMined>;
  },
  string
] => {
  const [transactionState, setTransactionState] = useState<TransactionState>(TransactionState.UNKNOWN);
  const { wallet } = useWallet();
  const [hash, setHash] = useState<string>('');

  const awaitReceiptByHash = async (transactionHash: string) => {
    try {
      setTransactionState(TransactionState.PENDING);
      const receipt = await wallet.getTransactionReceipt(transactionHash);
      if (receipt.status) {
        setTransactionState(TransactionState.SUCCESS);
      } else {
        setTransactionState(TransactionState.FAIL);
      }
    } catch (e) {
      setTransactionState(TransactionState.ERROR);
      throw e;
    }
  };

  const awaitTransactionMined = async (transaction: any, transactionCallabck?: (transactionState: TransactionState) => void) => {
    try {
      const result = await transaction.transact();
      if (transactionCallabck) transactionCallabck(TransactionState.PENDING);
      setTransactionState(TransactionState.PENDING);
      setHash(result.hash);
      const receipt = await result.wait();
      let _transactionState;
      if (receipt.status) {
        _transactionState = TransactionState.SUCCESS;
        if (transactionCallabck) transactionCallabck(TransactionState.SUCCESS);
      } else {
        _transactionState = TransactionState.FAIL;
        if (transactionCallabck) transactionCallabck(TransactionState.FAIL);
      }
      setTransactionState(_transactionState);
      return { transactionState: _transactionState, hash: result.hash };
    } catch (e) {
      setTransactionState(TransactionState.ERROR);
      throw e;
    }
  };

  return [transactionState, { awaitReceiptByHash, awaitTransactionMined }, hash];
};

export default _useTransactionMined;
