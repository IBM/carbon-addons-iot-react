import React, { useMemo, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import pick from 'lodash/pick';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Table as CarbonTable, TableContainer, Tag } from 'carbon-components-react';
import isNil from 'lodash/isNil';
import uniqueId from 'lodash/uniqueId';
import classnames from 'classnames';
import { useLangDirection } from 'use-lang-direction';

import { defaultFunction } from '../../utils/componentUtilityFunctions';
import { settings } from '../../constants/Settings';
import FilterTags from '../FilterTags/FilterTags';
import { RuleGroupPropType } from '../RuleBuilder/RuleBuilderPropTypes';

import {
  TableColumnsPropTypes,
  TableRowPropTypes,
  ExpandedRowsPropTypes,
  EmptyStatePropTypes,
  TableSearchPropTypes,
  I18NPropTypes,
  RowActionsStatePropTypes,
  ActiveTableToolbarPropType,
} from './TablePropTypes';
import TableHead from './TableHead/TableHead';
import TableToolbar from './TableToolbar/TableToolbar';
import EmptyTable from './EmptyTable/EmptyTable';
import TableSkeletonWithHeaders from './TableSkeletonWithHeaders/TableSkeletonWithHeaders';
import TableBody from './TableBody/TableBody';
import Pagination from './Pagination';
import TableFoot from './TableFoot/TableFoot';

const { iotPrefix } = settings;

