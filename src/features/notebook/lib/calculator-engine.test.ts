import { describe, expect, it } from "vitest";
import {
  INITIAL_CALC_STATE,
  pressBackspace,
  pressClear,
  pressDecimal,
  pressDigit,
  pressEquals,
  pressOperator,
  pressPercent,
} from "./calculator-engine";

describe("calculator-engine", () => {
  it("encadena dígitos en el visor", () => {
    let state = pressDigit(INITIAL_CALC_STATE, "1");
    state = pressDigit(state, "2");
    expect(state.display).toBe("12");
  });

  it("suma dos números (7 + 5 = 12)", () => {
    let state = pressDigit(INITIAL_CALC_STATE, "7");
    state = pressOperator(state, "+");
    state = pressDigit(state, "5");
    state = pressEquals(state);
    expect(state.display).toBe("12");
  });

  it("encadena operadores sin pulsar =: 2 + 3 + 4 = 9", () => {
    let state = pressDigit(INITIAL_CALC_STATE, "2");
    state = pressOperator(state, "+");
    state = pressDigit(state, "3");
    state = pressOperator(state, "+");
    state = pressDigit(state, "4");
    state = pressEquals(state);
    expect(state.display).toBe("9");
  });

  it("división entre cero muestra Error", () => {
    let state = pressDigit(INITIAL_CALC_STATE, "8");
    state = pressOperator(state, "÷");
    state = pressDigit(state, "0");
    state = pressEquals(state);
    expect(state.display).toBe("Error");
  });

  it("porcentaje: 50 % = 0.5", () => {
    const state = pressPercent({ ...INITIAL_CALC_STATE, display: "50" });
    expect(state.display).toBe("0.5");
  });

  it("el punto decimal no se duplica", () => {
    let state = pressDecimal(pressDigit(INITIAL_CALC_STATE, "1"));
    state = pressDecimal(state);
    expect(state.display).toBe("1.");
  });

  it("backspace borra el último dígito y llega a 0", () => {
    let state = pressDigit(INITIAL_CALC_STATE, "1");
    state = pressDigit(state, "2");
    state = pressBackspace(state);
    state = pressBackspace(state);
    expect(state.display).toBe("0");
  });

  it("clear reinicia al estado inicial", () => {
    const state = pressDigit(INITIAL_CALC_STATE, "9");
    expect(pressClear()).toEqual(INITIAL_CALC_STATE);
    expect(state.display).toBe("9");
  });
});
