import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect } from "react";

import Title from "../Title";
import QueueingPlayer from "../QueueingPlayer";

import "./index.scss";
import { t } from "i18next";

interface QueueingProps {
  queueingPlayers: number[];
  amountOfPlayers: number;
  handleInstantQueue: (state: boolean) => void;
}

const Queueing: FC<QueueingProps> = ({
  queueingPlayers,
  amountOfPlayers,
  handleInstantQueue,
}) => {
  const queueingVariants = {
    visible: {
      height: "auto",
      y: 0,
      opacity: 1,
    },
    hidden: {
      height: 0,
      y: -40,
      opacity: 0,
    },
  };

  useEffect(() => {
    handleInstantQueue(false);
    if (queueingPlayers.length === 1) {
      handleInstantQueue(true);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <motion.div
      className="queueing"
      variants={queueingVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.35 * queueingPlayers.length,
        type: "tween",
      }}
      exit="hidden"
    >
      {queueingPlayers.length > 1 && (
        <>
          <Title text={t("headers.vote")} />
          <div className="queueing__players">
            <AnimatePresence mode="sync">
              {queueingPlayers.map((player) => (
                <QueueingPlayer
                  key={player}
                  player={player}
                  queueingPlayers={queueingPlayers}
                  amountOfPlayers={amountOfPlayers}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Queueing;
