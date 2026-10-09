export type JsonSuccess = {
  ok: true;
  formatted: string;
  minified: string;
};

export type JsonFailure = {
  ok: false;
  error: string;
};

export type JsonResult = JsonSuccess | JsonFailure;

export function processJson(input: string): JsonResult {
  if (input.trim().length === 0) {
    return { ok: false, error: "Enter JSON to format." };
  }

  try {
    const value = JSON.parse(input) as unknown;
    return {
      ok: true,
      formatted: JSON.stringify(value, null, 2),
      minified: JSON.stringify(value),
    };
  } catch (error) {
    return { ok: false, error: formatJsonError(input, error) };
  }
}

function formatJsonError(input: string, error: unknown): string {
  const message = error instanceof Error ? error.message : "Invalid JSON.";
  if (/\bline \d+\b/i.test(message) && /\bcolumn \d+\b/i.test(message)) {
    return message;
  }

  const match = /position\s+(\d+)/i.exec(message);
  if (!match) {
    return message;
  }

  const position = Number(match[1]);
  if (!Number.isInteger(position) || position < 0) {
    return message;
  }

  const { line, column } = lineColumnAt(input, position);
  return `${message} (line ${line}, column ${column})`;
}

function lineColumnAt(
  input: string,
  position: number,
): { line: number; column: number } {
  const bounded = Math.min(position, input.length);
  let line = 1;
  let column = 1;

  for (let index = 0; index < bounded; index += 1) {
    if (input[index] === "\n") {
      line += 1;
      column = 1;
    } else {
      column += 1;
    }
  }

  return { line, column };
}
