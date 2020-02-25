export const COLORS = {
  RED: 'rgb(217,3,103)',
  BLUE: 'rgb(25,98,253)',
  YELLOW: 'rgb(254,213,34)',
  PURPLE: '#8A3FFC',
  TEAL: '#009C98',
  MAGENTA: '#EE538B',
  CYAN: '#0072C3',
};

export const DISABLED_COLORS = ['#e0e0e0', '#cacaca', '#a8a8a8', '#8d8d8d', '#6f6f6f'];

export const CARD_SIZES = {
  SMALL: 'SMALL',
  SMALLWIDE: 'SMALLWIDE',
  MEDIUMTHIN: 'MEDIUMTHIN',
  MEDIUM: 'MEDIUM',
  MEDIUMWIDE: 'MEDIUMWIDE',
  LARGETHIN: 'LARGETHIN',
  LARGE: 'LARGE',
  LARGEWIDE: 'LARGEWIDE',
};

export const LEGACY_CARD_SIZES = {
  XSMALL: 'XSMALL',
  XSMALLWIDE: 'XSMALLWIDE',
  TALL: 'TALL',
  WIDE: 'WIDE',
  XLARGE: 'XLARGE',
  ...CARD_SIZES,
};

export const CARD_TYPES = {
  BAR: 'BAR',
  DONUT: 'DONUT',
  CUSTOM: 'CUSTOM',
  GAUGE: 'GAUGE',
  IMAGE: 'IMAGE',
  LIST: 'LIST',
  PIE: 'PIE',
  TABLE: 'TABLE',
  TIMESERIES: 'TIMESERIES',
  VALUE: 'VALUE',
};

export const CARD_ACTIONS = {
  OPEN_EXPANDED_CARD: 'OPEN_EXPANDED_CARD',
  CLOSE_EXPANDED_CARD: 'CLOSE_EXPANDED_CARD',
  UPDATE_DATA: 'UPDATE_DATA',
  EDIT_CARD: 'EDIT_CARD',
  CLONE_CARD: 'CLONE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  CHANGE_TIME_RANGE: 'CHANGE_TIME_RANGE',
};

export const DASHBOARD_SIZES = {
  LARGE: 'lg',
  MAX: 'max',
  MEDIUM: 'md',
  SMALL: 'sm',
  XLARGE: 'xl',
  XSMALL: 'xs',
};

export const DASHBOARD_COLUMNS = {
  max: 16,
  xl: 16,
  lg: 16,
  md: 8,
  sm: 4,
  xs: 4,
};

export const DASHBOARD_BREAKPOINTS = {
  max: 1584,
  xl: 1312,
  lg: 1056,
  md: 672,
  sm: 480,
  xs: 320,
};

export const ROW_HEIGHT = {
  max: 144,
  xl: 144,
  lg: 144,
  md: 144,
  sm: 144,
  xs: 144,
};

/** The amount of space to preserve between cards */
export const GUTTER = 16;

/*
 * How many rows and columns should each card cross at each layout size
 */

export const CARD_DIMENSIONS = {
  SMALL: {
    max: { w: 2, h: 1 },
    xl: { w: 2, h: 1 },
    lg: { w: 4, h: 1 },
    md: { w: 4, h: 1 },
    sm: { w: 2, h: 1 },
    xs: { w: 4, h: 1 },
  },
  SMALLWIDE: {
    max: { w: 4, h: 1 },
    xl: { w: 4, h: 1 },
    lg: { w: 4, h: 1 },
    md: { w: 4, h: 1 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 1 },
  },
  MEDIUMTHIN: {
    max: { w: 2, h: 2 },
    xl: { w: 2, h: 2 },
    lg: { w: 4, h: 2 },
    md: { w: 2, h: 2 },
    sm: { w: 2, h: 2 },
    xs: { w: 4, h: 2 },
  },
  MEDIUM: {
    max: { w: 4, h: 2 },
    xl: { w: 4, h: 2 },
    lg: { w: 4, h: 2 },
    md: { w: 4, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  MEDIUMWIDE: {
    max: { w: 8, h: 2 },
    xl: { w: 8, h: 2 },
    lg: { w: 8, h: 2 },
    md: { w: 8, h: 2 },
    sm: { w: 4, h: 2 },
    xs: { w: 4, h: 2 },
  },
  LARGETHIN: {
    max: { w: 4, h: 4 },
    xl: { w: 4, h: 4 },
    lg: { w: 4, h: 4 },
    md: { w: 4, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
  LARGE: {
    max: { w: 8, h: 4 },
    xl: { w: 8, h: 4 },
    lg: { w: 8, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
  LARGEWIDE: {
    max: { w: 16, h: 4 },
    xl: { w: 16, h: 4 },
    lg: { w: 16, h: 4 },
    md: { w: 8, h: 4 },
    sm: { w: 4, h: 4 },
    xs: { w: 4, h: 4 },
  },
};

export const CARD_LAYOUTS = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL',
};

export const CARD_TITLE_HEIGHT = 48;
export const CARD_CONTENT_PADDING = 16;

export const TIME_SERIES_TYPES = {
  BAR: 'BAR',
  LINE: 'LINE',
};
