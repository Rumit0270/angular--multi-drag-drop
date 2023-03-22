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
      spyOn(component.listChange, 'emit');

      component.firstItemsList = [1, 2, 3];
      component.secondItemsList = [4, 5, 6];
      component.selectedIndicesInFirstList = [0, 1];

      component.moveItemsFromFirstToSecond();

      expect(component.firstItemsList).toEqual([3]);
      expect(component.secondItemsList).toEqual([4, 5, 6, 1, 2]);
      expect(component.listChange.emit).toHaveBeenCalled();
    });

    it('should move selected items from second to first list', () => {
      spyOn(component.listChange, 'emit');

      component.firstItemsList = [1, 2, 3];
      component.secondItemsList = [4, 5, 6];
      component.selectedIndicesInSecondList = [0, 1];

      component.moveItemsFromSecondToFirst();

      expect(component.firstItemsList).toEqual([1, 2, 3, 4, 5]);
      expect(component.secondItemsList).toEqual([6]);
      expect(component.listChange.emit).toHaveBeenCalled();
    });
  });

  it('should emit listChange event', fakeAsync(() => {
    spyOn(component.listChange, 'emit');

    component.emitListChangeEvent();
    tick();

    expect(component.listChange.emit).toHaveBeenCalled();
  }));
});
