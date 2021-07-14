import React from 'react';
import { mount } from 'enzyme';
import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import dayjs from '../../utils/dayjs';
import {
  INTERVAL_VALUES,
  RELATIVE_VALUES,
  PRESET_VALUES,
  PICKER_KINDS,
} from '../../constants/DateConstants';

import DateTimePicker from './DateTimePicker';
import { defaultAbsoluteValue, defaultRelativeValue } from './DateTimePicker.story';

const defaultPresets = [
  ...PRESET_VALUES,
  {
    label: 'Last 70 minutes',
    offset: 70,
  },
];

const dateTimePickerProps = {
  onCancel: jest.fn(),
  onApply: jest.fn(),
};

const i18n = {
  presetLabels: ['Last 30 minutes', 'Missed in translation'],
  intervalLabels: ['minutes', 'Missed in translation'],
  relativeLabels: ['Missed in translation'],
};

describe('DateTimePicker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    console.error.mockClear();
    jest.clearAllTimers();
  });

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should not blow up if correct object is passed as default value', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        presets={[
          {
            label: 'Last 30 minutes',
            offset: 30,
          },
          {
            label: 'Last 1 hour',
            offset: 60,
          },
        ]}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          // test not having id
          timeRangeValue: {
            label: 'Last 30 minutes',
            offset: 30,
          },
        }}
      />
    );
    jest.runAllTimers();
    expect(console.error).toHaveBeenCalledTimes(0);
  });

  it('should blow up if wrong combo of timeRangeKind and timeRangeValue is passed for defaultValue', () => {
    mount(
      <DateTimePicker
        {...dateTimePickerProps}
        preset={defaultPresets}
        defaultValue={{
          timeRangeKind: 'some other string',
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    jest.runAllTimers();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should have the first preset as value', () => {
    render(<DateTimePicker {...dateTimePickerProps} i18n={i18n} />);
    jest.runAllTimers();
    expect(screen.getByText(PRESET_VALUES[0].label)).toBeVisible();
  });

  it('should change to another preset value when clicked', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        presets={[
          {
            label: 'Last 30 minutes',
            offset: 30,
          },
          {
            label: 'Last 1 hour',
            offset: 60,
          },
        ]}
      />
    );
    jest.runAllTimers();
    // open the dropdown
    // the first element is the button. the second element is the svg
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    // select last 1 hour
    userEvent.click(screen.getByText(/Last 1 hour/));
    // check for the selected text
    expect(screen.getAllByText(/Last 1 hour/)).toHaveLength(2);
  });

  it('should show the user defined tooltip for preset', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        renderPresetTooltipText={() => 'User tooltip'}
        preset={defaultPresets}
      />
    );
    jest.runAllTimers();
    expect(screen.getByText('User tooltip')).toBeInTheDocument();
  });

  it('should call onApply', () => {
    render(<DateTimePicker {...dateTimePickerProps} preset={defaultPresets} />);
    jest.runAllTimers();
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    userEvent.click(screen.getByText('Apply'));
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('onCancel should be called', () => {
    render(<DateTimePicker {...dateTimePickerProps} />);
    jest.runAllTimers();
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    userEvent.click(screen.getByText('Cancel'));
    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
  });

  it('should render with a predefined preset', () => {
    render(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={{
          timeRangeKind: PICKER_KINDS.PRESET,
          timeRangeValue: PRESET_VALUES[1],
        }}
      />
    );
    jest.runAllTimers();
    expect(screen.getByText(PRESET_VALUES[1].label)).toBeVisible();
  });

  it('should render with a predefined relative range', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />);
    jest.runAllTimers();
    // first open the menu
    userEvent.click(screen.getAllByLabelText('Calendar')[0]);
    // change the last interval
    fireEvent.change(screen.getAllByLabelText('Select')[0], {
      target: { value: INTERVAL_VALUES.DAYS },
    });
    // change the relative to
    fireEvent.change(screen.getAllByLabelText('Select')[1], {
      target: { value: RELATIVE_VALUES.YESTERDAY },
    });

    const today = dayjs();
    jest.runAllTimers();

    expect(
      screen.getByText(`${today.format('YYYY-MM-DD')} 13:10 to ${today.format('YYYY-MM-DD')} 13:30`)
    ).toBeVisible();

    userEvent.click(screen.getByLabelText('Increment hours'));
    jest.runAllTimers();
    expect(
      screen.getByText(`${today.format('YYYY-MM-DD')} 13:09 to ${today.format('YYYY-MM-DD')} 13:30`)
    ).toBeVisible();

    userEvent.click(screen.getByLabelText('Increment hours'));
    jest.runAllTimers();
    expect(
      screen.getByText(`${today.format('YYYY-MM-DD')} 14:09 to ${today.format('YYYY-MM-DD')} 14:30`)
    ).toBeVisible();

    userEvent.click(screen.getByText('Apply'));
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should render with a predefined absolute range', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      '2020-04-01 12:34 to 2020-04-06 10:49'
    );

    wrapper.find('.iot--time-picker__controls--btn.up-icon').first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 10:49'
    );

    wrapper.find('.iot--time-picker__controls--btn.up-icon').at(1).simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 11:49'
    );

    wrapper.find('.iot--date-time-picker__menu-btn-apply').first().simulate('click');
    jest.runAllTimers();
    expect(dateTimePickerProps.onApply).toHaveBeenCalled();
  });

  it('should go back to presets when cancel button is picked on Absolute screen', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultAbsoluteValue} />);
    userEvent.click(screen.getByText(/Back/));
    expect(screen.getByText(/Custom Range/)).toBeInTheDocument();
  });

  it('should switch from relative to absolute and then to preset', () => {
    render(<DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />);
    // There should only be one on the relative page
    expect(screen.getAllByTitle(/Increment hours/).length).toEqual(1);

    userEvent.click(screen.getByTestId('date-time-picker__field'));
    userEvent.click(screen.getAllByText('Absolute')[0]);

    // There should be two on the Absolute page
    expect(screen.getAllByTitle(/Increment hours/).length).toEqual(2);

    userEvent.click(screen.getAllByText('Absolute')[0]);
  });

  it('should not show the relative option', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={defaultAbsoluteValue}
        showRelativeOption={false}
        hasTimeInput={false}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  // https://github.com/IBM/carbon-addons-iot-react/issues/1179
  it('should not show the relative option with preset as default value', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        defaultValue={PRESET_VALUES[1]}
        showRelativeOption={false}
      />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--radio-button')).toHaveLength(0);
  });

  it('should set the value relative to yesterday', () => {
    const wrapper = mount(
      <DateTimePicker
        {...dateTimePickerProps}
        intervals={[
          {
            label: 'minutes',
            value: INTERVAL_VALUES.MINUTES,
          },
        ]}
        relatives={[
          {
            label: 'Yesterday',
            value: RELATIVE_VALUES.YESTERDAY,
          },
        ]}
      />
    );
    wrapper.find('.iot--date-time-picker__listitem--custom').first().simulate('click');
    const today = dayjs().subtract(1, 'days');
    wrapper.find('.bx--number__control-btn.up-icon').first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      `${today.subtract(1, 'minute').format('YYYY-MM-DD HH:mm')} to ${today.format(
        'YYYY-MM-DD HH:mm'
      )}`
    );
  });

  it('should switch from relative to presets', () => {
    const wrapper = mount(
      <DateTimePicker {...dateTimePickerProps} defaultValue={defaultRelativeValue} />
    );
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    wrapper.find('.iot--date-time-picker__field').first().simulate('click');

    wrapper.find('.iot--date-time-picker__menu-btn-back').first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.iot--time-picker__controls--btn')).toHaveLength(0);
  });

  it('should keep preset value when switching from presets to relative and back', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    wrapper.find('.iot--date-time-picker__field').first().simulate('click');
    // if you are wondering about hostNodes https://github.com/enzymejs/enzyme/issues/836#issuecomment-401260477
    expect(
      wrapper.find('.iot--date-time-picker__listitem--preset-selected').hostNodes()
    ).toHaveLength(1);

    wrapper.find('.iot--date-time-picker__listitem--custom').first().simulate('click');

    wrapper.find('.iot--date-time-picker__menu-btn-back').first().simulate('click');

    expect(
      wrapper.find('.iot--date-time-picker__listitem--preset-selected').hostNodes()
    ).toHaveLength(1);
  });

  it('should render with programmatically set absolute range', () => {
    const wrapper = mount(<DateTimePicker {...dateTimePickerProps} />);
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.bx--tooltip__trigger').text()).toEqual(PRESET_VALUES[0].label);

    wrapper.setProps({ defaultValue: defaultAbsoluteValue });
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      '2020-04-01 12:34 to 2020-04-06 10:49'
    );

    wrapper.find('.iot--date-time-picker__icon').first().simulate('click');
    jest.runAllTimers();

    wrapper.find('.iot--time-picker__controls--btn.up-icon').first().simulate('click');
    jest.runAllTimers();
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      '2020-04-01 13:34 to 2020-04-06 10:49'
    );

    wrapper.find('.iot--date-time-picker__menu-btn-back').first().simulate('click');
    jest.runAllTimers();
    wrapper.find('.iot--date-time-picker__menu-btn-cancel').first().simulate('click');
    jest.runAllTimers();

    expect(dateTimePickerProps.onCancel).toHaveBeenCalled();
    expect(wrapper.find('.iot--date-time-picker__field')).toHaveLength(1);
    expect(wrapper.find('.iot--date-time-picker__field').first().text()).toEqual(
      '2020-04-01 12:34 to 2020-04-06 10:49'
    );
  });

  it('i18n string test', () => {
    const i18nTest = {
      toLabel: 'to-label',
      toNowLabel: 'to-now-label',
      calendarLabel: 'calendar-label',
      presetLabels: ['last-30-min', 'last-1-hour', 'last-6-hour', 'last-12-hour', 'last-24-hour'],
      intervalLabels: ['mins', 'hrs', 'dys', 'wks', 'mths', 'yrs'],
      relativeLabels: ['today', 'yesterday'],
      customRangeLinkLabel: 'custom-range',
      customRangeLabel: 'custom-range-2',
      relativeLabel: 'relative',
      lastLabel: 'last',
      invalidNumberLabel: 'number-is-not-valid',
      relativeToLabel: 'relative-to',
      absoluteLabel: 'absolute',
      startTimeLabel: 'start-time',
      endTimeLabel: 'end-time',
      applyBtnLabel: 'apply',
      cancelBtnLabel: 'cancel',
      backBtnLabel: 'back',
    };

    const presets = [
      {
        id: 'item-01',
        label: 'last-30-min',
        offset: 30,
      },
      {
        id: 'item-02',
        label: 'last-1-hour',
        offset: 60,
      },
      {
        id: 'item-03',
        label: 'last-6-hour',
        offset: 360,
      },
      {
        id: 'item-04',
        label: 'last-12-hour',
        offset: 720,
      },
      {
        id: 'item-05',
        label: 'last-24-hour',
        offset: 1440,
      },
    ];

    const i18nDefault = DateTimePicker.defaultProps.i18n;

    const relatives = [
      {
        label: 'today',
        value: RELATIVE_VALUES.TODAY,
      },
      {
        label: 'yesterday',
        value: RELATIVE_VALUES.YESTERDAY,
      },
    ];

    render(
      <DateTimePicker id="datetimepicker" presets={presets} i18n={i18nTest} relatives={relatives} />
    );
    i18nTest.presetLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    expect(screen.getAllByText(i18nTest.toNowLabel, { exact: false })[0]).toBeInTheDocument();
    expect(screen.getByLabelText(i18nTest.calendarLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.customRangeLinkLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.applyBtnLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.cancelBtnLabel)).toBeInTheDocument();

    i18nDefault.presetLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(i18nDefault.toNowLabel, { exact: false })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(i18nDefault.calendarLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.customRangeLinkLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.applyBtnLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.cancelBtnLabel)).not.toBeInTheDocument();
    // custom relative range screen
    fireEvent.click(screen.getByText(i18nTest.customRangeLinkLabel));
    i18nTest.intervalLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    i18nTest.relativeLabels.forEach((label) => {
      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
    expect(screen.getByText(i18nTest.customRangeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.backBtnLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.relativeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.lastLabel)).toBeInTheDocument();

    i18nDefault.intervalLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    i18nDefault.relativeLabels.forEach((label) => {
      expect(screen.queryByText(label)).not.toBeInTheDocument();
    });
    expect(screen.queryByText(i18nDefault.customRangeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.backBtnLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.relativeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.lastLabel)).not.toBeInTheDocument();
    // custom range absolute screen.
    fireEvent.click(screen.getByText(i18nTest.absoluteLabel));
    expect(screen.getByText(i18nTest.startTimeLabel)).toBeInTheDocument();
    expect(screen.getByText(i18nTest.endTimeLabel)).toBeInTheDocument();

    expect(screen.queryByText(i18nDefault.startTimeLabel)).not.toBeInTheDocument();
    expect(screen.queryByText(i18nDefault.endTimeLabel)).not.toBeInTheDocument();
    // click apply
    fireEvent.click(screen.getByText(i18nTest.applyBtnLabel));
    expect(screen.getAllByTitle(new RegExp(`.*${i18nTest.toLabel}.*`))[0]).toBeInTheDocument();

    expect(
      screen.queryByTitle(new RegExp(`.*\\s${i18nDefault.toLabel}\\s.*`))
    ).not.toBeInTheDocument();
  });
});
