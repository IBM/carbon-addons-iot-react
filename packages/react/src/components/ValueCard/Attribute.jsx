import React from 'react';
import PropTypes from 'prop-types';
import isNil from 'lodash/isNil';
import { CaretUp16, CaretDown16 } from '@carbon/icons-react';
import classnames from 'classnames';

import { CARD_LAYOUTS } from '../../constants/LayoutConstants';
import CardIcon from '../ImageCard/CardIcon';

import ValueRenderer from './ValueRenderer';
import UnitRenderer from './UnitRenderer';
import { BASE_CLASS_NAME } from './valueCardUtils';

const propTypes = {
  attribute: PropTypes.shape({
    label: PropTypes.string,
    unit: PropTypes.string,
    // decimal precision
    precision: PropTypes.number,
    thresholds: PropTypes.arrayOf(
      PropTypes.shape({
        comparison: PropTypes.oneOf(['<', '>', '=', '<=', '>=']).isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        color: PropTypes.string,
        icon: PropTypes.string,
      })
    ),
  }).isRequired,
  customFormatter: PropTypes.func,
  isEditable: PropTypes.bool,
  layout: PropTypes.oneOf(Object.values(CARD_LAYOUTS)),
  locale: PropTypes.string,

  renderIconByName: PropTypes.func,
  /** Optional trend information */
  secondaryValue: PropTypes.shape({
    color: PropTypes.string,
    trend: PropTypes.oneOf(['up', 'down']),
    value: PropTypes.any,
  }),
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  fontSize: PropTypes.number.isRequired,
  /** optional option to determine whether the number should be abbreviated (i.e. 10,000 = 10K) */
  isNumberValueCompact: PropTypes.bool.isRequired,
  /** number of attributes */
  attributeCount: PropTypes.number.isRequired,
};

const defaultProps = {
  layout: null,
  value: null,
  renderIconByName: null,
  secondaryValue: null,
  locale: 'en',
  customFormatter: null,
  isEditable: false,
};

const BEM_BASE = `${BASE_CLASS_NAME}__attribute`;

/**
 * An attribute has a Value, Units and maybe a Threshold or Trend.
 * He also determines which threshold applies to a given attribute (perhaps that should be moved)
 */
const Attribute = ({
  attribute: { label, unit, thresholds, precision },
  attributeCount,
  customFormatter,
  isEditable,
  layout,
  locale,
  renderIconByName,
  secondaryValue,
  value,
  fontSize,
  isNumberValueCompact,
}) => {
  // matching threshold will be the first match in the list, or a value of null if not isEditable
  const matchingThreshold = thresholds
    ? isEditable
      ? thresholds[0]
      : thresholds
          .filter((t) => {
            switch (t.comparison) {
              case '<':
                return !isNil(value) && value < t.value;
              case '>':
                return value > t.value;
              case '=':
                return value === t.value;
              case '<=':
                return !isNil(value) && value <= t.value;
              case '>=':
                return value >= t.value;
              default:
                return false;
            }
          })
          .concat([null])[0]
    : null;

  const valueColor =
    matchingThreshold && matchingThreshold.icon === undefined ? matchingThreshold.color : null;

  // need to reduce the width size to fit multiple attributs when card layout is horizontal
  const attributeWidthPercentage = layout === CARD_LAYOUTS.HORIZONTAL ? 100 / attributeCount : 100;

  // const shouldWrap =

  return (
    <>
      <div
        className={classnames(`${BEM_BASE}-wrapper`, {
          [`${BEM_BASE}-wrapper--vertical`]: layout === CARD_LAYOUTS.VERTICAL,
          [`${BEM_BASE}-wrapper--horizontal`]: layout === CARD_LAYOUTS.HORIZONTAL,
        })}
        style={{
          '--value-card-attribute-width': `${attributeWidthPercentage}%`,
        }}
      >
        <div className={`${BEM_BASE}-label`}>
          {matchingThreshold?.icon ? (
            <CardIcon
              fill={matchingThreshold.color}
              color={matchingThreshold.color}
              width={16}
              height={16}
              title={`${matchingThreshold.comparison} ${matchingThreshold.value}`}
              renderIconByName={renderIconByName}
              icon={matchingThreshold.icon}
            />
          ) : null}
          <span>{label}</span>
        </div>

        <div className={`${BEM_BASE}`}>
          <ValueRenderer
            value={value}
            layout={layout}
            precision={precision}
            color={valueColor}
            locale={locale}
            customFormatter={customFormatter}
            fontSize={fontSize}
            isNumberValueCompact={isNumberValueCompact}
          />
          <UnitRenderer unit={unit} />
        </div>
        {!isNil(secondaryValue) ? (
          <div
            className={`${BEM_BASE}-secondary-value`}
            style={{
              '--secondary-value-color': secondaryValue.color || '#777',
            }}
          >
            {secondaryValue.trend && secondaryValue.trend === 'up' ? (
              <CaretUp16 className={`${BEM_BASE}_trend-icon`} aria-label="trending up" />
            ) : secondaryValue.trend === 'down' ? (
              <CaretDown16 className={`${BEM_BASE}_trend-icon`} aria-label="trending down" />
            ) : null}
            {secondaryValue.value}
          </div>
        ) : null}
      </div>
    </>
  );
};

Attribute.propTypes = propTypes;
Attribute.defaultProps = defaultProps;

export default Attribute;
