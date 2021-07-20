import { Component } from '@angular/core';
import { AIListItem } from '../list-item/ai-list-item.class';

class CustomAIListItem extends AIListItem {
  constructor(rawData: any) {
    super(rawData);
  }

  includes(searchString: string) {
    return (
      (this.secondaryValue !== undefined &&
        this.secondaryValue !== null &&
        this.secondaryValue.includes(searchString)) ||
      this.items.some((listItem) => listItem.includes(searchString))
    );
  }
}

const items = [
  new CustomAIListItem({ value: 'Canada', secondaryValue: 'Search token 1', isSelectable: true }),
  new CustomAIListItem({ value: 'Brazil', secondaryValue: 'Search token 2', isSelectable: true }),
  new CustomAIListItem({ value: 'Columbia', secondaryValue: 'Search token 3', isSelectable: true }),
  new CustomAIListItem({
    value: 'United States of America',
    secondaryValue: 'Search token 4',
    isSelectable: true,
  }),
  new CustomAIListItem({ value: 'Uruguay', secondaryValue: 'Search token 5', isSelectable: true }),
  new CustomAIListItem({ value: 'Spain', secondaryValue: 'Search token 6', isSelectable: true }),
];

@Component({
  selector: 'app-custom-list',
  template: `
    <ai-list [items]="items" [hasSearch]="true" title="Search secondary values"> </ai-list>
  `,
})
export class AppCustomList {
  items = items;
}
