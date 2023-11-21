import { FC, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { SetupContent } from "./Content.tsx";

const SetupPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setupId } = useParams();

  console.warn(setupId);
  console.warn(location);

  useEffect(() => {
    document.title = "Мафия | Игровая сессия";
    setupId !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup
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
