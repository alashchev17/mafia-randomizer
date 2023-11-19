import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";

import { database, IDatabaseRoles } from "../../assets/database";
import RolesCard from "../../components/RolesCard";

const RolesInfoPage: FC = () => {
  useEffect(() => {
    document.title = "Мафия | Информация о ролях";
  }, []);

  return (
    <motion.div
      className="flex-center-column"
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
