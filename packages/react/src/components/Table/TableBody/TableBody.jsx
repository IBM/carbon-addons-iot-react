import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'carbon-components-react';
import VisibilitySensor from 'react-visibility-sensor';
import pick from 'lodash/pick';

import {
  ExpandedRowsPropTypes,
  TableRowPropTypes,
  TableColumnsPropTypes,
  RowActionsStatePropTypes,
} from '../TablePropTypes';
import deprecate from '../../../internal/deprecate';

import TableBodyRow from './TableBodyRow/TableBodyRow';

const { TableBody: CarbonTableBody } = DataTable;

/**
 * Use this function to traverse the tree structure of a set of table rows using Depth-first search (DFS)
 * and apply some function on each row. The function is applied once the recursion starts back-tracking.
 * @param rows The root node of your search space, an array of rows.
 * @param functionToApply Any function that should be applied on every row. Params are a row and an optional aggregatorObj.
 * @param aggregatorObj Used as a container to aggregate the result (e.g. a count or needle) if needed.
 */
const tableTraverser = (rows, functionToApply, aggregatorObj) => {
  rows.forEach((row) => {
    if (row.children) {
      tableTraverser(row.children, functionToApply, aggregatorObj);
    }
    functionToApply(row, aggregatorObj);
  });
};

const propTypes = {
  /** The unique id of the table */
  tableId: PropTypes.string.isRequired,
  rows: TableRowPropTypes,
  expandedRows: ExpandedRowsPropTypes,
  columns: TableColumnsPropTypes,
  expandedIds: PropTypes.arrayOf(PropTypes.string),
  selectedIds: PropTypes.arrayOf(PropTypes.string),
  /** internationalized label */
  selectRowAria: PropTypes.string,
  /** internationalized label */
  overflowMenuAria: PropTypes.string,
  /** internationalized label */
  clickToExpandAria: PropTypes.string,
  /** internationalized label */
  clickToCollapseAria: PropTypes.string,
  /** I18N label for in progress */
  inProgressText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** I18N label for action failed */
  actionFailedText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** since some columns might not be currently visible */
  totalColumns: PropTypes.number,
  hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
  hasRowExpansion: PropTypes.bool,
  hasRowNesting: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      /** If the hierarchy only has 1 nested level of children */
      hasSingleNestedHierarchy: PropTypes.bool,
    }),
  ]),
  hasRowActions: PropTypes.bool,
  wrapCellText: PropTypes.oneOf(['always', 'never', 'auto', 'alwaysTruncate']).isRequired,
  truncateCellText: PropTypes.bool.isRequired,
  /** the current state of the row actions */
  rowActionsState: RowActionsStatePropTypes,
  shouldExpandOnRowClick: PropTypes.bool,
  shouldLazyRender: PropTypes.bool,
  locale: PropTypes.string,

  actions: PropTypes.shape({
    onRowSelected: PropTypes.func,
    onRowClicked: PropTypes.func,
    onApplyRowActions: PropTypes.func,
    onRowExpanded: PropTypes.func,
  }).isRequired,
  /** What column ordering is currently applied to the table */
  ordering: PropTypes.arrayOf(
    PropTypes.shape({
      columnId: PropTypes.string.isRequired,
      /* Visibility of column in table, defaults to false */
      isHidden: PropTypes.bool,
    })
  ).isRequired,
  rowEditMode: PropTypes.bool,
  singleRowEditButtons: PropTypes.element,
  /**
   * direction of document
   */
  langDir: PropTypes.oneOf(['ltr', 'rtl']),
  /** shows an additional column that can expand/shrink as the table is resized  */
  showExpanderColumn: PropTypes.bool,
  // TODO: remove deprecated 'testID' in v3
  // eslint-disable-next-line react/require-default-props
  testID: deprecate(
    PropTypes.string,
    `The 'testID' prop has been deprecated. Please use 'testId' instead.`
  ),
  testId: PropTypes.string,
};

