import {
  tick,
  TestBed,
  fakeAsync,
  ComponentFixture,
} from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { MultiDragDropPairComponent } from './multi-drag-drop-pair.component';
import { MultiDragDropComponent } from '../multi-drag-drop/multi-drag-drop.component';

describe('MultiDragDropPairComponent', () => {
  let component: MultiDragDropPairComponent;
  let fixture: ComponentFixture<MultiDragDropPairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropModule],
      declarations: [MultiDragDropPairComponent, MultiDragDropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiDragDropPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('moveItemsFromFirstToSecond', () => {
    it('should move selected items from first to second list', () => {
      spyOn(component.itemsMoved, 'emit');

      component.firstItemsList = [1, 2, 3];
      component.secondItemsList = [4, 5, 6];
      component.selectedIndicesInFirstList = [0, 1];

      component.moveItemsFromFirstToSecond();

      expect(component.firstItemsList).toEqual([3]);
      expect(component.secondItemsList).toEqual([4, 5, 6, 1, 2]);
      expect(component.itemsMoved.emit).toHaveBeenCalled();
    });

    it('should move selected items from second to first list', () => {
      spyOn(component.itemsMoved, 'emit');

      component.firstItemsList = [1, 2, 3];
      component.secondItemsList = [4, 5, 6];
      component.selectedIndicesInSecondList = [0, 1];

      component.moveItemsFromSecondToFirst();

      expect(component.firstItemsList).toEqual([1, 2, 3, 4, 5]);
      expect(component.secondItemsList).toEqual([6]);
      expect(component.itemsMoved.emit).toHaveBeenCalled();
    });
  });

  it('should emit listUpdated event', fakeAsync(() => {
    spyOn(component.listUpdated, 'emit');

    component.handleItemsUpdated(false);
    tick();

    expect(component.listUpdated.emit).toHaveBeenCalled();
  }));

  it('should emit itemsMoved event when item are added in first list', fakeAsync(() => {
    let isMovedFromSecondToFirst = false;

    spyOn(component.itemsMoved, 'emit').and.callFake((event) => {
      isMovedFromSecondToFirst = event.isMovedFromSecondToFirst;
    });

    component.handleItemsAddedInFirstList([]);
    tick();

    expect(component.itemsMoved.emit).toHaveBeenCalled();
    expect(isMovedFromSecondToFirst).toBeTrue();
  }));

  it('should emit itemsMoved event when item are removed from first list', fakeAsync(() => {
    let isMovedFromFirstToSecond = false;

    spyOn(component.itemsMoved, 'emit').and.callFake((event) => {
      isMovedFromFirstToSecond = event.isMovedFromFirstToSecond;
    });

    component.handleItemsRemovedInFirstList([]);
    tick();

    expect(component.itemsMoved.emit).toHaveBeenCalled();
    expect(isMovedFromFirstToSecond).toBeTrue();
  }));
});
