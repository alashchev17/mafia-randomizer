import { IPlayer } from "../models";
import { getRoleDistribution } from "./roleDistribution";

export const initialPlayers: IPlayer[] = [
  {
    role: "Мирный житель",
    roleSrc: "/cards/innocent.svg",
  },
];
export const rolesRandomizer = (playersAmount: number, gameMode: string) => {
  const shuffleArray = (array: IPlayer[]) => {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const roleDistribution = getRoleDistribution(playersAmount, gameMode);
  const generatedArray = shuffleArray(
    roleDistribution.flatMap(({ count, role, roleSrc }) =>
      Array.from({ length: Math.max(count, 0) }, () => ({ role, roleSrc }))
    )
  );
  const mafiaPlayers = roleDistribution.reduce((total, { count, isMafia }) => {
    return isMafia ? total + count : total;
  }, 0);
  const innocentPlayers = generatedArray.length - mafiaPlayers;

  return { mafiaPlayers, innocentPlayers, generatedArray };
};
