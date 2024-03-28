import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { setTokensModal, setRequestTypeModal, setIsCreate, setList, updateList, setResultDialog } from "./actions";
import { AppState, useAppDispatch } from "../index";
import Server from "@/service";
// import { useTransactionMined } from '@/hooks';
import { Cell, constants, getERC20, getRegistry } from "@/sdk";
import { $shiftedByFixed } from "@/utils/met";
import { TransactionState } from "@/typings";
import { message, notification } from "antd";
import { useWallet } from "@solana/wallet-adapter-react";

export function useIsCreate(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const isCreate = useSelector<AppState, AppState["cells"]["isCreate"]>((state: AppState) => state.cells.isCreate);
  const handIsCreate = useCallback(
    (open: boolean) => {
      dispatch(setIsCreate(open));
    },
    [dispatch]
  );

  return [isCreate, handIsCreate];
}

export function useTokensModal(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const showTokensModal = useSelector<AppState, AppState["cells"]["showTokensModal"]>((state: AppState) => state.cells.showTokensModal);
  const handTokensModal = useCallback(
    (open: boolean) => {
      dispatch(setTokensModal(open));
    },
    [dispatch]
  );

  return [showTokensModal, handTokensModal];
}

export function useRequestTypeModal(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const showRequestTypeModal = useSelector<AppState, AppState["cells"]["showRequestTypeModal"]>((state: AppState) => state.cells.showRequestTypeModal);
  const handRequestTypeModal = useCallback(
    (open: boolean) => {
      dispatch(setRequestTypeModal(open));
    },
    [dispatch]
  );

  return [showRequestTypeModal, handRequestTypeModal];
}

export function useCells(): [any[], () => void, (data: Record<string, any>) => Promise<any>, () => void, boolean] {
  const dispatch = useAppDispatch();
  // const { wallet, account, chainId } = useWallet();
  const { wallet, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const list = useSelector<AppState, AppState["cells"]["list"]>((state: AppState) => state.cells.list);
  const fetchList = useCallback(async () => {
    try {
      // const Registry = constants.CHAIN_CONTRACTS[chainId].Registry;
      // const registry = getRegistry(wallet, Registry);
      // setLoading(true);
      // const balanceOf: any = await registry.balanceOf(account);
      // console.log('balanceOf', balanceOf);
      // let index = 0,
      //   tokenIds = [];
      // do {
      //   try {
      //     const tokenid = await registry.tokenOfOwnerByIndex(account, index);
      //     tokenIds.push(tokenid.toString());
      //     console.log('tokenid', tokenid.toString(), 'index', index);
      //   } catch (e) {}
      //   index++;
      // } while (balanceOf > 0 && index < balanceOf);
      // console.log('tokenIds', tokenIds);
      // // const params = { owner: account };
      // const params = { tokenIds };
      // const { code, data, error } = await Server.fetchCells(params);
      // if (code !== 0) throw new Error(error);
      // const list = [];
      // let i = 0;
      // for (i; i < data.length; i++) {
      //   const erc20 = getERC20(wallet, data[i].denom);
      //   const balance = await erc20.balanceOf(data[i].cellAddress);
      //   list.push({ ...data[i], Registry, reward: $shiftedByFixed(balance, -1 * data[i].tokeninfo.decimals, 3) });
      // }
      // dispatch(setList(list));
    } catch (e: any) {
      console.error("----", e.reason || e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, publicKey, wallet]);

  const update = useCallback(
    async (data: Record<string, any>) => {
      try {
        // const erc20 = getERC20(wallet, data.denom);
        // const reward = await erc20.balanceOf(data.cellAddress);
        // dispatch(updateList({ cellAddress: data.cellAddress, reward: $shiftedByFixed(reward, -1 * data.tokeninfo.decimals, 4) }));
      } catch (e: any) {
        console.error("----", e.reason || e.message);
      }
    },
    [dispatch, wallet]
  );

  const reset = () => {
    dispatch(setList([]));
  };

  // useEffect(() => {
  //   dispatch(setList([]));
  // }, [account, chainId]);

  return [list, fetchList, update, reset, loading];
}

export function useClaim(): [(data: Record<string, any>) => void, boolean] {
  const dispatch = useAppDispatch();
  const [, , update] = useCells();
  const { wallet, publicKey } = useWallet();
  // const [, { awaitTransactionMined }] = useTransactionMined();
  const [loading, setLoading] = useState(false);
  const claim = useCallback(
    async (data: Record<string, any>) => {
      try {
        setLoading(true);
        // const transaction = new Cell(wallet, data.cellAddress).withdraw(account);
        // const { transactionState, hash } = await awaitTransactionMined(transaction);
        // console.log('hash::', hash);

        // if (transactionState === TransactionState.SUCCESS) {
        //   await update(data);
        //   notification.success({ message: 'Claim Successfully' });
        // } else {
        //   throw new Error('Claim Fail');
        // }
      } catch (e: any) {
        notification.error({ message: e.reason || e.message || "Claim fail" });
      } finally {
        setLoading(false);
      }
    },
    [dispatch, publicKey, wallet]
  );

  return [claim, loading];
}

export function useResultModal(): [{ [key: string]: any }, (info: { [key: string]: any }) => void] {
  const dispatch = useAppDispatch();
  const resultInfo = useSelector<AppState, AppState["cells"]["resultInfoByDialog"]>((state: AppState) => state.cells.resultInfoByDialog);
  const handResultModal = useCallback(
    (info: { [key: string]: any }) => {
      dispatch(setResultDialog(info));
    },
    [dispatch]
  );

  return [resultInfo, handResultModal];
}
