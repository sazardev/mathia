import { describe, expect, it } from "vitest";
import {
  LEVEL_TEST_START_DIFFICULTY,
  levelTestTopic,
  mapDifficultyToStartUnit,
  nextLevelTestDifficulty,
} from "./level-test";

describe("nextLevelTestDifficulty", () => {
  it("sube un escalón con respuesta correcta", () => {
    expect(nextLevelTestDifficulty(3, true)).toBe(4);
  });

  it("baja un escalón con respuesta incorrecta", () => {
    expect(nextLevelTestDifficulty(3, false)).toBe(2);
  });

  it("nunca sube por encima de 5", () => {
    expect(nextLevelTestDifficulty(5, true)).toBe(5);
  });

  it("nunca baja por debajo de 1", () => {
    expect(nextLevelTestDifficulty(1, false)).toBe(1);
  });
});

describe("levelTestTopic", () => {
  it("usa aritmética en dificultades bajas", () => {
    expect(levelTestTopic(1)).toBe("integer-arithmetic");
    expect(levelTestTopic(2)).toBe("integer-arithmetic");
  });

  it("usa ecuaciones lineales en dificultades altas", () => {
    expect(levelTestTopic(3)).toBe("linear-equation");
    expect(levelTestTopic(5)).toBe("linear-equation");
  });
});

describe("mapDifficultyToStartUnit", () => {
  it("mapea dificultad baja a Unidad 1", () => {
    expect(mapDifficultyToStartUnit(1)).toBe(1);
    expect(mapDifficultyToStartUnit(2)).toBe(1);
  });

  it("mapea dificultad media a Unidad 2", () => {
    expect(mapDifficultyToStartUnit(3)).toBe(2);
  });

  it("mapea dificultad alta a Unidad 3", () => {
    expect(mapDifficultyToStartUnit(4)).toBe(3);
    expect(mapDifficultyToStartUnit(5)).toBe(3);
  });
});

describe("LEVEL_TEST_START_DIFFICULTY", () => {
  it("empieza en dificultad media (3)", () => {
    expect(LEVEL_TEST_START_DIFFICULTY).toBe(3);
  });
});
