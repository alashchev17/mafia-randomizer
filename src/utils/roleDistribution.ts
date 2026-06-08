import { ROLES, RoleKey } from "./roleAssets";

export const GAME_MODE_CLASSIC = "Классический";
export const GAME_MODE_EXTENDED = "Расширенный";

export type GameMode = typeof GAME_MODE_CLASSIC | typeof GAME_MODE_EXTENDED;

interface RoleDefinition {
  role: RoleKey;
  titleKey: string;
  isMafia: boolean;
}

export interface RoleDistributionItem extends RoleDefinition {
  count: number;
}

const ROLE_DEFINITIONS = {
  innocent: { role: ROLES.INNOCENT, titleKey: "roles.1.title", isMafia: false },
  sheriff: { role: ROLES.SHERIFF, titleKey: "roles.2.title", isMafia: false },
  mafia: { role: ROLES.MAFIA, titleKey: "roles.3.title", isMafia: true },
  don: { role: ROLES.DON, titleKey: "roles.4.title", isMafia: true },
  doctor: { role: ROLES.DOCTOR, titleKey: "roles.5.title", isMafia: false },
  putana: { role: ROLES.PUTANA, titleKey: "roles.6.title", isMafia: false },
} satisfies Record<string, RoleDefinition>;

export const normalizeGameMode = (gameMode: string): GameMode => {
  return gameMode === GAME_MODE_EXTENDED || gameMode === "Extended" ? GAME_MODE_EXTENDED : GAME_MODE_CLASSIC;
};

export const getRoleDistribution = (playersAmount: number, gameMode: string): RoleDistributionItem[] => {
  const normalizedGameMode = normalizeGameMode(gameMode);
  const mafiaPlayers = Math.floor(playersAmount / 3);
  const doctorPlayers = normalizedGameMode === GAME_MODE_EXTENDED ? 1 : 0;
  // Профурсетка (roleblock) joins the extended setup alongside the doctor.
  const putanaPlayers = normalizedGameMode === GAME_MODE_EXTENDED ? 1 : 0;
  const sheriffPlayers = 1;
  const donPlayers = 1;
  const mafiaRolePlayers = Math.max(mafiaPlayers - donPlayers, 0);
  const peacefulPlayers = playersAmount - mafiaPlayers - sheriffPlayers - doctorPlayers - putanaPlayers;

  const dist = [
    { ...ROLE_DEFINITIONS.innocent, count: peacefulPlayers },
    { ...ROLE_DEFINITIONS.sheriff, count: sheriffPlayers },
    { ...ROLE_DEFINITIONS.don, count: donPlayers },
    { ...ROLE_DEFINITIONS.mafia, count: mafiaRolePlayers },
    { ...ROLE_DEFINITIONS.doctor, count: doctorPlayers },
    { ...ROLE_DEFINITIONS.putana, count: putanaPlayers },
  ];

  // Invariant: the produced roles must total exactly the player count — never
  // silently drop or invent a seat.
  const total = dist.reduce((acc, r) => acc + r.count, 0);
  if (peacefulPlayers < 0 || total !== playersAmount) {
    throw new Error(`Invalid role distribution: ${total} roles for ${playersAmount} players`);
  }

  return dist;
};
