import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Discipline, DisciplineState } from "../../@types/discipline";

const initialState: DisciplineState = {
  list: [],
  selected: undefined,
  loading: false,
  error: undefined,
};

const disciplineSlice = createSlice({
  name: "discipline",
  initialState,
  reducers: {
    setList(state, action: PayloadAction<Discipline[]>) {
      state.list = action.payload;
    },
    setSelected(state, action: PayloadAction<Discipline | undefined>) {
      state.selected = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
  },
});

export const {
  setList,
  setSelected,
  setLoading,
  setError,
} = disciplineSlice.actions;

export default disciplineSlice.reducer;