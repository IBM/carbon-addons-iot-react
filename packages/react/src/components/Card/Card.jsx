import React, { useCallback, useMemo, useEffect, useState } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { Tooltip, SkeletonText } from 'carbon-components-react';
import SizeMe from 'react-sizeme';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { settings } from '../../constants/Settings';
import {
  CARD_TITLE_HEIGHT,
  CARD_CONTENT_PADDING,
  CARD_SIZES,
  CARD_LAYOUTS,
  ROW_HEIGHT,
  CARD_DIMENSIONS,
  DASHBOARD_BREAKPOINTS,
  DASHBOARD_COLUMNS,
  DASHBOARD_SIZES,
} from '../../constants/LayoutConstants';
import { CardPropTypes } from '../../constants/CardPropTypes';
import { getCardMinSize, filterValidAttributes } from '../../utils/componentUtilityFunctions';
import { getUpdatedCardSize, useCardResizing } from '../../utils/cardUtilityFunctions';

import CardToolbar from './CardToolbar';

const { prefix, iotPrefix } = settings;

const OptimizedSkeletonText = React.memo(SkeletonText);

/** Full card */
const CardWrapper = ({
  isSelected,
  children,
  dimensions,
  id,
  style,
  className,
  onScroll,
  // The event handlers are needed for when the card appears as grid items
  // in the Dashboard Grid - isEditable
  onMouseDown,
  onMouseUp,
  onTouchEnd,
  onTouchStart,
  onFocus,
  onBlur,
  tabIndex,
  testID,
  ...others
}) => {
  const validOthers = filterValidAttributes(others);

  return (
    <div
      role="presentation"
      data-testid={testID}
      id={id}
      style={{ ...style, '--card-default-height': `${dimensions.y}px` }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
      onScroll={onScroll}
      onFocus={onFocus}
      onBlur={onBlur}
      tabIndex={tabIndex}
      className={classnames(className, `${iotPrefix}--card--wrapper`, {
        [`${iotPrefix}--card--wrapper__selected`]: isSelected,
      })}
      {...validOthers}
    >
      {children}
    </div>
  );
};

/** Header components */
export const CardHeader = (
  { children } // eslint-disable-line react/prop-types
) => <div className={`${iotPrefix}--card--header`}>{children}</div>;

export const CardTitle = (
  { children, title } // eslint-disable-line react/prop-types
) => (
  <span className={`${iotPrefix}--card--title`} title={title}>
    {children}
  </span>
);

const CardContent = (props) => {
  const { children, dimensions, isExpanded, className, testID } = props;
  const height = `${dimensions.y - CARD_TITLE_HEIGHT}px`;
  return (
    <div
      data-testid={testID}
      style={{ [`--card-content-height`]: height }}
      className={classnames(className, `${iotPrefix}--card--content`, {
        [`${iotPrefix}--card--content--expanded`]: isExpanded,
      })}
    >
      {children}
    </div>
  );
};

const EmptyMessageWrapper = (props) => {
  const { children } = props;
  return (
    <div
      style={{ '--card-content-padding': `${CARD_CONTENT_PADDING}px` }}
      className={`${iotPrefix}--card--empty-message-wrapper`}
    >
      {children}
    </div>
  );
};

CardWrapper.propTypes = {
  /**
   * Is given the event as argument. Should return true or false if event should trigger selection
   */
  isSelected: PropTypes.bool,
  children: PropTypes.node.isRequired,
  dimensions: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  id: CardPropTypes.id,
  style: PropTypes.objectOf(PropTypes.string),
  testID: CardPropTypes.testID,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onTouchStart: PropTypes.func,
  onScroll: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  /** Optionally sets a keyboard tab index for the container */
  tabIndex: PropTypes.number,
};
CardWrapper.defaultProps = {
  isSelected: false,
  id: undefined,
  style: undefined,
  testID: 'Card',
  onMouseDown: undefined,
  onMouseUp: undefined,
  onTouchEnd: undefined,
  onTouchStart: undefined,
  onScroll: undefined,
  onFocus: undefined,
  onBlur: undefined,
  tabIndex: undefined,
};
CardContent.propTypes = {
  testID: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  dimensions: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
  isExpanded: CardPropTypes.isExpanded.isRequired,
};
CardContent.defaultProps = { children: undefined, className: '', testID: 'card-content' };
EmptyMessageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export const defaultProps = {
  size: CARD_SIZES.MEDIUM,
  layout: CARD_LAYOUTS.HORIZONTAL,
  title: undefined,
  toolbar: undefined,
  hideHeader: false,
  timeRange: undefined,
  isLoading: false,
  isEmpty: false,
  /** In editable mode we'll show preview data */
  isEditable: false,
  isExpanded: false,
  /** performance option: only render the content of the card to the ReactDOM if the card is visible on screen */
  isLazyLoading: false,
  /** For now we will hide the per card actions when we're editing */
  availableActions: {
    edit: false,
    clone: false,
    delete: false,
    range: false,
    expand: false,
    settings: false,
  },
  renderExpandIcon: undefined,
  rowHeight: ROW_HEIGHT,
  breakpoint: DASHBOARD_SIZES.LARGE,
  cardDimensions: CARD_DIMENSIONS,
  dashboardBreakpoints: DASHBOARD_BREAKPOINTS,
  dashboardColumns: DASHBOARD_COLUMNS,
  i18n: {
    noDataLabel: 'No data is available for this time range.',
    noDataShortLabel: 'No data',
    errorLoadingDataLabel: 'Error loading data for this card: ',
    errorLoadingDataShortLabel: 'Data error.',
    timeRangeLabel: 'Time range',
    rollingPeriodLabel: 'Rolling period',
    defaultLabel: 'Default',
    last24HoursLabel: 'Last 24 hrs',
    last7DaysLabel: 'Last 7 days',
    lastMonthLabel: 'Last month',
    lastQuarterLabel: 'Last quarter',
    lastYearLabel: 'Last year',
    periodToDateLabel: 'Period to date',
    thisWeekLabel: 'This week',
    thisMonthLabel: 'This month',
    thisQuarterLabel: 'This quarter',
    thisYearLabel: 'This year',
    selectTimeRangeLabel: 'Select time range',
    hourlyLabel: 'Hourly',
    dailyLabel: 'Daily',
    weeklyLabel: 'Weekly',
    monthlyLabel: 'Monthly',
    editCardLabel: 'Edit card',
    cloneCardLabel: 'Clone card',
    deleteCardLabel: 'Delete card',
    closeLabel: 'Close',
    expandLabel: 'Expand to fullscreen',
    overflowMenuDescription: 'Open and close list of options',
  },
  onMouseDown: undefined,
  onMouseUp: undefined,
  onTouchEnd: undefined,
  onTouchStart: undefined,
  onScroll: undefined,
  onFocus: undefined,
  onBlur: undefined,
  tabIndex: undefined,
  testID: CardWrapper.defaultProps.testID,
  customToolbarContent: undefined,
};

/** Dumb component that renders the card basics */
const Card = (props) => {
  const {
    size,
    children,
    title,
    layout,
    isLoading,
    isEmpty,
    isEditable,
    isExpanded,
    isLazyLoading,
    isResizable,
    resizeHandles: wrappingCardResizeHandles,
    error,
    hideHeader,
    id,
    tooltip,
    timeRange,
    timeRangeOptions,
    onCardAction,
    availableActions,
    renderExpandIcon,
    breakpoint,
    i18n,
    style,
    className,
    values,
    testID,
    contentClassName,
    customToolbarContent,
    ...others
  } = props;
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const isSM = newSize === CARD_SIZES.SMALL;

  const dimensions = getCardMinSize(
    breakpoint,
    newSize,
    others.dashboardBreakpoints,
    others.cardDimensions,
    others.rowHeight,
    others.dashboardColumns
  );

  // Need to cache the default available actions so it doesn't rerender
  const mergedAvailableActions = useMemo(
    () => ({
      ...defaultProps.availableActions,
      ...availableActions,
    }),
    [availableActions]
  );

  const hasToolbarActions = Object.values(mergedAvailableActions).includes(true);

  const strings = {
    ...defaultProps.i18n,
    ...i18n,
  };

  /** adds the id to the card action */
  const cachedOnCardAction = useCallback((...args) => onCardAction(id, ...args), [
    onCardAction,
    id,
  ]);

  const getChildSize = (cardSize, cardTitle) => {
    const childSize = {
      ...cardSize,
      height:
        cardTitle === null || cardTitle === undefined
          ? cardSize.height
          : cardSize.height - CARD_TITLE_HEIGHT,
    };
    return childSize;
  };

  // Ensure the title text has a tooltip only if the title text is truncated
  const titleRef = React.createRef();
  const [hasTitleTooltip, setHasTitleTooltip] = useState(false);
  useEffect(() => {
    if (titleRef.current && titleRef.current.clientWidth < titleRef.current.scrollWidth) {
      setHasTitleTooltip(true);
    } else {
      setHasTitleTooltip(false);
    }
  });

  const { resizeHandles, isResizing } = useCardResizing(
    wrappingCardResizeHandles,
    children,
    isResizable
  );

  const card = (
    <VisibilitySensor partialVisibility offset={{ top: 10 }}>
      {({ isVisible }) => (
        <SizeMe.SizeMe monitorHeight>
          {({ size: cardSize }) => {
            // support passing the card toolbar through to the custom card
            const cardToolbar =
              hasToolbarActions || customToolbarContent ? (
                <CardToolbar
                  width={cardSize.width}
                  availableActions={mergedAvailableActions}
                  renderExpandIcon={renderExpandIcon}
                  i18n={strings}
                  isEditable={isEditable}
                  isExpanded={isExpanded}
                  timeRange={timeRange}
                  timeRangeOptions={timeRangeOptions}
                  onCardAction={cachedOnCardAction}
                  customToolbarContent={customToolbarContent}
                />
              ) : null;

            return (
              <CardWrapper
                {...others} // you need all of these to support dynamic positioning during edit
                testID={testID}
                id={id}
                dimensions={dimensions}
                isExpanded={isExpanded}
                style={
                  !isExpanded
                    ? style
                    : {
                        height: 'calc(100% - 50px)',
                        width: 'calc(100% - 50px)',
                      }
                }
                className={classnames(`${iotPrefix}--card`, className, {
                  [`${iotPrefix}--card--resizing`]: isResizing,
                })}
              >
                {!hideHeader && (
                  <CardHeader>
                    <CardTitle title={title}>
                      {hasTitleTooltip ? (
                        <Tooltip
                          ref={titleRef}
                          showIcon={false}
                          triggerClassName={`${iotPrefix}--card--title--text`}
                          triggerText={title}
                        >
                          {title}
                        </Tooltip>
                      ) : (
                        <div ref={titleRef} className={`${iotPrefix}--card--title--text`}>
                          {title}
                        </div>
                      )}
                      {tooltip && (
                        <Tooltip
                          triggerId={`card-tooltip-trigger-${id}`}
                          tooltipId={`card-tooltip-${id}`}
                          id={`card-tooltip-${id}`} // https://github.com/carbon-design-system/carbon/pull/6744
                          triggerText=""
                        >
                          {tooltip}
                        </Tooltip>
                      )}
                    </CardTitle>
                    {cardToolbar}
                  </CardHeader>
                )}
                <CardContent
                  testID={`${testID}-content`}
                  dimensions={dimensions}
                  isExpanded={isExpanded}
                  className={contentClassName}
                >
                  {!isVisible && isLazyLoading ? ( // if not visible don't show anything
                    ''
                  ) : isLoading ? (
                    <div
                      style={{
                        '--card-content-padding': `${CARD_CONTENT_PADDING}px`,
                      }}
                      className={`${iotPrefix}--card--skeleton-wrapper`}
                    >
                      <OptimizedSkeletonText
                        paragraph
                        lineCount={
                          newSize === CARD_SIZES.SMALL || newSize === CARD_SIZES.SMALLWIDE ? 2 : 3
                        }
                        width="100%"
                      />
                    </div>
                  ) : error ? (
                    <EmptyMessageWrapper>
                      {newSize === CARD_SIZES.SMALL || newSize === CARD_SIZES.SMALLWIDE
                        ? strings.errorLoadingDataShortLabel
                        : `${strings.errorLoadingDataLabel} ${error}`}
                    </EmptyMessageWrapper>
                  ) : isEmpty && !isEditable ? (
                    <EmptyMessageWrapper>
                      {isSM ? strings.noDataShortLabel : strings.noDataLabel}
                    </EmptyMessageWrapper>
                  ) : Array.isArray(children) && typeof children?.[0] === 'function' ? ( // pass the measured size down to the children if it's an render function
                    [
                      // first option is a function
                      children?.[0](getChildSize(cardSize, title), {
                        cardToolbar,
                        ...props,
                      }), // second and third options are the resizable handles
                      children?.slice(1),
                    ]
                  ) : typeof children === 'function' ? (
                    children?.(getChildSize(cardSize, title), {
                      cardToolbar,
                      ...props,
                    })
                  ) : (
                    children
                  )}
                </CardContent>
                {resizeHandles}
              </CardWrapper>
            );
          }}
        </SizeMe.SizeMe>
      )}
    </VisibilitySensor>
  );

  return isExpanded ? (
    <div
      data-floating-menu-container // needed to place overflow floating menus within the modal so we can control them through css
      className={`${prefix}--modal is-visible`}
    >
      {card}
    </div>
  ) : (
    card
  );
};

Card.propTypes = CardPropTypes;
Card.defaultProps = defaultProps;

export default Card;
