import React from 'react';
import { mount } from 'enzyme';

import { settings } from '../../../constants/Settings';

import TableHead from './TableHead';
import TableHeader from './TableHeader';

const { iotPrefix } = settings;

const commonTableHeadProps = {
  /** List of columns */
  columns: [
    { id: 'col1', name: 'Column 1', isSortable: false },
    { id: 'col2', name: 'Column 2', isSortable: false },
    { id: 'col3', name: 'Column 3', isSortable: true, align: 'start' },
  ],
  tableState: {
    selection: {},
    sort: {
      columnId: 'col3',
      direction: 'ASC',
    },
    ordering: [
      { columnId: 'col1', isHidden: false },
      { columnId: 'col2', isHidden: false },
      { columnId: 'col3', isHidden: false },
    ],
  },
  actions: { onChangeOrdering: jest.fn() },
};

describe('TableHead', () => {
  test('columns should render', () => {
    const wrapper = mount(<TableHead {...commonTableHeadProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(3);
  });

  test('columns should render extra column for multi select', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowExpansion: true,
        hasRowSelection: 'multi',
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(4);
  });

  test('hasRowActions flag creates empty TableHeader', () => {
    const myProps = {
      ...commonTableHeadProps,
      options: {
        hasRowActions: true,
      },
    };
    const wrapper = mount(<TableHead {...myProps} />);
    const emptyTableHeader = wrapper.find('TableHeader .bx--table-header-label').last();
    expect(emptyTableHeader).toEqual({});
  });

  test('make sure data-column is set for width', () => {
    const myProps = { ...commonTableHeadProps };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('th[data-column="col1"]');
    expect(tableHeaders).toHaveLength(1);
  });

  test('activeBar set to "filter" shows FilterHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'filter';
    let wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeTruthy();

    delete myProps.tableState.activeBar;
    wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('FilterHeaderRow')).toBeFalsy();
  });

  test('activeBar set to "column" shows ColumnHeaderRow', () => {
    const myProps = { ...commonTableHeadProps, tableState: { ...commonTableHeadProps.tableState } };
    myProps.tableState.activeBar = 'column';
    const wrapper = mount(<TableHead {...myProps} />);
    expect(wrapper.exists('ColumnHeaderRow')).toBeTruthy();
  });

  test('check has resize if has resize is true ', () => {
    const myProps = { ...commonTableHeadProps, options: { hasResize: true } };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(`div.${iotPrefix}--column-resize-handle`);
    tableHeaders.first().simulate('click');
    expect(tableHeaders).toHaveLength(2);
  });

  test('check not resize if has resize is false ', () => {
    const myProps = { ...commonTableHeadProps, options: { hasResize: false } };
    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find('div.column-resize-handle');
    expect(tableHeaders).toHaveLength(0);
  });

  test('check hidden item is not shown ', () => {
    const myProps = {
      ...commonTableHeadProps,
      tableState: {
        ...commonTableHeadProps.tableState,
        ordering: [
          { columnId: 'col1', isHidden: false },
          { columnId: 'col2', isHidden: false },
          { columnId: 'col3', isHidden: true },
        ],
      },
      hasResize: false,
    };

    const wrapper = mount(<TableHead {...myProps} />);
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(2);
  });

  test('header renders with resizing columns when columns are empty on initial render', () => {
    const wrapper = mount(
      <TableHead
        columns={[]}
        tableState={{
          filters: [],
          expandedIds: [],
          isSelectAllSelected: false,
          selectedIds: [],
          rowActions: [],
          sort: {},
          ordering: [],
          loadingState: { rowCount: 5 },
          selection: { isSelectAllSelected: false },
        }}
        actions={{ onColumnResize: jest.fn() }}
        options={{ hasResize: true }}
      />
    );
    const tableHeaders = wrapper.find(TableHeader);
    expect(tableHeaders).toHaveLength(0);
    // trigger a re-render with non-empty columns
    wrapper.setProps({ ...commonTableHeadProps, options: { hasResize: true } });
    // sync enzyme component tree with the updated dom
    wrapper.update();
    const tableHeaderResizeHandles = wrapper.find(`div.${iotPrefix}--column-resize-handle`);
    tableHeaderResizeHandles.first().simulate('mouseDown');
    tableHeaderResizeHandles.first().simulate('mouseMove');
    tableHeaderResizeHandles.first().simulate('mouseUp');
    expect(tableHeaderResizeHandles).toHaveLength(2);
  });
});
