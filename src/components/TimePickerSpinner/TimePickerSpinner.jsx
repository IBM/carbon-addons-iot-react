import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TimePicker } from 'carbon-components-react';
import { CaretDownGlyph, CaretUpGlyph } from '@carbon/icons-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { keyCodes } from '../../constants/KeyCodeConstants';

const { iotPrefix } = settings;

export const TIMEGROUPS = {
  HOURS: 'HOURS',
  MINUTES: 'MINUTES',
};

const propTypes = {
  /** renders the up/down buttons  */
  spinner: PropTypes.bool,
  /** a default value for the input  */
  value: PropTypes.string,
  /** a list of children to pass to the Carbon TimePicker component  */
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  /** triggered on input click  */
  onClick: PropTypes.func,
  /** triggered on value change  */
  onChange: PropTypes.func,
  /** disable the input  */
  disabled: PropTypes.bool,
  /** set a 12-hour timepicker instead of the default 24-hour  */
  is12hour: PropTypes.bool,
  /** the default selected timegroup (hours, minutes) */
  defaultTimegroup: PropTypes.oneOf([TIMEGROUPS.HOURS, TIMEGROUPS.MINUTES]),
};

const defaultProps = {
  spinner: false,
  value: '',
  children: null,
  onClick: null,
  onChange: null,
  disabled: false,
  is12hour: false,
  defaultTimegroup: TIMEGROUPS.HOURS,
};

const TimePickerSpinner = ({
  spinner,
  value,
  children,
  onClick,
  onChange,
  disabled,
  is12hour,
  defaultTimegroup,
  ...others
}) => {
  const [pickerValue, setPickerValue] = useState(value || '');
  const [currentTimeGroup, setCurrentTimeGroup] = useState(
    defaultTimegroup === TIMEGROUPS.MINUTES ? 1 : 0
  );

  const [isInteractingWithSpinner, setIsInteractingWithSpinner] = useState(false);
  const [isSpinnerFocused, setIsSpinnerFocused] = useState(false);
  const [keyUpOrDownPosition, setKeyUpOrDownPosition] = useState(-1);
  const [focusTarget, setFocusTarget] = useState(null);

  const timePickerRef = React.createRef();

  const handleArrowClick = direction => {
    const timeGroups = pickerValue.split(':');
    if (timeGroups.length === 1) {
      timeGroups.push('00');
    }
    let groupValue = Number(timeGroups[currentTimeGroup]);
    if (Number.isNaN(groupValue)) {
      groupValue = 0;
    }

    const maxForGroup = currentTimeGroup === 0 ? (is12hour ? 12 : 23) : 59;

    if (direction === 'down') {
      groupValue = groupValue - 1 < 0 ? maxForGroup : groupValue - 1;
    } else {
      groupValue = groupValue + 1 > maxForGroup ? 0 : groupValue + 1;
    }

    timeGroups[currentTimeGroup] = groupValue.toString().padStart(2, '0');
    setPickerValue(timeGroups.join(':'));
    window.setTimeout(() => {
      if (focusTarget) {
        focusTarget.selectionStart = keyUpOrDownPosition;
        focusTarget.selectionEnd = keyUpOrDownPosition;
        setKeyUpOrDownPosition(-1);
      }
    }, 0);
  };

  const onInputClick = e => {
    const target = e.currentTarget;
    setFocusTarget(target);
    setCurrentTimeGroup(target.selectionStart <= 2 ? 0 : 1);
    if (onClick) {
      onClick(e);
    }
  };

  const onInputChange = e => {
    setPickerValue(e.currentTarget.value);
    if (onChange) {
      onChange(e);
    }
  };

  const onInputKeyDown = e => {
    const target = e.currentTarget;
    setFocusTarget(target);
    switch (e.keyCode) {
      case keyCodes.UP:
      case keyCodes.DOWN:
        setKeyUpOrDownPosition(target.selectionStart);
        break;
      default:
        break;
    }
  };

  const onInputKeyUp = e => {
    switch (e.keyCode) {
      case keyCodes.LEFT:
      case keyCodes.RIGHT:
        setCurrentTimeGroup(e.currentTarget.selectionStart <= 2 ? 0 : 1);
        break;
      case keyCodes.UP:
        handleArrowClick('up');
        break;
      case keyCodes.DOWN:
        handleArrowClick('down');
        break;
      default:
        break;
    }
  };

  const onArrowClick = direction => {
    setIsInteractingWithSpinner(true);
    handleArrowClick(direction);
  };

  const onArrowInteract = fromFocus => {
    if (!isSpinnerFocused) {
      setIsSpinnerFocused(fromFocus);
    }
    setIsInteractingWithSpinner(true);
  };

  const onArrowStopInteract = fromBlur => {
    if (fromBlur) {
      setIsSpinnerFocused(false);
      setIsInteractingWithSpinner(false);
    }
    if (!isSpinnerFocused) {
      setIsInteractingWithSpinner(false);
    }
  };

  const timeGroupForLabel = currentTimeGroup === 0 ? 'hours' : 'minutes';

  return (
    <div
      className={classnames(`${iotPrefix}--time-picker__wrapper`, {
        [`${iotPrefix}--time-picker__wrapper--with-spinner`]: spinner,
        [`${iotPrefix}--time-picker__wrapper--updown`]: keyUpOrDownPosition > -1,
        [`${iotPrefix}--time-picker__wrapper--show-underline`]: isInteractingWithSpinner,
        [`${iotPrefix}--time-picker__wrapper--show-underline-minutes`]: currentTimeGroup === 1,
      })}
    >
      <TimePicker
        ref={timePickerRef}
        onClick={onInputClick}
        onChange={onInputChange}
        value={pickerValue}
        onKeyDown={onInputKeyDown}
        onKeyUp={onInputKeyUp}
        disabled={disabled}
        {...others}
      >
        {children}
        {spinner ? (
          <div className={`${iotPrefix}--time-picker__controls`}>
            <button
              type="button"
              className={`${iotPrefix}--time-picker__controls--btn up-icon`}
              onClick={() => onArrowClick('up')}
              onMouseOver={() => onArrowInteract(false)}
              onMouseOut={() => onArrowStopInteract(false)}
              onFocus={() => onArrowInteract(true)}
              onBlur={() => onArrowStopInteract(true)}
              aria-live="polite"
              aria-atomic="true"
              title={`Increment ${timeGroupForLabel}`}
              aria-label={`Increment ${timeGroupForLabel}`}
              disabled={disabled}
            >
              <CaretUpGlyph className="up-icon" />
            </button>
            <button
              type="button"
              className={`${iotPrefix}--time-picker__controls--btn down-icon`}
              onClick={() => onArrowClick('down')}
              onMouseOver={() => onArrowInteract(false)}
              onMouseOut={() => onArrowStopInteract(false)}
              onFocus={() => onArrowInteract(true)}
              onBlur={() => onArrowStopInteract(true)}
              aria-live="polite"
              aria-atomic="true"
              title={`Decrement ${timeGroupForLabel}`}
              aria-label={`Decrement ${timeGroupForLabel}`}
              disabled={disabled}
            >
              <CaretDownGlyph className="down-icon" />
            </button>
          </div>
        ) : null}
      </TimePicker>
    </div>
  );
};

TimePickerSpinner.propTypes = propTypes;
TimePickerSpinner.defaultProps = defaultProps;

export default TimePickerSpinner;
