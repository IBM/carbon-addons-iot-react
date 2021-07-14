// Needed so that any component that uses sizeme can be jest tested
import sizeMe from 'react-sizeme';

sizeMe.noPlaceholders = true;

// Settings
export { settings } from './constants/Settings';

// Components
export AddCard from './components/AddCard';
export Button from './components/Button';
export Breadcrumb, { BreadcrumbItem, BreadcrumbSkeleton } from './components/Breadcrumb';
export ComposedModal from './components/ComposedModal';
export EmptyTable from './components/Table/EmptyTable/EmptyTable';
export Table from './components/Table';
export TableHead from './components/Table/TableHead/TableHead';
export TableBody from './components/Table/TableBody/TableBody';
export TableSaveViewModal from './components/Table/TableSaveViewModal/TableSaveViewModal';
export TableManageViewsModal from './components/Table/TableManageViewsModal/TableManageViewsModal';
export TableSkeletonWithHeaders from './components/Table/TableSkeletonWithHeaders/TableSkeletonWithHeaders';
export TableToolbar from './components/Table/TableToolbar/TableToolbar';
export WizardModal from './components/WizardModal';
export WizardInline from './components/WizardInline/WizardInline';
export StatefulWizardInline from './components/WizardInline/StatefulWizardInline';
export StatefulTable from './components/Table/StatefulTable';
export TileCatalog from './components/TileCatalog/TileCatalog';
export StatefulTileCatalog from './components/TileCatalog/StatefulTileCatalog';
export CatalogContent from './components/TileCatalog/CatalogContent';
export SimplePagination from './components/SimplePagination/SimplePagination';
export ProgressIndicator from './components/ProgressIndicator/ProgressIndicator';
export ComposedStructuredList from './components/ComposedStructuredList/ComposedStructuredList';
export ResourceList from './components/ResourceList/ResourceList';
export FileDrop from './components/FileDrop/FileDrop';
export PageTitleBar from './components/PageTitleBar/PageTitleBar';
export HierarchyList from './components/List/HierarchyList';
export BarChartCard from './components/BarChartCard/BarChartCard';
export TileCatalogNew from './components/TileCatalogNew/TileCatalogNew';
export TimePickerSpinner from './components/TimePickerSpinner/TimePickerSpinner';
export DateTimePicker from './components/DateTimePicker/DateTimePicker';
export TableViewDropdown from './components/Table/TableViewDropdown/TableViewDropdown';
export IconDropdown from './components/IconDropdown/IconDropdown';
export EmptyState from './components/EmptyState/EmptyState';
export ImageGalleryModal from './components/ImageGalleryModal/ImageGalleryModal';

// reusable reducers
export { baseTableReducer } from './components/Table/baseTableReducer';
export { tableReducer } from './components/Table/tableReducer';
export { tileCatalogReducer } from './components/TileCatalog/tileCatalogReducer';
export * as tableActions from './components/Table/tableActionCreators';

// Page related helpers
export PageHero from './components/Page/PageHero';
export PageWorkArea from './components/Page/PageWorkArea';
export EditPage from './components/Page/EditPage';
export NavigationBar from './components/NavigationBar/NavigationBar';
export Header from './components/Header';
export SideNav from './components/SideNav';
export SuiteHeader from './components/SuiteHeader/SuiteHeader';
export SuiteHeaderProfile from './components/SuiteHeader/SuiteHeaderProfile/SuiteHeaderProfile';
export SuiteHeaderAppSwitcher from './components/SuiteHeader/SuiteHeaderAppSwitcher/SuiteHeaderAppSwitcher';
export SuiteHeaderLogoutModal from './components/SuiteHeader/SuiteHeaderLogoutModal/SuiteHeaderLogoutModal';
export IdleLogoutConfirmationModal from './components/SuiteHeader/IdleLogoutConfirmationModal/IdleLogoutConfirmationModal';
export IdleTimer from './components/SuiteHeader/util/IdleTimer';
export SuiteHeaderI18N from './components/SuiteHeader/i18n';
export useSuiteHeaderData from './components/SuiteHeader/hooks/useSuiteHeaderData';
export suiteHeaderData from './components/SuiteHeader/util/suiteHeaderData';
export useUiResources from './components/SuiteHeader/hooks/useUiResources';
export uiresources from './components/SuiteHeader/util/uiresources';
export Walkme from './components/Walkme/Walkme';

