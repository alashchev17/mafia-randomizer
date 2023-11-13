export interface IPlayers {
  role: string;
  roleSrc: string;
}

export const initialPlayers: IPlayers[] = [
  {
    role: "Мирный житель",
    roleSrc: "/public/cards/innocent.svg",
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
        roleSrc: "/public/cards/headOfMafia.svg",
      });
    } else {
      for (let i = 0; i < mafiaPlayers; i++) {
        if (i === 0) {
          arrayOfRoles.push({
            role: "Дон",
            roleSrc: "/public/cards/headOfMafia.svg",
          });
        } else {
          arrayOfRoles.push({
            role: "Мафия",
            roleSrc: "/public/cards/mafia.svg",
          });
        }
      }
    }

    for (let j = 0; j < innocentPlayers; j++) {
      arrayOfRoles.push({
        role: "Мирный житель",
        roleSrc: "/public/cards/innocent.svg",
      });
    }

    arrayOfRoles.push({
      role: "Шериф",
      roleSrc: "/public/cards/sheriff.svg",
    });

    return arrayOfRoles;
  };

  return generateArrayOfPlayers(mafiaPlayers, innocentPlayers);
};
