import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ai-list-header',
  template: `
    <div class="iot--list-header-container">
      <div class="iot--list-header">
        <div class="iot--list-header--title">
          {{ title }}
        </div>
      </div>
      <div *ngIf="hasSearch" class="iot--list-header--search">
        <ibm-search
          placeholder="search"
          (valueChange)="onSearch.emit($event)"
          (clear)="onSearch.emit('')"
        >
        </ibm-search>
      </div>
    </div>
  `,
})
export class AIListHeaderComponent {
  /**
   * Title to be displayed on the list header.
   */
  @Input() title: string;

  /**
   * Indicates whether a search bar should be rendered in the list header.
   */
  @Input() hasSearch = false;

  /**
   * If a `hasSearch` is true, this is emitted when search value is changed.
   */
  @Output() onSearch = new EventEmitter<any>();
}
