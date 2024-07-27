import { User } from "./store/types";

const getFullName = (user: User) => {
  const { firstName, maidenName, lastName } = user;
  return `${firstName} ${maidenName} ${lastName}`;
};

export const columns = [
  {
    title: "ID",
    dataIndex: "id",
    sorter: (a: { id: number }, b: { id: number }) => {
      return Number(a.id) - Number(b.id);
    },
    width: 100,
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (image: string) => (
      <img alt={image} src={image} style={{ width: "30px", height: "30px" }} />
    ),
    width: 80,
  },
  {
    title: "Full Name",
    dataIndex: "",
    render: (_: any, rowData: User) => {
      return <>{getFullName(rowData)}</>;
    },
    sorter: (a: User, b: User) => {
      const nameA = getFullName(a).toLowerCase();
      const nameB = getFullName(b).toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    },
    width: 200,
  },
  {
    title: "Demography",
    dataIndex: "",
    render: (_: any, rowData: User) => {
      const { age } = rowData;

      const gender = rowData?.gender === "female" ? "F" : "M";
      return (
        <>
          {gender}/{age}
        </>
      );
    },
    width: 200,
  },
  {
    title: "Designation",
    dataIndex: "",
    render: (_: any, rowData: User) => {
      return <>{rowData?.company?.title}</>;
    },
    width: 200,
  },
  {
    title: "Location",
    dataIndex: "",
    width: 200,
    render: (_: any, rowData: User) => {
      return (
        <>
          {rowData?.address?.state},{rowData?.address?.country}
        </>
      );
    },
  },
];
