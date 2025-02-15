export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export const setUserData = (userData: { email: string; token: string; [key: string]: any }) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("accessToken", userData.token);
  }
};

export const getUserData = () => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

export const getUserEmail = (): string | null => {
  const userData = getUserData();
  return userData ? userData.email : null;
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const clearUserData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userData");
    localStorage.removeItem("accessToken");
  }
};