const propTypes = {
  /** DOM ID for component */
  id: PropTypes.string,
  /** Displays smaller title in header */
  secondaryTitle: PropTypes.string,
  tooltip: PropTypes.node,
  /** render zebra stripes or not */
  useZebraStyles: PropTypes.bool,
  /**  lighter styling where regular table too visually heavy */
  lightweight: PropTypes.bool,
  /** Specify the properties of each column in the table */
  columns: TableColumnsPropTypes.isRequired,
  /** Row value data for the body of the table */
  data: TableRowPropTypes.isRequired,
  /** Expanded data for the table details */
  expandedData: ExpandedRowsPropTypes,
  /** Optional properties to customize how the table should be rendered */
  options: PropTypes.shape({
    /** If true allows the table to aggregate values of columns in a special row */
    hasAggregations: PropTypes.bool,
    hasPagination: PropTypes.bool,
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
    hasFilter: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.oneOf(['onKeyPress', 'onEnterAndBlur']),
    ]),
    /* Turns on the Advanced Rule Builder Filtering. Is a boolean value */
    // eslint-disable-next-line consistent-return
    hasAdvancedFilter: (props, propName, componentName) => {
      if (__DEV__) {
        if (props?.hasFilter && props?.hasAdvancedFilter) {
          return new Error(
            `Only one of props 'options.hasFilter' or 'options.hasAdvancedFilter' can be specified in '${componentName}'.`
          );
        }

        if (![true, false, undefined].includes(props?.hasAdvancedFilter)) {
          return new Error(`'options.hasAdvancedFilter' should be a boolean or undefined.`);
        }
      }
    },
    /** if true, the data prop will be assumed to only represent the currently visible page */
    hasOnlyPageData: PropTypes.bool,
    /** has simple search capability */
    hasSearch: PropTypes.bool,
    hasColumnSelection: PropTypes.bool,
    hasColumnSelectionConfig: PropTypes.bool,
    shouldLazyRender: PropTypes.bool,
    hasRowCountInHeader: PropTypes.bool,
    hasResize: PropTypes.bool,
    hasSingleRowEdit: PropTypes.bool,
    hasUserViewManagement: PropTypes.bool,
    /** If true removes the "table-layout: fixed" for resizable tables  */
    useAutoTableLayoutForResize: PropTypes.bool,
    /**
     * auto - Wrap for tables with dynamic columns widths and truncate for tables with fixed or resizable columns
     * always - Wrap if needed for all table column configurations
     * never - Tables with dynamic columns widths grow larger and tables with fixed or resizable columns truncate.
     * alwaysTruncate - Always truncate if needed for all table column configurations
     */
    wrapCellText: PropTypes.oneOf(['always', 'never', 'auto', 'alwaysTruncate']),
  }),

  /** Initial state of the table, should be updated via a local state wrapper component implementation or via a central store/redux see StatefulTable component for an example */
  view: PropTypes.shape({
    aggregations: PropTypes.shape({
      label: PropTypes.string,
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          /** id of the column that should have its values aggregated */
          id: PropTypes.string.isRequired,
          /** the primitive value or function that will receive an array of values and returns an aggregated value */
          value: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
          /** allow aligning the results the same as the column */
          align: PropTypes.oneOf(['start', 'center', 'end']),
          /** allows the aggregation to align with sortable columns extra padding */
          isSortable: PropTypes.bool,
        })
      ),
    }),
    pagination: PropTypes.shape({
      pageSize: PropTypes.number,
      pageSizes: PropTypes.arrayOf(PropTypes.number),
      page: PropTypes.number,
      totalItems: PropTypes.number,
      /** Number of pages rendered in pagination */
      maxPages: PropTypes.number,
      isItemPerPageHidden: PropTypes.bool,
    }),
    filters: PropTypes.arrayOf(
      PropTypes.shape({
        columnId: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
          PropTypes.bool,
          PropTypes.arrayOf(PropTypes.string),
        ]).isRequired,
      })
    ),
    /** a stripped down version of the RuleBuilderFilterPropType */
    advancedFilters: PropTypes.arrayOf(
      PropTypes.shape({
        /** Unique id for particular filter */
        filterId: PropTypes.string.isRequired,
        /** Text for main tilte of page */
        filterTitleText: PropTypes.string.isRequired,
        filterRules: RuleGroupPropType.isRequired,
      })
    ),
    selectedAdvancedFilterIds: PropTypes.arrayOf(PropTypes.string),
    toolbar: PropTypes.shape({
      /** Specify which header row to display, will display default header row if null */
      activeBar: ActiveTableToolbarPropType,
      /** optional content to render inside the toolbar  */
      customToolbarContent: PropTypes.node,
      /** Specify which batch actions to render in the batch action bar. If empty, no batch action toolbar will display */
      batchActions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          labelText: PropTypes.string.isRequired,
          icon: PropTypes.element,
          iconDescription: PropTypes.string,
        })
      ),
      /** Simple search state */
      search: TableSearchPropTypes,
      /** is the toolbar currently disabled */
      isDisabled: PropTypes.bool,
      /** buttons to be shown with when activeBar is 'rowEdit' */
      rowEditBarButtons: PropTypes.node,
    }),
    table: PropTypes.shape({
      isSelectAllSelected: PropTypes.bool,
      isSelectAllIndeterminate: PropTypes.bool,
      selectedIds: PropTypes.arrayOf(PropTypes.string),
      sort: PropTypes.shape({
        columnId: PropTypes.string,
        direction: PropTypes.oneOf(['NONE', 'ASC', 'DESC']),
      }),
      /** Specify column ordering and visibility */
      ordering: PropTypes.arrayOf(
        PropTypes.shape({
          columnId: PropTypes.string.isRequired,
          /* Visibility of column in table, defaults to false */
          isHidden: PropTypes.bool,
        })
      ),
      /** what is the current state of the row actions */
      rowActions: RowActionsStatePropTypes,
      singleRowEditButtons: PropTypes.element,
      expandedIds: PropTypes.arrayOf(PropTypes.string),
      emptyState: EmptyStatePropTypes,
      loadingState: PropTypes.shape({
        isLoading: PropTypes.bool,
        rowCount: PropTypes.number,
      }),
    }),
  }),
  /** Callbacks for actions of the table, can be used to update state in wrapper component to update `view` props */
  actions: PropTypes.shape({
    pagination: PropTypes.shape({
      /** Specify a callback for when the current page or page size is changed. This callback is passed an object parameter containing the current page and the current page size */
      onChangePage: PropTypes.func,
    }),
    toolbar: PropTypes.shape({
      onApplyFilter: PropTypes.func,
      onToggleFilter: PropTypes.func,
      onShowRowEdit: PropTypes.func,
      onToggleColumnSelection: PropTypes.func,
      /** Specify a callback for when the user clicks toolbar button to clear all filters. Recieves a parameter of the current filter values for each column */
      onClearAllFilters: PropTypes.func,
      onCancelBatchAction: PropTypes.func,
      onApplyBatchAction: PropTypes.func,
      /** Apply a search criteria to the table */
      onApplySearch: PropTypes.func,
      /** Download the table contents */
      onDownloadCSV: PropTypes.func,
      /** When advanced filters are applied */
      onApplyAdvancedFilter: PropTypes.func,
      /** Toggles the advanced filter flyout open */
      onToggleAdvancedFilter: PropTypes.func,
      /** Remove the selected advancedFilter from the table */
      onRemoveAdvancedFilter: PropTypes.func,
      /** Fired the 'create new advanced filter' button is clicked. */
      onCreateAdvancedFilter: PropTypes.func,
      /** Fired when then 'Cancel' button is clicked in the advanced filter flyout menu */
      onCancelAdvancedFilter: PropTypes.func,
      /** Fired when an advanced filter is selected or removed. */
      onChangeAdvancedFilter: PropTypes.func,
    }),
    /** table wide actions */
    table: PropTypes.shape({
      onRowSelected: PropTypes.func,
      onRowClicked: PropTypes.func,
      onRowExpanded: PropTypes.func,
      onSelectAll: PropTypes.func,
      onChangeSort: PropTypes.func,
      /** callback if a row action is clicked called with the id of the action then the id of the row if you return a promise from apply row action the stateful table will assume you're asynchronous and give a spinner */
      onApplyRowAction: PropTypes.func,
      onClearRowError: PropTypes.func,
      onEmptyStateAction: PropTypes.func,
      onChangeOrdering: PropTypes.func,
      onColumnSelectionConfig: PropTypes.func,
      onColumnResize: PropTypes.func,
      onOverflowItemClicked: PropTypes.func,
    }).isRequired,
    /** callback for actions relevant for view management */
    onUserViewModified: PropTypes.func,
  }),
  /** what locale should we use to format table values if left empty no locale formatting happens */
  locale: PropTypes.string,
  i18n: I18NPropTypes,
};

