import { useEffect } from "react";
import {
  bindThemeParamsCssVars,
  init,
  isTMA,
  miniApp,
  retrieveRawInitData,
  themeParams,
  viewport,
} from "@telegram-apps/sdk-react";

import { useLoginTelegramMutation } from "../store/api/authApi";
import { useAppSelector } from "./useAppSelector";
import { selectIsAuthenticated } from "../store/authSlice";

let initialized = false;

const setupMiniApp = (): void => {
  if (initialized) return;
  initialized = true;
  init();
  try {
    themeParams.mountSync();
    bindThemeParamsCssVars();
  } catch {
    /* theming is optional */
  }
  try {
    miniApp.mountSync();
    miniApp.ready();
  } catch {
    /* mini-app scope unavailable on older clients */
  }
  try {
    void viewport
      .mount()
      .then(() => viewport.expand())
      .catch(() => undefined);
  } catch {
    /* viewport unavailable */
  }
};

export function useTelegramAuth(): void {
  const [loginTelegram] = useLoginTelegramMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated || !isTMA()) return;
    setupMiniApp();
    const initData = retrieveRawInitData();
    if (initData) void loginTelegram({ initData });
  }, [isAuthenticated, loginTelegram]);
}
