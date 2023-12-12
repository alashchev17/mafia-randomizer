import { IPlayers } from "../models";

export const initialPlayers: IPlayers[] = [
  {
    role: "Мирный житель",
    roleSrc: "/cards/innocent.svg",
  },
];
export const rolesRandomizer = (playersAmount: number, gameMode: string) => {
  const mafiaPlayers: number = Math.floor(playersAmount / 3);
  let innocentPlayers = playersAmount - mafiaPlayers - 1;

  switch (gameMode) {
    case "Классический":
      break;
    case "Расширенный":
      innocentPlayers = innocentPlayers - 1;
      break;
  }

  const generateRole = (role: string, roleSrc: string): IPlayers => {
    return { role, roleSrc };
  };

  const generateArrayOfPlayers = (
    mafiaPlayers: number,
    innocentPlayers: number,
  ): IPlayers[] => {
    const arrayOfRoles = [] as IPlayers[];

    if (mafiaPlayers === 1) {
      arrayOfRoles.push(generateRole("Дон", "/cards/headOfMafia.svg"));
    } else {
      for (let i = 0; i < mafiaPlayers; i++) {
        arrayOfRoles.push(
          generateRole(
            i === 0 ? "Дон" : "Мафия",
            i === 0 ? "/cards/headOfMafia.svg" : "/cards/mafia.svg",
          ),
        );
      }
    }

    for (let j = 0; j < innocentPlayers; j++) {
      arrayOfRoles.push(generateRole("Мирный житель", "/cards/innocent.svg"));
    }

    arrayOfRoles.push(generateRole("Шериф", "/cards/sheriff.svg"));

    if (gameMode === "Расширенный") {
      arrayOfRoles.push(generateRole("Доктор", "/cards/doctor.svg"));
    }

    return arrayOfRoles;
  };

  const shuffleArray = (array: IPlayers[]) => {
    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const generatedArray = shuffleArray(
    generateArrayOfPlayers(mafiaPlayers, innocentPlayers),
  );

  innocentPlayers = generatedArray.length - mafiaPlayers;

  return { mafiaPlayers, innocentPlayers, generatedArray };
};
