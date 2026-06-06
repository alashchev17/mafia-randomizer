import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { ISettings } from "../models";

const initialState: ISettings = {
  amountOfPlayers: 6,
  gameMode: "Классический",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<ISettings>>) => ({
      ...state,
      ...action.payload,
    }),
  },
  selectors: {
    selectSettings: (state) => state,
  },
});

export const { setSettings } = settingsSlice.actions;
export const { selectSettings } = settingsSlice.selectors;
export default settingsSlice.reducer;