export const defaultProps = (baseProps) => ({
  id: null,
  useZebraStyles: false,
  lightweight: false,
  title: null,
  tooltip: null,
  secondaryTitle: null,
  options: {
    hasAggregations: false,
    hasPagination: false,
    hasRowSelection: false,
    hasRowExpansion: false,
    hasRowActions: false,
    hasRowNesting: false,
    hasFilter: false,
    hasAdvancedFilter: false,
    hasOnlyPageData: false,
    hasSearch: false,
    hasColumnSelection: false,
    hasColumnSelectionConfig: false,
    hasResize: false,
    hasSingleRowEdit: false,
    hasUserViewManagement: false,
    useAutoTableLayoutForResize: false,
    shouldLazyRender: false,
    wrapCellText: 'always',
  },
  view: {
    aggregations: { columns: [] },
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30],
      page: 1,
      totalItems: baseProps.data && baseProps.data.length,
      maxPages: 100,
      isItemPerPageHidden: false,
    },
    filters: [],
    advancedFilters: [],
    selectedAdvancedFilterIds: [],
    toolbar: {
      advancedFilterFlyoutOpen: false,
      batchActions: [],
      search: {},
    },
    table: {
      expandedIds: [],
      isSelectAllSelected: undefined,
      selectedIds: [],
      rowActions: [],
      sort: {},
      ordering: baseProps.columns && baseProps.columns.map((i) => ({ columnId: i.id })),
      loadingState: {
        rowCount: 5,
      },
      singleRowEditButtons: null,
    },
  },
  actions: {
    pagination: {
      onChangePage: defaultFunction('actions.pagination.onChangePage'),
    },
    toolbar: {
      onToggleFilter: defaultFunction('actions.toolbar.onToggleFilter'),
      onShowRowEdit: defaultFunction('actions.toolbar.onShowRowEdit'),
      onToggleColumnSelection: defaultFunction('actions.toolbar.onToggleColumnSelection'),
      onApplyBatchAction: defaultFunction('actions.toolbar.onApplyBatchAction'),
      onCancelBatchAction: defaultFunction('actions.toolbar.onCancelBatchAction'),
      onRemoveAdvancedFilter: defaultFunction('actions.toolbar.onRemoveAdvancedFilter'),
      onCancelAdvancedFilter: defaultFunction('actions.toolbar.onCancelFilter'),
      onCreateAdvancedFilter: defaultFunction('actions.toolbar.onCreateAdvancedFilter'),
      onApplyAdvancedFilter: defaultFunction('actions.toolbar.onApplyAdvancedFilter'),
      onChangeAdvancedFilter: defaultFunction('actions.toolbar.onChangeAdvancedFilter'),
      onToggleAdvancedFilter: defaultFunction('actions.toolbar.onToggleAdvancedFilter'),
    },
    table: {
      onChangeSort: defaultFunction('actions.table.onChangeSort'),
      onRowExpanded: defaultFunction('actions.table.onRowExpanded'),
      onRowClicked: defaultFunction('actions.table.onRowClicked'),
      onApplyRowAction: defaultFunction('actions.table.onApplyRowAction'),
      onEmptyStateAction: null,
      onChangeOrdering: defaultFunction('actions.table.onChangeOrdering'),
      onColumnSelectionConfig: defaultFunction('actions.table.onColumnSelectionConfig'),
      onColumnResize: defaultFunction('actions.table.onColumnResize'),
      onOverflowItemClicked: defaultFunction('actions.table.onOverflowItemClicked'),
    },
    onUserViewModified: null,
  },
  locale: null,
  i18n: {
    /** pagination */
    pageBackwardAria: 'Previous page',
    pageForwardAria: 'Next page',
    pageNumberAria: 'Page Number',
    itemsPerPage: 'Items per page:',
    itemsRange: (min, max) => `${min}–${max} items`,
    currentPage: (page) => `page ${page}`,
    itemsRangeWithTotal: (min, max, total) => `${min}–${max} of ${total} items`,
    pageRange: (current, total) => `${current} of ${total} pages`,
    /** table body */
    overflowMenuAria: 'More actions',
    clickToExpandAria: 'Click to expand content',
    clickToCollapseAria: 'Click to collapse content',
    selectAllAria: 'Select all items',
    selectRowAria: 'Select row',
    /** toolbar */
    clearAllFilters: 'Clear all filters',
    columnSelectionButtonAria: 'Column Selection',
    columnSelectionConfig: 'Manage Columns',
    filterButtonAria: 'Filters',
    editButtonAria: 'Edit rows',
    searchLabel: 'Search',
    searchPlaceholder: 'Search',
    clearFilterAria: 'Clear filter',
    filterAria: 'Filter',
    openMenuAria: 'Open menu',
    closeMenuAria: 'Close menu',
    clearSelectionAria: 'Clear selection',
    batchCancel: 'Cancel',
    itemsSelected: 'items selected',
    itemSelected: 'item selected',
    rowCountInHeader: (totalRowCount) => `Results: ${totalRowCount}`,
    toggleAggregations: 'Toggle Aggregations',
    /** empty state */
    emptyMessage: 'There is no data',
    emptyMessageWithFilters: 'No results match the current filters',
    emptyButtonLabel: 'Create some data',
    downloadIconDescription: 'Download table content',
    filterNone: 'Unsort rows by this header',
    filterAscending: 'Sort rows by this header in ascending order',
    filterDescending: 'Sort rows by this header in descending order',
  },
});

