import { FC, useState } from "react";

interface QueueingPlayerProps {
  player: number;
}

const QueueingPlayer: FC<QueueingPlayerProps> = ({ player }) => {
  const [amountOfVotes, setAmountOfVotes] = useState(0);

  const handleAmountPlus = () => {
    setAmountOfVotes((prev) => prev + 1);
  };

  const handleAmountMinus = () => {
    setAmountOfVotes((prev) => prev - 1);
  };

  return (
    <div key={player} className="queueing__player">
      <span>Игрок №{player}</span>
      <button onClick={handleAmountMinus}>-</button>
      <span>{amountOfVotes}</span>
      <button onClick={handleAmountPlus}>+</button>
    </div>
  );
};

export default QueueingPlayer;
