import { FC, useState } from "react";
import { motion } from "framer-motion";

import iconPlus from "./assets/plus.svg";
import iconMinus from "./assets/minus.svg";
import { useTranslation } from "react-i18next";

interface QueueingPlayerProps {
  player: number;
  queueingPlayers: number[];
  amountOfPlayers: number;
}

const QueueingPlayer: FC<QueueingPlayerProps> = ({ player, queueingPlayers, amountOfPlayers }) => {
  const { t } = useTranslation();
  const [amountOfVotes, setAmountOfVotes] = useState(0);

  const handleAmountPlus = () => {
    setAmountOfVotes((prev) => prev + 1);
  };

  const handleAmountMinus = () => {
    setAmountOfVotes((prev) => prev - 1);
  };

  const queueingPlayerVariants = {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.45 + index * 0.3,
        duration: 1.5,
        type: "spring",
      },
    }),
  };

  return (
    <motion.div
      key={player}
      className="queueing__player"
      variants={queueingPlayerVariants}
      initial="hidden"
      animate="visible"
      custom={queueingPlayers.indexOf(player)}
      exit="hidden"
    >
      <span className="queueing__number">
        {t("labels.player")} №{player}
      </span>
      <div className="queueing__controls">
        <button className="queueing__button" disabled={amountOfVotes < 1} onClick={handleAmountMinus}>
          <img src={iconMinus} alt="Icon: Minus Icon" />
        </button>
        <span className="queueing__count">{amountOfVotes}</span>
        <button className="queueing__button" disabled={amountOfVotes === amountOfPlayers} onClick={handleAmountPlus}>
          <img src={iconPlus} alt="Icon: Plus Icon" />
        </button>
      </div>
    </motion.div>
  );
};

export default QueueingPlayer;
