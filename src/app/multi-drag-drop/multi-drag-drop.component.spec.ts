import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDragDropComponent } from './multi-drag-drop.component';

describe('MultiDragDropComponent', () => {
  let component: MultiDragDropComponent;
  let fixture: ComponentFixture<MultiDragDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropModule],
      declarations: [MultiDragDropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiDragDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
