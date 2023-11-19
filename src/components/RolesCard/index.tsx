import { FC } from "react";
import { motion } from "framer-motion";

import "./index.scss";

interface RolesCardProps {
  title: string;
  description: string;
  roleSrc: string;
  index: number;
}

const RolesCard: FC<RolesCardProps> = (props: RolesCardProps) => {
  const { title, description, roleSrc, index } = props;

  const cardsVariants = {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.7 + index * 0.3,
        duration: 0.8,
        type: "spring",
      },
    }),
  };

  return (
    <motion.div
      className="roles-card"
      variants={cardsVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <img className="roles-card__image" src={roleSrc} alt={title} />
      <div className="roles-card__information">
        <p className="roles-card__text">
          <span>{title}</span> – {description}
        </p>
      </div>
    </motion.div>
  );
};

export default RolesCard;
