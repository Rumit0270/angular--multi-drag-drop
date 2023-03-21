import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDragDropPairComponent } from './multi-drag-drop-pair.component';

describe('MultiDragDropPairComponent', () => {
  let component: MultiDragDropPairComponent;
  let fixture: ComponentFixture<MultiDragDropPairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDragDropPairComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiDragDropPairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
