import { FC } from "react";

import "./index.scss";

interface RolesCardProps {
  title: string;
  description: string;
  roleSrc: string;
}

const RolesCard: FC<RolesCardProps> = (props: RolesCardProps) => {
  const { title, description, roleSrc } = props;

  return (
    <div className="roles-card">
      <img className="roles-card__image" src={roleSrc} alt={title} />
      <div className="roles-card__information">
        <p className="roles-card__text">
          <span>{title}</span> – {description}
        </p>
      </div>
    </div>
  );
};

export default RolesCard;
