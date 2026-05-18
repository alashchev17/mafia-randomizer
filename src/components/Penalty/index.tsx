import { FC } from "react";

import "./index.scss";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsDeleted, selectIsKilled, selectIsQueued, selectPenaltyCount } from "../../store/sessionSlice";
import { setPenaltyThunk } from "../../store/thunks";

interface PenaltyProps {
  playerId: number;
}

const Penalty: FC<PenaltyProps> = ({ playerId }) => {
  const dispatch = useAppDispatch();
  const penaltyCount = useAppSelector(selectPenaltyCount(playerId));
  const isKilled = useAppSelector(selectIsKilled(playerId));
  const isDeleted = useAppSelector(selectIsDeleted(playerId));
  const isQueued = useAppSelector(selectIsQueued(playerId));

  const disabled = isKilled || isQueued || isDeleted;

  const handleClick = (amount: 1 | 2 | 3) => {
    const next: 0 | 1 | 2 | 3 = penaltyCount === amount ? ((amount - 1) as 0 | 1 | 2) : amount;
    dispatch(setPenaltyThunk({ playerId, count: next }));
  };

  return (
    <div className="penalty">
      {[1, 2, 3].map((amount) => (
        <button
          key={amount}
          className={`penalty__point ${penaltyCount >= amount ? "pressed" : ""} ${disabled ? "disabled" : ""}`}
          onClick={disabled ? undefined : () => handleClick(amount as 1 | 2 | 3)}
        ></button>
      ))}
    </div>
  );
};

export default Penalty;
