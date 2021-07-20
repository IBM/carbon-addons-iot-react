import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { AIListItem } from './list-item/ai-list-item.class';
import { IconService } from 'carbon-components-angular';
import { Bee32 } from '@carbon/icons';

export enum SelectionType {
  SINGLE = 'single',
  MULTI = 'multi',
}

@Component({
  selector: 'ai-list',
  template: `
    <div class="iot--list" [ngClass]="{ 'iot--list__full-height': isFullHeight }">
      <ai-list-header [hasSearch]="hasSearch" [title]="title" (onSearch)="handleSearch($event)">
      </ai-list-header>
      <div
        class="iot--list--content"
        [ngClass]="{ 'iot--list--content__full-height': isFullHeight }"
      >
        <ng-container
          *ngIf="items && items.length > 0"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: items,
              nestingLevel: 0,
              parentItem: null,
              index: 0
            }
          }"
        >
        </ng-container>
        <div
          *ngIf="!items || items.length < 1"
          class="iot--list--empty-state iot--list--empty-state__full-height"
        >
          <ng-container *ngIf="!isTemplate(emptyState)">
            <svg ibmIcon="bee" size="32"></svg>
            <p>{{ emptyState }}</p>
          </ng-container>
          <ng-container
            *ngIf="isTemplate(emptyState)"
            #customTemplate
            [ngTemplateOutlet]="emptyState"
          >
          </ng-container>
        </div>
      </div>
    </div>

    <ng-template #listItemTemplateRef let-data>
      <!-- Render item -->
      <ng-container *ngIf="data.item.id && !isArray(data.item) && data.item.includes(searchString)">
        <ai-list-item-wrapper
          [draggable]="itemsDraggable && data.item.isDraggable"
          [disabled]="data.item.disabled"
          [size]="data.item.size"
          [isDragging]="draggingState.isDragging"
          (dragStart)="
            setDraggingState({ isDragging: true, item: data.item, parent: data.parentItem })
          "
          (dragEnd)="setDraggingState({ isDragging: false, item: null, parent: null })"
          (droppedAbove)="handleDrop(data.parentItem, data.index)"
          (droppedBelow)="handleDrop(data.parentItem, data.index + 1)"
          (droppedNested)="handleDrop(data.item, 0)"
        >
          <ai-list-item
            [item]="data.item"
            [nestingLevel]="data.item.hasChildren() ? data.nestingLevel - 1 : data.nestingLevel"
            (itemSelected)="handleSelect(data.item)"
            [selectionType]="selectionType"
            [draggable]="itemsDraggable"
          >
          </ai-list-item>
        </ai-list-item-wrapper>
      </ng-container>

      <!-- Item has children -->
      <ng-container *ngIf="!isArray(data.item) && data.item.hasChildren() && data.item.expanded">
        <ng-container
          *ngFor="let item of data.item.items; index as i"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: item,
              nestingLevel: getAdjustedNestingLevel(data.item.items, data.nestingLevel),
              parentItem: data.item,
              index: i
            }
          }"
        ></ng-container>
      </ng-container>

      <!-- Top level item -->
      <ng-container *ngIf="isArray(data.item)">
        <ng-container
          *ngFor="let item of data.item; index as i"
          [ngTemplateOutlet]="listItemTemplateRef"
          [ngTemplateOutletContext]="{
            $implicit: {
              item: item,
              nestingLevel: getAdjustedNestingLevel(data.item, data.nestingLevel),
              parentItem: null,
              index: i
            }
          }"
        >
        </ng-container>
      </ng-container>
    </ng-template>
  `,
})
export class AIListComponent implements OnInit {
  @Input() items: AIListItem[];

  @Input() selectionType: SelectionType;

  /**
   * Indicates whether or not items in the list can be dragged into new positions.
   */
  @Input() itemsDraggable: boolean;

  /**
   * Indicates whether a search bar should be rendered in the list header.
   */
  @Input() hasSearch = false;

  /**
   * Title to be displayed on the list header.
   */
  @Input() title: string;

  @Input() isFullHeight = false;

  @Input() emptyState: string | TemplateRef<any> = 'No list items to show';

  /**
   * If a `hasSearch` is true, this is emitted when search value is changed.
   */
  @Output() onSearch = new EventEmitter<string>();

  searchString = '';

  draggingState = { isDragging: false, item: null, parent: null };

  constructor(protected iconService: IconService) {}

  ngOnInit() {
    this.iconService.register(Bee32);
  }

  setDraggingState(data: any) {
    this.draggingState = Object.assign({}, this.draggingState, data);
  }

  handleDrop(receiver: AIListItem, index: number) {
    // Don't allow list items to be dropped as one of its own children, and also
    // don't allow list items to be dropped on itself.
    if (
      !this.draggingState.item.hasItem(receiver) &&
      (receiver === null || receiver.id !== this.draggingState.item.id)
    ) {
      // Remove the `draggedItem` from its original position.
      // If `draggedItemParent` is null it means `draggedItem` is a top level list item.
      if (this.draggingState.parent === null) {
        const droppedItemIndex = this.items.findIndex(
          (item: AIListItem) => item.id === this.draggingState.item.id
        );
        this.items.splice(droppedItemIndex, 1);
      } else {
        this.draggingState.parent.removeItem(this.draggingState.item);
      }

      // Place `draggedItem` as a child of `receivingItem` at the given `index`.
      // If `receiver` is null it means put `draggedItem` as a top level list item.
      if (receiver === null) {
        this.items.splice(index, 0, this.draggingState.item);
      } else {
        receiver.addItem(this.draggingState.item, index);
      }
    }
    this.setDraggingState({ isDragging: false, item: null, parent: null });
  }

  handleSelect(selectedItem: AIListItem) {
    if (this.selectionType === SelectionType.MULTI) {
      this.updateChildSelectedStates(selectedItem);
      this.updateParentSelectedStates(this.items);
    } else {
      this.onSingleSelect(this.items, selectedItem.id);
    }
  }

  handleSearch(searchString: string) {
    this.searchString = searchString;
    this.onSearch.emit(searchString);
  }

  /**
   * This function returns the adjusted `nestingLevel`s of an AIListItem.
   */
  getAdjustedNestingLevel(items: AIListItem[], currentDepth: number) {
    return items.some((item) => item.hasChildren()) ? currentDepth + 1 : currentDepth;
  }

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  public isTemplate(value: any) {
    return value instanceof TemplateRef;
  }

  protected updateChildSelectedStates(selectedItem: AIListItem) {
    if (selectedItem.hasChildren()) {
      selectedItem.items.forEach((item: AIListItem) => {
        if (!item.disabled) {
          item.select(selectedItem.selected);
        }
        this.updateChildSelectedStates(item);
      });
    }
  }

  protected updateParentSelectedStates(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (item.hasChildren()) {
        this.updateParentSelectedStates(item.items);
      } else {
        return;
      }

      if (item.isSelectable && item.allChildrenSelected()) {
        item.select();
        item.setIndeterminate(false);
      } else if (item.isSelectable && item.someChildrenSelected()) {
        item.select();
        item.setIndeterminate();
      } else {
        if (!item.items.every((listItem) => listItem.disabled)) {
          item.select(false);
        }
        item.setIndeterminate(false);
      }
    });
  }

  protected onSingleSelect(items: AIListItem[], selectedId: string) {
    items.forEach((item: AIListItem) => {
      if (item.id !== selectedId) {
        item.select(false);
      }

      if (item.hasChildren()) {
        this.onSingleSelect(item.items, selectedId);
      }
    });
  }
}
