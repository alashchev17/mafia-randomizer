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

import { INotification, ISettings } from "./models";
import Notification from "./components/Notification";
import { AnimatePresence } from "framer-motion";

const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationData, setNotificationData] = useState<INotification>(
    {} as INotification,
  );

  const [settings, setSettings] = useState<ISettings>({
    amountOfPlayers: 6,
    gameMode: "Классический",
  });

  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/welcome");
    }
  }, [location, navigate]);

  const handleNotification = (
    state: boolean,
    title: string,
    text: string,
    information: string,
  ) => {
    setIsNotificationVisible(state);
    setNotificationData((prevState: INotification) => {
      return {
        ...prevState,
        title,
        text,
        information,
      };
    });
  };

  return (
    <>
      <Header />
      <div className="wrapper">
        <AnimatePresence>
          {isNotificationVisible && (
            <Notification
              title={notificationData.title}
              text={notificationData.text}
              information={notificationData.information}
              setVisible={setIsNotificationVisible}
            />
          )}
        </AnimatePresence>
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
                <SettingsPage
                  settings={settings}
                  setSettings={setSettings}
                  handleNotification={handleNotification}
                />
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
