export function authHeader(customToken?: string): Record<string, string | boolean> | undefined {
  if (typeof window === "undefined") return undefined; // Prevent error in SSR

  // Retrieve token from localStorage if not provided
  const token = customToken || localStorage.getItem("accessToken");

  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT,GET,POST,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Referer,Accept,Origin,User-Agent,Content-Type,Authorization",
      "WWW-Authenticate": "Basic",
      "Access-Control-Allow-Credentials": true,
    };
  }

  return undefined;
}
