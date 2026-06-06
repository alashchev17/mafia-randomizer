import { useEffect } from "react";

import { useAppDispatch } from "./useAppDispatch";
import { setActiveRoomId } from "../store/multiplayerSlice";
import { SocketEvents } from "../store/socket";

/**
 * Marks `roomId` as the active room and joins it over the socket, clearing the
 * active room on unmount. Shared by the room and game pages.
 */
export function useActiveRoom(roomId: string): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!roomId) return;
    dispatch(setActiveRoomId(roomId));
    SocketEvents.roomJoin(roomId);
    return () => {
      dispatch(setActiveRoomId(null));
    };
  }, [roomId, dispatch]);
}
