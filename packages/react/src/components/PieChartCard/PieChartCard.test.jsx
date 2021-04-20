import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import Card from '../Card/Card';
import Table from '../Table/Table';

import PieChartCard, { formatColors } from './PieChartCard';

jest.unmock('@carbon/charts-react');

const chartDataExample = [
  {
    group: '2V2N 9KYPM',
    category: 'cat A',
    value: 1,
  },
  {
    group: 'L22I P66EP L22I P66EP',
    category: 'cat B',
    value: 10,
  },
  {
    group: 'JQAI 2M4L1',
    category: 'cat C',
    value: 20,
  },
  {
    group: 'J9DZ F37AP',
    category: 'cat D',
    value: 50,
  },
  {
    group: 'YEL48 Q6XK YEL48',
    category: 'cat E',
    value: 15,
  },
  {
    group: 'Misc',
    category: 'cat F',
    value: 40,
  },
];

const pieChartCardProps = {
  availableActions: { expand: true },
  content: {
    groupDataSourceId: 'group',
    legendPosition: 'bottom',
  },
  id: 'pie-chart-card',
  isLoading: false,
  isExpanded: false,
  onCardAction: jest.fn(),
  size: CARD_SIZES.LARGE,
  title: 'Schools',
  testID: 'test-pie-chart-card',
  values: chartDataExample,
};

describe('utility functions', () => {
  it('formatColors with array', () => {
    const mockColors = {
      'cat A': 'purple',
    };
    const formattedColors = formatColors(chartDataExample, 'category', mockColors);
    expect(formattedColors.scale['cat A']).toEqual('purple');
    expect(formattedColors.scale['cat B']).toEqual('#1192e8');
  });
  it('formatColors with object', () => {
    const mockColors = {
      'cat A': 'purple',
    };
    const formattedColors = formatColors({ 'cat A': 124, 'cat B': 125 }, undefined, mockColors);
    expect(formattedColors.scale['cat A']).toEqual('purple');
    expect(formattedColors.scale['cat B']).toEqual('#1192e8');
  });
});

/*
  FYI: the underlying Carbon Charts controls have been mocked.
  Check __mocks__/@carbon/charts-react/ for details
*/

