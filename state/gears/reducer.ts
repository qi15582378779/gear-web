import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showTokensModal: false,
  showRequestTypeModal: false,
  isCreate: false,
  list: [] as any[],
  resultInfoByDialog: {
    open: false,
    type: "wating",
    hash: ""
  }
};

const GearsSlice = createSlice({
  name: "gears",
  initialState,
  reducers: {
    setTokensModal(state, { payload: open }) {
      state.showTokensModal = open;
    },
    setIsCreate(state, { payload: open }) {
      state.isCreate = open;
    },
    setRequestTypeModal(state, { payload: open }) {
      state.showRequestTypeModal = open;
    },
    setList(state, { payload: list }) {
      state.list = list;
    },
    updateList(state, { payload: info }) {
      const index = state.list.findIndex((ele: any) => ele.gearAddress === info.gearAddress);
      if (index === -1) return;
      state.list[index] = { ...state.list[index], ...info };
    },
    setResultDialog(state, { payload: info }) {
      state.resultInfoByDialog = info;
    }
  }
});
export default GearsSlice.reducer;
