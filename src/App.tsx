import { FC, useEffect } from "react";
import { useNavigate, Route, Routes } from "react-router-dom";

import "./App.scss";
import "./components/Button/index.scss";

import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import RolesInfoPage from "./pages/RolesInfoPage";
import SetupPage from "./pages/SetupPage";
import NotFoundPage from "./pages/NotFoundPage";

const App: FC = () => {
  const locationOnLoad = document.location.href.split("/")[3];
  const navigate = useNavigate();

  useEffect(() => {
    if (locationOnLoad.length === 0) {
      navigate("/welcome");
    }
  }, [locationOnLoad]);

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
