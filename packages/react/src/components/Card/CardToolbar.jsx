import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { Close16, Popup16, Settings16 } from '@carbon/icons-react';
import { OverflowMenu, OverflowMenuItem, Button } from 'carbon-components-react';
import classnames from 'classnames';

import { settings } from '../../constants/Settings';
import { TimeRangeOptionsPropTypes } from '../../constants/CardPropTypes';
import { CARD_ACTIONS } from '../../constants/LayoutConstants';

import CardRangePicker, { CardRangePickerPropTypes } from './CardRangePicker';

const { iotPrefix, prefix } = settings;

export const ToolbarSVGWrapper = (props) => {
  return (
    <Button
      kind="ghost"
      className={classnames(
        `${iotPrefix}--card--toolbar-action`,
        `${iotPrefix}--card--toolbar-svg-wrapper`,
        `${prefix}--btn--icon-only` // can't actually use the hasIconOnly prop because we don't want the tooltip
      )}
      {...props}
    />
  );
};

const propTypes = {
  /** set of available actions for the card */
  availableActions: PropTypes.objectOf(PropTypes.bool).isRequired,
  /** is the card editable */
  isEditable: PropTypes.bool,
  /** is the card expanded */
  isExpanded: PropTypes.bool,
  /**
   * Define the icon render to be rendered.
   * Can be a React component class
   */
  renderExpandIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  className: PropTypes.string,
  ...omit(CardRangePickerPropTypes, 'onClose'),
  /** Generates the available time range selection options. Each option should include 'this' or 'last'.
   * i.e. { thisWeek: 'This week', lastWeek: 'Last week'}
   */
  timeRangeOptions: TimeRangeOptionsPropTypes,
  /** Optionally adds React nodes to the right of the existing rendered toolbar nodes */
  customToolbarContent: PropTypes.node,
  i18n: PropTypes.shape({
    last24Hours: PropTypes.string,
    last7Days: PropTypes.string,
    lastMonth: PropTypes.string,
    lastQuarter: PropTypes.string,
    lastYear: PropTypes.string,
    thisWeek: PropTypes.string,
    thisMonth: PropTypes.string,
    thisQuarter: PropTypes.string,
    thisYear: PropTypes.string,
    overflowMenuDescription: PropTypes.string,
    cloneCardLabel: PropTypes.string,
    deleteCardLabel: PropTypes.string,
    closeLabel: PropTypes.string,
    expandLabel: PropTypes.string,
    settingsLabel: PropTypes.string,
  }),
};

const defaultProps = {
  isEditable: false,
  isExpanded: false,
  renderExpandIcon: Popup16,
  className: null,
  timeRangeOptions: null,
  customToolbarContent: null,
  i18n: {
    last24Hours: 'Last 24 hours',
    last7Days: 'Last 7 days',
    lastMonth: 'Last month',
    lastQuarter: 'Last quarter',
    lastYear: 'Last year',
    thisWeek: 'This week',
    thisMonth: 'This month',
    thisQuarter: 'This quarter',
    thisYear: 'This year',
    overflowMenuDescription: 'Card actions menu',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
    closeLabel: 'Close',
    expandLabel: 'Expand',
    settingsLabel: 'Settings',
  },
};

const CardToolbar = ({
  i18n,
  width,
  isEditable,
  isExpanded,
  renderExpandIcon,
  availableActions,
  timeRange,
  timeRangeOptions: timeRangeOptionsProp,
  onCardAction,
  className,
  customToolbarContent,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  // maps the timebox internal label to a translated string
  // Need the default here in case that the CardToolbar is used by multiple different components
  // Also needs to reassign itself if i18n changes
  const timeRangeOptions = useMemo(
    () =>
      timeRangeOptionsProp || {
        last24Hours: mergedI18n.last24HoursLabel,
        last7Days: mergedI18n.last7DaysLabel,
        lastMonth: mergedI18n.lastMonthLabel,
        lastQuarter: mergedI18n.lastQuarterLabel,
        lastYear: mergedI18n.lastYearLabel,
        thisWeek: mergedI18n.thisWeekLabel,
        thisMonth: mergedI18n.thisMonthLabel,
        thisQuarter: mergedI18n.thisQuarterLabel,
        thisYear: mergedI18n.thisYearLabel,
      },
    [
      mergedI18n.last24HoursLabel,
      mergedI18n.last7DaysLabel,
      mergedI18n.lastMonthLabel,
      mergedI18n.lastQuarterLabel,
      mergedI18n.lastYearLabel,
      mergedI18n.thisMonthLabel,
      mergedI18n.thisQuarterLabel,
      mergedI18n.thisWeekLabel,
      mergedI18n.thisYearLabel,
      timeRangeOptionsProp,
    ]
  );

  return isEditable ? (
    <div className={classnames(className, `${iotPrefix}--card--toolbar`)}>
      {(availableActions.clone || availableActions.delete) && (
        <OverflowMenu
          flipped
          title={mergedI18n.overflowMenuDescription}
          iconDescription={mergedI18n.overflowMenuDescription}
        >
          {availableActions.clone && (
            <OverflowMenuItem
              onClick={() => {
                onCardAction(CARD_ACTIONS.CLONE_CARD);
              }}
              itemText={mergedI18n.cloneCardLabel}
              title={mergedI18n.cloneCardLabel}
              requireTitle
            />
          )}
          {availableActions.delete && (
            <OverflowMenuItem
              isDelete
              onClick={() => {
                onCardAction(CARD_ACTIONS.DELETE_CARD);
              }}
              itemText={mergedI18n.deleteCardLabel}
              title={mergedI18n.deleteCardLabel}
              requireTitle
            />
          )}
        </OverflowMenu>
      )}
    </div>
  ) : (
    <div className={classnames(className, `${iotPrefix}--card--toolbar`)}>
      {customToolbarContent}
      {availableActions.range ? (
        <CardRangePicker
          width={width}
          i18n={mergedI18n}
          timeRange={timeRange}
          timeRangeOptions={timeRangeOptions}
          onCardAction={onCardAction}
          cardWidth={width}
        />
      ) : null}
      {availableActions.settings ? (
        <ToolbarSVGWrapper
          title={mergedI18n.settingsLabel}
          onClick={() => onCardAction(CARD_ACTIONS.ON_SETTINGS_CLICK)}
          iconDescription={mergedI18n.settingsLabel}
          renderIcon={Settings16}
        />
      ) : null}
      {availableActions.expand ? (
        <>
          {isExpanded ? (
            <ToolbarSVGWrapper
              title={mergedI18n.closeLabel}
              onClick={() => onCardAction(CARD_ACTIONS.CLOSE_EXPANDED_CARD)}
              iconDescription={mergedI18n.closeLabel}
              renderIcon={Close16}
            />
          ) : (
            <ToolbarSVGWrapper
              title={mergedI18n.expandLabel}
              onClick={() => {
                onCardAction(CARD_ACTIONS.OPEN_EXPANDED_CARD);
              }}
              iconDescription={mergedI18n.expandLabel}
              renderIcon={renderExpandIcon}
            />
          )}
        </>
      ) : null}
    </div>
  );
};

CardToolbar.propTypes = propTypes;
CardToolbar.defaultProps = defaultProps;
export default CardToolbar;
