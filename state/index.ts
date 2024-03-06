import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import chain from './chain/reducer';
import call from './call/reducer';
import cells from './cells/reducer';
import base from './base/reducer';

const store = configureStore({
  reducer: {
    base,
    chain,
    call,
    cells
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,

      thunk: true
    }),
  devTools: process.env.NODE_ENV === 'development'
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;
