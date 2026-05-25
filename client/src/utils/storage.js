export const storageKeys = {
  auth: "fitmanager_auth",
  membership: "fitmanager_membership",
};

export const loadStoredJson = (key, fallback = null) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

export const saveStoredJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage write issues in UI code.
  }
};

export const removeStoredJson = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage removal issues in UI code.
  }
};
