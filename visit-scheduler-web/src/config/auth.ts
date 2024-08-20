export const AUTHORIZED_ROUTES = {
  user: ["/schedule", "/me", "/"],
  admin: [],
} as const satisfies Record<string, string[]>;
