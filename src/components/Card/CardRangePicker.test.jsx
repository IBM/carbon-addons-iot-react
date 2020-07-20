import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { mount } from 'enzyme';

import { CARD_ACTIONS } from '../../constants/LayoutConstants';
import { settings } from '../../constants/Settings';

import CardRangePicker from './CardRangePicker';

const { iotPrefix } = settings;

describe('CardRangePicker', () => {
  const mockOnCardAction = jest.fn();
  const selectTimeRangeLabel = 'Select time range';
  const defaultLabel = 'Default';
  const last24HoursLabel = 'Last 24 Hours';
  const thisWeekLabel = 'This week';

  it('card editable actions', async () => {
    render(
      <CardRangePicker
        i18n={{
          selectTimeRangeLabel,
          defaultLabel,
          last24HoursLabel,
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
      />
    );
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    // Click on the default
    const defaultRange = await screen.findByText(defaultLabel);
    fireEvent.click(defaultRange);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'default',
    });
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    const last24Hours = await screen.findByText(last24HoursLabel);
    fireEvent.click(last24Hours);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'last24Hours',
    });
    mockOnCardAction.mockClear();

    // Reopen menu
    fireEvent.click(screen.getAllByTitle(selectTimeRangeLabel)[0]);
    mockOnCardAction.mockClear();
    const thisWeek = await screen.findByText(thisWeekLabel);
    fireEvent.click(thisWeek);
    expect(mockOnCardAction).toHaveBeenCalledWith(CARD_ACTIONS.CHANGE_TIME_RANGE, {
      range: 'thisWeek',
    });
  });

  it('show time range label when enough space', () => {
    const wrapper = mount(
      <CardRangePicker
        i18n={{
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
        cardWidth={500}
        timeRange="thisWeek"
      />
    );
    expect(wrapper.find(`.${iotPrefix}--card--toolbar-timerange-label`)).toHaveLength(1);

    const wrapper2 = mount(
      <CardRangePicker
        i18n={{
          thisWeekLabel,
        }}
        onCardAction={mockOnCardAction}
        cardWidth={229}
        timeRange="thisWeek"
      />
    );
    expect(wrapper2.find(`.${iotPrefix}--card--toolbar-timerange-label`)).toHaveLength(0);
  });
});
