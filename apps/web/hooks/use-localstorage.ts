"use client";

import { STORAGE_KEYS } from "@/lib/constants";

export const importFromLocalStorage = () => {
  let savedElements = null;
  let savedState = null;
  let userName = null;

  try {
    savedElements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    savedState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
    userName = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_USERNAME);
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  return { savedElements, savedState, userName };
};
