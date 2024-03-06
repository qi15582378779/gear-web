import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showHistoryModal: false,
  history: [] as any[],
  hasNewHistory: false,
  approveResultDialog: {
    open: false,
    // open: true,
    step: 'approve', // approve  call
    type: 'wating', // wating pending success fail
    callInfo: {
      name: '',
      logoFile: ''
    }
  },
  resultInfoByDialog: {
    open: false,
    type: 'wating',
    hash: '',
    callInfo: {
      name: '',
      logoFile: ''
    }
  }
};

const CallsSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    setHistoryModal(state, { payload: open }) {
      state.showHistoryModal = open;
    },
    setHasNewHistory(state, { payload: isNew }) {
      state.hasNewHistory = isNew;
    },

    setHistory(state, { payload: list }) {
      state.history = list;
    },
    setResultDialog(state, { payload: info }) {
      state.resultInfoByDialog = info;
    },
    setApproveResultDialog(state, { payload: info }) {
      // if (!info.open) {
      //   state.approveResultDialog = { ...state.approveResultDialog, open: false };
      // } else {
      state.approveResultDialog = { ...state.approveResultDialog, ...info };
      // }
    }
  }
});
export default CallsSlice.reducer;
