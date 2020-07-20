import React from 'react';
import { storiesOf } from '@storybook/react';
import { actions } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import { DataTable } from 'carbon-components-react';
import { Add32, Edit16, Stop16, TrashCan16 } from '@carbon/icons-react';

import TableBodyRow from './TableBodyRow';

const { Table, TableContainer, TableBody } = DataTable;

const tableBodyRowProps = {
  ordering: [{ columnId: 'string' }],
  columns: [{ id: 'string', name: 'String' }],
  id: 'rowId',
  tableId: 'tableId',
  totalColumns: 1,
  values: { string: 'My String' },
  tableActions: actions(
    'onRowSelected',
    'onRowClicked',
    'onApplyRowAction',
    'onRowExpanded',
    'onClearRowError'
  ),
  options: {
    wrapCellText: 'never',
    truncateCellText: false,
  },
};

const TableDecorator = storyFn => (
  <TableContainer>
    <Table>
      <TableBody>{storyFn()}</TableBody>
    </Table>
  </TableContainer>
);
storiesOf('Watson IoT/TableBodyRow', module)
  // Table rows need to be rendered in a tbody or else they'll throw an error
  .addDecorator(TableDecorator)
  .add('normal', () => <TableBodyRow {...tableBodyRowProps} />)
  .add('row actions', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      isExpanded={boolean('isExpanded', false)}
      rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
      options={{ ...tableBodyRowProps.options, hasRowActions: true, hasRowExpansion: true }}
    />
  ))
  .add('row actions with overflow', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      isExpanded={boolean('isExpanded', false)}
      rowActions={[
        { id: 'add', renderIcon: Add32, iconDescription: 'Add' },
        { id: 'edit', renderIcon: Edit16, isOverflow: true, labelText: 'Edit' },
        {
          id: 'test1',
          renderIcon: Stop16,
          isOverflow: true,
          labelText: 'Test 1',
          hasDivider: true,
        },
        { id: 'test2', renderIcon: Stop16, isOverflow: true, labelText: 'Test 2' },
        { id: 'test3', renderIcon: Stop16, isOverflow: true, labelText: 'Test 3' },
        {
          id: 'delete',
          renderIcon: TrashCan16,
          isOverflow: true,
          labelText: 'Delete',
          isDelete: true,
        },
      ]}
      options={{ ...tableBodyRowProps.options, hasRowActions: true, hasRowExpansion: true }}
    />
  ))
  .add('is not selectable', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      isSelectable={boolean('isSelectable', false)}
      rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
      options={{ ...tableBodyRowProps.options, hasRowActions: true, hasRowSelection: 'multi' }}
    />
  ))
  .add('is selectable', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
      options={{ ...tableBodyRowProps.options, hasRowActions: true, hasRowSelection: 'multi' }}
    />
  ))
  .add('rowActions running', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
      options={{ ...tableBodyRowProps.options, hasRowActions: true, hasRowExpansion: true }}
      isRowActionRunning
      isExpanded={boolean('isExpanded', false)}
    />
  ))
  .add('rowActions error', () => (
    <TableBodyRow
      {...tableBodyRowProps}
      rowActions={[{ id: 'add', renderIcon: Add32, iconDescription: 'Add' }]}
      options={{ ...tableBodyRowProps.options, hasRowActions: true, hasRowExpansion: true }}
      rowActionsError={{
        title: 'Import failed:',
        message: 'Model type not currently supported.',
        learnMoreURL: 'http://www.cnn.com',
      }}
      isExpanded={boolean('isExpanded', false)}
    />
  ));
