export interface IPlayers {
  role: string;
  roleSrc: string;
}

export const initialPlayers: IPlayers[] = [
  {
    role: "Мирный житель",
    roleSrc: "/cards/innocent.svg",
  },
];
export const rolesRandomizer = (playersAmount: number) => {
  const mafiaPlayers: number = Math.floor(playersAmount / 3);
  const innocentPlayers = playersAmount - mafiaPlayers - 1;

  const generateArrayOfPlayers = (
    mafiaPlayers: number,
    innocentPlayers: number,
  ): IPlayers[] => {
    let arrayOfRoles = [] as IPlayers[];

    if (mafiaPlayers === 1) {
      arrayOfRoles.push({
        role: "Дон",
        roleSrc: "/cards/headOfMafia.svg",
      });
    } else {
      for (let i = 0; i < mafiaPlayers; i++) {
        if (i === 0) {
          arrayOfRoles.push({
            role: "Дон",
            roleSrc: "/cards/headOfMafia.svg",
          });
        } else {
          arrayOfRoles.push({
            role: "Мафия",
            roleSrc: "/cards/mafia.svg",
          });
        }
      }
    }

    for (let j = 0; j < innocentPlayers; j++) {
      arrayOfRoles.push({
        role: "Мирный житель",
        roleSrc: "/cards/innocent.svg",
      });
    }

    arrayOfRoles.push({
      role: "Шериф",
      roleSrc: "/cards/sheriff.svg",
    });

    return arrayOfRoles;
  };

  const shuffleArray = (array: IPlayers[]) => {
    const shuffledArray = array;

    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffledArray[i];
      shuffledArray[i] = shuffledArray[j];
      shuffledArray[j] = temp;
    }
    return shuffledArray;
  };

  const generatedArray = generateArrayOfPlayers(mafiaPlayers, innocentPlayers);

  return shuffleArray(generatedArray);
};
