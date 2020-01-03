import { mount } from 'enzyme';
import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';

/* eslint-disable*/
import { Tooltip } from '../Tooltip';
import { ToolbarItem } from '../Toolbar';
import { CARD_SIZES } from '../../constants/LayoutConstants';

import Card, { SkeletonWrapper } from './Card';

const tooltipElement = <div>This is some other text</div>;

const cardProps = {
  title: 'My Title',
  id: 'my card',
};

describe('Card testcases', () => {
  test('xsmall', () => {
    const wrapper = mount(<Card {...cardProps} size={CARD_SIZES.SMALL} />);

    // small should have full header
    expect(wrapper.find('.card--header')).toHaveLength(1);
  });

  test('render icons', () => {
    let wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.SMALL} availableActions={{ range: true }} />
    );
    // should render icons
    expect(wrapper.find(ToolbarItem)).toHaveLength(1);

    wrapper = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.XSMALL}
        availableActions={{ range: true, expand: true }}
      />
    );
    // range icon should not render if isEditable prop is true
    expect(wrapper.find(ToolbarItem)).toHaveLength(2);

    wrapper = mount(
      <Card {...cardProps} size={CARD_SIZES.XSMALL} isEditable availableActions={{ range: true }} />
    );
    // range icon should not render if isEditable prop is true
    expect(wrapper.find(ToolbarItem)).toHaveLength(0);
  });

  test('additional prop based elements', () => {
    let wrapper = mount(<Card {...cardProps} size={CARD_SIZES.LARGE} tooltip={tooltipElement} />);
    // tooltip prop will render a tooltip in the header
    expect(wrapper.find(Tooltip)).toHaveLength(1);
    // without the isLoading prop SkeletonWrapper should not be rendered
    expect(wrapper.find(SkeletonWrapper)).toHaveLength(0);
    // with the isLoading prop SkeletonWrapper should  be rendered
    wrapper = mount(
      <Card {...cardProps} isLoading size={CARD_SIZES.XSMALLWIDE} tooltip={tooltipElement} />
    );
    expect(wrapper.find(SkeletonWrapper)).toHaveLength(1);
  });
  test('isExpanded', () => {
    const wrapper = mount(
      <Card {...cardProps} isExpanded size={CARD_SIZES.LARGE} tooltip={tooltipElement} />
    );
    // isExpanded renders the modal wrapper around it
    expect(wrapper.find('.bx--modal')).toHaveLength(1);
  });
  test('card actions', () => {
    const mockOnCardAction = jest.fn();
    const wrapper = mount(
      <Card
        {...cardProps}
        isExpanded
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ expand: true }}
      />
    );
    wrapper
      .find('.card--toolbar-action')
      .get(0)
      .props.onClick();
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, 'CLOSE_EXPANDED_CARD');

    mockOnCardAction.mockClear();
    const wrapper2 = mount(
      <Card
        {...cardProps}
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ expand: true }}
      />
    );
    wrapper2
      .find('.card--toolbar-action')
      .get(0)
      .props.onClick();
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, 'OPEN_EXPANDED_CARD');
  });
  test('card editable actions', async done => {
    const mockOnCardAction = jest.fn();
    const { getByRole, getByTitle, getByText } = render(
      <Card
        {...cardProps}
        isEditable
        size={CARD_SIZES.LARGE}
        tooltip={tooltipElement}
        onCardAction={mockOnCardAction}
        availableActions={{ edit: true, clone: true, delete: true }}
      />
    );
    fireEvent.click(getByTitle('Open and close list of options'));
    // Click on the first overflow menu item
    const firstMenuItem = await waitForElement(() => getByText('Edit card'));
    fireEvent.click(firstMenuItem);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, 'EDIT_CARD');
    mockOnCardAction.mockClear();
    // Reopen menu
    fireEvent.click(getByTitle('Open and close list of options'));
    const secondElement = await waitForElement(() => getByText('Clone card'));
    fireEvent.click(secondElement);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, 'CLONE_CARD');

    // Reopen menu
    fireEvent.click(getByTitle('Open and close list of options'));
    mockOnCardAction.mockClear();
    const thirdElement = await waitForElement(() => getByText('Delete card'));
    fireEvent.click(thirdElement);
    expect(mockOnCardAction).toHaveBeenCalledWith(cardProps.id, 'DELETE_CARD');
    done();
  });
});
