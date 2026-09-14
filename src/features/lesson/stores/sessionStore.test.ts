import { beforeEach, describe, expect, it } from "vitest";
import type { Exercise } from "../types";
import {
  continueSession,
  dismissRescue,
  endSessionNow,
  getSessionState,
  gradeCurrent,
  startSession,
} from "./sessionStore";

const EXERCISES: Exercise[] = [
  { id: "e1", type: "input", prompt: "1+1", hints: [], answer: "2" },
  { id: "e2", type: "input", prompt: "2+2", hints: [], answer: "4" },
  { id: "e3", type: "input", prompt: "3+3", hints: [], answer: "6" },
  { id: "e4", type: "input", prompt: "4+4", hints: [], answer: "8" },
];

beforeEach(() => {
  startSession("s1", EXERCISES);
});

function failCurrent(): void {
  const active = getSessionState().queue[getSessionState().index];
  if (active === undefined) throw new Error("no active exercise");
  gradeCurrent(active.id, false, 0);
  continueSession();
}

describe("sessionStore rescue anti-frustración", () => {
  it("incrementa consecutiveWrong en fallo y resetea en acierto", () => {
    gradeCurrent("e1", false, 0);
    expect(getSessionState().consecutiveWrong).toBe(1);
    continueSession();
    gradeCurrent("e2", true, 10);
    expect(getSessionState().consecutiveWrong).toBe(0);
  });

  it("activa rescueActive exactamente en el 3er fallo consecutivo", () => {
    failCurrent();
    expect(getSessionState().rescueActive).toBe(false);
    failCurrent();
    expect(getSessionState().rescueActive).toBe(false);
    failCurrent();
    expect(getSessionState().rescueActive).toBe(true);
  });

  it("dismissRescue solo actúa cuando rescueActive es true", () => {
    dismissRescue();
    expect(getSessionState().rescueActive).toBe(false);
    failCurrent();
    failCurrent();
    failCurrent();
    expect(getSessionState().rescueActive).toBe(true);
    dismissRescue();
    expect(getSessionState().rescueActive).toBe(false);
  });

  it("endSessionNow termina la sesión preservando el progreso ganado", () => {
    gradeCurrent("e1", true, 10);
    endSessionNow();
    const state = getSessionState();
    expect(state.status).toBe("finished");
    expect(state.earnedXp).toBe(10);
    expect(state.correctCount).toBe(1);
    expect(state.queue).toHaveLength(4);
  });

  it("endSessionNow no hace nada si la sesión no está activa", () => {
    endSessionNow();
    expect(getSessionState().status).toBe("finished");
    endSessionNow();
    expect(getSessionState().status).toBe("finished");
  });
});
