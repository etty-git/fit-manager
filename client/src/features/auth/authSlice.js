import { createSlice } from "@reduxjs/toolkit";
import {
  removeStoredJson,
  saveStoredJson,
  loadStoredJson,
  storageKeys,
} from "../../utils/storage";

// 🔥 טוענים מה־localStorage בהתחלה
const storedAuth = loadStoredJson(storageKeys.auth);

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      saveStoredJson(storageKeys.auth, {
        user: action.payload.user,
        token: action.payload.token,
      });
    },

    logout: (state) => {
      // 🔥 איפוס מוחלט
      state.user = null;
      state.token = null;

      // 🔥 ניקוי storage
      removeStoredJson(storageKeys.auth);
      removeStoredJson(storageKeys.membership);
      localStorage.removeItem("token"); // אם נשמר בנפרד
    },

  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;