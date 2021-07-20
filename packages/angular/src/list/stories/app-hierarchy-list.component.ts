import { AfterViewInit, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { AIListItem } from '../list-item/ai-list-item.class';

@Component({
  selector: 'app-hierarchy-list',
  template: `
    <div style="display: flex">
      <div style="width: 400px; height: 600px">
        <ai-list
          [items]="items"
          selectionType="multi"
          title="City Populations"
          [hasSearch]="true"
          [itemsDraggable]="true"
        >
        </ai-list>
      </div>
      <div style="margin-left: 100px">
        <p>Selected item: {{ selectedItemValue }}</p>
        <p>Selected danger item: {{ dangerValue }}</p>
      </div>
    </div>

    <ng-template #rowActions let-data>
      <ibm-overflow-menu placement="bottom" [flip]="true" [offset]="{ x: 4, y: -4 }">
        <ibm-overflow-menu-option (click)="data.select()">Select</ibm-overflow-menu-option>
        <ibm-overflow-menu-option disabled="true" [divider]="true">
          Disabled
        </ibm-overflow-menu-option>
        <ibm-overflow-menu-option type="danger" (click)="data.selectDanger()">
          Danger option
        </ibm-overflow-menu-option>
      </ibm-overflow-menu>
    </ng-template>
    <ibm-placeholder></ibm-placeholder>
  `,
})
export class AppHierarchyList implements AfterViewInit {
  @Input() items: AIListItem[];

  selectedItemValue = '';
  dangerValue = '';

  @ViewChild('rowActions') rowActions: TemplateRef<any>;

  addRowActions(items: AIListItem[]) {
    items.forEach((item: AIListItem) => {
      if (item.hasChildren()) {
        this.addRowActions(item.items);
      }

      if (!item.isCategory) {
        item.rowActions = this.rowActions;
        item.rowActionsContext = {
          $implicit: {
            select: () => {
              this.selectedItemValue = item.value;
            },
            selectDanger: () => {
              this.dangerValue = item.value;
            },
          },
        };
      }
    });
  }

  ngAfterViewInit() {
    this.addRowActions(this.items);
  }
}
