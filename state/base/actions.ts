import { createAction } from '@reduxjs/toolkit';

export const setBalance = createAction<{ [key: string]: any }>('base/setBalance');
