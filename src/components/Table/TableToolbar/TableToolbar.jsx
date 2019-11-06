import React from 'react';
import PropTypes from 'prop-types';
import IconColumnSelector from '@carbon/icons-react/lib/column/20';
import IconFilter from '@carbon/icons-react/lib/filter/20';
import { DataTable, Button } from 'carbon-components-react';
import styled from 'styled-components';
import { sortStates } from 'carbon-components-react/lib/components/DataTable/state/sorting';

import { TableSearchPropTypes } from '../TablePropTypes';
// import { COLORS } from '../../../styles/styles';

const {
  TableToolbar: CarbonTableToolbar,
  TableToolbarContent,
  // TableToolbarAction,
  TableBatchActions,
  TableBatchAction,
  TableToolbarSearch,
} = DataTable;

const ToolbarSVGWrapper = styled.button`
  &&& {
    background: transparent;
    border: none;
    display: flex;
    cursor: pointer;
    height: 3rem;
    width: 3rem;
    padding: 1rem;
    outline: 2px solid transparent;

    :hover {
      background: #e5e5e5;
    }

    &:active,
    &:focus {
      outline: 2px solid #0062ff;
      outline-offset: -2px;
    }
  }
`;

const StyledToolbarSearch = styled(TableToolbarSearch)`
  &&& {
    flex-grow: 2;
  }
`;

const StyledCarbonTableToolbar = styled(CarbonTableToolbar)`
  &&& {
    width: 100%;
    padding-top: 0.125rem;
  }
`;

// Need to save one px on the right for the focus
const StyledTableToolbarContent = styled(TableToolbarContent)`
  &&& {
    flex: 1;
    font-size: 0.875rem;
  }
`;

const StyledTableBatchActions = styled(TableBatchActions)`
  z-index: 3;

  & + .bx--toolbar-action {
    padding: 0;
  }
`;

const ToolBarResultLabel = styled.label`
  &&& {
    display: flex;
    position: relative;
    height: 3rem;
    padding: 1rem;
  }
`;
const propTypes = {
  /** id of table */
  tableId: PropTypes.string.isRequired,
  /** global table options */
  options: PropTypes.shape({
    hasFilter: PropTypes.bool,
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasRowCount: PropTypes.bool,
  }).isRequired,

  /** internationalized labels */
  i18n: PropTypes.shape({
    clearAllFilters: PropTypes.string,
    columnSelectionButtonAria: PropTypes.string,
    filterButtonAria: PropTypes.string,
    searchLabel: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    batchCancel: PropTypes.string,
    itemsSelected: PropTypes.string,
    itemSelected: PropTypes.string,
    filterNone: PropTypes.string,
    filterAscending: PropTypes.string,
    filterDescending: PropTypes.string,
    rowCountLabel: PropTypes.string,
  }),
  /**
   * Action callbacks to update tableState
   */
  actions: PropTypes.shape({
    onCancelBatchAction: PropTypes.func,
    onApplyBatchAction: PropTypes.func,
    onClearAllFilters: PropTypes.func,
    onToggleColumnSelection: PropTypes.func,
    onToggleFilter: PropTypes.func,
  }).isRequired,
  /**
   * Inbound tableState
   */
  tableState: PropTypes.shape({
    /** is the toolbar currently disabled */
    isDisabled: PropTypes.bool,
    /** Which toolbar is currently active */
    activeBar: PropTypes.oneOf(['column', 'filter']),
    /** total number of selected rows */
    totalSelected: PropTypes.number,
    /** row selection option */
    hasRowSelection: PropTypes.oneOf(['multi', 'single', false]),
    /** optional content to render inside the toolbar  */
    customToolbarContent: PropTypes.node,
    /** available batch actions */
    batchActions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        labelText: PropTypes.string.isRequired,
        icon: PropTypes.node,
        iconDescription: PropTypes.string,
      })
    ),
    search: TableSearchPropTypes,
  }).isRequired,
};

