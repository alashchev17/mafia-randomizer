import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import MainPage from "./pages/MainPage";
import RolesInfoPage from "./pages/RolesInfoPage";
import SetupPage from "./pages/SetupPage";
import SettingsPage from "./pages/SettingsPage";
import SessionPage from "./pages/SessionPage";
import NotFoundPage from "./pages/NotFoundPage";

import { INotification, ISettings } from "./models";
import Notification from "./components/Notification";

import "./App.scss";
import "./components/Button/index.scss";
import StatsPage from "./pages/StatsPage";

const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationData, setNotificationData] = useState<INotification>({} as INotification);

  const [settings, setSettings] = useState<ISettings>({
    amountOfPlayers: 6,
    gameMode: "Классический",
  });

  const handleNotification = (state: boolean, text: string) => {
    setIsNotificationVisible(state);
    setNotificationData((prevState: INotification) => {
      return {
        ...prevState,
        text,
      };
    });
  };

  useEffect(() => {
    if (location.state?.page === "session") {
      handleNotification(true, location.state.notificationMessage);
      navigate(location.pathname);
    }

    if (location.pathname === "/") {
      navigate("/welcome");
    }
  }, [location, navigate]);

  return (
    <>
      <AnimatePresence>{location.pathname !== "/session" && <Header />}</AnimatePresence>
      <div className="wrapper">
        <AnimatePresence>
          {isNotificationVisible && <Notification text={notificationData.text} setVisible={setIsNotificationVisible} />}
        </AnimatePresence>
        <div className="container">
          <Routes>
            <Route path="/welcome" element={<MainPage />} />
            <Route path="/information" element={<RolesInfoPage />} />
            <Route path="/setup/:setupId" element={<SetupPage settings={settings} />} />
            <Route path="/session" element={<SessionPage handleNotification={handleNotification} />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route
              path="/settings"
              element={
                <SettingsPage settings={settings} setSettings={setSettings} handleNotification={handleNotification} />
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
