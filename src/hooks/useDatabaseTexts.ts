import { useTranslation } from "react-i18next";

interface IDatabaseDescription {
  id: number;
  text: string;
  title?: string;
  path: string;
}

interface IDatabaseRole {
  id: number;
  title: string;
  roleDescription: string;
  roleSrc: string;
}

interface IDatabaseGameMode {
  id: number;
  title: string;
  description: string;
}

interface IDatabase {
  descriptions: IDatabaseDescription[];
  roles: IDatabaseRole[];
  gameModes: IDatabaseGameMode[];
}

export const useDatabaseTexts = (): IDatabase => {
  const { t } = useTranslation();

  const database: IDatabase = {
    descriptions: [
      {
        id: 1,
        text: t("description.1.text"),
        title: t("description.1.title"),
        path: t("description.1.path"),
      },
    ],
    roles: [
      {
        id: 1,
        title: t("roles.1.title"),
        roleDescription: t("roles.1.description"),
        roleSrc: t("roles.1.src"),
      },
      {
        id: 2,
        title: t("roles.2.title"),
        roleDescription: t("roles.2.description"),
        roleSrc: t("roles.2.src"),
      },
      {
        id: 3,
        title: t("roles.3.title"),
        roleDescription: t("roles.3.description"),
        roleSrc: t("roles.3.src"),
      },
      {
        id: 4,
        title: t("roles.4.title"),
        roleDescription: t("roles.4.description"),
        roleSrc: t("roles.4.src"),
      },
      {
        id: 5,
        title: t("roles.5.title"),
        roleDescription: t("roles.5.description"),
        roleSrc: t("roles.5.src"),
      },
    ],
    gameModes: [
      {
        id: 1,
        title: t("gameModes.1.title"),
        description: t("gameModes.1.description"),
      },
      {
        id: 2,
        title: t("gameModes.2.title"),
        description: t("gameModes.2.description"),
      },
    ],
  };

  return database;
};
