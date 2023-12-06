import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";

import { database, IDatabaseRoles } from "../../assets/database";
import RolesCard from "../../components/RolesCard";
import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation.ts";

const RolesInfoPage: FC = () => {
  useEffect(() => {
    document.title = "Мафия | Информация о ролях";
  }, []);

  return (
    <motion.div
      className="flex-center-column"
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
    >
      <Title text="Информация о ролях" />
      <div className="roles-wrapper">
        {database.roles &&
          database.roles.map((role: IDatabaseRoles, i: number) => (
            <RolesCard
              key={role.id}
              title={role.title}
              description={role.roleDescription}
              roleSrc={role.roleSrc!}
              index={i}
            />
          ))}
      </div>
      <Link to={"/welcome"} className="button button--secondary">
        На главную
      </Link>
    </motion.div>
  );
};

export default RolesInfoPage;
