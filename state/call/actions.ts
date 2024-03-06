import { createAction } from '@reduxjs/toolkit';

export const setTokensModal = createAction<boolean>('call/setTokensModal');
export const setHistory = createAction<any[]>('call/setHistory');
export const setHistoryModal = createAction<boolean>('call/setHistoryModal');
export const setHasNewHistory = createAction<boolean>('call/setHasNewHistory');
export const setResultDialog = createAction<{ [key: string]: any }>('call/setResultDialog');
export const setApproveResultDialog = createAction<{ [key: string]: any }>('call/setApproveResultDialog');
