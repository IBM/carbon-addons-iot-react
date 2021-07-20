import { Component, Input, ViewEncapsulation } from '@angular/core';

import { TableHead } from 'carbon-components-angular';

/**
 * A subcomponent that creates the thead of the table
 *
 * Example
 *
 * ```html
 * 	<thead aiTableHead [model]="model"></thead>
 * ```
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[aiTableHead]',
  template: `
    <ng-container *ngIf="model">
      <tr *ngFor="let headerRow of model.header; let rowIndex = index" class="table-row">
        <th ibmTableHeadExpand *ngIf="model.hasExpandableRows()" [id]="model.getId('expand')"></th>
        <th
          ibmTableHeadCheckbox
          *ngIf="!skeleton && showSelectionColumn && rowIndex === 0"
          class="table-selection-column"
          [checked]="selectAllCheckbox"
          [indeterminate]="selectAllCheckboxSomeSelected"
          [ariaLabel]="getCheckboxHeaderLabel()"
          [size]="size"
          [skeleton]="skeleton"
          [attr.rowspan]="model.header.length"
          [id]="model.getId('select')"
          (change)="onSelectAllCheckboxChange()"
        ></th>

        <ng-container *ngFor="let column of headerRow; let i = index">
          <th
            aiTableHeadCell
            *ngIf="column && column.visible"
            [id]="model.getId(i, rowIndex)"
            [headers]="rowIndex > 0 ? model.getHeaderId(i, column.colSpan) : ''"
            [column]="column"
            [attr.colspan]="column.colSpan"
            [attr.rowspan]="column.rowSpan"
            [filterTitle]="getFilterTitle()"
            (sort)="sort.emit(i)"
            [class]="column.className"
            [skeleton]="skeleton"
            [ngStyle]="column.style"
          ></th>
        </ng-container>
        <th
          *ngIf="!skeleton && stickyHeader"
          [ngStyle]="{ width: scrollbarWidth + 'px', padding: 0, border: 0 }"
        >
          <!--
					Scrollbar pushes body to the left so this header column is added to push
					the title bar the same amount and keep the header and body columns aligned.
				--></th>
      </tr>
    </ng-container>
    <ng-content></ng-content>
  `,
  styleUrls: ['./table-head.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AITableHeadComponent extends TableHead {
  @Input() model: any;
}
