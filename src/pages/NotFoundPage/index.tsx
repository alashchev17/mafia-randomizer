import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";

import "./index.scss";

const NotFoundPage: FC = () => {
  return (
    <motion.div
      initial={{
        y: -50,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        type: "spring",
      }}
    >
      <Title text="Упс!" />
      <div className="not-found">
        <h3 className="not-found__subtitle">404 - Страница не найдена</h3>
        <p className="not-found__description">
          Страница, которую вы пытаетесь открыть, была удалена, её имя
          изменилось или она является временно недоступной.
        </p>
        <Link to="/welcome" className="button button--secondary">
          Вернуться на главную
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFoundPage;
