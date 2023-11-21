import { FC, useEffect } from "react";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";

import "./App.scss";
import "./components/Button/index.scss";

import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import RolesInfoPage from "./pages/RolesInfoPage";
import SetupPage from "./pages/SetupPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.warn("location.pathname: " + location.pathname);

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/welcome");
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/welcome" element={<MainPage />} />
          <Route path="/information" element={<RolesInfoPage />} />
          <Route path="/setup/:setupId" element={<SetupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
