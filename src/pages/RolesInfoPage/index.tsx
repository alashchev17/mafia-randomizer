import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";

import type { IDatabaseRole } from "../../assets/database";
import { useDatabaseTexts } from "../../hooks/useDatabaseTexts.ts";
import RolesCard from "../../components/RolesCard";
import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation.ts";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext.tsx";

const RolesInfoPage: FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const database = useDatabaseTexts();

  useEffect(() => {
    document.title = t("titles.rolesInfoPage");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <motion.div
      className="flex-center-column"
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
    >
      <Title text={t("headers.rolesInfoPage")} />
      <div className="roles-wrapper">
        {database.roles &&
          database.roles.map((role: IDatabaseRole, i: number) => (
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
        {t("buttons.backToMain")}
      </Link>
    </motion.div>
  );
};

export default RolesInfoPage;
