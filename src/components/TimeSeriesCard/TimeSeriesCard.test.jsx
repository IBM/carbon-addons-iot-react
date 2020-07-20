import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Table from '../Table/Table';
import { getIntervalChartData } from '../../utils/sample';
import { CARD_SIZES, COLORS, TIME_SERIES_TYPES } from '../../constants/LayoutConstants';
import { barChartData } from '../../utils/barChartDataSample';

import TimeSeriesCard, { handleTooltip, formatChartData, formatColors } from './TimeSeriesCard';

const timeSeriesCardProps = {
  title: 'Temperature',
  id: 'facility-temperature',
  isLoading: false,
  content: {
    series: [
      {
        label: 'Temp',
        dataSourceId: 'temperature',
        // color: text('color', COLORS.PURPLE),
      },
    ],
    xLabel: 'Time',
    yLabel: 'Temperature (˚F)',
    timeDataSourceId: 'timestamp',
  },
  values: getIntervalChartData('hour', 1, { min: 50, max: 100 }, 100),
  interval: 'hour',
  breakpoint: 'lg',
  size: 'LARGE',
  onCardAction: () => {},
};

describe('TimeSeriesCard', () => {
  it('does not show line chart when loading', () => {
    let wrapper = mount(
      <TimeSeriesCard {...timeSeriesCardProps} isLoading size={CARD_SIZES.MEDIUM} />
    );
    expect(wrapper.find('LineChart')).toHaveLength(0);
    expect(wrapper.find('SkeletonText')).toHaveLength(1);

    wrapper = mount(<TimeSeriesCard {...timeSeriesCardProps} size={CARD_SIZES.MEDIUM} />);
    expect(wrapper.find('LineChart')).toHaveLength(1);
    expect(wrapper.find('SkeletonText')).toHaveLength(0);
  });
  it('does not fail to render if no data is given', () => {
    // For whatever reason, these devices do not give back real data so the No data message
    // should render instead of the line graph
    const emptyValues = [{ deviceid: 'robot1' }, { deviceid: 'robot2' }];
    render(
      <TimeSeriesCard {...timeSeriesCardProps} values={emptyValues} size={CARD_SIZES.MEDIUM} />
    );

    expect(screen.getByText('No data is available for this time range.')).toBeInTheDocument();
  });
  it('shows table with data when expanded', () => {
    const wrapper = mount(
      <TimeSeriesCard {...timeSeriesCardProps} isExpanded size={CARD_SIZES.MEDIUMTHIN} />
    );
    expect(wrapper.find('LineChart')).toHaveLength(1);
    // Carbon Table should be there
    expect(wrapper.find(Table)).toHaveLength(1);
  });
  it('shows bar chart when chartLayout is set to bar', () => {
    timeSeriesCardProps.content.chartType = TIME_SERIES_TYPES.BAR;
    const wrapper = mount(<TimeSeriesCard {...timeSeriesCardProps} size={CARD_SIZES.MEDIUMWIDE} />);
    expect(wrapper.find('StackedBarChart')).toHaveLength(1);
  });

  it('handleTooltip should add date', () => {
    const defaultTooltip = '<li>existing tooltip</li>';
    // the date is from 2017
    const updatedTooltip = handleTooltip(
      { date: new Date(1500000000000) },
      defaultTooltip,
      [],
      'Detected alert:'
    );
    expect(updatedTooltip).not.toEqual(defaultTooltip);
    expect(updatedTooltip).toContain('<ul');
    expect(updatedTooltip).toContain('2017');
  });
  it('show line chart when only 1 color is set', () => {
    const timeSeriesCardWithOneColorProps = {
      title: 'Temperature',
      id: 'facility-temperature',
      isLoading: false,
      content: {
        series: [
          {
            label: 'Temperature Device 1',
            dataSourceId: 'temperature',
            dataFilter: {
              ENTITY_ID: 'Sensor2-1',
            },
            color: COLORS.MAGENTA,
          },
          {
            label: 'Temperature Device 2',
            dataSourceId: 'temperature',
            dataFilter: {
              ENTITY_ID: 'Sensor2-3',
            },
            // no color set here
          },
        ],
        xLabel: 'Time',
        yLabel: 'Temperature (˚F)',
        timeDataSourceId: 'timestamp',
      },
      values: getIntervalChartData('day', 12, { min: 10, max: 100 }, 100).reduce(
        (acc, dataPoint) => {
          // make "two devices worth of data" so that we can filter
          acc.push(dataPoint);
          acc.push({
            ...dataPoint,
            temperature: dataPoint.temperature / 2,
            ENTITY_ID: 'Sensor2-3',
          });
          return acc;
        },
        []
      ),
      interval: 'hour',
      breakpoint: 'lg',
      size: 'LARGE',
      onCardAction: () => {},
    };
    const wrapper = mount(<TimeSeriesCard {...timeSeriesCardWithOneColorProps} />);
    expect(wrapper.find('LineChart')).toHaveLength(1);
  });
  it('formatChartData returns properly formatted data without dataFilter set', () => {
    const series = [
      {
        label: 'Amsterdam',
        dataSourceId: 'particles',
      },
    ];

    expect(
      formatChartData(
        'timestamp',
        series,
        barChartData.timestamps.filter(data => data.city === 'Amsterdam')
      )
    ).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 447,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 450,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 512,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 565,
      },
    ]);
  });
  it('formatChartData respects dates', () => {
    const series = [
      {
        label: 'Amsterdam',
        dataSourceId: 'particles',
      },
    ];

    expect(
      formatChartData(
        undefined,
        series,
        barChartData.timestamps
          .filter(data => data.city === 'Amsterdam')
          .map(data => ({ ...data, timestamp: new Date(data.timestamp) }))
      )
    ).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 447,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 450,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 512,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 565,
      },
    ]);
  });
  it('formatChartData returns properly formatted data with dataFilter set', () => {
    const series = [
      {
        label: 'Amsterdam',
        dataSourceId: 'particles',
        dataFilter: {
          city: 'Amsterdam',
        },
        color: COLORS.MAGENTA,
      },
      {
        label: 'New York',
        dataSourceId: 'particles',
        dataFilter: {
          city: 'New York',
        },
        // no color set here
      },
    ];

    expect(formatChartData('timestamp', series, barChartData.timestamps)).toEqual([
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 447,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 450,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 512,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'Amsterdam',
        value: 565,
      },
      {
        date: new Date('2020-02-09T16:23:45.000Z'),
        group: 'New York',
        value: 528,
      },
      {
        date: new Date('2020-02-10T16:23:45.000Z'),
        group: 'New York',
        value: 365,
      },
      {
        date: new Date('2020-02-11T16:23:45.000Z'),
        group: 'New York',
        value: 442,
      },
      {
        date: new Date('2020-02-12T16:23:45.000Z'),
        group: 'New York',
        value: 453,
      },
    ]);
  });
  it('formatChartData returns empty array if no data matches dataFilter', () => {
    const series = [
      {
        label: 'Amsterdam',
        dataSourceId: 'particles',
        dataFilter: {
          city: 'Not Amsterdam',
        },
      },
    ];

    expect(
      formatChartData(
        'timestamp',
        series,
        barChartData.timestamps.filter(data => data.city === 'Amsterdam')
      )
    ).toEqual([]);
  });
  it('formatColors returns correct format if series is array', () => {
    const series = [
      {
        label: 'Amsterdam',
        dataSourceId: 'particles',
        color: 'blue',
      },
      {
        label: 'New York',
        dataSourceId: 'particles',
        color: 'yellow',
      },
    ];

    expect(formatColors(series)).toEqual({
      identifier: 'group',
      scale: { Amsterdam: 'blue', 'New York': 'yellow' },
    });
  });
  it('formatColors returns correct format if series is object', () => {
    const series = {
      label: 'Amsterdam',
      dataSourceId: 'particles',
      color: 'blue',
    };

    expect(formatColors(series)).toEqual({
      identifier: 'group',
      scale: { Amsterdam: 'blue' },
    });
  });
  it('tableColumn headers should use the label, not the dataSourceId', () => {
    render(<TimeSeriesCard {...timeSeriesCardProps} isExpanded size={CARD_SIZES.MEDIUM} />);

    // the dataSourceId is temperature so this should show the appreviated label Temp instead
    expect(screen.getByText('Temp')).toBeInTheDocument();
  });
});
