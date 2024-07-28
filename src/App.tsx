import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserTable from "./UserTable";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserTable />} />
    </Routes>
  </BrowserRouter>
);

export default App;