const defaultProps = {
  expandedIds: [],
  selectedIds: [],
  selectRowAria: 'Select row',
  overflowMenuAria: 'More actions',
  clickToExpandAria: 'Click to expand.',
  clickToCollapseAria: 'Click to collapse.',
  locale: null,
  rows: [],
  expandedRows: [],
  rowActionsState: [],
  columns: [],
  totalColumns: 0,
  hasRowSelection: false,
  hasRowExpansion: false,
  hasRowNesting: false,
  hasRowActions: false,
  shouldExpandOnRowClick: false,
  shouldLazyRender: false,
  rowEditMode: false,
  singleRowEditButtons: null,
  langDir: 'ltr',
  showExpanderColumn: false,
  testId: '',
};

const TableBody = ({
  tableId,
  rows,
  columns,
  expandedIds,
  expandedRows,
  selectedIds,
  selectRowAria,
  overflowMenuAria,
  clickToExpandAria,
  clickToCollapseAria,
  inProgressText,
  learnMoreText,
  dismissText,
  actionFailedText,
  totalColumns,
  actions,
  rowActionsState,
  hasRowActions,
  hasRowSelection,
  hasRowExpansion,
  hasRowNesting,
  shouldExpandOnRowClick,
  shouldLazyRender,
  ordering,
  wrapCellText,
  truncateCellText,
  locale,
  rowEditMode,
  singleRowEditButtons,
  langDir,
  // TODO: remove deprecated 'testID' in v3
  testID,
  testId,
  showExpanderColumn,
}) => {
  // Need to merge the ordering and the columns since the columns have the renderer function
  const orderingMap = useMemo(
    () =>
      ordering.map((col) => ({
        ...col,
        ...columns.find((column) => column.id === col.columnId),
      })),
    [columns, ordering]
  );

  const findAllAncestorRows = (childId, myRows) => {
    const result = [];
    const applyFunc = (row, ancestors) => {
      const lastChildId = result[result.length - 1]?.id || childId;
      const currentRowIsParent = row.children?.filter((child) => child.id === lastChildId).length;
      if (currentRowIsParent) {
        ancestors.push(row);
      }
    };
    tableTraverser(myRows, applyFunc, result);
    return result;
  };

  const findAllChildRowIds = ({ children = [] }) => {
    const result = [];
    tableTraverser(children, (row, aggr) => aggr.push(row.id), result);
    return result;
  };

  const findRow = (rowId, myRows) => {
    const result = [];
    const applyFunc = (row, aggr) => {
      if (row.id === rowId) {
        aggr.push(row);
      }
    };
    tableTraverser(myRows, applyFunc, result);
    return result[0];
  };

  const updateChildIdSelection = (triggeringRowId, myRows, selection) => {
    const row = findRow(triggeringRowId, myRows);
    const childRowIds = findAllChildRowIds(row);
    const triggeringRowSelected = selection.includes(triggeringRowId);

    return triggeringRowSelected
      ? [...new Set(selection.concat(childRowIds))]
      : selection.filter((id) => !childRowIds.includes(id));
  };

  const updateAncestorSelection = (allAncestorRows, selection) => {
    const newSelection = [...selection];
    allAncestorRows.forEach((ancestorRow) => {
      if (ancestorRow.children.every((child) => newSelection.includes(child.id))) {
        newSelection.push(ancestorRow.id);
      } else if (newSelection.includes(ancestorRow.id)) {
        newSelection.splice(newSelection.indexOf(ancestorRow.id), 1);
      }
    });
    return newSelection;
  };

  const onRowSelected = (rowId, selected) => {
    if (hasRowSelection === 'single') {
      actions.onRowSelected(rowId, selected, selected ? [rowId] : []);
    } else {
      const allAncestorRows = findAllAncestorRows(rowId, rows) || [];
      const withNewSelection = selected
        ? [...selectedIds, rowId]
        : selectedIds.filter((id) => id !== rowId);
      const withUpdatedAncestors = updateAncestorSelection(allAncestorRows, withNewSelection);
      const withUpdatedChildren = updateChildIdSelection(rowId, rows, withUpdatedAncestors);
      actions.onRowSelected(rowId, selected, withUpdatedChildren.sort());
    }
  };

  const getIndeterminateRowSelectionIds = (myRows, mySelectedIds) => {
    const result = [];
    if (hasRowNesting && mySelectedIds.length) {
      const applyFunc = (row, indeterminateList) => {
        const allChildren = findAllChildRowIds(row);
        const allAreSelected = allChildren.every((childId) => mySelectedIds.includes(childId));
        const someAreSelected =
          !allAreSelected && allChildren.some((childId) => mySelectedIds.includes(childId));
        if (someAreSelected) {
          indeterminateList.push(row.id);
        }
      };
      tableTraverser(myRows, applyFunc, result);
    }
    return result;
  };

  const someRowHasSingleRowEditMode = rowActionsState.some((rowAction) => rowAction.isEditMode);
  const indeterminateSelectionIds = getIndeterminateRowSelectionIds(rows, selectedIds);

  const renderRow = (row, nestingLevel = 0) => {
    const isRowExpanded = expandedIds.includes(row.id);
    const shouldShowChildren =
      hasRowNesting && isRowExpanded && row.children && row.children.length > 0;
    const myRowActionState = rowActionsState.find((rowAction) => rowAction.rowId === row.id);
    const rowHasSingleRowEditMode = !!(myRowActionState && myRowActionState.isEditMode);
    const isSelectable = rowEditMode || someRowHasSingleRowEditMode ? false : row.isSelectable;

    const rowElement = (
      <TableBodyRow
        langDir={langDir}
        key={row.id}
        isExpanded={isRowExpanded}
        isSelectable={isSelectable}
        isSelected={selectedIds.includes(row.id)}
        isIndeterminate={indeterminateSelectionIds.includes(row.id)}
        rowEditMode={rowEditMode}
        singleRowEditMode={rowHasSingleRowEditMode}
        singleRowEditButtons={singleRowEditButtons}
        rowDetails={
          isRowExpanded && expandedRows.find((j) => j.rowId === row.id)
            ? expandedRows.find((j) => j.rowId === row.id).content
            : null
        }
        rowActionsError={myRowActionState ? myRowActionState.error : null}
        isRowActionRunning={myRowActionState ? myRowActionState.isRunning : null}
        ordering={orderingMap}
        selectRowAria={selectRowAria}
        overflowMenuAria={overflowMenuAria}
        clickToCollapseAria={clickToCollapseAria}
        clickToExpandAria={clickToExpandAria}
        inProgressText={inProgressText}
        actionFailedText={actionFailedText}
        learnMoreText={learnMoreText}
        dismissText={dismissText}
        columns={columns}
        tableId={tableId}
        id={row.id}
        locale={locale}
        totalColumns={totalColumns}
        options={{
          hasRowSelection,
          hasRowExpansion,
          hasRowNesting,
          hasRowActions,
          shouldExpandOnRowClick,
          wrapCellText,
          truncateCellText,
        }}
        nestingLevel={nestingLevel}
        nestingChildCount={row.children ? row.children.length : 0}
        tableActions={{
          ...pick(actions, 'onApplyRowAction', 'onRowExpanded', 'onRowClicked', 'onClearRowError'),
          onRowSelected,
        }}
        rowActions={row.rowActions}
        values={row.values}
        showExpanderColumn={showExpanderColumn}
      />
    );
    return shouldShowChildren
      ? [rowElement].concat(row.children.map((childRow) => renderRow(childRow, nestingLevel + 1)))
      : rowElement;
  };

  return (
    <CarbonTableBody data-testid={testID || testId}>
      {rows.map((row) => {
        return shouldLazyRender ? (
          <VisibilitySensor
            key={`visibilitysensor-${row.id}`}
            scrollCheck
            partialVisibility
            resizeCheck
          >
            {({ isVisible }) => (isVisible ? renderRow(row) : <tr />)}
          </VisibilitySensor>
        ) : (
          renderRow(row)
        );
      })}
    </CarbonTableBody>
  );
};

TableBody.propTypes = propTypes;
TableBody.defaultProps = defaultProps;

export default TableBody;
