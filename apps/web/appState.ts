import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils';
import { CanvasElement } from '@/types/shape';
import { STORAGE_KEYS } from '@/lib/constants';

export const localStorageElementsAtom = atomWithStorage<CanvasElement[]>(
  STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
  [] // default value
);

// support for both single shape and multiple shapes
export const addShapeAtom = atom(
  null, // no read
  (get, set, newShapes: CanvasElement | CanvasElement[]) => {
    const currentShapes = get(localStorageElementsAtom);
    if (Array.isArray(newShapes)) {
      set(localStorageElementsAtom, [...newShapes]); // [...currentShapes, ...newShapes] will make things duplicate
      return;
    } else {
      set(localStorageElementsAtom, [...currentShapes, newShapes]);
    }
  }
);

export const clearShapesAtom = atom(
  null,
  (get, set) => {
    set(localStorageElementsAtom, []);
  }
);