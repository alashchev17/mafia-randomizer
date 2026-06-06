import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  text: string | null;
  nonce: number;
}

const initialState: NotificationState = {
  text: null,
  nonce: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<string>) => {
      state.text = action.payload;
      state.nonce += 1;
    },
    clearNotification: (state) => {
      state.text = null;
    },
  },
  selectors: {
    selectNotification: (state) => state,
  },
});

export const { pushNotification, clearNotification } = notificationSlice.actions;
export const { selectNotification } = notificationSlice.selectors;
export default notificationSlice.reducer;
