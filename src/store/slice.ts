import { createSlice } from "@reduxjs/toolkit";
import { UserListResponseType } from "./types";
import { USER_LIST_SLICE } from "./actions";
import { userListAsyncThunk } from "./thunk";

const userListInitialResponse: UserListResponseType = {
  users: [],
  total: 0,
  skip: 0,
  limit: 0,
};

const userListSlice = createSlice({
  name: USER_LIST_SLICE,
  initialState: {
    isLoading: false,
    isError: false,
    data: userListInitialResponse,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userListAsyncThunk.pending, (state) => {
      state.data = userListInitialResponse
      state.isLoading = true;
      state.isError = false;
    });

    builder.addCase(userListAsyncThunk.fulfilled, (state, action) => {
      state.data = action?.payload;
      state.isLoading = false;
      state.isError = false;
    });

    builder.addCase(userListAsyncThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.data = userListInitialResponse;
      console.error(action.payload);
    });
  },
});

export const userListReducer = userListSlice.reducer;
export default userListSlice;