const defaultProps = {
  i18n: {
    clearAllFilters: 'Clear all filters',
    columnSelectionButtonAria: 'Column selection',
    filterButtonAria: 'Filter',
    searchLabel: 'Search',
    searchPlaceholder: 'Search',
    batchCancel: 'Cancel',
    itemsSelected: 'items selected',
    itemSelected: 'item selected',
    filterNone: 'Unsort rows by this header',
    filterAscending: 'Sort rows by this header in ascending order',
    filterDescending: 'Sort rows by this header in descending order',
    rowCountLabel: 'Results',
  },
};

const translateWithId = (i18n, id, state) => {
  const { batchCancel, itemsSelected, itemSelected } = i18n;
  switch (id) {
    case 'carbon.table.batch.cancel':
      return batchCancel;
    case 'carbon.table.batch.items.selected':
      return `${state.totalSelected} ${itemsSelected}`;
    case 'carbon.table.batch.item.selected':
      return `${state.totalSelected} ${itemSelected}`;
    case 'carbon.table.toolbar.search.label':
      return i18n.searchLabel;
    case 'carbon.table.toolbar.search.placeholder':
      return i18n.searchPlaceholder;
    case 'carbon.table.header.icon.description':
      if (state.isSortHeader) {
        // When transitioning, we know that the sequence of states is as follows:
        // NONE -> ASC -> DESC -> NONE
        if (state.sortDirection === sortStates.NONE) {
          return i18n.filterAscending;
        }
        if (state.sortDirection === sortStates.ASC) {
          return i18n.filterDescending;
        }

        return i18n.filterNone;
      }
      return i18n.filterAscending;
    default:
      return '';
  }
};

const TableToolbar = ({
  tableId,
  className,
  i18n,
  options: { hasColumnSelection, hasFilter, hasSearch, hasRowSelection, hasRowCount },
  actions: {
    onCancelBatchAction,
    onApplyBatchAction,
    onClearAllFilters,
    onToggleColumnSelection,
    onToggleFilter,
    onApplySearch,
  },
  tableState: {
    totalSelected,
    totalFilters,
    batchActions,
    search,
    // activeBar,
    customToolbarContent,
    isDisabled,
    totalItemsCount,
  },
}) => (
  <StyledCarbonTableToolbar className={className}>
    <StyledTableBatchActions
      onCancel={onCancelBatchAction}
      shouldShowBatchActions={hasRowSelection === 'multi' && totalSelected > 0}
      totalSelected={totalSelected}
      translateWithId={(...args) => translateWithId(i18n, ...args)}
    >
      {batchActions.map(({ id, labelText, ...others }) => (
        <TableBatchAction key={id} onClick={() => onApplyBatchAction(id)} {...others}>
          {labelText}
        </TableBatchAction>
      ))}
    </StyledTableBatchActions>
    {hasRowCount ? (
      <ToolBarResultLabel>
        {i18n.rowCountLabel}: {totalItemsCount}
      </ToolBarResultLabel>
    ) : null}

    <StyledTableToolbarContent>
      {hasSearch ? (
        <StyledToolbarSearch
          {...search}
          translateWithId={(...args) => translateWithId(i18n, ...args)}
          id={`${tableId}-toolbar-search`}
          onChange={event => onApplySearch(event.currentTarget ? event.currentTarget.value : '')}
          disabled={isDisabled}
        />
      ) : null}
      {customToolbarContent || null}
      {totalFilters > 0 ? (
        <Button kind="secondary" onClick={onClearAllFilters}>
          {i18n.clearAllFilters}
        </Button>
      ) : null}
      {hasColumnSelection ? (
        <ToolbarSVGWrapper onClick={onToggleColumnSelection}>
          <IconColumnSelector description={i18n.columnSelectionButtonAria} />
        </ToolbarSVGWrapper>
      ) : null}
      {hasFilter ? (
        <ToolbarSVGWrapper onClick={onToggleFilter}>
          <IconFilter description={i18n.filterButtonAria} />
        </ToolbarSVGWrapper>
      ) : null}
    </StyledTableToolbarContent>
  </StyledCarbonTableToolbar>
);

TableToolbar.propTypes = propTypes;
TableToolbar.defaultProps = defaultProps;

export default TableToolbar;
