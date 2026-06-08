export const ROLES = {
  INNOCENT: "innocent",
  SHERIFF: "sheriff",
  MAFIA: "mafia",
  DON: "don",
  DOCTOR: "doctor",
  PUTANA: "putana",
} as const;

export type RoleKey = (typeof ROLES)[keyof typeof ROLES];

export const MAFIA_ROLES: readonly RoleKey[] = [ROLES.MAFIA, ROLES.DON];

export const ROLE_SRC_MAP: Record<RoleKey, string> = {
  [ROLES.INNOCENT]: "/cards/innocent.svg",
  [ROLES.SHERIFF]: "/cards/sheriff.svg",
  [ROLES.MAFIA]: "/cards/mafia.svg",
  [ROLES.DON]: "/cards/headOfMafia.svg",
  [ROLES.DOCTOR]: "/cards/doctor.svg",
  [ROLES.PUTANA]: "/cards/putana.svg",
};

export const ROLE_TITLE_KEY_MAP: Record<RoleKey, string> = {
  [ROLES.INNOCENT]: "roles.1.title",
  [ROLES.SHERIFF]: "roles.2.title",
  [ROLES.MAFIA]: "roles.3.title",
  [ROLES.DON]: "roles.4.title",
  [ROLES.DOCTOR]: "roles.5.title",
  [ROLES.PUTANA]: "roles.6.title",
};

export const getRoleSrc = (role: RoleKey): string => ROLE_SRC_MAP[role] ?? "";

export const getRoleTitleKey = (role: RoleKey): string => ROLE_TITLE_KEY_MAP[role] ?? "";

export const isMafiaRole = (role: RoleKey): boolean => MAFIA_ROLES.includes(role);