describe('PieChartCard', () => {
  it('shows loading skeleton for isLoading even for empty data  ', () => {
    const loadingSkeletonQuery = '.iot--pie-chart-container svg.chart-skeleton';
    const { container, rerender } = render(<PieChartCard {...pieChartCardProps} />);
    let svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeFalsy();

    rerender(<PieChartCard {...pieChartCardProps} isLoading />);
    svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeVisible();

    rerender(<PieChartCard {...pieChartCardProps} isLoading={false} />);
    svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeFalsy();

    rerender(<PieChartCard {...pieChartCardProps} values={[]} isLoading />);
    svgLoadingIcon = container.querySelector(loadingSkeletonQuery);
    expect(svgLoadingIcon).toBeVisible();
  });

  it('shows empty data message when there are no values', () => {
    const noDataMsg = 'No data for this card';
    render(<PieChartCard {...pieChartCardProps} i18n={{ noDataLabel: noDataMsg }} values={[]} />);
    expect(screen.queryByText(noDataMsg)).toBeVisible();
  });

  it('shows table when the card is expanded', () => {
    render(<PieChartCard {...pieChartCardProps} isExpanded />);
    expect(screen.getByTestId('test-pie-chart-card-table')).toBeVisible();
  });

  it('shows uses labels based on groupDataSourceId', () => {
    const groupBasedLabelExample = 'Misc';
    const categoryBasedLabelExample = 'cat A';
    const { rerender } = render(<PieChartCard {...pieChartCardProps} groupDataSourceId="group" />);
    expect(screen.getByText(groupBasedLabelExample)).toBeVisible();
    expect(screen.queryByText(categoryBasedLabelExample)).not.toBeInTheDocument();

    rerender(<PieChartCard {...pieChartCardProps} content={{ groupDataSourceId: 'category' }} />);
    expect(screen.getByText(categoryBasedLabelExample)).toBeVisible();
    expect(screen.queryByText(groupBasedLabelExample)).toBeFalsy();
  });

  it('supports card variables', () => {
    const chartDataExampleWithVariable = [
      { ...chartDataExample[0], group: `{var1}` },
      ...chartDataExample.slice(1),
    ];
    const variableValue = 'Inserted Var';
    render(
      <PieChartCard
        {...pieChartCardProps}
        values={chartDataExampleWithVariable}
        cardVariables={{ var1: variableValue }}
      />
    );
    expect(screen.getByText(variableValue)).toBeInTheDocument();
  });

  it('supports custom colors', () => {
    const colorsMap = {
      'cat A': 'red',
      'cat B': 'green',
      'cat C': 'blue',
      'cat D': 'yellow',
      'cat E': 'purple',
      'cat F': 'orange',
    };

    render(
      <PieChartCard
        {...pieChartCardProps}
        content={{ colors: colorsMap, groupDataSourceId: 'category' }}
      />
    );

    const slices = screen.getAllByRole('group')[0].getElementsByClassName('slice');
    const orderedColors = chartDataExample
      .sort((a, b) => b.value - a.value)
      .map((data) => colorsMap[data.category]);

    for (let index = 0; index < orderedColors.length; index += 1) {
      expect(slices.item(index).getAttribute('fill')).toEqual(orderedColors[index]);
    }
  });

  it('supports custom labels', () => {
    render(
      <PieChartCard
        {...pieChartCardProps}
        content={{
          labelsFormatter: (wrapper) => {
            return `test-label-${wrapper.value}`;
          },
        }}
      />
    );

    chartDataExample.forEach((sliceData) => {
      expect(screen.getByText(`test-label-${sliceData.value}`)).toBeVisible();
    });
  });

  it('shows sample data for isEditable', () => {
    render(<PieChartCard {...pieChartCardProps} isEditable />);
    expect(screen.getByText('Sample 0')).toBeVisible();
    expect(screen.getByText('Sample 1')).toBeVisible();
    expect(screen.getByText('Sample 2')).toBeVisible();
    expect(screen.getByText('Sample 3')).toBeVisible();
  });

  it('uses custom colors for sample data slices', () => {
    const colorsMap = {
      'cat A': 'red',
      'cat B': 'green',
    };
    render(
      <PieChartCard
        {...pieChartCardProps}
        isEditable
        content={{ colors: colorsMap, groupDataSourceId: 'category' }}
      />
    );
    expect(screen.getByText('Sample 0')).toBeVisible();
    expect(screen.getByText('Sample 1')).toBeVisible();

    const slices = screen.getAllByRole('group')[0].getElementsByClassName('slice');
    const firstSliceColor = slices.item(0).getAttribute('fill');
    const secondSliceColor = slices.item(1).getAttribute('fill');

    // The sample values are random and the pie chart orders the slices after
    // the value so we don't know the order of the colors in this test.
    expect([firstSliceColor, secondSliceColor]).toContain('red');
    expect([firstSliceColor, secondSliceColor]).toContain('green');
  });

  it('can be customised with component overrides', () => {
    const TestCard = (props) => {
      return <Card {...props} data-testid="custom-test-card" />;
    };
    const TestPieChart = () => {
      return <div>I am not a pie chart</div>;
    };
    const TestTable = (props) => {
      return <Table {...props} data-testid="custom-test-table" />;
    };

    render(
      <PieChartCard
        {...pieChartCardProps}
        isExpanded
        overrides={{
          card: { component: TestCard },
          pieChart: { component: TestPieChart },
          table: { component: TestTable },
        }}
      />
    );

    expect(screen.getByTestId('custom-test-card')).toBeInTheDocument();
    expect(screen.getByText('I am not a pie chart')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-table')).toBeInTheDocument();
  });

  it('can be customised with props overrides', () => {
    render(
      <PieChartCard
        {...pieChartCardProps}
        isExpanded
        overrides={{
          card: { props: { 'data-testid': 'custom-test-card' } },
          pieChart: {
            props: (origProps) => {
              const propCopy = { ...origProps };
              propCopy.options.data.groupMapsTo = 'category';
              return propCopy;
            },
          },
          table: { props: { 'data-testid': 'custom-test-table' } },
        }}
      />
    );

    expect(screen.getByTestId('custom-test-card')).toBeInTheDocument();
    expect(screen.getByText('cat A')).toBeInTheDocument();
    expect(screen.getByTestId('custom-test-table')).toBeInTheDocument();
  });
});
