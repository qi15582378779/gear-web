import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { setTokensModal, setRequestTypeModal, setList, updateList, setResultDialog } from "./actions";
import { AppState, useAppDispatch } from "../index";
import Server from "@/service";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWorkspaceGear } from "@/hooks/useWorkspace";
import { PublicKey } from "@solana/web3.js";

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
  const workspace = useWorkspaceGear();

  const { wallet, publicKey } = useWallet();
  const [loading, setLoading] = useState(false);
  const list = useSelector<AppState, AppState["cells"]["list"]>((state: AppState) => state.cells.list);
  const fetchList = useCallback(async () => {
    try {
      setLoading(true);
      const { code, data, error } = await Server.fetchGears({ owner: publicKey!.toBase58().toLowerCase() });
      if (code !== 0) throw new Error(error);
      const list = [];
      let i = 0;
      for (i; i < data.length; i++) {
        try {
          const reward = await workspace?.program.getClaimableAmount(new PublicKey(data[i].gearAddress));
          list.push({ ...data[i], reward, gear_nft: `https://solscan.io/token/${data[i].gearAddress}?cluster=devnet#metadata`, arweave_storage: `https://arweave.net/${data[i].metadataObjectId}` });
        } catch (e) {}
      }
      dispatch(setList(list));
    } catch (e: any) {
      console.error("----", e.reason || e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, publicKey, wallet]);

  const update = useCallback(
    async (data: Record<string, any>) => {
      try {
        const reward = await workspace?.program.getClaimableAmount(new PublicKey(data.gearAddress));
        dispatch(updateList({ gearAddress: data.gearAddress, reward }));
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