// Dashboard
export Dashboard from './components/Dashboard/Dashboard';
export DashboardHeader from './components/Dashboard/DashboardHeader';
export DashboardGrid from './components/Dashboard/DashboardGrid';
export DashboardEditor from './components/DashboardEditor/DashboardEditor';
export CardEditor from './components/CardEditor/CardEditor';
export Card from './components/Card/Card';
export PieChartCard from './components/PieChartCard/PieChartCard';
export ValueCard from './components/ValueCard/ValueCard';
export TimeSeriesCard from './components/TimeSeriesCard/TimeSeriesCard';
export ImageCard from './components/ImageCard/ImageCard';
export TableCard from './components/TableCard/TableCard';
export GaugeCard from './components/GaugeCard/GaugeCard';
export { DragAndDrop } from './utils/DragAndDropUtils';

// Experimental
export ListCard from './components/ListCard/ListCard';
export PageWizard from './components/PageWizard/PageWizard';
export PageWizardStep from './components/PageWizard/PageWizardStep/PageWizardStep';
export PageWizardStepContent from './components/PageWizard/PageWizardStep/PageWizardStepContent';
export PageWizardStepDescription from './components/PageWizard/PageWizardStep/PageWizardStepDescription';
export PageWizardStepExtraContent from './components/PageWizard/PageWizardStep/PageWizardStepExtraContent';
export PageWizardStepTitle from './components/PageWizard/PageWizardStep/PageWizardStepTitle';
export StatefulPageWizard from './components/PageWizard/StatefulPageWizard';
export TileGallery from './components/TileGallery/TileGallery';
export TileGallerySection from './components/TileGallery/TileGallerySection';
export TileGalleryItem from './components/TileGallery/TileGalleryItem';
export TileGalleryViewSwitcher from './components/TileGallery/TileGalleryViewSwitcher';
export TileGallerySearch from './components/TileGallery/TileGallerySearch';
export StatefulTileGallery from './components/TileGallery/StatefulTileGallery';
export List from './components/List/List';
export SimpleList from './components/List/SimpleList/SimpleList';
export IconSwitch, { ICON_SWITCH_SIZES } from './components/IconSwitch/IconSwitch';
export AccordionItemDefer from './components/Accordion/AccordionItemDefer';
export ComboBox from './components/ComboBox';
export FlyoutMenu from './components/FlyoutMenu';
export FilterTags from './components/FilterTags/FilterTags';
export ColorDropdown from './components/ColorDropdown/ColorDropdown';
export HotspotEditorTooltipTab from './components/HotspotEditorModal/HotspotEditorTooltipTab/HotspotEditorTooltipTab';
export HotspotTextStyleTab from './components/HotspotEditorModal/HotspotTextStyleTab/HotspotTextStyleTab';
export DynamicHotspotSourcePicker from './components/HotspotEditorModal/DynamicHotspotSourcePicker/DynamicHotspotSourcePicker';
export ComboChartCard from './components/ComboChartCard/ComboChartCard';
export MenuButton from './components/MenuButton/MenuButton';
export ListBuilder from './components/ListBuilder/ListBuilder';
export TearSheet from './components/TearSheet/TearSheet';
export TearSheetWrapper from './components/TearSheet/TearSheetWrapper';
export MapCard from './components/MapCard/MapCard';

// Hooks
export { useDNDProviderElement } from './hooks/useDNDProviderElement';
export {
  hotspotActionTypes,
  hotspotTypes,
  hotspotEditorReducer,
  useHotspotEditorState,
} from './components/HotspotEditorModal/hooks/hotspotStateHook';

