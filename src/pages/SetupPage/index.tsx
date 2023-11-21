import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { SetupContent } from "./Content.tsx";

const SetupPage: FC = () => {
  const navigate = useNavigate();
  const { setupId } = useParams();

  useEffect(() => {
    document.title = "Мафия | Игровая сессия";
    setupId !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="flex-center-column"
      initial={{
        opacity: 0,
        y: -50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        type: "spring",
      }}
    >
      <SetupContent />
    </motion.div>
  );
};

export default SetupPage;
