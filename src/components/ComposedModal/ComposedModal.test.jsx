import { mount } from 'enzyme';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import * as utilityFunctions from '../../utils/componentUtilityFunctions';
import { settings } from '../../constants/Settings';

import ComposedModal from './ComposedModal';

const { iotPrefix } = settings;

jest.mock('../../utils/componentUtilityFunctions');

const modalProps = {
  onClose: () => jest.fn(),
};

describe('ComposedModal', () => {
  it('invalid field should be scrolled into view', () => {
    const wrapper = mount(<ComposedModal {...modalProps} />);
    wrapper.setProps({ invalid: true, submitFailed: true });
    expect(utilityFunctions.scrollErrorIntoView).toHaveBeenCalledTimes(1);
  });
  it('errors should be cleared', () => {
    const onClearError = jest.fn();
    const wrapper = mount(
      <ComposedModal {...modalProps} error="error" onClearError={onClearError} />
    );
    wrapper
      .find('.bx--inline-notification__close-button')
      .at(0)
      .simulate('click');
    expect(onClearError).toHaveBeenCalledTimes(1);
  });
  it('errors should not cause error', () => {
    const wrapper = mount(<ComposedModal {...modalProps} error="error" />);
    wrapper
      .find('.bx--inline-notification__close-button')
      .at(0)
      .simulate('click');
    // the close button shouldn't cause exception
    expect(wrapper).toBeDefined();
  });
  it('clicking outside Composedmodal does not close it', () => {
    const wrapper = mount(<ComposedModal {...modalProps} />);
    // Have to return false
    expect(wrapper.instance().doNotClose()).toEqual(false);
  });
  it('there should be enough space for the error message to avoid double scrollbars', () => {
    const { rerender } = render(
      <ComposedModal {...modalProps} error="There is an error">
        My test content
      </ComposedModal>
    );

    expect(screen.queryByText('My test content')).toHaveClass(
      `${iotPrefix}--composed-modal__body--small-margin-bottom`
    );

    rerender(<ComposedModal {...modalProps}>My test content</ComposedModal>);

    expect(screen.queryByText('My test content')).not.toHaveClass(
      `${iotPrefix}--composed-modal__body--small-margin-bottom`
    );
  });
});
