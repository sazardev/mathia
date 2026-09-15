export type CalcOperator = "+" | "-" | "×" | "÷";

export interface CalcState {
  display: string;
  previous: number | null;
  operator: CalcOperator | null;
  overwrite: boolean;
}

export const INITIAL_CALC_STATE: CalcState = {
  display: "0",
  previous: null,
  operator: null,
  overwrite: true,
};

function applyOperator(a: number, b: number, op: CalcOperator): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

function formatResult(value: number): string {
  if (Number.isNaN(value) || !Number.isFinite(value)) return "Error";
  return Number(value.toFixed(10)).toString();
}

export function pressDigit(state: CalcState, digit: string): CalcState {
  if (state.overwrite) return { ...state, display: digit, overwrite: false };
  if (state.display === "0") return { ...state, display: digit };
  if (state.display.replace("-", "").length >= 12) return state;
  return { ...state, display: state.display + digit };
}

export function pressDecimal(state: CalcState): CalcState {
  if (state.overwrite) return { ...state, display: "0.", overwrite: false };
  if (state.display.includes(".")) return state;
  return { ...state, display: state.display + "." };
}

export function pressOperator(
  state: CalcState,
  operator: CalcOperator,
): CalcState {
  const current = Number(state.display);
  if (state.previous === null) {
    return {
      display: state.display,
      previous: current,
      operator,
      overwrite: true,
    };
  }
  if (state.overwrite) return { ...state, operator };
  const result = applyOperator(
    state.previous,
    current,
    state.operator ?? operator,
  );
  return {
    display: formatResult(result),
    previous: result,
    operator,
    overwrite: true,
  };
}

export function pressEquals(state: CalcState): CalcState {
  if (state.operator === null || state.previous === null) return state;
  const result = applyOperator(
    state.previous,
    Number(state.display),
    state.operator,
  );
  return {
    display: formatResult(result),
    previous: null,
    operator: null,
    overwrite: true,
  };
}

export function pressPercent(state: CalcState): CalcState {
  return {
    ...state,
    display: formatResult(Number(state.display) / 100),
    overwrite: true,
  };
}

export function pressBackspace(state: CalcState): CalcState {
  if (state.overwrite) return state;
  const next = state.display.slice(0, -1);
  return { ...state, display: next === "" || next === "-" ? "0" : next };
}

export function pressClear(): CalcState {
  return INITIAL_CALC_STATE;
}
