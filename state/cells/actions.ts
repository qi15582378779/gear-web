import { createAction } from "@reduxjs/toolkit";

export type IUpdateList = {
  gearAddress: string;
  [key: string]: any;
};
export const setIsCreate = createAction<boolean>("cells/setIsCreate");
export const setTokensModal = createAction<boolean>("cells/setTokensModal");
export const setRequestTypeModal = createAction<boolean>("cells/setRequestTypeModal");
export const setList = createAction<any[]>("cells/setList");
export const updateList = createAction<IUpdateList>("cells/updateList");
export const setResultDialog = createAction<{ [key: string]: any }>("cells/setResultDialog");
