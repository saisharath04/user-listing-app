import { createAsyncThunk } from "@reduxjs/toolkit";
import { USER_LIST_THUNK } from "./actions";
import { UserListPayloadType, UserListResponseType } from "./types";
import axios from "axios";
import { notification } from "antd";

const url = "https://dummyjson.com/users";

const filterUrl = "https://dummyjson.com/users/filter"; //?key=gender&value=male

export const userListAsyncThunk: any = createAsyncThunk(
  USER_LIST_THUNK,
  async (payload: UserListPayloadType) => {
    const getUrl = payload.key ? filterUrl : url;
    try {
      const response = await axios.get<UserListResponseType>(getUrl, {
        params: payload,
      });
      return response.data;
    } catch (error) {
      const typedError = error as Error;
      notification.error({ message: typedError.message, placement: "top" });
    }
  }
);
