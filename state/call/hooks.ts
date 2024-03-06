import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { setTokensModal, setHistory, setResultDialog, setHistoryModal, setHasNewHistory, setApproveResultDialog } from './actions';
import { AppState, useAppDispatch } from '../index';
import Server from '@/service';
import { useWallet } from '@/hooks';
import { message, notification } from 'antd';

export function useTokensModal(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const showTokensModal = useSelector<AppState, AppState['cells']['showTokensModal']>((state: AppState) => state.cells.showTokensModal);
  const handTokensModal = useCallback(
    (open: boolean) => {
      dispatch(setTokensModal(open));
    },
    [dispatch]
  );

  return [showTokensModal, handTokensModal];
}

export function useHistory(): [{ historyList: any[]; listLoad: boolean }, { fetchHistory: () => void; reset: () => void }] {
  const dispatch = useAppDispatch();
  const { wallet, account } = useWallet();
  const historyList = useSelector<AppState, AppState['call']['history']>((state: AppState) => state.call.history);
  const [listLoad, setListLoad] = useState<boolean>(false);
  const fetchHistory = useCallback(async () => {
    setListLoad(true);
    try {
      const params = { owner: account };
      const { code, data, error } = await Server.fetchHistory(params);
      if (code !== 0) throw new Error(error);
      dispatch(setHistory(data));
    } catch (e: any) {
      notification.error({
        message: e.message || 'error'
      });
    } finally {
      setListLoad(false);
    }
  }, [dispatch, account, wallet]);

  const reset = () => {
    dispatch(setHistory([]));
  };

  return [
    { historyList, listLoad },
    { fetchHistory, reset }
  ];
}

export function useHistoryDialog(): [boolean, (open: boolean) => void] {
  const dispatch = useAppDispatch();
  const showHistoryModal = useSelector<AppState, AppState['call']['showHistoryModal']>((state: AppState) => state.call.showHistoryModal);
  const handShowHistoryModal = useCallback(
    (open: boolean) => {
      dispatch(setHistoryModal(open));
    },
    [dispatch]
  );

  return [showHistoryModal, handShowHistoryModal];
}

export function useResultModal(): [{ [key: string]: any }, (info: { [key: string]: any }) => void] {
  const dispatch = useAppDispatch();
  const resultInfo = useSelector<AppState, AppState['call']['resultInfoByDialog']>((state: AppState) => state.call.resultInfoByDialog);
  const handResultModal = useCallback(
    (info: { [key: string]: any }) => {
      dispatch(setResultDialog(info));
    },
    [dispatch]
  );

  return [resultInfo, handResultModal];
}
export function useApproveDialog(): [{ [key: string]: any }, (info: { [key: string]: any }) => void] {
  const dispatch = useAppDispatch();
  const approveResultDialog = useSelector<AppState, AppState['call']['approveResultDialog']>((state: AppState) => state.call.approveResultDialog);
  const handResultModal = useCallback(
    (info: { [key: string]: any }) => {
      dispatch(setApproveResultDialog(info));
    },
    [dispatch]
  );

  return [approveResultDialog, handResultModal];
}

export function useHasNewHistory(): [boolean, (hasNew: boolean) => void] {
  const dispatch = useAppDispatch();
  const hasNewHistory = useSelector<AppState, AppState['call']['hasNewHistory']>((state: AppState) => state.call.hasNewHistory);
  const handHasNewHistory = useCallback(
    (hasNew: boolean) => {
      dispatch(setHasNewHistory(hasNew));
    },
    [dispatch]
  );

  return [hasNewHistory, handHasNewHistory];
}