// Carbon proxy
export {
  Accordion,
  AccordionItem,
  AspectRatio,
  // TODO: unify breadcrumb
  // Breadcrumb,
  // BreadcrumbItem
  // TODO: unify button
  // Button,
  ButtonSet,
  Checkbox,
  CodeSnippet,
  // TODO: unify combobox
  // ComboBox,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ContentSwitcher,
  Copy,
  CopyButton,
  DangerButton,
  // TODO consolidate Carbon's datatable exports below with our table exports
  // default as DataTable,
  // Table,
  // TableActionList,
  // TableBatchAction,
  // TableBatchActions,
  // TableBody,
  // TableCell,
  // TableContainer,
  // TableExpandHeader,
  // TableExpandRow,
  // TableExpandedRow,
  // TableHead,
  // TableHeader,
  // TableRow,
  // TableSelectAll,
  // TableSelectRow,
  // TableToolbar,
  // TableToolbarAction,
  // TableToolbarContent,
  // TableToolbarSearch,
  // TableToolbarMenu,
  DataTable,
  DatePicker,
  DatePickerInput,
  Dropdown,
  ErrorBoundary,
  ErrorBoundaryContext,
  Filename,
  FileUploader,
  FileUploaderButton,
  FileUploaderDropContainer,
  FileUploaderItem,
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  FluidForm,
  Grid,
  Row,
  Column,
  Icon,
  InlineLoading,
  Link,
  ListItem,
  Loading,
  Modal,
  ModalWrapper,
  MultiSelect,
  ToastNotification,
  InlineNotification,
  NotificationActionButton,
  NotificationButton,
  NotificationTextDetails,
  NumberInput,
  OrderedList,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
  PaginationNav,
  PrimaryButton,
  // TODO Consolidate ProgressIndicator export from Carbon below with our ProgressIndicator export
  // ProgressIndicator,
  ProgressStep,
  RadioButton,
  RadioButtonGroup,
  Search,
  SearchFilterButton,
  SearchLayoutButton,
  SecondaryButton,
  Select,
  SelectItem,
  SelectItemGroup,
  Switch,
  Slider,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListBody,
  StructuredListRow,
  StructuredListInput,
  StructuredListCell,
  Tab,
  TabContent,
  Tabs,
  Tag,
  TextArea,
  TextInput,
  Tile,
  ClickableTile,
  SelectableTile,
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  RadioTile,
  TileGroup,
  TimePicker,
  TimePickerSelect,
  Toggle,
  ToggleSmall,
  Toolbar,
  ToolbarItem,
  ToolbarTitle,
  ToolbarOption,
  ToolbarDivider,
  ToolbarSearch,
  Tooltip,
  TooltipDefinition,
  TooltipIcon,
  UnorderedList,
  SkeletonText,
  SkeletonPlaceholder,
  DataTableSkeleton,
  AccordionSkeleton,
  // TODO unify breadcrumb skeleton
  // BreadcrumbSkeleton,
  ButtonSkeleton,
  CheckboxSkeleton,
  CodeSnippetSkeleton,
  DropdownSkeleton,
  FileUploaderSkeleton,
  NumberInputSkeleton,
  PaginationSkeleton,
  ProgressIndicatorSkeleton,
  RadioButtonSkeleton,
  SearchSkeleton,
  SelectSkeleton,
  SliderSkeleton,
  StructuredListSkeleton,
  TabsSkeleton,
  TagSkeleton,
  TextAreaSkeleton,
  TextInputSkeleton,
  ToggleSkeleton,
  ToggleSmallSkeleton,
  IconSkeleton,
  DatePickerSkeleton,
  // -----------------------
  // UI Shell proxy exports
  // -----------------------
  Content,
  // TODO Consolidate Header export from Carbon below with our Header export
  // Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  HeaderSideNavItems,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
  SkipToContent,
  // TODO Consolidate SideNav export from Carbon below with our SideNav export
  // SideNav,
  SideNavDetails,
  SideNavFooter,
  SideNavHeader,
  SideNavIcon,
  SideNavItem,
  SideNavItems,
  SideNavLink,
  SideNavLinkText,
  SideNavMenu,
  SideNavMenuItem,
  SideNavSwitcher,
  // Experimental components from Carbon

  // eslint-disable-next-line camelcase
  unstable_Pagination,
  // eslint-disable-next-line camelcase
  unstable_PageSelector,
  // eslint-disable-next-line camelcase
  unstable_TreeNode,
  // eslint-disable-next-line camelcase
  unstable_TreeView,
} from 'carbon-components-react';

export {
  determineCardRange,
  compareGrains,
  formatNumberWithPrecision,
  getVariables,
  getCardVariables,
  replaceVariables,
  findMatchingThresholds,
} from './utils/cardUtilityFunctions';

export { determineMaxValueCardAttributeCount } from './components/ValueCard/valueCardUtils';

export { csvDownloadHandler } from './utils/componentUtilityFunctions';

export * from './icons/components';

// Constants
export {
  CARD_TYPES,
  CARD_SIZES,
  CARD_ACTIONS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_SIZES,
  TIME_SERIES_TYPES,
  BAR_CHART_TYPES,
  DASHBOARD_EDITOR_CARD_TYPES,
} from './constants/LayoutConstants';
export { PICKER_KINDS } from './constants/DateConstants';
