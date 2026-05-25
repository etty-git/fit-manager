import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.notification = {
        id: Date.now(),
        type: action.payload.type || "info",
        title: action.payload.title || "",
        message: action.payload.message || "",
      };
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const { showNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
