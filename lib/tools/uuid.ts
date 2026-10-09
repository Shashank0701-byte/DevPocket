const UUID_V4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const UUID_MIN_COUNT = 1;
export const UUID_MAX_COUNT = 20;

export function isUuidV4(value: string): boolean {
  return UUID_V4.test(value);
}

export function clampUuidCount(count: number): number {
  if (!Number.isFinite(count)) {
    return UUID_MIN_COUNT;
  }

  return Math.min(UUID_MAX_COUNT, Math.max(UUID_MIN_COUNT, Math.trunc(count)));
}

export function generateUuid(): string {
  return crypto.randomUUID();
}

export function generateUuids(count: number): string[] {
  const total = clampUuidCount(count);
  return Array.from({ length: total }, () => generateUuid());
}
