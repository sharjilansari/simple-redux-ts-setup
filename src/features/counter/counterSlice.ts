import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface counterState {
  value: number;
}

const initialState: counterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "Counter",
  initialState,
  reducers: {
    increamented(state) {
      state.value += 1;
    },
    amountAdded(state, action: PayloadAction<number>){
        state.value += action.payload;
    }
  },
});

export const { increamented, amountAdded } = counterSlice.actions;
export default counterSlice.reducer;
