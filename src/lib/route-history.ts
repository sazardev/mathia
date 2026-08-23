export type RouteHistoryEntry = {
  readonly path: string;
  readonly searchStr: string;
  readonly visitedAt: number;
};

export type RouteHistory = {
  record: (path: string, searchStr: string, visitedAt?: number) => void;
  entries: () => readonly RouteHistoryEntry[];
  current: () => RouteHistoryEntry | undefined;
};

export function createRouteHistory(capacity: number): RouteHistory {
  const log: RouteHistoryEntry[] = [];

  return {
    record(path, searchStr, visitedAt = Date.now()) {
      const last = log[log.length - 1];

      if (
        last !== undefined &&
        last.path === path &&
        last.searchStr === searchStr
      ) {
        log[log.length - 1] = { ...last, visitedAt };
        return;
      }

      log.push({ path, searchStr, visitedAt });

      if (log.length > capacity) {
        log.shift();
      }
    },
    entries: () => [...log],
    current: () => log[log.length - 1],
  };
}
