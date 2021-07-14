import React from 'react';
import { boolean, text, select } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PICKER_KINDS,
  PRESET_VALUES,
} from '../../constants/DateConstants';

import DateTimePicker from './DateTimePicker';

export const defaultRelativeValue = {
  timeRangeKind: PICKER_KINDS.RELATIVE,
  timeRangeValue: {
    lastNumber: 20,
    lastInterval: INTERVAL_VALUES.MINUTES,
    relativeToWhen: RELATIVE_VALUES.TODAY,
    relativeToTime: '13:30',
  },
};

export const defaultAbsoluteValue = {
  timeRangeKind: PICKER_KINDS.ABSOLUTE,
  timeRangeValue: {
    startDate: '2020-04-01',
    startTime: '12:34',
    endDate: '2020-04-06',
    endTime: '10:49',
  },
};

export default {
  title: '1 - Watson IoT/DateTimePicker',
  parameters: {
    docs: {
      inlineStories: false,
    },
  },
  excludeStories: ['defaultRelativeValue', 'defaultAbsoluteValue'],
};

export const Default = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      dateTimeMask={text('dateTimeMask', 'YYYY-MM-DD HH:mm')}
      relatives={[
        {
          label: 'Yesterday',
          value: RELATIVE_VALUES.YESTERDAY,
        },
      ]}
      hasTimeInput={boolean('hasTimeInput', true)}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
      hasIconOnly={boolean('hasIconOnly', false)}
      renderPresetTooltipText={() => 'User tooltip'}
    />
  );
};

export const SelectedPreset = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      defaultValue={{
        timeRangeKind: PICKER_KINDS.PRESET,
        timeRangeValue: PRESET_VALUES[3],
      }}
      hasTimeInput={boolean('hasTimeInput', true)}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
      hasIconOnly={boolean('hasIconOnly', false)}
    />
  );
};

SelectedPreset.storyName = 'Selected preset';

export const SelectedRelative = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      defaultValue={defaultRelativeValue}
      hasTimeInput={boolean('hasTimeInput', true)}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
      hasIconOnly={boolean('hasIconOnly', false)}
    />
  );
};

SelectedRelative.storyName = 'Selected relative';

export const SelectedAbsolute = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      defaultValue={defaultAbsoluteValue}
      hasTimeInput={boolean('hasTimeInput', true)}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
      hasIconOnly={boolean('hasIconOnly', false)}
    />
  );
};

SelectedAbsolute.storyName = 'Selected absolute';

export const WithoutARelativeOption = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      defaultValue={{
        timeRangeKind: PICKER_KINDS.PRESET,
        timeRangeValue: PRESET_VALUES[3],
      }}
      hasTimeInput={boolean('hasTimeInput', true)}
      showRelativeOption={false}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
      hasIconOnly={boolean('hasIconOnly', false)}
    />
  );
};

WithoutARelativeOption.storyName = 'Without a relative option';

export const WithoutACustomRangeLink = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      defaultValue={{
        timeRangeKind: PICKER_KINDS.PRESET,
        timeRangeValue: PRESET_VALUES[3],
      }}
      hasTimeInput={boolean('hasTimeInput', true)}
      showCustomRangeLink={false}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
      hasIconOnly={boolean('hasIconOnly', false)}
    />
  );
};

WithoutACustomRangeLink.storyName = 'Without a custom range link';

export const LightVersion = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      dateTimeMask={text('dateTimeMask', 'YYYY-MM-DD HH:mm')}
      relatives={[
        {
          label: 'Yesterday',
          value: RELATIVE_VALUES.YESTERDAY,
        },
      ]}
      light
      hasTimeInput={boolean('hasTimeInput', true)}
      hasIconOnly={boolean('hasIconOnly', false)}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
    />
  );
};

LightVersion.storyName = 'Light version';

export const IconOnly = () => {
  return (
    <DateTimePicker
      id="datetimepicker"
      dateTimeMask={text('dateTimeMask', 'YYYY-MM-DD HH:mm')}
      relatives={[
        {
          label: 'Yesterday',
          value: RELATIVE_VALUES.YESTERDAY,
        },
      ]}
      hasTimeInput={boolean('hasTimeInput', true)}
      hasIconOnly={boolean('hasIconOnly', true)}
    />
  );
};

IconOnly.storyName = 'Icon only';

export const Locale = () => {
  return (
    <DateTimePicker
      id="datetimepicker25"
      dateTimeMask={text('dateTimeMask', 'L HH:mm')}
      locale={select('locale', ['en', 'fr', 'ja'], 'fr')}
      defaultValue={defaultAbsoluteValue}
      hasTimeInput={boolean('hasTimeInput', true)}
      hasIconOnly={boolean('hasIconOnly', false)}
      onApply={action('onApply')}
      onCancel={action('onCancel')}
    />
  );
};
