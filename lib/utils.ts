export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const setUserData = (userData: { email: string; token: string; [key: string]: any }) => {
  localStorage.setItem("userData", JSON.stringify(userData))
  localStorage.setItem("accessToken", userData.token)
}

export const getUserData = () => {
  const userData = localStorage.getItem("userData")
  return userData ? JSON.parse(userData) : null
}

export const getUserEmail = (): string | null => {
  const userData = getUserData()
  return userData ? userData.email : null
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken")
}

export const clearUserData = () => {
  localStorage.removeItem("userData")
  localStorage.removeItem("accessToken")
}


