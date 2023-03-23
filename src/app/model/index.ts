export interface ItemsMovedEvent<T = any> {
  isMovedFromFirstToSecond: boolean;
  isMovedFromSecondToFirst: boolean;
  movedItems: T[];
}

export interface ItemsOrderChangeEvent {
  isFirstList: boolean;
}

export interface ItemSelectionChangeEvent<T = any> {
  selectedItems: T[];
  selectedIndices: number[];
}
