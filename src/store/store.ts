import { configureStore } from "@reduxjs/toolkit";
import { userListReducer } from "./slice";

const store = configureStore({
  reducer: {
    userListReducer, 
  },
});

export default store;
