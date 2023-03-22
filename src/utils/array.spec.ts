import { filterWithMutation, insertItemsAt } from './array';

describe('Array utils', () => {
  describe('filterWithMutation', () => {
    it('should filter the array with mutation', () => {
      const arr = [1, 2, 3, 4, 5];

      const removed = filterWithMutation(arr, (item) => item !== 5);

      expect(arr).toEqual([1, 2, 3, 4]);
      expect(removed).toEqual([5]);
    });
  });

  describe('insertItemsAt', () => {
    it('should insert items at given index', () => {
      const arr = [1, 2, 3];
      const itemsToAdd = [4, 5];

      insertItemsAt(arr, 0, ...itemsToAdd);

      expect(arr).toEqual([4, 5, 1, 2, 3]);
    });
  });
});
