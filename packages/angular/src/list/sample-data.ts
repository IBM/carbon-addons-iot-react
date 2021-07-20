import { AIListItem } from './list-item/ai-list-item.class';

export const simpleListItems = [
  new AIListItem({ value: 'Canada', isSelectable: true }),
  new AIListItem({ value: 'Brazil', isSelectable: true }),
  new AIListItem({ value: 'Columbia', isSelectable: true }),
  new AIListItem({ value: 'United States of America', isSelectable: true }),
  new AIListItem({ value: 'Uruguay', isSelectable: true }),
  new AIListItem({ value: 'Spain', isSelectable: true }),
];

export const largeListItems = [
  new AIListItem({ value: 'Canada', size: 'lg', isDraggable: true, isSelectable: true }),
  new AIListItem({ value: 'Brazil', size: 'lg', isDraggable: true, isSelectable: true }),
  new AIListItem({ value: 'Columbia', size: 'lg', isDraggable: true, isSelectable: true }),
  new AIListItem({
    value: 'United States of America',
    size: 'lg',
    isDraggable: true,
    isSelectable: true,
  }),
  new AIListItem({ value: 'Uruguay', size: 'lg', isDraggable: true, isSelectable: true }),
  new AIListItem({ value: 'Spain', size: 'lg', isDraggable: true, isSelectable: true }),
];

export const nestedDraggableListItems = [
  new AIListItem({
    value: 'Canada',
    isCategory: true,
    expanded: true,
    isSelectable: true,
    isDraggable: true,
    items: [
      new AIListItem({
        value: 'Toronto',
        secondaryValue: '6,254,571',
        isSelectable: true,
        isDraggable: true,
      }),
      new AIListItem({
        value: 'Vancouver',
        secondaryValue: '2,581,000',
        isSelectable: true,
        isDraggable: true,
      }),
    ],
  }),
  new AIListItem({
    value: 'Brazil',
    isSelectable: true,
    expanded: true,
    isCategory: true,
    isDraggable: true,
    items: [
      new AIListItem({
        value: 'São Paulo',
        secondaryValue: '12,325,232',
        isSelectable: true,
        isDraggable: true,
      }),
      new AIListItem({
        value: 'Rio de Janeiro',
        isSelectable: true,
        secondaryValue: '6,747,815',
        isDraggable: true,
      }),
    ],
  }),
  new AIListItem({
    value: 'Columbia',
    isSelectable: true,
    expanded: true,
    isCategory: true,
    isDraggable: true,
    items: [
      new AIListItem({
        value: 'Bogotá',
        secondaryValue: '8,181,047',
        isSelectable: true,
        isDraggable: true,
      }),
      new AIListItem({
        value: 'Leticia',
        secondaryValue: '42,280',
        isSelectable: true,
        isDraggable: true,
      }),
    ],
  }),
  new AIListItem({
    value: 'United States of America',
    disabled: true,
    isSelectable: true,
    expanded: true,
    isCategory: true,
    isDraggable: true,
    items: [
      new AIListItem({
        value: 'Chicago',
        secondaryValue: '2,677,643',
        disabled: true,
        isSelectable: true,
        isDraggable: true,
      }),
      new AIListItem({
        value: 'Los Angeles',
        secondaryValue: '3,970,219',
        isSelectable: true,
        isDraggable: true,
      }),
    ],
  }),
  new AIListItem({
    value: 'Uruguay',
    isSelectable: true,
    expanded: true,
    isCategory: true,
    isDraggable: true,
    items: [
      new AIListItem({
        value: 'Montevideo',
        secondaryValue: '1,319,108',
        isSelectable: true,
        isDraggable: true,
      }),
      new AIListItem({
        value: 'Salto',
        secondaryValue: '104,028',
        isSelectable: true,
        isDraggable: true,
      }),
    ],
  }),
];
