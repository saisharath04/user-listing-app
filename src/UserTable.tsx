import { Select, Spin, Table, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import "./UserTable.css";
import { columns } from "./Columns";
import { stateList } from "./store/mockData";
import { userListAsyncThunk } from "./store/thunk";
import {
  FiltersType,
  UserListPayloadType,
  UserListResponseType,
} from "./store/types";
const { Title } = Typography;

const UserTable = () => {
  const [filters, setFilters] = useState<FiltersType>({
    gender: undefined,
    stateCode: undefined,
    limit: 10,
    skip: 0,
  });

  const [response, setResponse] = useState<UserListResponseType>({
    users: [],
    total: 0,
    skip: 0,
    limit: 0,
  });

  const dispatch = useDispatch();

  const fetchUserList = useCallback(
    (newFilters = filters) => {
      const payload: UserListPayloadType = {
        limit: newFilters.limit,
        skip: newFilters.skip,
      };

      // this api is not supporting multi filter so Only one filter is UserTablelying here
      if (newFilters.gender) {
        payload.key = "gender";
        payload.value = newFilters.gender;
      } else if (newFilters.stateCode) {
        payload.key = "address.stateCode";
        payload.value = newFilters.stateCode;
      }

      dispatch(userListAsyncThunk(payload)).then(
        (res: { payload: UserListResponseType }) => {
          setResponse((prevResponse) => ({
            users:
              newFilters.skip === 0
                ? res.payload.users
                : prevResponse.users.concat(res.payload.users),
            limit: res.payload.limit,
            skip: res.payload.skip,
            total: res.payload.total,
          }));
        }
      );
    },
    [filters, userListAsyncThunk, dispatch, setResponse]
  );

  useEffect(() => {
    fetchUserList({ ...filters, skip: 0 });
  }, [filters.gender, filters.stateCode]);

  useEffect(() => {
    if (filters.skip > 0) {
      fetchUserList();
    }
  }, [filters.skip]);

  const loadMoreData = useCallback(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      skip: prevFilters.skip + 10,
    }));
  }, [setFilters]);

  const filterOptionHandler = (input: string, option: any) =>
    option.label?.toLowerCase().includes(input?.toLowerCase());

  return (
    <div className="container">
      <div className="title_container">
        <Title level={2}>Students</Title>
        <div>
          <Select
            showSearch
            allowClear
            style={{ width: 200, marginRight: 24 }}
            size="large"
            placeholder="Country"
            value={filters?.stateCode}
            options={stateList}
            onChange={(value: string) => {
              setFilters({ ...filters, stateCode: value, skip: 0 });
            }}
            filterOption={filterOptionHandler}
          />
          <Select
            allowClear
            style={{ width: 200 }}
            size="large"
            placeholder="Gender"
            value={filters?.gender}
            options={[
              {
                value: "male",
                label: "Male",
              },
              {
                value: "female",
                label: "Female",
              },
            ]}
            onChange={(value: string) => {
              setFilters({ ...filters, gender: value, skip: 0 });
            }}
          />
        </div>
      </div>
      <div className="table_container">
        <div>
          <InfiniteScroll
            dataLength={response.users.length}
            next={loadMoreData}
            hasMore={response?.total !== response?.users?.length}
            loader={
              <Spin style={{ display: "flex", justifyContent: "center" }} />
            }
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
            refreshFunction={() => <Spin />}
            pullDownToRefresh
            pullDownToRefreshThreshold={10}
          >
            <Table
              columns={columns}
              dataSource={response?.users}
              pagination={false}
              size="large"
            />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
