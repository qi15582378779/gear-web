import { createAction } from "@reduxjs/toolkit";

export type IUpdateList = {
  gearAddress: string;
  [key: string]: any;
};
export const setIsCreate = createAction<boolean>("gears/setIsCreate");
export const setTokensModal = createAction<boolean>("gears/setTokensModal");
export const setRequestTypeModal = createAction<boolean>("gears/setRequestTypeModal");
export const setList = createAction<any[]>("gears/setList");
export const updateList = createAction<IUpdateList>("gears/updateList");
export const setResultDialog = createAction<{ [key: string]: any }>("gears/setResultDialog");
