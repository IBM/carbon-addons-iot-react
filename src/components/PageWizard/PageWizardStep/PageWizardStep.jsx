import React from 'react';
import PropTypes from 'prop-types';
import { InlineNotification } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import { childrenPropType } from '../PageWizard';
import Button from '../../Button/Button';

const { iotPrefix } = settings;

const PageWizardStepPropTypes = {
  /** Step identifier for controlling which step is active */
  id: PropTypes.string.isRequired,
  /** Optional callback function for validation */
  onValidate: PropTypes.func,
  /** Children nodes */
  children: childrenPropType,
  /** optional error to show for this step */
  error: PropTypes.node,
  /** optional callback to clear the error */
  onClearError: PropTypes.func,
  /** Internationalized strings */
  i18n: PropTypes.objectOf(PropTypes.string),
  /** Optional sticky footer */
  hasStickyFooter: PropTypes.bool,
  /** Callback function to close the wizard */
  onClose: PropTypes.func.isRequired,
  /** Determines if Cancel or Previous button is rendered */
  hasPrev: PropTypes.bool,
  /** Determines if Next or Submit button is rendered */
  hasNext: PropTypes.bool,
  /** Callback function when Next button is clicked */
  onNext: PropTypes.func,
  /** Optionally determines if Next button is disabled */
  nextDisabled: PropTypes.bool,
  /** Callback function when Previous button is clicked */
  onBack: PropTypes.func,
  /** Renders a loading icon in the Next button */
  sendingData: PropTypes.bool,
  /** Callback function when Submit button is clicked */
  onSubmit: PropTypes.func.isRequired,
};

const PageWizardStepDefaultProps = {
  children: [],
  error: null,
  onClearError: null,
  onValidate: () => true,
  hasStickyFooter: false,
  nextDisabled: false,
  sendingData: false,
  i18n: {
    close: 'Close',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
  },
  hasPrev: false,
  hasNext: false,
  onNext: null,
  onBack: null,
};

const PageWizardStep = ({
  id,
  children,
  onValidate,
  error,
  onClearError,
  i18n,
  hasStickyFooter,
  onClose,
  hasPrev,
  hasNext,
  onNext,
  nextDisabled,
  onBack,
  sendingData,
  onSubmit,
}) => (
  <div className={`${iotPrefix}--page-wizard--step`} id={id}>
    {error ? (
      <InlineNotification
        lowContrast
        title={error}
        subtitle=""
        kind="error"
        onCloseButtonClick={onClearError}
        iconDescription={i18n.close}
      />
    ) : null}
    {children}
    <div
      className={
        hasStickyFooter
          ? `${iotPrefix}--page-wizard--content--actions--sticky`
          : `${iotPrefix}--page-wizard--content--actions`
      }
    >
      {!hasPrev ? (
        <Button onClick={onClose} kind="secondary">
          {i18n.cancel}
        </Button>
      ) : null}
      {hasPrev ? (
        <Button onClick={onBack} kind="secondary">
          {i18n.back}
        </Button>
      ) : null}
      {hasNext ? (
        <Button
          onClick={() => {
            if (onValidate()) {
              if (onNext) onNext();
            }
          }}
          disabled={nextDisabled}
        >
          {i18n.next}
        </Button>
      ) : (
        <Button
          onClick={() => onValidate() && onSubmit()}
          disabled={nextDisabled}
          loading={sendingData}
        >
          {i18n.submit}
        </Button>
      )}
    </div>
  </div>
);

PageWizardStep.propTypes = PageWizardStepPropTypes;
PageWizardStep.defaultProps = PageWizardStepDefaultProps;

export default PageWizardStep;
