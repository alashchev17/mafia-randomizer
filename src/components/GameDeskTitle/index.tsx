import { FC } from "react";
import Title from "../Title";
import { useSessionContext } from "../../contexts/SessionContext.tsx";

const GameDeskTitle: FC = () => {
  const { gameStats } = useSessionContext();
  return <Title text={`${gameStats.type} – ${gameStats.counter}`} />;
};

export default GameDeskTitle;
