import { useEffect } from "react";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { selectAuthToken } from "../store/authSlice";
import { connectSocket, disconnectSocket } from "../store/socket";

export function useMultiplayerConnection(): void {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (!token) return;
    connectSocket(token, dispatch);
    return () => {
      disconnectSocket(dispatch);
    };
  }, [token, dispatch]);
}
