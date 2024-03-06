import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  balance: {
    bnb: '0.00',
    usdt: '0.00'
  }
};

const BaseSlice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    setBalance(state, { payload: info }) {
      state.balance = info;
    }
  }
});
export default BaseSlice.reducer;
