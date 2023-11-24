import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";

import "./App.scss";
import "./components/Button/index.scss";

import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import RolesInfoPage from "./pages/RolesInfoPage";
import SetupPage from "./pages/SetupPage";
import NotFoundPage from "./pages/NotFoundPage";
import SettingsPage from "./pages/SettingsPage";

import { ISettings } from "./models";

const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [settings, setSettings] = useState<ISettings>({
    amountOfPlayers: 6,
    gameMode: "Классический",
  });

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/welcome");
    }
  }, [location, navigate]);

  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/welcome" element={<MainPage />} />
          <Route path="/information" element={<RolesInfoPage />} />
          <Route
            path="/setup/:setupId"
            element={<SetupPage settings={settings} />}
          />
          <Route
            path="/settings"
            element={
              <SettingsPage settings={settings} setSettings={setSettings} />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
