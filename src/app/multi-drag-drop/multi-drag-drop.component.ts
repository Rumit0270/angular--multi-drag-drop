import {
  DragRef,
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
} from '@angular/cdk/drag-drop';

import {
  Input,
  Output,
  Component,
  OnChanges,
  ElementRef,
  TemplateRef,
  ContentChild,
  EventEmitter,
  HostListener,
  SimpleChanges,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { filterWithMutation, insertItemsAt } from 'src/utils/array';

import { ItemSelectionChangeEvent } from '../model';

@Component({
  selector: 'multi-drag-drop',
  templateUrl: './multi-drag-drop.component.html',
  styleUrls: ['./multi-drag-drop.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiDragDropComponent implements OnChanges, AfterViewInit {
  @Input() listId = '';

  // Disable dropping withing the same drop list
  @Input() isSortingDisabled: boolean = true;

  // Input List array
  @Input() items: any[] = [];

  // Default template to be used for rendering items
  // Passed as a child content
  @ContentChild(TemplateRef, { static: false }) templateRef: TemplateRef<any>;

  // Custom template to be used for rendering items
  // Since, each row in a list may have different UI elements
  // pass it from the container component
  @Input() itemTemplateRef: TemplateRef<any>;

  // Emits event when item is removed from droppable list
  @Output() itemsRemoved = new EventEmitter<any[]>();

  // Emits event when item is added to the  droppable list
  @Output() itemsAdded = new EventEmitter<any[]>();

  // Emits event when item is updated in the dropped list
  @Output() itemsUpdated = new EventEmitter<any[]>();

  // Event that gets emitted when the selected items are changed
  @Output() selectionChanged = new EventEmitter<ItemSelectionChangeEvent>();

  // Reference of element being dragged
  private dragRef: DragRef | undefined = undefined;

  // Array that tracks which index items are selected
  private selections: number[] = [];

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { items } = changes;
    const { currentValue, previousValue } = items;

    if (JSON.stringify(currentValue) === JSON.stringify(previousValue)) {
      return;
    }

    this.clearSelections();
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  get isDragging() {
    return !!this.dragRef;
  }

  isSelected(index: number) {
    return this.selections.includes(index);
  }

  get selectedItemsCount() {
    return this.selections.length;
  }

  get selectedItems() {
    // Sorting the indices and returning
    const sortedSelections = [...this.selections].sort();
    return sortedSelections.map((i) => this.items[i]);
  }

  /**
   * Handles that gets called when item is dropped into the list
   */
  itemDroppedInList(event: CdkDragDrop<any[]>) {
    if (!event.isPointerOverContainer) {
      return;
    }

    const isDroppedInSameContainer =
      event.previousContainer === event.container;

    // If an item is moved within a list without selecting
    if (isDroppedInSameContainer && !this.selectedItemsCount) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.itemsUpdated.emit(this.items);
      return;
    }

    const eventData = event.item.data;

    // Item is dropped into same container with selections
    if (isDroppedInSameContainer && this.selectedItemsCount) {
      this.moveItemPositionsInArray(
        this.items,
        event.currentIndex,
        eventData.selectionIndices
      );

      this.itemsUpdated.emit(this.items);
    }

    // Items is dropped into different container
    // So,just add the dropped items at the given index
    if (!isDroppedInSameContainer) {
      insertItemsAt(this.items, event.currentIndex, ...eventData.selectedItems);
      this.itemsAdded.emit(eventData.selectedItems);
    }

    // this.itemsUpdated.emit(this.items);
    this.cdr.detectChanges();
  }

  /**
   * Handler that gets called when an dragging is started for an item
   */
  dragStarted(event: CdkDragStart, index: number) {
    // Detach this view during dragging to prevent performance issue
    this.cdr.detach();

    this.dragRef = event.source._dragRef;

    const selectionIndices = this.selectedItemsCount
      ? this.selections
      : [index];

    const eventData = {
      selectionIndices,
      selectedItems: selectionIndices.map((i) => this.items[i]),
    };

    // Assigning some data to the event source
    // Here, source refers to individual cdkDrag element in list
    // Assigned data will be used in `dragDropped` and `itemDroppedInList` methods
    event.source.data = eventData;
    this.cdr.detectChanges();
  }

  /**
   * Handler that gets called when an dragging is ended for an item
   */
  dragEnded() {
    this.dragRef = undefined;

    // Reattach the detached view
    this.cdr.reattach();
    this.cdr.detectChanges();
  }

  /**
   * Handler that gets called when an item being dragged is dropped.
   * Item may be dropped into any droppable list.
   */
  dragDropped(event: CdkDragDrop<any>) {
    if (!event.isPointerOverContainer) {
      return;
    }

    // Here, event.item refers to the individual cdkDrag element in list
    const eventData = event.item.data;

    if (event.previousContainer !== event.container) {
      // An item is dragged from this container to other drag container
      // So, filter out those items.
      const removedItems = filterWithMutation(
        this.items,
        (_, index) => !eventData.selectionIndices.includes(index)
      );

      this.itemsRemoved.emit(removedItems);
    }

    this.dragRef = undefined;

    // Need to defer clearing selections value.
    // To handle case when multiple items are dragged
    // and dropped into same drag container
    setTimeout(() => this.clearSelections());
  }

  private clearSelections() {
    if (!this.selectedItemsCount) {
      return;
    }

    this.selections = [];
    this.selectionChanged.emit({ selectedItems: [], selectedIndices: [] });
    this.cdr.detectChanges();
  }

  // private selectAllItems() {
  //   if (this.selectedItemsCount === this.items.length) {
  //     return;
  //   }

  //   this.selections = this.items.map((_, index) => index);

  //   this.selectionChanged.emit({
  //     selectedItems: this.items,
  //     selectedIndices: this.selections,
  //   });

  //   this.cdr.detectChanges();
  // }

  // // handles "ctrl/command + a" to select all
  // @HostListener('document:keydown', ['$event'])
  // private handleKeyboardEvent(event: KeyboardEvent) {
  //   // Reset dragging on esc
  //   if (event.key === 'Escape' && this.dragRef) {
  //     // Reset the position of drag element
  //     this.dragRef.reset();

  //     // Remove the focus from the drag element
  //     document.dispatchEvent(new Event('mouseup'));
  //     return;
  //   }

  //   // Select all with CTRL+A
  //   if (
  //     event.key === 'a' &&
  //     (event.ctrlKey || event.metaKey) &&
  //     this.selectedItemsCount &&
  //     document.activeElement.nodeName !== 'INPUT'
  //   ) {
  //     event.preventDefault();
  //     this.selectAllItems();
  //   }
  // }

  // For Clearing out the selected item
  // on clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: PointerEvent) {
    const isClickedOutside = !this.elementRef.nativeElement.contains(
      event.target
    );

    if (this.selectedItemsCount && isClickedOutside) {
      this.clearSelections();
    }
  }

  selectItem(event: MouseEvent, index: number) {
    // CTRL/CMD key
    const isCtrlKey = event.ctrlKey || event.metaKey;

    this.updateSelections(index, isCtrlKey);

    this.selectionChanged.emit({
      selectedItems: this.selectedItems,
      selectedIndices: this.selections,
    });
    this.cdr.detectChanges();
  }

  private updateSelections(index: number, isWithCtrlKey: boolean) {
    const isAlreadySelected = this.isSelected(index);
    const hasMultipleSelectedItems = this.selectedItemsCount > 1;

    // When an mutliple item is selected and then a single item is selected
    if (!isWithCtrlKey && isAlreadySelected && hasMultipleSelectedItems) {
      this.selections = [index];
      return;
    }

    if (!isWithCtrlKey) {
      this.selections = isAlreadySelected ? [] : [index];
      return;
    }

    if (!this.selectedItemsCount) {
      this.selections = [index];
      return;
    }

    if (isAlreadySelected) {
      this.selections = this.selections.filter((i) => i !== index);
      return;
    }

    this.selections.push(index);
  }

  private moveItemPositionsInArray(
    arr: any[],
    currentIndex: number,
    positions: number[]
  ) {
    const movedItems = arr.filter((_, index) => positions.includes(index));

    filterWithMutation(arr, (_, index) => !positions.includes(index));

    // Index where the selected items are inserted
    let insertIndex = currentIndex;

    const movedPositions = [...positions];

    // Need to remove last index because it is already accounted for in currentIndex
    movedPositions.splice(-1, 1);

    // Need to compute new insert index because of multiple select
    // Take the initial current index as base and update it based on
    // number of items selected
    movedPositions.forEach((position) => {
      if (position < insertIndex) {
        insertIndex--;
      }
    });

    insertItemsAt(arr, insertIndex, ...movedItems);
  }
}
