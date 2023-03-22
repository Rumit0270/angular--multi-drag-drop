import {
  tick,
  TestBed,
  fakeAsync,
  ComponentFixture,
} from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, ElementRef } from '@angular/core';

import { MultiDragDropComponent } from './multi-drag-drop.component';

describe('MultiDragDropComponent', () => {
  let component: MultiDragDropComponent;
  let fixture: ComponentFixture<MultiDragDropComponent>;
  let cdr: ChangeDetectorRef;
  let elementRef: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropModule],
      declarations: [MultiDragDropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiDragDropComponent);

    component = fixture.componentInstance;
    cdr = (component as any).cdr;
    elementRef = (component as any).elementRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should not clear selections if items input value is unchanged', () => {
      component.selectItem({} as any, 0);

      const mockChanges: any = {
        items: {
          currentValue: [1, 2, 3],
          previousValue: [1, 2, 3],
        },
      };

      component.ngOnChanges(mockChanges);

      expect(component.selectedItemsCount).toEqual(1);
    });

    it('should clear selections if items input value is changed', () => {
      component.selectItem({} as any, 0);

      const mockChanges: any = {
        items: {
          currentValue: [1, 2],
          previousValue: [1, 2, 3],
        },
      };

      component.ngOnChanges(mockChanges);

      expect(component.selectedItemsCount).toEqual(0);
    });
  });

  describe('ngAfterViewInit', () => {
    it('should trigger change detection', () => {
      spyOn(cdr, 'detectChanges');

      component.ngAfterViewInit();

      expect(cdr.detectChanges).toHaveBeenCalled();
    });
  });

  describe('isDragging', () => {
    it('should return boolean indicating dragging state', () => {
      component.dragStarted({ source: { _dragRef: {} } } as any, 0);

      expect(component.isDragging).toBeTrue();
    });
  });

  describe('isSelected', () => {
    it('should check if an item at index is selected', () => {
      component.selectItem({} as any, 0);

      expect(component.isSelected(0)).toBeTrue();
      expect(component.isSelected(1)).toBeFalse();
    });
  });

  describe('selectedItemsCount', () => {
    it('should return selected items count', () => {
      component.selectItem({} as any, 0);

      expect(component.selectedItemsCount).toEqual(1);
    });
  });

  describe('itemDroppedInList', () => {
    it('should not emit any event if pointer is not over container while dropping', () => {
      spyOn(component.itemsAdded, 'emit');
      spyOn(component.itemsUpdated, 'emit');

      component.itemDroppedInList({ isPointerOverContainer: false } as any);

      expect(component.itemsAdded.emit).not.toHaveBeenCalled();
      expect(component.itemsUpdated.emit).not.toHaveBeenCalled();
    });

    it('should emit itemsUpdated event if an item is dropped in same container', () => {
      spyOn(component.itemsUpdated, 'emit');

      const mockContainer = { data: [] };
      const mockDropEvent: any = {
        isPointerOverContainer: true,
        previousContainer: mockContainer,
        container: mockContainer,
        previousIndex: 0,
        currentIndex: 0,
      };
      component.itemDroppedInList(mockDropEvent);

      expect(component.itemsUpdated.emit).toHaveBeenCalled();
    });

    it('should emit itemsUpdated event if multiple items are dropped in same container', () => {
      component.items = [1, 2, 3, 4, 5];
      component.selectItem({} as any, 0);
      component.selectItem({} as any, 1);

      spyOn(component.itemsUpdated, 'emit');

      const mockContainer = { data: [] };
      const mockDropEvent: any = {
        isPointerOverContainer: true,
        previousContainer: mockContainer,
        container: mockContainer,
        previousIndex: 0,
        currentIndex: 4,
        item: {
          data: {
            selectionIndices: [1, 2],
          },
        },
      };
      component.itemDroppedInList(mockDropEvent);

      expect(component.itemsUpdated.emit).toHaveBeenCalled();
    });

    it('should emit itemsAdded event if items are dropped in different container', () => {
      component.items = [1, 2, 3, 4, 5];

      spyOn(component.itemsAdded, 'emit');

      const mockDropEvent: any = {
        isPointerOverContainer: true,
        previousContainer: { data: [] },
        container: { data: [] },
        previousIndex: 0,
        currentIndex: 0,
        item: {
          data: {
            selectionIndices: [1, 2],
            selectedItems: [2, 3],
          },
        },
      };
      component.itemDroppedInList(mockDropEvent);

      expect(component.itemsAdded.emit).toHaveBeenCalled();
    });
  });

  describe('dragStarted', () => {
    it('should detach view and update event with selected index data', () => {
      component.items = [1, 2, 3, 4, 5];
      spyOn(cdr, 'detach');

      const mockEvent: any = {
        source: {
          _dragRef: {},
        },
      };

      component.dragStarted(mockEvent, 0);

      expect(mockEvent.source.data).toEqual({
        selectionIndices: [0],
        selectedItems: [1],
      });
    });

    it('should update event with all selected data', () => {
      component.items = [1, 2, 3, 4, 5];
      component.selectItem({} as any, 1);

      spyOn(cdr, 'detach');

      const mockEvent: any = {
        source: {
          _dragRef: {},
        },
      };

      component.dragStarted(mockEvent, 0);

      expect(mockEvent.source.data).toEqual({
        selectionIndices: [1],
        selectedItems: [2],
      });
    });
  });

  describe('dragEnded', () => {
    it('should reattach view', () => {
      spyOn(cdr, 'reattach');

      component.dragEnded();

      expect(cdr.reattach).toHaveBeenCalled();
      expect(component.isDragging).toBeFalse();
    });
  });

  describe('dragDropped', () => {
    it('should not clear dragRef if item is not dropped over container', () => {
      const mockEvent: any = {
        source: {
          _dragRef: {},
        },
      };

      component.dragStarted(mockEvent, 0);
      component.dragDropped({ isPointerOverContainer: false } as any);

      expect(component.isDragging).toBeTrue();
    });

    it('should emit itemsRemoved if items are dropped into different container', () => {
      component.items = [1, 2, 3, 4, 5];
      spyOn(component.itemsRemoved, 'emit');

      const mockDropEvent: any = {
        isPointerOverContainer: true,
        previousContainer: { data: [] },
        container: { data: [] },
        previousIndex: 0,
        currentIndex: 4,
        item: {
          data: {
            selectionIndices: [1, 2],
          },
        },
      };

      component.dragDropped(mockDropEvent);

      expect(component.itemsRemoved.emit).toHaveBeenCalled();
    });

    it('should clear item selections', fakeAsync(() => {
      component.items = [1, 2, 3, 4, 5];
      component.selectItem({} as any, 0);
      component.selectItem({} as any, 1);

      const mockContainer = {};
      const mockDropEvent: any = {
        isPointerOverContainer: true,
        previousContainer: mockContainer,
        container: mockContainer,
        previousIndex: 0,
        currentIndex: 4,
        item: {},
      };

      component.dragDropped(mockDropEvent);
      tick();

      expect(component.selectedItemsCount).toEqual(0);
    }));
  });

  describe('selectedItems', () => {
    it('should return selected items', () => {
      component.items = [1, 2, 3, 4, 5];
      component.selectItem({} as any, 1);

      expect(component.selectedItems).toEqual([2]);
    });
  });

  describe('selectItem', () => {
    it('should only select clicked item when the item is already selected with other items', () => {
      spyOn(component.selectionChanged, 'emit');
      component.items = [1, 2, 3, 4, 5];
      const mockEvent: any = {
        ctrlKey: false,
      };

      component.selectItem({ ctrlKey: true } as any, 0);
      component.selectItem({ ctrlKey: true } as any, 1);
      component.selectItem(mockEvent, 0);

      expect(component.selectionChanged.emit).toHaveBeenCalled();
      expect(component.selectedItemsCount).toEqual(1);
    });

    it('should empty selections if same item is selected again', () => {
      spyOn(component.selectionChanged, 'emit');
      component.items = [1, 2, 3, 4, 5];

      component.selectItem({ ctrlKey: false } as any, 0);
      component.selectItem({ ctrlKey: false } as any, 0);

      expect(component.selectionChanged.emit).toHaveBeenCalled();
      expect(component.selectedItemsCount).toEqual(0);
    });

    it('should select an item', () => {
      spyOn(component.selectionChanged, 'emit');
      component.items = [1, 2, 3, 4, 5];

      component.selectItem({ ctrlKey: true } as any, 0);

      expect(component.selectionChanged.emit).toHaveBeenCalled();
      expect(component.selectedItemsCount).toEqual(1);
    });

    it('should remove selection from an item', () => {
      spyOn(component.selectionChanged, 'emit');
      component.items = [1, 2, 3, 4, 5];

      component.selectItem({ ctrlKey: true } as any, 0);
      component.selectItem({ ctrlKey: true } as any, 1);
      component.selectItem({ ctrlKey: true } as any, 0);

      expect(component.selectionChanged.emit).toHaveBeenCalled();
      expect(component.selectedItemsCount).toEqual(1);
      expect(component.selectedItems).toEqual([2]);
    });

    it('should select multiple items', () => {
      spyOn(component.selectionChanged, 'emit');
      component.items = [1, 2, 3, 4, 5];

      component.selectItem({ ctrlKey: true } as any, 0);
      component.selectItem({ ctrlKey: true } as any, 1);

      expect(component.selectionChanged.emit).toHaveBeenCalled();
      expect(component.selectedItemsCount).toEqual(2);
      expect(component.selectedItems).toEqual([1, 2]);
    });
  });

  describe('clickOutside', () => {
    it('should clear selections if clicked outside', () => {
      spyOn(elementRef.nativeElement, 'contains').and.returnValue(false);
      component.items = [1, 2, 3, 4, 5];

      component.selectItem({ ctrlKey: true } as any, 0);
      component.selectItem({ ctrlKey: true } as any, 1);

      component.clickOutside({ target: {} } as any);

      expect(component.selectedItemsCount).toEqual(0);
    });
  });
});
