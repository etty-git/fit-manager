import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";
import workoutReducer from "../features/workout/workoutSlice"; // הוספת הייבוא
import { loadStoredJson, storageKeys } from "../utils/storage";

const storedAuth = loadStoredJson(storageKeys.auth, {});

const preloadedState = {
  auth: {
    user: storedAuth?.user || null,
    token: storedAuth?.token || localStorage.getItem("token"),
  },
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    workout: workoutReducer, // הוספת ה-Reducer החדש
    [api.reducerPath]: api.reducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});