import { describe, it, expect } from "vitest";
import { getRoleDistribution } from "../roleDistribution";
import { rolesRandomizer } from "../rolesRandomizer";
import { ROLES } from "../roleAssets";

describe("rolesRandomizer", () => {
  it("should correctly distribute roles for Classic mode with 6 players", () => {
    const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(6, "Классический");

    expect(mafiaPlayers).toBe(2);
    expect(innocentPlayers).toBe(4);
    expect(generatedArray.length).toBe(6);

    const roles = generatedArray.map((player) => player.role);
    expect(roles).toContain(ROLES.DON);
    expect(roles).toContain(ROLES.MAFIA);
    expect(roles).toContain(ROLES.SHERIFF);
    expect(roles.filter((role) => role === ROLES.INNOCENT).length).toBe(3);
    expect(roles).not.toContain(ROLES.DOCTOR);
  });

  it("should correctly distribute roles for Extended mode with 6 players", () => {
    const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(6, "Расширенный");

    expect(mafiaPlayers).toBe(2);
    expect(innocentPlayers).toBe(4);
    expect(generatedArray.length).toBe(6);

    const roles = generatedArray.map((player) => player.role);
    expect(roles).toContain(ROLES.DON);
    expect(roles).toContain(ROLES.MAFIA);
    expect(roles).toContain(ROLES.SHERIFF);
    expect(roles).toContain(ROLES.DOCTOR);
    expect(roles).toContain(ROLES.PUTANA);
    // Extended now also seats one профурсетка, so plain innocents drop to 1.
    expect(roles.filter((role) => role === ROLES.INNOCENT).length).toBe(1);
  });

  it("should correctly distribute roles for larger games with 9 players", () => {
    const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(9, "Классический");

    expect(mafiaPlayers).toBe(3);
    expect(innocentPlayers).toBe(6);
    expect(generatedArray.length).toBe(9);

    const roles = generatedArray.map((player) => player.role);
    expect(roles).toContain(ROLES.DON);
    expect(roles.filter((role) => role === ROLES.MAFIA).length).toBe(2);
    expect(roles).toContain(ROLES.SHERIFF);
    expect(roles.filter((role) => role === ROLES.INNOCENT).length).toBe(5);
  });

  it("should handle English mode names", () => {
    const { generatedArray: classicArray } = rolesRandomizer(6, "Classic");
    const { generatedArray: extendedArray } = rolesRandomizer(6, "Extended");

    expect(classicArray.map((player) => player.role)).not.toContain(ROLES.DOCTOR);
    expect(extendedArray.map((player) => player.role)).toContain(ROLES.DOCTOR);
  });

  it("should return role counts for preview without shuffling roles", () => {
    const distribution = getRoleDistribution(6, "Расширенный");
    const countsByRole = Object.fromEntries(distribution.map(({ role, count }) => [role, count]));

    expect(countsByRole[ROLES.INNOCENT]).toBe(1);
    expect(countsByRole[ROLES.SHERIFF]).toBe(1);
    expect(countsByRole[ROLES.DON]).toBe(1);
    expect(countsByRole[ROLES.MAFIA]).toBe(1);
    expect(countsByRole[ROLES.DOCTOR]).toBe(1);
    expect(countsByRole[ROLES.PUTANA]).toBe(1);
  });

  it("always produces exactly one role per player across sizes and modes", () => {
    for (const mode of ["Классический", "Расширенный"] as const) {
      for (let n = 4; n <= 12; n += 1) {
        const total = getRoleDistribution(n, mode).reduce((acc, r) => acc + r.count, 0);
        expect(total).toBe(n);
        expect(rolesRandomizer(n, mode).generatedArray.length).toBe(n);
      }
    }
  });
});
