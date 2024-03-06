import { createAction } from '@reduxjs/toolkit';

export interface chainLoginInfo {
  address: string;
  connect: boolean;
}

export const setShowWallet = createAction<boolean>('chain/showWallet');
export const setWalletStatus = createAction<boolean>('chain/setWalletStatus');
export const setWalletAddress = createAction<string>('chain/setWalletAddress');
export const setConnected = createAction<boolean>('chain/setConnected');
export const setChainId = createAction<string | number>('chain/setChainId');
export const chainLogin = createAction<chainLoginInfo>('chain/chainLogin');
export const chainLogout = createAction('chain/chainLogout');
export const setNewWalletInfo = createAction<any>('chain/setNewWalletInfo');
