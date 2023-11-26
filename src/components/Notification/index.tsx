import { FC, useEffect } from "react";
import { motion } from "framer-motion";

import closeSvg from "./close.svg";

import "./index.scss";

interface NotificationProps {
  title: string;
  text: string;
  information: string;
  setVisible: (state: boolean) => void;
}

const Notification: FC<NotificationProps> = ({
  title,
  text,
  information,
  setVisible,
}) => {
  const handleClose = () => {
    setVisible(false);
  };

  const notificationVariants = {
    visible: {
      x: 0,
      opacity: 1,
      delay: 0.3,
    },
    hidden: {
      x: "100%",
      opacity: 0,
    },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [setVisible]);

  return (
    <motion.div
      className="notification"
      variants={notificationVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.8,
        type: "spring",
      }}
      exit="hidden"
    >
      <motion.span
        className="notification__status-bar"
        initial={{
          width: "0%",
        }}
        animate={{
          width: "100%",
        }}
        transition={{
          duration: 5,
          type: "tween",
        }}
      ></motion.span>
      <div className="notification__header">
        <h2 className="notification__title">{title}</h2>
        <img
          onClick={handleClose}
          src={closeSvg}
          alt="Icon: Close icon"
          className="notification__close"
        />
      </div>
      <p className="notification__text">{text}</p>
      {information.length > 0 && (
        <p className="notification__text">{information}</p>
      )}
    </motion.div>
  );
};

export default Notification;
