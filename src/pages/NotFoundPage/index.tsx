import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";

import "./index.scss";
import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation.ts";

const NotFoundPage: FC = () => {
  return (
    <motion.div
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
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
