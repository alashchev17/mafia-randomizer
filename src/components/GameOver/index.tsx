import { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Title from "../Title";

import "./index.scss";

import { useAppSelector } from "../../hooks/useAppSelector";
import { selectGameLog } from "../../store/statsSlice";
import type { WinnerKey } from "../../store/selectors";

interface GameOverProps {
  winnerKey: WinnerKey;
}

const gameOverVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const GameOver: FC<GameOverProps> = ({ winnerKey }) => {
  const { t } = useTranslation();
  const stats = useAppSelector(selectGameLog);

  return (
    <motion.div variants={gameOverVariants} initial="hidden" animate="visible" exit="hidden" className="gameover">
      <Title text={t("headers.gameOver")} />
      <p className="gameover__winner">
        {t("labels.winnerTeam")}: <span className="gameover__team">{t(`teams.${winnerKey}`)}</span>
      </p>
      <div className="gameover__row">
        {winnerKey !== "premature" && (
          <Link className="button button--primary" to="/stats" state={{ stats, winnerKey }} replace={true}>
            {t("buttons.showHistory")}
          </Link>
        )}
        <Link style={{ display: "block" }} className="button button--secondary" to="/welcome" replace={true}>
          {t("buttons.backToMain")}
        </Link>
      </div>
    </motion.div>
  );
};

export default GameOver;
