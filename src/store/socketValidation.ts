// Runtime guards for inbound socket payloads. TypeScript annotations on socket
// listeners are erased at build time, so a malformed (or hostile) server frame
// would otherwise flow straight into reducers that index state by seat/user and
// crash or corrupt it. These guards validate only the fields the reducers touch
// and let listeners drop anything that doesn't match.

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isBool = (v: unknown): v is boolean => typeof v === "boolean";

export const isRoomPlayer = (p: unknown): boolean =>
  isObject(p) && isString(p.userId) && isString(p.username) && isNumber(p.seatNumber);

export const isRoom = (r: unknown): boolean =>
  isObject(r) && isString(r.id) && isString(r.code) && Array.isArray(r.players) && r.players.every(isRoomPlayer);

export const isGameState = (g: unknown): boolean =>
  isObject(g) && isString(g.id) && isNumber(g.cycle) && Array.isArray(g.seats);

export const hasUserId = (p: unknown): boolean => isObject(p) && isString(p.userId);

export const hasTargetSeat = (p: unknown): boolean => isObject(p) && isNumber(p.targetSeat);

export const isVotingResult = (p: unknown): boolean =>
  isObject(p) && isBool(p.isTie) && (p.targetSeat === null || isNumber(p.targetSeat));

export const isNightResult = (p: unknown): boolean =>
  isObject(p) && (p.killedSeat === null || isNumber(p.killedSeat));

export const isVote = (p: unknown): boolean =>
  isObject(p) && isNumber(p.actorSeat) && (p.targetSeat === null || isNumber(p.targetSeat));

export const isNomination = (p: unknown): boolean => isObject(p) && isNumber(p.actorSeat) && isNumber(p.targetSeat);

/** Dispatches `action` only when `valid`; otherwise logs and drops the frame. */
export const guarded = <T>(event: string, payload: T, valid: boolean, run: () => void): void => {
  if (valid) {
    run();
    return;
  }
  if (import.meta.env.DEV) console.warn(`[socket] dropped malformed "${event}" payload`, payload);
};
