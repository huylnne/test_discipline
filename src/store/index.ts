import { configureStore } from "@reduxjs/toolkit";
import { disciplineReducer } from "./disciplineSlice";

export const store = configureStore({
  reducer: {
    discipline: disciplineReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;