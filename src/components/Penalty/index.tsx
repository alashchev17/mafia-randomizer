import { Dispatch, FC, SetStateAction, useState } from "react";

import "./index.scss";

interface PenaltyProps {
  playerStatus: {
    isMuted: boolean;
    isKilled: boolean;
    isDeleted: boolean;
    isQueued: boolean;
  };
  setPlayerStatus: Dispatch<
    SetStateAction<{
      isMuted: boolean;
      isKilled: boolean;
      isDeleted: boolean;
      isQueued: boolean;
    }>
  >;
}

const Penalty: FC<PenaltyProps> = ({ setPlayerStatus, playerStatus }) => {
  const [penaltyCount, setPenaltyCount] = useState(0);

  const handleClick = (amount: number) => {
    if (penaltyCount !== amount) {
      setPenaltyCount(amount);
      if (amount === 3) {
        setPlayerStatus((prev) => {
          return {
            ...prev,
            isMuted: true,
          };
        });
      } else {
        setPlayerStatus((prev) => {
          return {
            ...prev,
            isMuted: false,
          };
        });
      }
    } else {
      setPenaltyCount((prev) => prev - 1);
      setPlayerStatus((prev) => {
        return {
          ...prev,
          isMuted: false,
        };
      });
    }
  };

  if (
    playerStatus.isKilled ||
    playerStatus.isQueued ||
    playerStatus.isDeleted
  ) {
    return (
      <div className="penalty">
        <button
          className={`penalty__point ${
            penaltyCount >= 1 ? "pressed" : ""
          } disabled`}
        ></button>
        <button
          className={`penalty__point ${
            penaltyCount >= 2 ? "pressed" : ""
          } disabled`}
        ></button>
        <button
          className={`penalty__point ${
            penaltyCount >= 3 ? "pressed" : ""
          } disabled`}
        ></button>
      </div>
    );
  }
  return (
    <div className="penalty">
      <button
        className={`penalty__point ${penaltyCount >= 1 ? "pressed" : ""}`}
        onClick={() => handleClick(1)}
      ></button>
      <button
        className={`penalty__point ${penaltyCount >= 2 ? "pressed" : ""}`}
        onClick={() => handleClick(2)}
      ></button>
      <button
        className={`penalty__point ${penaltyCount >= 3 ? "pressed" : ""}`}
        onClick={() => handleClick(3)}
      ></button>
    </div>
  );
};

export default Penalty;
