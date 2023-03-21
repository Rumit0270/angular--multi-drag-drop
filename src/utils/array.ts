/**
 *
 * @param arr Array to be mutated
 * @param cb Callback to determine filter criteria
 * @returns removed items from array
 */
export const filterWithMutation = <T>(
  arr: T[],
  cb: (item: T, index: number) => boolean
) => {
  const arrClone = [...arr];
  const removedItems = [];

  arr.splice(0);

  arrClone.forEach((item, index) => {
    const shouldInclude = cb(item, index);

    if (shouldInclude) {
      arr.push(item);
    } else {
      removedItems.push(item);
    }
  });

  return removedItems;
};

/**
 *
 * @param arr The array in which items are to be inserted
 * @param insertAt Index at which items are to be inserted
 * @param items array of items to be inserted
 */
export const insertItemsAt = <T>(arr: T[], insertAt: number, ...items: T[]) => {
  return arr.splice(insertAt, 0, ...items);
};
