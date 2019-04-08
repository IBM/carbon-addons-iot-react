import {
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Loading,
  InlineNotification,
} from 'carbon-components-react';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import styled from 'styled-components';
import { rem } from 'polished';

import { scrollErrorIntoView } from '../../utils/componentUtilityFunctions';
import ButtonEnhanced from '../ButtonEnhanced';
import { COLORS } from '../../styles/styles';

const StyledModal = styled(ComposedModal)`
   {
    /* is is also an error modal? */
    &.error-modal {
      .bx--modal-container {
        border-top: ${COLORS.errorRed} ${rem(4)} solid;
      }
    }

    .bx--modal-container {
      @media (min-height: ${rem(515)}) {
        overflow-y: auto;
      }
    }

    /* support large modals for ll the sizes */
    &.big-modal {
      .bx--modal-header {
        margin-bottom: 0rem;
      }
      .bx--modal-container {
        min-height: ${rem(600)};
        min-width: ${rem(800)};
        max-height: 80%;
        @media (min-width: ${rem(600)}) {
          height: auto;
        }
        @media (min-width: ${rem(1024)}) {
          max-width: 80%;
        }
        @media (min-width: ${rem(1200)}) {
          max-width: 60%;
        }
      }
    }

    /* Needed for buttons when they're next to each other */
    .bx--btn + .bx--btn {
      margin-left: 1rem;
    }
    .bx--modal-footer {
      * + * {
        margin-left: 1rem;
      }
    }
    .bx--modal-header__heading {
      margin-bottom: 0.75rem;
    }
    .bx--modal-content__text {
      font-size: 1rem;
    }
    .bx--modal-content {
      min-height: ${rem(200)};
    }
  }
`;

const StyledMessageBox = styled(InlineNotification)`
   {
    width: 100%;
  }
`;

const StyledModalFooter = styled(ModalFooter)`
   {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    flex-grow: 0;
    justify-content: flex-end;
    .modal-greedy-spacer {
      flex-grow: 2;
      text-align: left; // needed to override the dialog style
    }
  }
`;
const StyledButtons = styled.div`
   {
    display: flex;
  }
`;

export const BaseModalPropTypes = {
  /** Header Props
   * label: goes on top of the dialog
   * title: Heading of the dialog
   * helpText, additional information will stay at the top of the screen when scrolling dialog content
   */
  header: PropTypes.shape({
    label: PropTypes.string,
    title: PropTypes.string,
    helpText: PropTypes.node,
  }),
  /** ability to add translation string to close icon */
  iconDescription: PropTypes.string,

  /** Content to render inside Modal */
  children: PropTypes.node,
  /** Footer Props
   * Either supply your own footer element or supply an object with button labels and submit handlers and we will make a footer with two buttons for you
   */
  footer: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.shape({
      primaryButtonLabel: PropTypes.node,
      secondaryButtonLabel: PropTypes.node,
    }),
  ]),
  /** NEW PROP: Type of dialog, affects colors, styles of dialog */
  type: PropTypes.oneOf(['warn', 'normal']),
  /** NEW PROP: Whether this particular dialog needs to be very large */
  isLarge: PropTypes.bool,

  /** Should the dialog be open or not */
  open: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /**   Close the dialog */
  onClose: PropTypes.func.isRequired,

  /**  Is data currently being sent to the backend */
  sendingData: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  /**  Is my data actively loading? */
  isFetchingData: PropTypes.bool,

  /** Form Error Details */
  error: PropTypes.string,
  /**  Clear the currently shown error, triggered if the user closes the ErrorNotification */
  onClearError: PropTypes.func,

  /** Did the form submission fail */
  submitFailed: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /** Is the form currently invalid */
  invalid: PropTypes.bool, // eslint-disable-line react/boolean-prop-naming
  /** Callback to submit the dialog/form */
  onSubmit: PropTypes.func,
};

/**
 * Renders a carbon modal dialog.  This dialog adds these additional features on top of the base carbon dialog:
 *  adds header.helpText prop to explain dialog
 *  adds type prop for warning and error type dialogs
 *  adds isLarge prop for large and small class styling dialogs
 *  adds isFetchingData props for loading state
 *  adds error and dataError prop to display notification about error at bottom of dialog
 *  if submitFailed prop, it will find and scroll the failing carbon element into view
 *  shows spinner on primary dialog button if sendingData prop is true
 *
 * We also prevent the dialog from closing if you click outside it.
 *
 */
class BaseModal extends React.Component {
  static propTypes = BaseModalPropTypes;

  static defaultProps = {
    open: true,
    error: null,
    isFetchingData: false,
    sendingData: null,
    onClearError: null,
    type: null,
    footer: null,
    isLarge: false,
    submitFailed: false,
    onSubmit: null,
    invalid: false,
    children: null,
    header: {},
    iconDescription: 'Close',
  };

  componentDidUpdate(prevProps) {
    const { submitFailed, invalid } = this.props;
    if (invalid && submitFailed !== prevProps.submitFailed) {
      scrollErrorIntoView(true);
    }
  }

  handleClearError = () => {
    const { onClearError } = this.props;
    if (onClearError) {
      onClearError();
    }
  };

  /** TODO: This is needed to keep the ComposedModal from closing if you click outside it this supports our dialogs on top of dialogs issue */
  doNotClose = () => false;

  render() {
    const {
      header,
      error,
      sendingData,
      children,
      footer,
      open,
      className,
      type,
      onClose,
      isFetchingData,
      isLarge,
      onSubmit,
      iconDescription,
    } = this.props;
    const { label, title, helpText } = header;
    // First check for dataErrors as they are worse than form errors

    return isFetchingData ? (
      <Loading />
    ) : (
      <StyledModal
        open={open}
        onClose={this.doNotClose}
        className={classNames(className, {
          'error-modal': type === 'warn',
          'big-modal': isLarge,
        })}>
        <ModalHeader
          label={label}
          title={title}
          closeModal={onClose}
          buttonOnClick={onClose}
          iconDescription={iconDescription}>
          {helpText ? <p className="bx--modal-content__text">{helpText}</p> : null}
        </ModalHeader>
        {children ? <ModalBody>{children}</ModalBody> : null}
        {error ? (
          <StyledMessageBox
            title={error}
            subtitle=""
            kind="error"
            onCloseButtonClick={this.handleClearError}
          />
        ) : null}
        {footer || onSubmit ? (
          <StyledModalFooter>
            {React.isValidElement(footer) ? (
              <StyledButtons>{footer}</StyledButtons>
            ) : (
              <StyledButtons>
                <ButtonEnhanced kind="secondary" onClick={onClose}>
                  {(footer && footer.secondaryButtonLabel) || 'Cancel'}
                </ButtonEnhanced>
                <ButtonEnhanced
                  kind={type === 'warn' ? 'danger' : 'primary'}
                  loading={
                    (typeof sendingData === 'boolean' && sendingData) ||
                    typeof sendingData === 'string'
                  }
                  onClick={onSubmit}>
                  {(footer && footer.primaryButtonLabel) || 'Save'}
                </ButtonEnhanced>
              </StyledButtons>
            )}
          </StyledModalFooter>
        ) : null}
      </StyledModal>
    );
  }
}

export default BaseModal;
