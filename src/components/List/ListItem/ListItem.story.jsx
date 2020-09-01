import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, select, boolean } from '@storybook/addon-knobs';
import { Edit16, Star16, StarFilled16 } from '@carbon/icons-react';

import { Button, OverflowMenu, OverflowMenuItem } from '../../..';
import { Tag } from '../../Tag';

import ListItem from './ListItem';

storiesOf('Watson IoT Experimental/ListItem', module)
  .add('basic w/ knobs', () => {
    const value = text('value', 'List Item');
    const secondaryValue = text('secondaryValue', undefined);
    const iconName = select('icon', ['none', 'Star16', 'StarFilled16']);
    const iconComponent =
      iconName === 'Star16' ? Star16 : iconName === 'StarFilled16' ? StarFilled16 : null;
    const rowActionSet = select('row action example', ['none', 'single', 'multi'], 'none');
    const tagsConfig = select('tags example', ['none', 'single', 'multi'], 'none');

    const rowActionComponent =
      rowActionSet === 'single'
        ? [
            <Button
              key="list-item-edit"
              style={{ color: 'black' }}
              renderIcon={Edit16}
              hasIconOnly
              kind="ghost"
              size="small"
              onClick={() => action('row action clicked')}
              iconDescription="Edit"
            />,
          ]
        : rowActionSet === 'multi'
        ? [
            <OverflowMenu flipped>
              <OverflowMenuItem itemText="Edit" />
              <OverflowMenuItem itemText="Add" />
              <OverflowMenuItem itemText="Delete" hasDivider isDelete />
            </OverflowMenu>,
          ]
        : [];
    const tagsData =
      tagsConfig === 'single'
        ? [
            <Tag type="blue" title="descriptor" key="tag1">
              default
            </Tag>,
          ]
        : tagsConfig === 'multi'
        ? [
            <Tag type="blue" title="descriptor" key="tag1">
              default
            </Tag>,
            <Tag type="red" disabled key="tag2">
              disabled tag
            </Tag>,
          ]
        : undefined;
    return (
      <div style={{ width: 400 }}>
        <ListItem
          id="list-item"
          value={value}
          secondaryValue={secondaryValue}
          icon={iconComponent ? React.createElement(iconComponent) : null}
          iconPosition={select('iconPosition', ['left', 'right'], 'right')}
          isSelectable={boolean('isSelectable', false)}
          selected={boolean('selected', false)}
          onSelect={action('onSelect')}
          isExpandable={boolean('isExpandable', false)}
          expanded={boolean('expanded', false)}
          onExpand={action('onExpand')}
          isCategory={boolean('isCategory', false)}
          isLargeRow={boolean('isLargeRow', false)}
          nestingLevel={select('nestingLevel', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0)}
          rowActions={rowActionComponent}
          tags={tagsData}
        />
      </div>
    );
  })
  .add('with value', () => (
    <div style={{ width: 400 }}>
      <ListItem id="list-item" value="List Item" />
    </div>
  ))
  .add('with secondaryValue', () => (
    <div style={{ width: 400 }}>
      <ListItem id="list-item" value="List Item" secondaryValue="Secondary Value" />
    </div>
  ))
  .add('testing secondaryValue overflow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="List Item this could be a really long value that can't quite fit"
        secondaryValue="Secondary Value could also be a really, extraordinarily long value"
        isLargeRow={boolean('isLargeRow', true)}
      />
    </div>
  ))
  .add('with icon', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="List Item"
        icon={<Star16 />}
        iconPosition={select('iconPosition', ['left', 'right'])}
      />
    </div>
  ))
  .add('with isSelectable', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="Selectable List Item"
        secondaryValue={text('secondaryValue', '')}
        isSelectable
        onSelect={action('onSelect')}
        isLargeRow={boolean('isLargeRow', false)}
      />
    </div>
  ))
  .add('with isLargeRow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="List Item"
        secondaryValue="With isLargeRow, the secondary value serves primarily as a description field for the list item"
        isLargeRow={boolean('isLargeRow', true)}
      />
    </div>
  ))
  .add('testing isLargeRow overflow', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="List Item this could be a reaaaaaaaaaaally really long value"
        secondaryValue="With isLargeRow, the secondary value serves primarily as a description field for the list item.  If the content is too wide for the list item, it will be visible in a tooltip."
        isLargeRow={boolean('isLargeRow', true)}
      />
    </div>
  ))
  .add('with isExpandable', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="Expandable List Item"
        secondaryValue={text('secondaryValue', '')}
        isExpandable
        onExpand={action('onExpand')}
        isLargeRow={boolean('isLargeRow', false)}
      />
    </div>
  ))
  .add('with isCategory', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value="List Item"
        secondaryValue={text('secondaryValue', '')}
        isExpandable
        onExpand={action('onExpand')}
        isCategory
      />
    </div>
  ))
  .add('with single row action', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value={text('value', 'List Item')}
        secondaryValue={text('secondaryValue', 'Secondary Value')}
        rowActions={[
          <Button
            key="list-item-edit"
            style={{ color: 'black' }}
            renderIcon={Edit16}
            hasIconOnly
            kind="ghost"
            size="small"
            onClick={() => action('row action clicked')}
            iconDescription="Edit"
          />,
        ]}
      />
    </div>
  ))
  .add('with OverflowMenu row actions', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value={text('value', 'List Item')}
        isExpandable={boolean('isExpandable', true)}
        onExpand={action('onExpand')}
        rowActions={[
          <OverflowMenu flipped>
            <OverflowMenuItem itemText="Edit" />
            <OverflowMenuItem itemText="Add" />
            <OverflowMenuItem itemText="Delete" />
            <OverflowMenuItem itemText="Danger option" hasDivider isDelete />
          </OverflowMenu>,
        ]}
      />
    </div>
  ))
  .add('with Tags', () => (
    <div style={{ width: 400 }}>
      <ListItem
        id="list-item"
        value={text('value', 'List Item')}
        tags={[
          <Tag type="blue" title="descriptor" key="tag1">
            default
          </Tag>,
          <Tag type="red" disabled key="tag2">
            disabled tag
          </Tag>,
        ]}
      />
    </div>
  ));
