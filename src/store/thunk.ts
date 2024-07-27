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
    const isFilterApplied = payload?.gender || payload?.stateCode;
    const isDoubleFilterApplied = payload?.gender && payload?.stateCode;

    let params: Record<string, string | number> = {
      limit: 10,
      skip: (payload?.page - 1) * 10,
    };

    if (!isDoubleFilterApplied && payload?.gender) {
      params.key = "gender";
      params.value = payload?.gender;
    } else if (!isDoubleFilterApplied && payload?.stateCode) {
      params.key = "address.stateCode";
      params.value = payload?.stateCode;
    }

    const getUrl = () => {
      if (isDoubleFilterApplied) {
        return url;
      }
      if (isFilterApplied) {
        return filterUrl;
      }
      return url;
    };

    try {
      const response = await axios.get<UserListResponseType>(getUrl(), {
        params: isDoubleFilterApplied
          ? {
              limit: 0,
            }
          : params,
      });

      let filteredResponse = response;
      console.log("filteredResponse1", filteredResponse?.data?.users);
      if (payload?.stateCode) {
        const filteredUsers = filteredResponse?.data?.users?.filter(
          (datum) => datum?.address?.stateCode === payload?.stateCode
        );
        filteredResponse.data.users = filteredUsers;
      }
      console.log("filteredResponse2", filteredResponse?.data?.users);
      if (payload?.gender) {
        const filteredUsers = filteredResponse?.data?.users?.filter(
          (datum) => datum?.gender === payload?.gender
        );
        filteredResponse.data.users = filteredUsers;
      }
      console.log("filteredResponse3", filteredResponse?.data?.users);
      return filteredResponse;
    } catch (error) {
      const typedError = error as Error;
      console.log("typedError", typedError);
      notification.error({ message: typedError.message, placement: "top" });
    }
  }
);
