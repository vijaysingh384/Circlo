const HOST_TOKEN_KEY = (eventId: string) => `host_token_${eventId}`;
const SESSION_TOKEN_KEY = (eventId: string) => `session_token_${eventId}`;

export function getHostToken(eventId: string): string | null {
  return localStorage.getItem(HOST_TOKEN_KEY(eventId));
}

export function setHostToken(eventId: string, token: string): void {
  localStorage.setItem(HOST_TOKEN_KEY(eventId), token);
}

export function getSessionToken(eventId: string): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY(eventId));
}

export function setSessionToken(eventId: string, token: string): void {
  localStorage.setItem(SESSION_TOKEN_KEY(eventId), token);
}

export function generateToken(): string {
  return crypto.randomUUID();
}
