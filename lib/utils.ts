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


export function generateAttribute(label: string): string {
  // Convert to lowercase and split into words
  const words = label.toLowerCase().split(/\s+/)

  // Define words to ignore
  const ignoreWords = new Set([
    "what",
    "is",
    "the",
    "a",
    "an",
    "of",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "over",
    "after",
  ])

  // Filter out common words and keep significant ones
  const significantWords = words.filter((word) => !ignoreWords.has(word))

  // If we have multiple words, try to create a meaningful combination
  if (significantWords.length > 0) {
    // For questions about names, ensure we capture whose name it is
    if (significantWords.includes("name")) {
      const nameIndex = significantWords.indexOf("name")
      // Get the words that describe whose name it is
      const contextWords = significantWords.filter((_, index) => index !== nameIndex)
      if (contextWords.length > 0) {
        // Combine the context with "name" at the end
        // Remove all special characters and replace with underscores
        return [...contextWords, "name"]
          .join("_")
          .replace(/[^a-z0-9_]/g, "")
          .substring(0, 30)
      }
    }

    // For other types of questions, combine all significant words
    // Remove all special characters and replace with underscores
    return significantWords
      .join("_")
      .replace(/[^a-z0-9_]/g, "")
      .substring(0, 30)
  }

  // Fallback if no significant words found
  return "question_" + Math.random().toString(36).substring(2, 7)
}

