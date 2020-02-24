import React from 'react';
import {
  render,
  fireEvent,
  waitForElementToBeRemoved,
  waitForElement,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { sampleHierarchy } from '../List.story';

import HierarchyList, { searchForNestedItemValues, searchForNestedItemIds } from './HierarchyList';

describe('HierarchyList', () => {
  // Mock the scroll function as its not implemented in jsdom
  // https://stackoverflow.com/questions/53271193/typeerror-scrollintoview-is-not-a-function
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  const items = [
    ...Object.keys(sampleHierarchy.MLB['American League']).map(team => ({
      id: team,
      isCategory: true,
      content: {
        value: team,
      },
      children: Object.keys(sampleHierarchy.MLB['American League'][team]).map(player => ({
        id: `${team}_${player}`,
        content: {
          value: player,
          secondaryValue: sampleHierarchy.MLB['American League'][team][player],
        },
        isSelectable: true,
      })),
    })),
    ...Object.keys(sampleHierarchy.MLB['National League']).map(team => ({
      id: team,
      isCategory: true,
      content: {
        value: team,
      },
      children: Object.keys(sampleHierarchy.MLB['National League'][team]).map(player => ({
        id: `${team}_${player}`,
        content: {
          value: player,
          secondaryValue: sampleHierarchy.MLB['National League'][team][player],
        },
        isSelectable: true,
      })),
    })),
  ];

  test('searchForNestedItemValues should return results for single nested list', () => {
    const foundValue = searchForNestedItemValues(items, 'jd');
    expect(foundValue).toEqual([
      {
        children: [
          {
            content: {
              secondaryValue: 'LF',
              value: 'JD Davis',
            },
            id: 'New York Mets_JD Davis',
            isSelectable: true,
          },
        ],
        content: {
          value: 'New York Mets',
        },
        id: 'New York Mets',
        isCategory: true,
      },
    ]);
  });

  test('searchForNestedItemValues should not return results for single nested list', () => {
    const foundValue = searchForNestedItemValues(items, 'abcdefg');
    expect(foundValue).toEqual([]);
  });

  test('searchForNestedItemIds should return results for single nested list', () => {
    const foundValue = searchForNestedItemIds(items, 'New York Mets_JD Davis');
    expect(foundValue).toEqual([
      {
        children: [
          {
            content: {
              secondaryValue: 'LF',
              value: 'JD Davis',
            },
            id: 'New York Mets_JD Davis',
            isSelectable: true,
          },
        ],
        content: {
          value: 'New York Mets',
        },
        id: 'New York Mets',
        isCategory: true,
      },
    ]);
  });

  test('searchNestedItems should not return results for single nested list', () => {
    const foundValue = searchForNestedItemIds(items, 'abcdefg');
    expect(foundValue).toEqual([]);
  });

  test('clicking expansion caret should expand item', () => {
    const { getByTitle, getAllByRole } = render(
      <HierarchyList items={items} title="Hierarchy List" pageSize="xl" />
    );
    fireEvent.click(getAllByRole('button')[0]);
    // Category item should be expanded
    expect(getByTitle('Chicago White Sox')).toBeInTheDocument();
    // Nested item should be visible
    expect(getByTitle('Leury Garcia')).toBeInTheDocument();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeInTheDocument();
    expect(getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(getByTitle('Houston Astros')).toBeInTheDocument();
    expect(getByTitle('Washington Nationals')).toBeInTheDocument();
  });

  test('clicking expansion caret should collapse expanded item', () => {
    const { getByTitle, getAllByRole, queryByTitle } = render(
      <HierarchyList items={items} title="Hierarchy List" pageSize="xl" />
    );
    // Expand
    fireEvent.click(getAllByRole('button')[0]);
    // Category item should be expanded
    expect(getByTitle('Chicago White Sox')).toBeInTheDocument();
    // Nested item should be visible
    expect(getByTitle('Leury Garcia')).toBeInTheDocument();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeInTheDocument();
    expect(getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(getByTitle('Houston Astros')).toBeInTheDocument();
    expect(getByTitle('Washington Nationals')).toBeInTheDocument();
    // Collapse
    fireEvent.click(getAllByRole('button')[0]);
    // Category item should be expanded
    expect(getByTitle('Chicago White Sox')).toBeInTheDocument();
    // Nested item should be visible
    expect(queryByTitle('Leury Garcia')).not.toBeInTheDocument();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeInTheDocument();
    expect(getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(getByTitle('Houston Astros')).toBeInTheDocument();
    expect(getByTitle('Washington Nationals')).toBeInTheDocument();
  });

  test('clicking nextpage should display the second page', () => {
    const { getByTitle, queryByTitle, getAllByRole } = render(
      <HierarchyList items={items} title="Hierarchy List" pageSize="sm" />
    );
    // Only 5 categories should be showing by default
    expect(getByTitle('Chicago White Sox')).toBeInTheDocument();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeInTheDocument();
    expect(getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(getByTitle('Houston Astros')).toBeInTheDocument();
    // 1 category should be hidden as its on page 2
    expect(queryByTitle('Washington Nationals')).not.toBeInTheDocument();

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[buttons.length - 1]);
    // Only 1 categories should be showing by default
    expect(getByTitle('Washington Nationals')).toBeInTheDocument();
    // The other 5 categories should be hidden as they're on page 1
    expect(queryByTitle('Chicago White Sox')).not.toBeInTheDocument();
    expect(queryByTitle('New York Mets')).not.toBeInTheDocument();
    // Yankees are once again unworthy
    expect(queryByTitle('New York Yankees')).not.toBeInTheDocument();
    expect(queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
    expect(queryByTitle('Houston Astros')).not.toBeInTheDocument();
  });

  test('found search result categories should be expanded', () => {
    const { getByLabelText, getByTitle, queryByTitle } = render(
      <HierarchyList items={items} hasSearch title="Hierarchy List" pageSize="lg" />
    );
    fireEvent.change(getByLabelText('Enter a value'), { target: { value: 'jd' } });
    /** Need to wait for the element to be removed because the search function
        has a debouncing timeout */
    // eslint-disable-next-line
    waitForElementToBeRemoved(() => queryByTitle('New York Yankees')).then(() => {
      // Category containing value should appear
      expect(getByTitle('New York Mets')).toBeInTheDocument();
      // Yankees are not worthy
      expect(queryByTitle('New York Yankees')).not.toBeInTheDocument();
      expect(queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
      expect(queryByTitle('Chicago White Sox')).not.toBeInTheDocument();
      expect(queryByTitle('Houston Astros')).not.toBeInTheDocument();
      expect(queryByTitle('Washington Nationals')).not.toBeInTheDocument();
      // Found item should appear
      expect(getByTitle('JD Davis')).toBeInTheDocument();
    });
  });

  test('all items should return if search value is empty string', async () => {
    const { getByLabelText, getByTitle, queryByTitle } = render(
      <HierarchyList items={items} hasSearch title="Hierarchy List" />
    );
    fireEvent.change(getByLabelText('Enter a value'), { target: { value: 'jd davis' } });
    /** Need to wait for the element to be removed because the search function
        has a debouncing timeout */
    // eslint-disable-next-line
    waitForElementToBeRemoved(() => queryByTitle('New York Yankees')).then(async () => {
      // Category containing value should appear
      expect(getByTitle('New York Mets')).toBeInTheDocument();
      // Yankees are not worthy
      expect(queryByTitle('New York Yankees')).not.toBeInTheDocument();
      expect(queryByTitle('Atlanta Braves')).not.toBeInTheDocument();
      expect(queryByTitle('Chicago White Sox')).not.toBeInTheDocument();
      expect(queryByTitle('Houston Astros')).not.toBeInTheDocument();
      expect(queryByTitle('Washington Nationals')).not.toBeInTheDocument();
      // Found item should appear
      expect(getByTitle('JD Davis')).toBeInTheDocument();

      // Change search to empty string
      fireEvent.change(getByLabelText('Enter a value'), { target: { value: '' } });
      /** Need to wait for an element to appear because the search function
      has a debouncing timeout */
      const braves = await waitForElement(() => getByTitle('Atlanta Braves'));
      // All categories should appear
      expect(getByTitle('New York Mets')).toBeInTheDocument();
      expect(braves).toBeInTheDocument();
      expect(queryByTitle('Chicago White Sox')).toBeInTheDocument();
      expect(queryByTitle('Houston Astros')).toBeInTheDocument();
      expect(queryByTitle('Washington Nationals')).toBeInTheDocument();
      // Yankees are ... unfortunately worthy as well
      expect(getByTitle('New York Yankees')).toBeInTheDocument();
    });
  });

  test('parent items of defaultSelectedId should be expanded', () => {
    const { getByTitle, queryByTitle } = render(
      <HierarchyList
        items={items}
        title="Hierarchy List"
        pageSize="xl"
        defaultSelectedId="New York Mets_JD Davis"
        hasPagination={false}
      />
    );
    // Nested item should be visible
    expect(getByTitle('JD Davis')).toBeInTheDocument();
    // All other categories should be visible still
    expect(getByTitle('New York Mets')).toBeInTheDocument();
    // Yankees are unfortunately worthy too...
    expect(getByTitle('New York Yankees')).toBeInTheDocument();
    expect(getByTitle('Chicago White Sox')).toBeInTheDocument();
    expect(getByTitle('Atlanta Braves')).toBeInTheDocument();
    expect(getByTitle('Houston Astros')).toBeInTheDocument();
    expect(getByTitle('Washington Nationals')).toBeInTheDocument();
    // But no Yankees players should be visible
    expect(queryByTitle('Gary Sanchez')).not.toBeInTheDocument();
  });

  test('clicking item should fire onSelect', () => {
    const onSelect = jest.fn();
    const { getByTitle, getAllByRole } = render(
      <HierarchyList items={items} title="Hierarchy List" pageSize="xl" onSelect={onSelect} />
    );
    // Expand the category
    fireEvent.click(getAllByRole('button')[0]);
    // Select the item
    fireEvent.click(getByTitle('Leury Garcia'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
