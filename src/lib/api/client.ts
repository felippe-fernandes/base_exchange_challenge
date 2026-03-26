const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const isServer = typeof window === "undefined";

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...(isServer ? { cache: "no-store" as const } : {}),
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(response.status, message);
  }

  return response.json();
}