import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { EventSchedule16 } from '@carbon/icons-react';
import { ToolbarItem, OverflowMenu, OverflowMenuItem } from 'carbon-components-react';
import classnames from 'classnames';
import isNil from 'lodash/isNil';

import { TimeRangeOptionsPropTypes } from '../../constants/CardPropTypes';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

export const CardRangePickerPropTypes = {
  /** Optional selected range to pass at the card level */
  timeRange: PropTypes.string,
  /** Generates the available time range selection options. Each option should include 'this' or 'last'.
   * i.e. { thisWeek: 'This week', lastWeek: 'Last week'}
   */
  timeRangeOptions: TimeRangeOptionsPropTypes, // eslint-disable-line react/require-default-props
  /** callback to handle interactions with the range picker */
  onCardAction: PropTypes.func.isRequired,
  /** set of internationalized labels */
  i18n: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.element])
  ).isRequired,
  cardWidth: PropTypes.number,
};

const defaultProps = {
  timeRange: null,
  cardWidth: undefined,
};

const CardRangePicker = ({
  i18n,
  timeRange: timeRangeProp,
  timeRangeOptions,
  onCardAction,
  cardWidth,
}) => {
  const [timeRange, setTimeRange] = useState(timeRangeProp);

  const handleTimeRange = useCallback(
    value => {
      onCardAction('CHANGE_TIME_RANGE', { range: value });
      setTimeRange(value);
    },
    [setTimeRange, onCardAction]
  );

  return (
    <div className={`${iotPrefix}--card--toolbar-date-range-wrapper`}>
      <ToolbarItem>
        {cardWidth > 400 ? (
          <div id="timeRange" className={`${iotPrefix}--card--toolbar-timerange-label`}>
            {timeRangeOptions[timeRange] || i18n.defaultLabel}
          </div>
        ) : null}

        <OverflowMenu
          className={classnames(`${iotPrefix}--card--toolbar-date-range-action`)}
          flipped
          title={i18n.selectTimeRangeLabel}
          iconDescription={i18n.selectTimeRangeLabel}
          menuOptionsClass={`${iotPrefix}--card--overflow`}
          renderIcon={EventSchedule16}
        >
          <OverflowMenuItem
            key="default"
            onClick={() => handleTimeRange('default')}
            itemText={i18n.defaultLabel}
            className={classnames({
              [`${iotPrefix}--card--overflow-menuitem-active`]:
                timeRange === '' || isNil(timeRange),
            })}
          />
          {Object.keys(timeRangeOptions)
            .filter(i => i.includes('last'))
            .map((i, index) => (
              <OverflowMenuItem
                key={i}
                hasDivider={index === 0}
                onClick={() => handleTimeRange(i)}
                itemText={timeRangeOptions[i]}
                className={classnames({
                  [`${iotPrefix}--card--overflow-menuitem-active`]: timeRange === i,
                })}
              />
            ))}
          {Object.keys(timeRangeOptions)
            .filter(i => i.includes('this'))
            .map((i, index) => (
              <OverflowMenuItem
                key={i}
                hasDivider={index === 0}
                onClick={() => handleTimeRange(i)}
                itemText={timeRangeOptions[i]}
                className={classnames({
                  [`${iotPrefix}--card--overflow-menuitem-active`]: timeRange === i,
                })}
              />
            ))}
        </OverflowMenu>
      </ToolbarItem>
    </div>
  );
};

CardRangePicker.propTypes = CardRangePickerPropTypes;
CardRangePicker.defaultProps = defaultProps;
export default CardRangePicker;
