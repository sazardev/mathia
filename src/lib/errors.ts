export type MathiaErrorCode =
  | "EMPTY_SELECTION"
  | "INDEX_OUT_OF_BOUNDS"
  | "INVALID_RANGE"
  | "INVALID_RATIONAL"
  | "ZERO_DENOMINATOR"
  | "DIVISION_BY_ZERO"
  | "INVALID_DIFFICULTY"
  | "INVALID_DEEP_LINK";

export class MathiaError extends Error {
  readonly code: MathiaErrorCode;

  constructor(code: MathiaErrorCode, message: string) {
    super(message);
    this.name = "MathiaError";
    this.code = code;
  }
}
