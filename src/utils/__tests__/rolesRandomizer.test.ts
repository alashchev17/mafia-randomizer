import { describe, it, expect } from "vitest";
import { rolesRandomizer } from "../rolesRandomizer";

describe("rolesRandomizer", () => {
  it("should correctly distribute roles for Classic mode with 6 players", () => {
    const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(6, "Классический");

    expect(mafiaPlayers).toBe(2);
    expect(innocentPlayers).toBe(4);
    expect(generatedArray.length).toBe(6);

    // Verify all expected roles are present
    const roles = generatedArray.map((player) => player.role);
    expect(roles).toContain("Дон");
    expect(roles).toContain("Мафия");
    expect(roles).toContain("Шериф");
    expect(roles.filter((role) => role === "Мирный житель").length).toBe(3);

    // Verify no doctor in classic mode
    expect(roles).not.toContain("Доктор");
  });

  it("should correctly distribute roles for Extended mode with 6 players", () => {
    const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(6, "Расширенный");

    expect(mafiaPlayers).toBe(2);
    expect(innocentPlayers).toBe(4);
    expect(generatedArray.length).toBe(6);

    // Verify all expected roles are present
    const roles = generatedArray.map((player) => player.role);
    expect(roles).toContain("Дон");
    expect(roles).toContain("Мафия");
    expect(roles).toContain("Шериф");
    expect(roles).toContain("Доктор");
    expect(roles.filter((role) => role === "Мирный житель").length).toBe(2);
  });

  it("should correctly distribute roles for larger games with 9 players", () => {
    const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(9, "Классический");

    expect(mafiaPlayers).toBe(3);
    expect(innocentPlayers).toBe(6);
    expect(generatedArray.length).toBe(9);

    // Verify all expected roles are present
    const roles = generatedArray.map((player) => player.role);
    expect(roles).toContain("Дон");
    expect(roles.filter((role) => role === "Мафия").length).toBe(2);
    expect(roles).toContain("Шериф");
    expect(roles.filter((role) => role === "Мирный житель").length).toBe(5);
  });

  it("should handle English mode names", () => {
    const { generatedArray: classicArray } = rolesRandomizer(6, "Classic");
    const { generatedArray: extendedArray } = rolesRandomizer(6, "Extended");

    expect(classicArray.map((player) => player.role)).not.toContain("Доктор");
    expect(extendedArray.map((player) => player.role)).toContain("Доктор");
  });
});
