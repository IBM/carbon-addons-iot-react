import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isNil from 'lodash/isNil';
import classNames from 'classnames';

import { CARD_LAYOUTS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getUpdatedCardSize } from '../../utils/cardUtilityFunctions';
import { settings } from '../../constants/Settings';

const { iotPrefix } = settings;

const propTypes = {
  value: PropTypes.any, // eslint-disable-line
  unit: PropTypes.any, // eslint-disable-line
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  isSmall: PropTypes.bool,
  isMini: PropTypes.bool,
  precision: PropTypes.number,
  /** the card size */
  size: PropTypes.string.isRequired,
  color: PropTypes.string,
  isVertical: PropTypes.bool,
  /** Allows the unit and threshold icons to wrap into a new line */
  allowedToWrap: PropTypes.bool.isRequired,
  /** Makes the value and the unit smaller */
  wrapCompact: PropTypes.bool,
};

const defaultProps = {
  layout: CARD_LAYOUTS.HORIZONTAL,
  isSmall: false,
  isMini: false,
  precision: 1,
  color: null,
  isVertical: false,
  wrapCompact: false,
};

const Attribute = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  ${props => (props.unit || props.isSmall) && !props.isVertical && `max-width: 66%`};
  ${props => props.color && `color: ${props.color}`};
  display: flex;
  ${props => props.isMini && 'align-items: center;'}
`;

/** Returns font size in rem */
const determineFontSize = ({ value, size, isSmall, isMini, layout }) => {
  if (typeof value === 'string') {
    switch (size) {
      case CARD_SIZES.SMALL:
        return value.length > 4 ? 1 : 2;
      case CARD_SIZES.SMALLWIDE:
        return layout === CARD_LAYOUTS.HORIZONTAL ? 1.25 : 1;
      default:
    }
  }
  return isMini ? 1 : isSmall ? 2 : 2.5;
};

/** Renders the actual attribute value */
const AttributeValue = styled.span`
  line-height: ${props => (props.isMini ? '1.0rem' : props.isSmall ? '2.0rem' : '2.5rem')};
  font-size: ${props => `${determineFontSize(props)}rem`};
  padding-bottom: 0.25rem;
  font-weight: ${props => (props.isMini ? 'normal' : 'lighter')};
  ${props => props.layout === CARD_LAYOUTS.VERTICAL && `text-align: left;`};
  /* autoprefixer: ignore next */
  ${props =>
    props.allowedToWrap
      ? `white-space: nowrap; text-overflow: ellipsis;`
      : `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow-wrap: break-word;`};
  ${props => !props.hasWords && 'word-break: break-all;'}
  overflow: hidden;
`;

const StyledBoolean = styled.span`
  text-transform: capitalize;
`;

const determinePrecision = (size, value, precision) => {
  // If it's an integer don't return extra values
  if (Number.isInteger(value)) {
    return 0;
  }
  // If the card is xsmall we don't have room for decimals!
  switch (size) {
    case CARD_SIZES.SMALL:
      return Math.abs(value) > 9 ? 0 : precision;
    default:
  }
  return precision;
};

/** This components job is determining how to render different kinds of card values */
const ValueRenderer = ({
  value,
  size,
  unit,
  layout,
  precision: precisionProp,
  isSmall,
  isMini,
  color,
  isVertical,
  allowedToWrap,
  wrapCompact,
}) => {
  // Checks size property against new size naming convention and reassigns to closest supported size if necessary.
  const newSize = getUpdatedCardSize(size);

  const precision = determinePrecision(newSize, value, precisionProp);
  let renderValue = value;
  if (typeof value === 'boolean') {
    renderValue = <StyledBoolean>{value.toString()}</StyledBoolean>;
  }
  if (typeof value === 'number') {
    renderValue =
      value > 1000000000000
        ? `${(value / 1000000000000).toFixed(precision)}T`
        : value > 1000000000
        ? `${(value / 1000000000).toFixed(precision)}B`
        : value > 1000000
        ? `${(value / 1000000).toFixed(precision)}M`
        : value > 1000
        ? `${(value / 1000).toFixed(precision)}K`
        : value.toFixed(precision);
  } else if (isNil(value)) {
    renderValue = '--';
  }

  const hasWordsCheck = string =>
    typeof string === 'string' ? string.trim().indexOf(' ') >= 0 : false;
  const hasWords = hasWordsCheck(renderValue);

  return (
    <Attribute
      unit={unit}
      isSmall={isSmall}
      isMini={isMini}
      color={color}
      isVertical={isVertical}
      allowedToWrap={allowedToWrap}
      className={classNames({
        [`${iotPrefix}--value-card__attribute-value--wrappable`]: allowedToWrap,
        [`${iotPrefix}--value-card__attribute-value--wrappable-compact`]: wrapCompact,
      })}
    >
      <AttributeValue
        size={newSize}
        title={`${value} ${unit || ''}`}
        layout={layout}
        isSmall={isSmall}
        isMini={isMini}
        value={value}
        allowedToWrap={allowedToWrap}
        hasWords={hasWords}
      >
        {renderValue}
      </AttributeValue>
    </Attribute>
  );
};

ValueRenderer.propTypes = propTypes;
ValueRenderer.defaultProps = defaultProps;

export default ValueRenderer;
