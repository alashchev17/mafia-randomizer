import { FC, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import { useAppSelector } from "./hooks/useAppSelector";
import { selectNotification } from "./store/notificationSlice";
import MainPage from "./pages/MainPage";
import RolesInfoPage from "./pages/RolesInfoPage";
import SetupPage from "./pages/SetupPage";
import SettingsPage from "./pages/SettingsPage";
import SessionPage from "./pages/SessionPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RequireAuth from "./components/RequireAuth";

import { INotification } from "./models";
import Notification from "./components/Notification";

import "./App.scss";
import "./components/Button/index.scss";
import StatsPage from "./pages/StatsPage";
import MultiplayerLandingPage from "./pages/MultiplayerLandingPage";
import MultiplayerRoomPage from "./pages/MultiplayerRoomPage";
import MultiplayerJoinPage from "./pages/MultiplayerJoinPage";
import MultiplayerGamePage from "./pages/MultiplayerGamePage";

const App: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [notificationData, setNotificationData] = useState<INotification>({} as INotification);

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

  const { nonce, text } = useAppSelector(selectNotification);
  const lastNonce = useRef(0);
  useEffect(() => {
    if (nonce !== lastNonce.current && text) {
      lastNonce.current = nonce;
      handleNotification(true, text);
    }
  }, [nonce, text]);

  const headerHidden = location.pathname === "/session" || location.pathname.startsWith("/multiplayer/game/");

  return (
    <>
      <AnimatePresence>{!headerHidden && <Header />}</AnimatePresence>
      <div className="wrapper">
        <AnimatePresence>
          {isNotificationVisible && <Notification text={notificationData.text} setVisible={setIsNotificationVisible} />}
        </AnimatePresence>
        <div className={location.pathname === "/settings" ? "settings-container" : "container"}>
          <Routes>
            <Route path="/welcome" element={<MainPage />} />
            <Route path="/information" element={<RolesInfoPage />} />
            <Route path="/setup/:setupId" element={<SetupPage />} />
            <Route path="/session" element={<SessionPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              }
            />
            <Route
              path="/multiplayer"
              element={
                <RequireAuth>
                  <MultiplayerLandingPage />
                </RequireAuth>
              }
            />
            <Route
              path="/multiplayer/join"
              element={
                <RequireAuth>
                  <MultiplayerJoinPage />
                </RequireAuth>
              }
            />
            <Route
              path="/multiplayer/room/:roomId"
              element={
                <RequireAuth>
                  <MultiplayerRoomPage />
                </RequireAuth>
              }
            />
            <Route
              path="/multiplayer/game/:roomId"
              element={
                <RequireAuth>
                  <MultiplayerGamePage />
                </RequireAuth>
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