const Table = (props) => {
  const {
    id,
    columns,
    data,
    expandedData,
    locale,
    view,
    actions: { onUserViewModified },
    actions,
    options,
    lightweight,
    className,
    style,
    i18n,
    // Table Toolbar props
    secondaryTitle,
    tooltip,
    ...others
  } = merge({}, defaultProps(props), props);

  // There is no way to access the current search value in the Table
  // so we need to track that for the save view fuctionality.
  const searchValue = useRef(view?.toolbar?.search?.defaultValue);

  const initialRendering = useRef(true);

  // The save/load view functionality needs access to the latest view configuration
  // and also needs to know when the configuration has changed for the StatefulTable.
  // This effect satifies both those needs.
  useDeepCompareEffect(() => {
    if (options.hasUserViewManagement && onUserViewModified) {
      if (!initialRendering.current) {
        onUserViewModified({
          view,
          columns,
          state: {
            currentSearchValue: searchValue.current === undefined ? '' : searchValue.current,
          },
        });
      } else {
        initialRendering.current = false;
      }
    }
  }, [
    // Props of type React.Element or React.Node must not be included in
    // useDeepCompareEffect dependency arrays, their object signature is
    // massive and will throw out of memory errors if compared.
    // https://github.com/kentcdodds/use-deep-compare-effect/issues/7
    // https://twitter.com/dan_abramov/status/1104415855612432384
    view.pagination,
    view.filters,
    view.toolbar.activeBar,
    // Remove the icon as it's a React.Element which can not be compared
    view.toolbar.batchActions.map((action) => {
      const { icon, ...nonElements } = action;
      return nonElements;
    }),
    view.toolbar.initialDefaultSearch,
    view.toolbar.search,
    view.toolbar.isDisabled,
    view.table.isSelectAllSelected,
    view.table.isSelectAllIndeterminate,
    view.table.selectedIds,
    view.table.sort,
    view.table.ordering,
    // Remove the error as it's a React.Element/Node which can not be compared
    view.table.rowActions.map((action) => {
      const { error, ...nonElements } = action;
      return nonElements;
    }),
    view.table.expandedIds,
    view.table.loadingState,
    view.table.filteredData,
    columns,
  ]);

  const { maxPages, ...paginationProps } = view.pagination;
  const langDir = useLangDirection();
  const hasMultiSelect = options.hasRowSelection === 'multi';

  const [tableId] = useState(() => uniqueId('table-'));
  const [, forceUpdateCellTextWidth] = useState(0);

  const useCellTextTruncate = useMemo(
    () =>
      options
        ? options.wrapCellText === 'alwaysTruncate' ||
          (options.wrapCellText !== 'always' &&
            ((options.hasResize && !options.useAutoTableLayoutForResize) ||
              columns.some((col) => col.hasOwnProperty('width'))))
        : undefined,
    [options, columns]
  );

  const handleClearFilters = () => {
    if (actions.toolbar && actions.toolbar.onClearAllFilters) {
      actions.toolbar.onClearAllFilters();
    }
    if (actions.toolbar && actions.toolbar.onApplySearch) {
      actions.toolbar.onApplySearch('');
    }
  };

  const handleOnColumnResize = (resizedCols) => {
    if (actions.table && actions.table.onColumnResize) {
      actions.table.onColumnResize(resizedCols);
    }
    forceUpdateCellTextWidth((n) => !n);
  };

  const minItemInView =
    options.hasPagination && !options.hasOnlyPageData && view.pagination
      ? (view.pagination.page - 1) * view.pagination.pageSize
      : 0;
  const maxItemInView =
    options.hasPagination && !options.hasOnlyPageData && view.pagination
      ? view.pagination.page * view.pagination.pageSize
      : data.length;
  const visibleData = data.slice(minItemInView, maxItemInView);

  const visibleColumns = columns.filter(
    (c) =>
      !(
        view.table.ordering.find((o) => o.columnId === c.id) || {
          isHidden: false,
        }
      ).isHidden
  );

  const [hasAggregations, setHasAggregations] = useState(options.hasAggregations);
  const aggregationsProp = view.aggregations;
  const getColumnNumbers = (tableData, columnId) =>
    tableData.map((row) => row.values[columnId]).filter((value) => Number.isFinite(value));

  const onToggleAggregations = useCallback(() => setHasAggregations((prev) => !prev), [
    setHasAggregations,
  ]);

  const aggregations = useMemo(() => {
    return hasAggregations && aggregationsProp.columns
      ? {
          label: aggregationsProp.label,
          columns: aggregationsProp.columns.map((col) => {
            let aggregatedValue;
            const isFunction = typeof col.value === 'function';
            const calculateValue = isFunction || col.value === undefined;

            if (calculateValue) {
              const numbers = getColumnNumbers(data, col.id);
              aggregatedValue = isFunction
                ? col.value(numbers)
                : numbers.reduce((total, num) => total + num, 0);
            }
            return calculateValue ? { ...col, value: aggregatedValue.toString() } : col;
          }),
          align: aggregationsProp.align,
        }
      : undefined;
  }, [data, hasAggregations, aggregationsProp]);

  const totalColumns =
    visibleColumns.length +
    (hasMultiSelect ? 1 : 0) +
    (options.hasRowExpansion ? 1 : 0) +
    (options.hasRowActions ? 1 : 0);

  const isFiltered =
    view.filters.length > 0 ||
    view.selectedAdvancedFilterIds.length ||
    (!isNil(view.toolbar) &&
      !isNil(view.toolbar.search) &&
      !isNil(view.toolbar.search.value) &&
      view.toolbar.search.value !== '');

  const rowEditMode = view.toolbar.activeBar === 'rowEdit';
  const singleRowEditMode = !!view.table.rowActions.find((action) => action.isEditMode);

  const allRowsAreSelected = view.table.selectedIds.length === visibleData.length;
  const someRowsAreSelected = view.table.selectedIds.length > 0 && !allRowsAreSelected;

  const noSelectAllProp = view.table.isSelectAllSelected === undefined;
  const isSelectAllSelected = noSelectAllProp ? allRowsAreSelected : view.table.isSelectAllSelected;

  const noIndeterminateProp = view.table.isSelectAllIndeterminate === undefined;
  const isSelectAllIndeterminate =
    noIndeterminateProp && noSelectAllProp
      ? someRowsAreSelected
      : view.table.isSelectAllIndeterminate;

  return (
    <TableContainer
      style={style}
      data-testid={`${id}-table-container`}
      className={classnames(className, `${iotPrefix}--table-container`)}
    >
      {
        /* If there is no items being rendered in the toolbar, don't render the toolbar */
        options.hasAggregations ||
        options.hasFilter ||
        options.hasAdvancedFilter ||
        options.hasSearch ||
        (hasMultiSelect && view.table.selectedIds.length > 0) ||
        options.hasRowCountInHeader ||
        options.hasColumnSelection ||
        options.hasRowEdit ||
        actions.toolbar.onDownloadCSV ||
        secondaryTitle ||
        view.toolbar.customToolbarContent ||
        tooltip ? (
          <TableToolbar
            tableId={id || tableId}
            secondaryTitle={secondaryTitle}
            tooltip={tooltip}
            i18n={{
              clearAllFilters: i18n.clearAllFilters,
              columnSelectionButtonAria: i18n.columnSelectionButtonAria,
              filterButtonAria: i18n.filterButtonAria,
              editButtonAria: i18n.editButtonAria,
              searchLabel: i18n.searchLabel,
              searchPlaceholder: i18n.searchPlaceholder,
              batchCancel: i18n.batchCancel,
              itemsSelected: i18n.itemsSelected,
              itemSelected: i18n.itemSelected,
              filterNone: i18n.filterNone,
              filterAscending: i18n.filterAscending,
              filterDescending: i18n.filterDescending,
              downloadIconDescription: i18n.downloadIconDescription,
              rowCountInHeader: i18n.rowCountInHeader,
              toggleAggregations: i18n.toggleAggregations,
            }}
            actions={{
              ...pick(
                actions.toolbar,
                'onCancelBatchAction',
                'onApplyBatchAction',
                'onClearAllFilters',
                'onToggleColumnSelection',
                'onToggleFilter',
                'onShowRowEdit',
                'onDownloadCSV',
                'onApplyFilter',
                'onApplyAdvancedFilter',
                'onCancelAdvancedFilter',
                'onCreateAdvancedFilter',
                'onChangeAdvancedFilter',
                'onRemoveAdvancedFilter',
                'onToggleAdvancedFilter'
              ),
              onApplySearch: (value) => {
                searchValue.current = value;
                if (actions.toolbar?.onApplySearch) {
                  actions.toolbar.onApplySearch(value);
                }
              },
              onToggleAggregations,
            }}
            options={{
              ...pick(
                options,
                'hasAggregations',
                'hasColumnSelection',
                'hasSearch',
                'hasRowSelection',
                'hasRowCountInHeader',
                'hasRowEdit',
                'hasUserViewManagement'
              ),
              hasFilter: Boolean(options?.hasFilter),
              hasAdvancedFilter: Boolean(options?.hasAdvancedFilter),
            }}
            tableState={{
              totalSelected: view.table.selectedIds.length,
              totalFilters:
                (view.filters ? view.filters.length : 0) +
                (view.selectedAdvancedFilterIds.length ? view.selectedAdvancedFilterIds.length : 0),
              totalItemsCount: view.pagination.totalItems,
              isDisabled: singleRowEditMode || view.toolbar.isDisabled,
              ordering: view.table.ordering,
              columns,
              ...pick(view, 'filters', 'advancedFilters', 'selectedAdvancedFilterIds'),
              ...pick(
                view.toolbar,
                'batchActions',
                'search',
                'activeBar',
                'customToolbarContent',
                'rowEditBarButtons',
                'advancedFilterFlyoutOpen'
              ),
            }}
            data={data}
            testID={`${id}-table-toolbar`}
          />
        ) : null
      }
      {view.selectedAdvancedFilterIds.length ? (
        <section className={`${iotPrefix}--table__advanced-filters-container`}>
          <FilterTags>
            {view.advancedFilters
              .filter((advFilter) => view.selectedAdvancedFilterIds.includes(advFilter.filterId))
              .map((advancedFilter) => {
                return (
                  <Tag
                    key={advancedFilter.filterId}
                    filter
                    title={advancedFilter.filterTitleText}
                    onClose={(e) => {
                      if (typeof actions?.toolbar?.onRemoveAdvancedFilter === 'function') {
                        actions.toolbar.onRemoveAdvancedFilter(e, advancedFilter.filterId);
                      }
                    }}
                  >
                    {advancedFilter.filterTitleText}
                  </Tag>
                );
              })}
          </FilterTags>
        </section>
      ) : null}
      <div className="addons-iot-table-container">
        <CarbonTable
          data-testid={id}
          className={classnames({
            [`${iotPrefix}--data-table--resize`]: options.hasResize,
            [`${iotPrefix}--data-table--fixed`]:
              options.hasResize && !options.useAutoTableLayoutForResize,
            [`${iotPrefix}--data-table--row-actions`]: options.hasRowActions,
          })}
          {...others}
        >
          <TableHead
            {...others}
            i18n={i18n}
            lightweight={lightweight}
            options={{
              ...pick(
                options,
                'hasAggregation',
                'hasColumnSelectionConfig',
                'hasResize',
                'hasRowActions',
                'hasRowExpansion',
                'hasRowNesting',
                'hasSingleRowEdit',
                'hasRowSelection',
                'useAutoTableLayoutForResize'
              ),
              wrapCellText: options.wrapCellText,
              truncateCellText: useCellTextTruncate,
            }}
            columns={columns}
            filters={view.filters}
            actions={{
              ...pick(actions.toolbar, 'onApplyFilter'),
              ...pick(
                actions.table,
                'onSelectAll',
                'onChangeSort',
                'onChangeOrdering',
                'onColumnSelectionConfig',
                'onOverflowItemClicked'
              ),
              onColumnResize: handleOnColumnResize,
            }}
            selectAllText={i18n.selectAllAria}
            clearFilterText={i18n.clearFilterAria}
            filterText={i18n.filterAria}
            clearSelectionText={i18n.clearSelectionAria}
            openMenuText={i18n.openMenuAria}
            closeMenuText={i18n.closeMenuAria}
            tableId={id || tableId}
            tableState={{
              isDisabled: rowEditMode || singleRowEditMode,
              activeBar: view.toolbar.activeBar,
              filters: view.filters,
              ...view.table,
              selection: { isSelectAllSelected, isSelectAllIndeterminate },
            }}
            hasFastFilter={options?.hasFilter === 'onKeyPress'}
            testID={`${id}-table-head`}
          />
          {view.table.loadingState.isLoading ? (
            <TableSkeletonWithHeaders
              columns={visibleColumns}
              {...pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions')}
              rowCount={view.table.loadingState.rowCount}
              testID={`${id}-table-skeleton`}
            />
          ) : visibleData && visibleData.length ? (
            <TableBody
              langDir={langDir}
              tableId={id || tableId}
              rows={visibleData}
              locale={locale}
              rowActionsState={view.table.rowActions}
              singleRowEditButtons={view.table.singleRowEditButtons}
              expandedRows={expandedData}
              columns={visibleColumns}
              expandedIds={view.table.expandedIds}
              selectedIds={view.table.selectedIds}
              {...pick(
                i18n,
                'overflowMenuAria',
                'clickToExpandAria',
                'clickToCollapseAria',
                'inProgressText',
                'actionFailedText',
                'learnMoreText',
                'dismissText',
                'selectRowAria'
              )}
              totalColumns={totalColumns}
              {...pick(
                options,
                'hasRowSelection',
                'hasRowExpansion',
                'hasRowActions',
                'hasRowNesting',
                'shouldExpandOnRowClick',
                'shouldLazyRender'
              )}
              wrapCellText={options.wrapCellText}
              truncateCellText={useCellTextTruncate}
              ordering={view.table.ordering}
              rowEditMode={rowEditMode}
              actions={pick(
                actions.table,
                'onRowSelected',
                'onApplyRowAction',
                'onClearRowError',
                'onRowExpanded',
                'onRowClicked'
              )}
              testID={`${id}-table-body`}
            />
          ) : (
            <EmptyTable
              id={id}
              totalColumns={totalColumns}
              isFiltered={isFiltered}
              emptyState={
                // only show emptyState if no filters or search is applied
                view.table.emptyState && !isFiltered
                  ? view.table.emptyState
                  : {
                      message: i18n.emptyMessage,
                      messageWithFilters: i18n.emptyMessageWithFilters,
                      buttonLabel: i18n.emptyButtonLabel,
                      buttonLabelWithFilters: i18n.emptyButtonLabelWithFilters,
                    }
              }
              onEmptyStateAction={
                isFiltered && i18n.emptyButtonLabelWithFilters
                  ? handleClearFilters // show clear filters
                  : !isFiltered && actions.table.onEmptyStateAction
                  ? actions.table.onEmptyStateAction
                  : undefined // if not filtered then show normal empty state
              }
              testID={`${id}-table-empty`}
            />
          )}
          {hasAggregations ? (
            <TableFoot
              options={{
                ...pick(options, 'hasRowSelection', 'hasRowExpansion', 'hasRowActions'),
              }}
              tableState={{
                aggregations,
                ordering: view.table.ordering,
              }}
              testID={`${id}-table-foot`}
            />
          ) : null}
        </CarbonTable>
      </div>
      {options.hasPagination &&
      !view.table.loadingState.isLoading &&
      visibleData &&
      visibleData.length ? ( // don't show pagination row while loading
        <Pagination
          pageSize={paginationProps.pageSize}
          pageSizes={paginationProps.pageSizes}
          page={paginationProps.page}
          isItemPerPageHidden={paginationProps.isItemPerPageHidden}
          totalItems={
            paginationProps.totalItems < maxPages * paginationProps.pageSize
              ? paginationProps.totalItems
              : maxPages * paginationProps.pageSize
          }
          onChange={actions.pagination.onChangePage}
          backwardText={i18n.pageBackwardAria}
          forwardText={i18n.pageForwardAria}
          pageNumberText={i18n.pageNumberAria}
          itemsPerPageText={i18n.itemsPerPage}
          itemText={i18n.itemsRange}
          itemRangeText={i18n.itemsRangeWithTotal}
          pageText={i18n.currentPage}
          pageRangeText={i18n.pageRange}
          preventInteraction={rowEditMode || singleRowEditMode}
          testID={`${id}-table-pagination`}
        />
      ) : null}
    </TableContainer>
  );
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps({});

export default Table;
