// src/utils/auth.ts (Placeholder - explained)
export const checkUserLoggedIn = (): boolean => {
    if (typeof window !== 'undefined') {
      try {
        // This CHECKS LOCAL STORAGE, NOT the secure cookie!
        const storedUser = localStorage.getItem('user');
        return !!storedUser; // Returns true if *any* user info exists in local storage
      } catch (e) { /* ... */ }
    }
    return false;
};