import { FC, useEffect } from "react";
import { Link } from "react-router-dom";

import Title from "../components/Title";
import DescriptionParagraph from "../components/DescriptionParagraph";

import { database, IDatabaseRoles } from "../assets/database";
import RolesCard from "../components/RolesCard";

const RolesInfoPage: FC = () => {
  useEffect(() => {
    document.title = "Мафия | Информация о ролях";
  }, []);

  return (
    <div className="flex-center-column">
      <Title text="Информация о ролях" />
      <div className="roles-wrapper">
        {database.roles &&
          database.roles.map((role: IDatabaseRoles) => (
            <RolesCard
              key={role.id}
              title={role.title}
              description={role.roleDescription}
              roleSrc={role.roleSrc!}
            />
          ))}
      </div>
      <Link to={"/welcome"} className="button button--secondary">
        На главную
      </Link>
    </div>
  );
};

export default RolesInfoPage;
