import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showWallet: false,
  walletStatus: true,
  superChainIds: [5],

  walletAddress: '',
  chainId: '',
  connected: false,

  newWalletInfo: {}
};

const BaseInfoSlice = createSlice({
  name: 'chain',
  initialState,
  reducers: {
    showWallet(state, { payload: flag }) {
      state.showWallet = flag;
    },
    setWalletStatus(state, { payload: flag }) {
      state.walletStatus = flag;
    },
    setWalletAddress(state, { payload: address }) {
      state.walletAddress = address;
    },
    setConnected(state, { payload: data }) {
      state.connected = data;
    },
    setChainId(state, { payload: chainId }) {
      state.chainId = String(Number(chainId));
    },

    chainLogin(state, { payload: chainLoginInfo }) {
      console.log('chainLogin----', chainLoginInfo);
      state.walletAddress = chainLoginInfo.address;
      state.connected = chainLoginInfo.connect;
    },
    chainLogout(state) {
      state.walletAddress = '';
      state.connected = false;
      state.chainId = '';
    },

    setNewWalletInfo(state, { payload: info }) {
      state.newWalletInfo = info;
    }
  }
});
export default BaseInfoSlice.reducer;
