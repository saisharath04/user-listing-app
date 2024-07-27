import { Select, Spin, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { columns } from "./Columns";
import InfiniteScrollWrapper from "./InfiniteScrollWrapper";
import { stateList } from "./store/mockData";
import { userListAsyncThunk } from "./store/thunk";
import {
  GenericStoreType,
  User,
  UserListPayloadType,
  UserListResponseType,
} from "./store/types";
const { Title } = Typography;

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFilters] = useState<UserListPayloadType>({
    gender: undefined,
    stateCode: undefined,
    page: 1,
  });
  const dispatch = useDispatch();
  const { data, isLoading, totalCount } = useSelector(
    (state: {
      userListReducer: GenericStoreType & { data: UserListResponseType };
    }) => {
      const { userListReducer } = state;
      return {
        data: userListReducer?.data?.users,
        isLoading: userListReducer.isLoading,
        totalCount: userListReducer?.data?.total,
      };
    }
  );

  useEffect(() => {
    if (data?.length !== 0) {
      setUsers(data);
    }
  }, [data]);

  const fetchUserList = () => {
    dispatch(userListAsyncThunk(filters));
  };

  console.log("state", data, isLoading);

  useEffect(() => {
    fetchUserList();
  }, [filters]);

  const filterOptionHandler = (input: string, option: any) =>
    option.label?.toLowerCase().includes(input?.toLowerCase());

  const handlePageChange = (pageNo: number) => {
    setFilters({
      ...filters,
      page: pageNo,
    });
    console.log(pageNo);
  };

  return (
    <div className="container">
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <div>
          <div className="title_container">
            <Title level={2}>Employees</Title>
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
                  console.log("value===", value);
                  setFilters({ ...filters, page: 1, stateCode: value });
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
                  setFilters({ ...filters, page: 1, gender: value });
                }}
              />
            </div>
          </div>
          <div className="table_container">
            {/* <InfiniteScrollWrapper
              functionNext={fetchUserList}
              lengthData={users?.length}
            > */}
            <div style={{ maxWidth: 1000 }}>
              <Table
                columns={columns}
                dataSource={data}
                pagination={{
                  position: ["bottomRight"],
                  pageSize: 10,
                  total: totalCount,
                  current: filters?.page,
                  hideOnSinglePage: true,
                  onChange: handlePageChange,
                }}
                size="small"
                scroll={{
                  y: 550,
                }}
              />
            </div>
            {/* </InfiniteScrollWrapper> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
