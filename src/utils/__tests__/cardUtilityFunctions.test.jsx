import React from 'react';

import {
  determinePrecision,
  determineCardRange,
  compareGrains,
  getUpdatedCardSize,
  formatNumberWithPrecision,
  formatChartNumberWithPrecision,
  handleCardVariables,
  getVariables,
  getCardVariables,
  replaceVariables,
  chartValueFormatter,
} from '../cardUtilityFunctions';
import { CARD_SIZES } from '../../constants/LayoutConstants';

describe('cardUtilityFunctions', () => {
  it('determine precision', () => {
    // default precisions
    expect(determinePrecision(CARD_SIZES.SMALL, 11.45)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.SMALL, 0.125)).toBeUndefined();
    // For small card sizes always trust the passed precision
    expect(determinePrecision(CARD_SIZES.SMALL, 11.45, 1)).toEqual(1);
    expect(determinePrecision(CARD_SIZES.SMALL, 0.125, 2)).toEqual(2);
    // For integers no precision
    expect(determinePrecision(CARD_SIZES.LARGE, 700)).toEqual(0);
    expect(determinePrecision(CARD_SIZES.LARGE, 1.45, 1)).toEqual(1);
  });
  it('determineCardRange', () => {
    expect(determineCardRange('last24Hours').type).toEqual('rolling');
    expect(determineCardRange('thisWeek').type).toEqual('periodToDate');
  });
  it('compareGrains', () => {
    expect(compareGrains('day', 'day')).toEqual(0);
    expect(compareGrains('hour', 'day')).toEqual(-1);
    expect(compareGrains('week', 'day')).toEqual(1);
  });
  it('GetUpdatedCardSize', () => {
    expect(getUpdatedCardSize('XSMALL')).toEqual('SMALL');
    expect(getUpdatedCardSize('XSMALLWIDE')).toEqual('SMALLWIDE');
    expect(getUpdatedCardSize('WIDE')).toEqual('MEDIUMWIDE');
    expect(getUpdatedCardSize('TALL')).toEqual('LARGETHIN');
    expect(getUpdatedCardSize('XLARGE')).toEqual('LARGEWIDE');
    expect(getUpdatedCardSize('MEDIUM')).toEqual('MEDIUM');
  });
  it('formatNumberWithPrecision', () => {
    expect(formatNumberWithPrecision(3.45, 1, 'fr')).toEqual('3,5'); // decimal separator should be comma
    expect(formatNumberWithPrecision(3.45, 2, 'en')).toEqual('3.45'); // decimal separator should be period
    expect(formatNumberWithPrecision(35000, 2, 'en')).toEqual('35.00K'); // K separator
    expect(formatNumberWithPrecision(35000, null, 'en')).toEqual('35K'); // K separator
  });
  it('formatChartNumberWithPrecision', () => {
    expect(formatChartNumberWithPrecision(3.45, 1, 'fr')).toEqual('3,5'); // decimal separator should be comma
    expect(formatChartNumberWithPrecision(3.45, 2, 'en')).toEqual('3.45'); // decimal separator should be period
    expect(formatChartNumberWithPrecision(35000, 2, 'en')).toEqual('35,000.00');
    expect(formatChartNumberWithPrecision(35000, null, 'en')).toEqual('35,000');
  });
  it('handleCardVariables updates value cards with variables', () => {
    const valueCardPropsWithVariables = {
      title: 'Fuel {variable} flow',
      content: {
        attributes: [
          {
            dataSourceId: 'fuel_flow_rate',
            dataFilter: {
              deviceid: '73000',
            },
            label: 'Latest - 73000',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: 2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate2',
            dataFilter: {
              deviceid: '73001',
            },
            label: 'Latest - 73001',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: '{unitVariable}',
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_min',
            label: 'Minimum {otherVariable}',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '>',
                icon: 'Checkmark outline',
                value: -2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_max',
            label: 'Maximum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '<',
                icon: 'Checkmark outline',
                value: 5,
              },
            ],
          },
        ],
      },
      values: [],
      others: {
        cardVariables: {
          variable: 'big',
          otherVariable: 'small',
          unitVariable: 'F',
        },
        dataSource: {
          range: {
            type: 'periodToDate',
            count: -24,
            interval: 'hour',
          },
          attributes: [
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate',
            },
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate2',
            },
            {
              aggregator: 'min',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_min',
            },
            {
              aggregator: 'max',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_max',
            },
          ],
          groupBy: ['deviceid'],
        },
      },
    };
    const updatedContent = {
      attributes: [
        {
          dataSourceId: 'fuel_flow_rate',
          dataFilter: {
            deviceid: '73000',
          },
          label: 'Latest - 73000',
          precision: 3,
          thresholds: [
            {
              color: '#F00',
              comparison: '>',
              icon: 'Warning',
              value: 2,
            },
          ],
        },
        {
          dataSourceId: 'fuel_flow_rate2',
          dataFilter: {
            deviceid: '73001',
          },
          label: 'Latest - 73001',
          precision: 3,
          thresholds: [
            {
              color: '#F00',
              comparison: '>',
              icon: 'Warning',
              value: 'F',
            },
          ],
        },
        {
          dataSourceId: 'fuel_flow_rate_min',
          label: 'Minimum small',
          precision: 3,
          thresholds: [
            {
              color: '#5aa700',
              comparison: '>',
              icon: 'Checkmark outline',
              value: -2,
            },
          ],
        },
        {
          dataSourceId: 'fuel_flow_rate_max',
          label: 'Maximum',
          precision: 3,
          thresholds: [
            {
              color: '#5aa700',
              comparison: '<',
              icon: 'Checkmark outline',
              value: 5,
            },
          ],
        },
      ],
    };
    const updatedTitle = 'Fuel big flow';
    const updatedValues = [];
    const { title, content, values, others } = valueCardPropsWithVariables;
    expect(handleCardVariables(title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  it('handleCardVariables updates table cards with variables', () => {
    const tableCardPropsWithVariables = {
      title: 'Max and {minimum} speed',
      content: {
        columns: [
          {
            dataSourceId: 'abnormal_stop_id',
            label: 'Abnormal Stop Count',
          },
          {
            dataSourceId: 'speed_id_mean',
            label: 'Mean Speed',
          },
          {
            dataSourceId: 'speed_id_max',
            label: 'Max Speed',
          },
          {
            dataSourceId: 'deviceid',
            linkTemplate: {
              href: 'www.{url}.com',
            },
          },
          {
            dataSourceId: 'timestamp',
            label: 'Time stamp',
            type: 'TIMESTAMP',
          },
        ],
        thresholds: [
          {
            dataSourceId: 'abnormal_stop_id',
            comparison: '>=',
            severity: 1,
            value: 75,
            label: '{level} Severity',
            severityLabel: '{size} severity',
            icon: 'Stop filled',
            color: '#008000',
          },
        ],
        expandedRows: [
          {
            dataSourceId: 'travel_time_id',
            label: 'Mean travel time',
          },
        ],
        sort: 'DESC',
      },
      values: [],
      others: {
        cardVariables: {
          minimum: 1.24,
          url: 'google',
          level: 'high',
          size: 'large',
        },
        dataSource: {
          attributes: [
            {
              aggregator: 'mean',
              attribute: 'speed',
              id: 'speed_id_mean',
            },
            {
              aggregator: 'count',
              attribute: 'abnormal_stop_count',
              id: 'abnormal_stop_id',
            },
            {
              aggregator: 'max',
              attribute: 'speed',
              id: 'speed_id_max',
            },
            {
              aggregator: 'mean',
              attribute: 'travel_time',
              id: 'travel_time_id',
            },
          ],
          range: {
            count: -7,
            interval: 'day',
          },
          timeGrain: 'day',
          groupBy: ['deviceid'],
        },
      },
    };
    const updatedTitle = 'Max and 1.24 speed';
    const updatedContent = {
      columns: [
        {
          dataSourceId: 'abnormal_stop_id',
          label: 'Abnormal Stop Count',
        },
        {
          dataSourceId: 'speed_id_mean',
          label: 'Mean Speed',
        },
        {
          dataSourceId: 'speed_id_max',
          label: 'Max Speed',
        },
        {
          dataSourceId: 'deviceid',
          linkTemplate: {
            href: 'www.google.com',
          },
        },
        {
          dataSourceId: 'timestamp',
          label: 'Time stamp',
          type: 'TIMESTAMP',
        },
      ],
      thresholds: [
        {
          dataSourceId: 'abnormal_stop_id',
          comparison: '>=',
          severity: 1,
          value: 75,
          label: 'high Severity',
          severityLabel: 'large severity',
          icon: 'Stop filled',
          color: '#008000',
        },
      ],
      expandedRows: [
        {
          dataSourceId: 'travel_time_id',
          label: 'Mean travel time',
        },
      ],
      sort: 'DESC',
    };
    const updatedValues = [];
    const { title, content, values, others } = tableCardPropsWithVariables;
    expect(handleCardVariables(title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  it('handleCardVariables returns original card when no value cardVariables are specified', () => {
    const valueCardProps = {
      id: 'fuel_flow',
      size: 'SMALL',
      title: 'Fuel flow',
      content: {
        attributes: [
          {
            dataSourceId: 'fuel_flow_rate',
            dataFilter: {
              deviceid: '73000',
            },
            label: 'Latest - 73000',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: 2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate2',
            dataFilter: {
              deviceid: '73001',
            },
            label: 'Latest - 73001',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: '%',
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_min',
            label: 'Minimum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '>',
                icon: 'Checkmark outline',
                value: -2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_max',
            label: 'Maximum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '<',
                icon: 'Checkmark outline',
                value: 5,
              },
            ],
          },
        ],
      },
      values: [],
      others: {
        dataSource: {
          range: {
            type: 'periodToDate',
            count: -24,
            interval: 'hour',
          },
          attributes: [
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate',
            },
            {
              aggregator: 'last',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate2',
            },
            {
              aggregator: 'min',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_min',
            },
            {
              aggregator: 'max',
              attribute: 'fuel_flow_rate',
              id: 'fuel_flow_rate_max',
            },
          ],
          groupBy: ['deviceid'],
        },
      },
    };
    const { title, content, values, others } = valueCardProps;
    expect(handleCardVariables(title, content, [], others)).toEqual({
      title,
      content,
      values,
      ...others,
    });
  });
  it('handleCardVariables returns original card when no table cardVariables are specified', () => {
    const tableCardProps = {
      title: 'Max and min speed',
      content: {
        columns: [
          {
            dataSourceId: 'abnormal_stop_id',
            label: 'Abnormal Stop Count',
          },
          {
            dataSourceId: 'speed_id_mean',
            label: 'Mean Speed',
          },
          {
            dataSourceId: 'speed_id_max',
            label: 'Max Speed',
          },
          {
            dataSourceId: 'timestamp',
            label: 'Time stamp',
            type: 'TIMESTAMP',
          },
        ],
        thresholds: [
          {
            dataSourceId: 'abnormal_stop_id',
            comparison: '>=',
            severity: 1,
            value: 75,
            label: 'Low Severity',
            severityLabel: 'Low severity',
            icon: 'Stop filled',
            color: '#008000',
          },
        ],
        expandedRows: [
          {
            dataSourceId: 'travel_time_id',
            label: 'Mean travel time',
          },
        ],
        sort: 'DESC',
      },
      values: [],
      others: {
        dataSource: {
          attributes: [
            {
              aggregator: 'mean',
              attribute: 'speed',
              id: 'speed_id_mean',
            },
            {
              aggregator: 'count',
              attribute: 'abnormal_stop_count',
              id: 'abnormal_stop_id',
            },
            {
              aggregator: 'max',
              attribute: 'speed',
              id: 'speed_id_max',
            },
            {
              aggregator: 'mean',
              attribute: 'travel_time',
              id: 'travel_time_id',
            },
          ],
          range: {
            count: -7,
            interval: 'day',
          },
          timeGrain: 'day',
          groupBy: ['deviceid'],
        },
      },
    };
    const { title, content, values, others } = tableCardProps;
    expect(handleCardVariables(title, content, values, others)).toEqual({
      title,
      content,
      values,
      ...others,
    });
  });
  it('handleCardVariables updates cards with variables when there are case discrepancies in cardVariables', () => {
    const timeSeriesCardPropsWithVariables = {
      title: 'timeSeries {device}',
      content: {
        xLabel: '{x_label}',
        yLabel: '{y_label}',
        unit: '{unit}',
        series: [
          {
            dataSourceId: 'airflow_mean',
            label: '{label}',
          },
        ],
      },
      values: [],
      others: {
        cardVariables: {
          x_labEL: 'x-axis',
          y_label: 'y-axis',
          deVice: 'air',
          unit: 'F',
          Label: 'Airflow Mean',
        },
      },
    };
    const updatedTitle = 'timeSeries air';
    const updatedContent = {
      xLabel: 'x-axis',
      yLabel: 'y-axis',
      unit: 'F',
      series: [
        {
          dataSourceId: 'airflow_mean',
          label: 'Airflow Mean',
        },
      ],
    };
    const updatedValues = [];
    const { title, content, values, others } = timeSeriesCardPropsWithVariables;
    expect(handleCardVariables(title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  it('handleCardVariables updates timeseries cards with variables', () => {
    const timeSeriesCardPropsWithVariables = {
      title: 'timeSeries {device}',
      content: {
        xLabel: '{x_label}',
        yLabel: '{y_label}',
        unit: '{unit}',
        series: [
          {
            dataSourceId: 'airflow_mean',
            label: '{label}',
          },
        ],
      },
      values: [],
      others: {
        cardVariables: {
          x_label: 'x-axis',
          y_label: 'y-axis',
          device: 'air',
          unit: 'F',
          label: 'Airflow Mean',
        },
      },
    };
    const updatedTitle = 'timeSeries air';
    const updatedContent = {
      xLabel: 'x-axis',
      yLabel: 'y-axis',
      unit: 'F',
      series: [
        {
          dataSourceId: 'airflow_mean',
          label: 'Airflow Mean',
        },
      ],
    };
    const updatedValues = [];
    const { title, content, values, others } = timeSeriesCardPropsWithVariables;
    expect(handleCardVariables(title, content, values, others)).toEqual({
      title: updatedTitle,
      content: updatedContent,
      values: updatedValues,
      ...others,
    });
  });
  it('handleCardVariables returns original card when no cardVariables are specified', () => {
    const timeSeriesCardProps = {
      title: 'timeSeries',
      content: {
        xLabel: 'x-axis',
        yLabel: 'y-axis',
        unit: 'F',
        series: [
          {
            dataSourceId: 'airflow_mean',
            label: 'Airflow Mean',
          },
        ],
      },
      values: [],
      others: {},
    };
    const { title, content, values, others } = timeSeriesCardProps;
    expect(handleCardVariables(title, content, values, others)).toEqual({
      title,
      content,
      values,
      ...others,
    });
  });
  it('getVariables should return a list of variables from a string', () => {
    const titleWithVariables = '{variable} in a title with {variables}';
    const title = 'A title without variables';
    expect(getVariables(titleWithVariables)).toEqual(['variable', 'variables']);
    expect(getVariables(title)).toEqual(undefined);
  });
  it('getCardVariables returns variables in ValueCards', () => {
    const valueCardWithVariables = {
      id: 'fuel_flow',
      size: 'SMALL',
      title: 'Fuel {variable} flow',
      type: 'VALUE',
      content: {
        attributes: [
          {
            dataSourceId: 'fuel_flow_rate',
            dataFilter: {
              deviceid: '73000',
            },
            label: 'Latest - 73000',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: 2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate2',
            dataFilter: {
              deviceid: '73001',
            },
            label: 'Latest - 73001',
            precision: 3,
            thresholds: [
              {
                color: '#F00',
                comparison: '>',
                icon: 'Warning',
                value: '{unitVariable}',
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_min',
            label: 'Minimum {otherVariable}',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '>',
                icon: 'Checkmark outline',
                value: -2,
              },
            ],
          },
          {
            dataSourceId: 'fuel_flow_rate_max',
            label: 'Maximum',
            precision: 3,
            thresholds: [
              {
                color: '#5aa700',
                comparison: '<',
                icon: 'Checkmark outline',
                value: 5,
              },
            ],
          },
        ],
      },
      dataSource: {
        range: {
          type: 'periodToDate',
          count: -24,
          interval: 'hour',
        },
        attributes: [
          {
            aggregator: 'last',
            attribute: 'fuel_flow_rate',
            id: 'fuel_flow_rate',
          },
          {
            aggregator: 'last',
            attribute: 'fuel_flow_rate',
            id: 'fuel_flow_rate2',
          },
          {
            aggregator: 'min',
            attribute: 'fuel_flow_rate',
            id: 'fuel_flow_rate_min',
          },
          {
            aggregator: 'max',
            attribute: 'fuel_flow_rate',
            id: 'fuel_flow_rate_max',
          },
        ],
        groupBy: ['deviceid'],
      },
    };
    expect(getCardVariables(valueCardWithVariables)).toEqual([
      'variable',
      'unitVariable',
      'otherVariable',
    ]);
  });
  it('getCardVariables returns variables for an ImageCard', () => {
    const imageCardWithVariables = {
      content: {
        alt: 'Sample image',
        src: 'static/media/landscape.69143f06.jpg',
        zoomMax: 10,
        hotspots: [
          {
            icon: 'carbon-icon',
            color: 'blue',
            content: {
              title: 'sensor readings',
              attributes: [
                {
                  dataSourceId: 'temp_last',
                  label: '{high} temp',
                  unit: '{unitVar}',
                },
              ],
            },
            thresholds: [
              {
                dataSourceId: 'temp_last',
                comparison: '>=',
                value: '{thresVar}',
              },
            ],
          },
        ],
      },
      size: 'LARGE',
      title: 'Expanded {large} card',
      type: 'IMAGE',
    };
    expect(getCardVariables(imageCardWithVariables)).toEqual([
      'high',
      'unitVar',
      'thresVar',
      'large',
    ]);
  });
  it('getCardVariables returns variables for a TableCard', () => {
    const tableCardWithVariables = {
      id: 'speed_mean_and_max_threshold',
      size: 'LARGE',
      title: 'Max and {minimum} speed',
      type: 'TABLE',
      content: {
        columns: [
          {
            dataSourceId: 'abnormal_stop_id',
            label: 'Abnormal Stop Count',
          },
          {
            dataSourceId: 'speed_id_mean',
            label: 'Mean Speed',
          },
          {
            dataSourceId: 'speed_id_max',
            label: 'Max Speed',
          },
          {
            dataSourceId: 'deviceid',
            linkTemplate: {
              href: 'www.{url}.com',
              displayValue: '{url}',
            },
          },
          {
            dataSourceId: 'timestamp',
            label: 'Time stamp',
            type: 'TIMESTAMP',
          },
        ],
        thresholds: [
          {
            dataSourceId: 'abnormal_stop_id',
            comparison: '>=',
            severity: 1,
            value: 75,
            label: '{high} Severity',
            severityLabel: '{large} severity',
            icon: 'Stop filled',
            color: '#008000',
          },
        ],
        expandedRows: [
          {
            dataSourceId: 'travel_time_id',
            label: 'Mean travel time',
          },
        ],
        sort: 'DESC',
      },
      dataSource: {
        attributes: [
          {
            aggregator: 'mean',
            attribute: 'speed',
            id: 'speed_id_mean',
          },
          {
            aggregator: 'count',
            attribute: 'abnormal_stop_count',
            id: 'abnormal_stop_id',
          },
          {
            aggregator: 'max',
            attribute: 'speed',
            id: 'speed_id_max',
          },
          {
            aggregator: 'mean',
            attribute: 'travel_time',
            id: 'travel_time_id',
          },
        ],
        range: {
          count: -7,
          interval: 'day',
        },
        timeGrain: 'day',
        groupBy: ['deviceid'],
      },
    };
    expect(getCardVariables(tableCardWithVariables)).toEqual(['minimum', 'url', 'high', 'large']);
  });
  it('getCardVariables returns variables for a TimeSeriesCard', () => {
    const timeSeriesCardWithVariables = {
      id: 'air_flow_mean',
      size: 'LARGE',
      title: 'Air flow {deviceId} mean vs max',
      type: 'TIMESERIES',
      content: {
        series: [
          {
            dataSourceId: 'airflow_mean',
            label: 'Airflow Mean',
          },
          {
            dataSourceId: 'airflow_max',
            label: '{airflow_max}',
          },
        ],
        xLabel: '{x_axis}',
        yLabel: '{y_axis}',
        unit: '{unit}',
        timeDataSourceId: 'timestamp',
      },
      dataSource: {
        attributes: [
          {
            aggregator: 'mean',
            attribute: 'air_flow_rate',
            id: 'airflow_mean',
          },
          {
            aggregator: 'max',
            attribute: 'air_flow_rate',
            id: 'airflow_max',
          },
        ],
        range: {
          type: 'periodToDate',
          count: -7,
          interval: 'day',
        },
        additionalData: {
          type: 'alert',
          dataFilter: {
            name: 'alert_air_flow_rate_greater_than_1',
          },
        },
        timeGrain: 'day',
      },
    };
    expect(getCardVariables(timeSeriesCardWithVariables)).toEqual([
      'deviceId',
      'airflow_max',
      'x_axis',
      'y_axis',
      'unit',
    ]);
  });
  it('getCardVariables does not blow up on null or react symbols', () => {
    const timeSeriesCardWithVariables = {
      id: 'air_flow_mean',
      size: 'LARGE',
      title: 'Air flow {deviceId} mean vs max',
      type: 'TIMESERIES',
      content: {
        series: [
          {
            dataSourceId: 'airflow_max',
            label: '{airflow_max}',
          },
        ],
        xLabel: '{x_axis}',
        yLabel: '{y_axis}',
        unit: '{unit}',
        timeDataSourceId: 'timestamp',
      },
      dataSource: {
        attributes: [
          {
            aggregator: 'max',
            attribute: 'air_flow_rate',
            id: 'airflow_max',
          },
        ],
        range: {
          type: 'periodToDate',
          count: -7,
          interval: 'day',
        },
        timeGrain: 'day',
      },
      someNullProperty: null,
      someReactSymbolProperty: <p>Hi I am a React symbol</p>,
    };
    expect(getCardVariables(timeSeriesCardWithVariables)).toEqual([
      'deviceId',
      'airflow_max',
      'x_axis',
      'y_axis',
      'unit',
    ]);
  });
  it('getCardVariables returns empty array when no variables are given', () => {
    const imageCard = {
      content: {
        alt: 'Sample image',
        src: 'static/media/landscape.69143f06.jpg',
        zoomMax: 10,
        hotspots: [
          {
            icon: 'carbon-icon',
            color: 'blue',
            content: {
              title: 'sensor readings',
              attributes: [
                {
                  dataSourceId: 'temp_last',
                  label: 'temp',
                  unit: 'F',
                },
              ],
            },
            thresholds: [
              {
                dataSourceId: 'temp_last',
                comparison: '>=',
                value: '300',
              },
            ],
          },
        ],
      },
      size: 'LARGE',
      title: 'Expanded card',
      type: 'IMAGE',
    };
    expect(getCardVariables(imageCard)).toEqual([]);
  });
  it('replaceVariables', () => {
    const card = {
      title: 'my {number_variable} {string_variable}',
      thresholds: [{ value: '{number_variable}' }, { value: '{string_variable}' }],
    };
    const updatedCard = replaceVariables(
      ['number_variable', 'string_variable'],
      { number_variable: 100, string_variable: 'mystring' },
      card
    );
    expect(updatedCard.title).toEqual('my 100 mystring');
    expect(updatedCard.thresholds[0].value).toEqual(100);
    expect(updatedCard.thresholds[1].value).toEqual('mystring');
  });
  it('replaceVariables handles nodes correctly', () => {
    const card = {
      title: <p>my default</p>,
      thresholds: [{ value: '{number_variable}' }, { value: '{string_variable}' }],
    };
    const updatedCard = replaceVariables(
      ['number_variable', 'string_variable'],
      { number_variable: 100, string_variable: 'mystring' },
      card
    );
    expect(React.isValidElement(updatedCard.title)).toEqual(true);
    expect(updatedCard.thresholds[0].value).toEqual(100);
    expect(updatedCard.thresholds[1].value).toEqual('mystring');
  });
  it('chartValueFormatter', () => {
    // Small should get 3 precision
    expect(chartValueFormatter(0.23456, CARD_SIZES.LARGE, null)).toEqual('0.235');
    // default precision
    expect(chartValueFormatter(1.23456, CARD_SIZES.LARGE, null)).toEqual('1.2');
    // With units
    expect(chartValueFormatter(0.23456, CARD_SIZES.LARGE, 'writes per second')).toEqual(
      '0.235 writes per second'
    );

    // Large numbers!
    expect(chartValueFormatter(1500, CARD_SIZES.LARGE, null)).toEqual('1,500');
    // nil
    expect(chartValueFormatter(null, CARD_SIZES.LARGE, null)).toEqual('--');
  });
});
