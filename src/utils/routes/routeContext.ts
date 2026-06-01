// src/utils/routeContext.ts

let currentPathname = "UNKNOWN";

// ✅ setter (called from layout / gatekeeper)
export function setPathname(path: string) {
  currentPathname = path;
}

// ✅ getter (used anywhere like API)
export function getPathname(): string {
  return currentPathname;
}
``;
