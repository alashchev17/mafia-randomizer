export interface IDatabaseDescriptions {
  id: number;
  text: string;
  title?: string;
  path: string;
}

export interface IDatabaseRoles {
  id: number;
  title: string;
  roleDescription: string;
  roleSrc: string;
}

export interface IDatabase {
  descriptions: IDatabaseDescriptions[];
  roles: IDatabaseRoles[];
}

export const database: IDatabase = {
  descriptions: [
    {
      id: 1,
      text: "популярная психологическая игра. Сюжет прост. Мирные жители города, которые устали от распоясавшейся мафии, решают устроить самосуд и убивать преступников. Мафия в ответ объявляет войну с целью уничтожить всех горожан. Команды мафии и мирных жителей играют друг против друга. Мирные жители выигрывают, если вычисляют и «отправляют на смерть» всех мафиози. Мафия выигрывает, если победа мирных жителей математически невозможна.",
      title: "Мафия",
      path: "welcome",
    },
  ],
  roles: [
    {
      id: 1,
      title: "Мирный житель",
      roleDescription:
        "самая многочисленная роль в игре. Их задача - вычислить игроков команды Мафии и устранить их всех на дневном голосовании. Ночью не ходят. Побеждают, когда устранена вся Мафия.",
      roleSrc: "/public/cards/innocent.svg",
    },
    {
      id: 2,
      title: "Шериф",
      roleDescription:
        "играет за команду мирных жителей. Задача Шерифа – помочь команде Мирных жителей путем ночных проверок игроков на причастность к Мафии. Каждую ночь имеет право скрытно от других участников игры проверить одного (любого) игрока.",
      roleSrc: "/public/cards/sheriff.svg",
    },
    {
      id: 3,
      title: "Мафия",
      roleDescription:
        "играет за команду Мафии. Задача Мафии – убить всех мирных жителей ночью и, при возможности, выставлять на голосование игроков команды Мирных. Каждую ночь имеет право скрытно от других участников игры выбрать жертву совместно с Доном и другими участниками команды Мафия.",
      roleSrc: "/public/cards/mafia.svg",
    },
    {
      id: 4,
      title: "Дон",
      roleDescription:
        "играет за команду Мафии. Задача Дона – привести свою команду к победе. Каждую ночь имеет право скрытно от других игроков, путём ночных проверок, вычислить Шерифа, чтобы впоследствии от него избавиться. Является главным игроком команды Мафии, определяет ход стрельбы в партии, путём договорки со своими союзниками.",
      roleSrc: "/public/cards/headOfMafia.svg",
    },
  ],
};
