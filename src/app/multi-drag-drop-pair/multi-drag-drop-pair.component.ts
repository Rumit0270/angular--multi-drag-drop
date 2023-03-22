import {
  Input,
  Output,
  Component,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { filterWithMutation, insertItemsAt } from 'src/utils/array';

@Component({
  selector: 'multi-drag-drop-pair',
  templateUrl: './multi-drag-drop-pair.component.html',
  styleUrls: ['./multi-drag-drop-pair.component.css'],
})
export class MultiDragDropPairComponent {
  @Input() isSortingDisabled: boolean = true;

  // Droppable list ids
  @Input() firstListId: string = '';
  @Input() secondListId: string = '';

  // List items
  @Input() firstItemsList: any[] = [];
  @Input() secondItemsList: any[] = [];

  // Row Templates for individual list
  @Input() firstItemTemplateRef: TemplateRef<any>;
  @Input() secondItemTemplateRef: TemplateRef<any>;

  // Fires event when either of the list changes
  @Output() listChange = new EventEmitter<void>();

  // selectedItems
  selectedIndicesInFirstList: number[] = [];
  selectedIndicesInSecondList: number[] = [];

  moveItemsFromFirstToSecond() {
    const removedItems = filterWithMutation(
      this.firstItemsList,
      (_, index) => !this.selectedIndicesInFirstList.includes(index)
    );

    insertItemsAt(
      this.secondItemsList,
      this.secondItemsList.length,
      ...removedItems
    );
    this.listChange.emit();
  }

  moveItemsFromSecondToFirst() {
    const removedItems = filterWithMutation(
      this.secondItemsList,
      (_, index) => !this.selectedIndicesInSecondList.includes(index)
    );

    insertItemsAt(
      this.firstItemsList,
      this.firstItemsList.length,
      ...removedItems
    );

    this.listChange.emit();
  }

  // Emit after next tick to prevent race condition
  emitListChangeEvent() {
    setTimeout(() => {
      this.listChange.emit();
    });
  }
}
