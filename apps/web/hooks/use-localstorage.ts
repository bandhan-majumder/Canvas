// import { animeAtom } from "@/appState";
import type { CanvasElement } from "@/types/shape";
import { STORAGE_KEYS } from "@/lib/constants";

export const importFromLocalStorage = () => {
  let savedElements = null;
  let savedState = null;

  try {
    savedElements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    savedState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  return { savedElements, savedState };
};

const saveDataStateToLocalStorage = (
  elements: readonly CanvasElement[],
  // appState: AppState,
) => {
//   const localStorageQuotaExceeded = appJotaiStore.get(
//     localStorageQuotaExceededAtom,
//   );
  try {
    // const _appState = clearAppStateForLocalStorage(appState);

    // if (
    //   _appState.openSidebar?.name === DEFAULT_SIDEBAR.name &&
    //   _appState.openSidebar.tab === CANVAS_SEARCH_TAB
    // ) {
    //   _appState.openSidebar = null;
    // }

    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
      JSON.stringify(elements),
    );
    // localStorage.setItem(
    //   STORAGE_KEYS.LOCAL_STORAGE_APP_STATE,
    //   JSON.stringify(_appState),
    // );
  } catch (error: any) {
    // Unable to access window.localStorage
    console.error(error);
  }
};