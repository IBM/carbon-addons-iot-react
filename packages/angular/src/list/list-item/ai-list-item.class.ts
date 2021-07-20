import { TemplateRef } from '@angular/core';

export class AIListItem {
  /**
   * Variable used for creating unique ids for ListItems.
   */
  static listItemCount = 0;

  /**
   * Unique identifier for the list item.
   */
  id = `list-item-${AIListItem.listItemCount++}`;

  /**
   * Primary content to be displayed in the list item.
   */
  value = '';

  /**
   * Indicates whether or not a list item's displayed value should be bolded.
   */
  isCategory = false;

  /**
   * Secondary value to be displayed in the list item.
   */
  secondaryValue?: string;

  /**
   * This contains an optional row action that can be rendered in the list item.
   */
  rowActions?: TemplateRef<any>;

  rowActionsContext?: any;

  /**
   * If the list item has child list items, this indicates whether or not it's
   * direct children are displayed.
   */
  expanded = false;

  /**
   * Indicates whether or not the list item can be selected.
   */
  isSelectable = false;

  /**
   * Indicates whether or not the item is selected.
   */
  selected = false;

  disabled = false;

  /**
   * Indicates whether or not the list item is in an indeterminate state.
   */
  indeterminate = false;

  /**
   * Optional nested items.
   */
  items: AIListItem[] = [];

  size: 'md' | 'lg' = 'md';

  /**
   * Indicates whether or not the item can be dragged into a different position.
   */
  isDraggable = false;

  constructor(rawData?: any) {
    Object.assign(this, {}, rawData);
  }

  /**
   * This method returns `true` if `searchString` is a substring of `value`
   * or `secondaryValue` of this list item or any of its children.
   * This method may be overridden to achieve a custom search.
   *
   * For example, if I want `ai-list` to only filter based on secondary
   * values and have case matter, I can create a custom `AIListItem`:
   *
   * class CustomAIListItem extends AIListItem {
   *   constructor(rawData: any) {
   *     super(rawData);
   *   }
   *
   *   includes(searchString: string) {
   *     return this.secondaryValue.includes(searchString) || this.items.some((listItem) => listItem.includes(searchString));
   *   }
   * }
   *
   * Then instead of passing in an array of `AIListItem`s into `ai-list`,
   * you can pass in an array of `CustomAIListItem`s and if you have the
   * search bar turned on, it will filter out items based on your custom
   * `includes` method.
   */
  includes(searchString: string) {
    return (
      this.value.toLowerCase().includes(searchString.toLowerCase()) ||
      (this.secondaryValue !== undefined &&
        this.secondaryValue !== null &&
        this.secondaryValue.toLowerCase().includes(searchString.toLowerCase())) ||
      this.items.some((listItem) => listItem.includes(searchString))
    );
  }

  expand(expanded = true) {
    this.expanded = expanded;
  }

  select(selected = true) {
    this.selected = selected;
  }

  setIndeterminate(indeterminate = true) {
    this.indeterminate = indeterminate;
  }

  disable(disabled = true) {
    this.disabled = disabled;
  }

  addItem(listItem: AIListItem, index: number) {
    this.items.splice(index, 0, listItem);
  }

  removeItem(listItem: AIListItem) {
    const removeIndex = this.items.findIndex((item: AIListItem) => item.id === listItem.id);
    if (removeIndex >= 0) {
      this.items.splice(removeIndex, 1);
    }
  }

  hasItem(item: AIListItem) {
    if (item === undefined || item === null) {
      return false;
    }

    return this.id === item.id || this.items.some((listItem) => listItem.hasItem(item));
  }

  hasChildren() {
    return this.items && this.items.length > 0;
  }

  someChildrenSelected() {
    return this.items.some((item: AIListItem) => (item.isSelectable ? item.selected : false));
  }

  allChildrenSelected() {
    return this.items.every((item: AIListItem) => (item.isSelectable ? item.selected : true));
  }
}
