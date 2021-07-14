/** Date related constants */

export const PICKER_KINDS = {
  PRESET: 'PRESET',
  RELATIVE: 'RELATIVE',
  ABSOLUTE: 'ABSOLUTE',
};

export const PRESET_VALUES = [
  {
    id: 'item-01',
    label: 'Last 30 minutes',
    offset: 30,
  },
  {
    id: 'item-02',
    label: 'Last 1 hour',
    offset: 60,
  },
  {
    id: 'item-03',
    label: 'Last 6 hours',
    offset: 360,
  },
  {
    id: 'item-04',
    label: 'Last 12 hours',
    offset: 720,
  },
  {
    id: 'item-05',
    label: 'Last 24 hours',
    offset: 1440,
  },
];

export const INTERVAL_VALUES = {
  MINUTES: 'MINUTES',
  HOURS: 'HOURS',
  DAYS: 'DAYS',
  WEEKS: 'WEEKS',
  MONTHS: 'MONTHS',
  YEARS: 'YEARS',
};

export const RELATIVE_VALUES = {
  YESTERDAY: 'YESTERDAY',
  TODAY: 'TODAY',
};
