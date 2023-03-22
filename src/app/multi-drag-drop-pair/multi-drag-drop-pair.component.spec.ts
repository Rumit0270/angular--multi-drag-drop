import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiDragDropComponent } from '../multi-drag-drop/multi-drag-drop.component';

import { MultiDragDropPairComponent } from './multi-drag-drop-pair.component';

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
});
