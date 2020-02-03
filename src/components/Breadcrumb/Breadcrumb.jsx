import React, { useState, useEffect, useRef, Children } from 'react';
import useResizeObserver from 'use-resize-observer';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { OverflowMenuHorizontal20 } from '@carbon/icons-react';
import { Breadcrumb as CarbonBreadcrumb } from 'carbon-components-react';

import { OverflowMenuItem, OverflowMenu } from '../../index';

const propTypes = {
  /**
   * Specify the label for the breadcrumb container
   */
  'aria-label': PropTypes.string,

  /**
   * Pass in the BreadcrumbItem's for your Breadcrumb
   */
  children: PropTypes.node,

  /**
   * Specify an optional className to be applied to the container node
   */
  className: PropTypes.string,

  /**
   * Optional prop to omit the trailing slash for the breadcrumbs
   */
  noTrailingSlash: PropTypes.bool,

  /**
   * Allow for collapse of breadcrumbs into overflow menu when not enough space, this implies
   * the use of ResizeObserver
   */
  hasOverflow: PropTypes.bool,
};

const defaultProps = {
  className: null,
  noTrailingSlash: false,
  children: null,
  hasOverflow: false,
  'aria-label': null,
};

const Breadcrumb = ({ children, className, hasOverflow, ...other }) => {
  const childrenItems = Children.map(children, child => child);
  const breakingWidth = useRef([]);
  const { ref: breadcrumbRef } = useResizeObserver({
    useDefaults: false,
  });
  const [overflowItems, setOverflowItems] = useState([]);
  const [afterOverflowItems, setAfterOverflowItems] = useState(childrenItems.slice(1));

  /** update breadcrumbs  */
  useEffect(
    () => {
      if (hasOverflow) {
        // The visible list is overflowing
        if (breadcrumbRef.current.clientWidth < breadcrumbRef.current.scrollWidth) {
          // Record the width of the list
          breakingWidth.current.push(breadcrumbRef.current.scrollWidth);
          if (afterOverflowItems.length > 1) {
            // Move item to the hidden list
            setOverflowItems([...overflowItems, afterOverflowItems.shift()]);
            setAfterOverflowItems([...afterOverflowItems]);
          }
          // The visible list is not overflowing
        } else if (
          breakingWidth.current[breakingWidth.current.length - 1] >= 0 &&
          breadcrumbRef.current.clientWidth >
            breakingWidth.current[breakingWidth.current.length - 1] &&
          overflowItems.length > 0
        ) {
          // Move the item to the visible list
          setAfterOverflowItems([overflowItems.pop(), ...afterOverflowItems]);
          setOverflowItems([...overflowItems]);
          breakingWidth.current.pop();
        }
      }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [breadcrumbRef.current?.clientWidth, breadcrumbRef.current?.scrollWidth]
  );

  return (
    <div
      className={classnames('breadcrumb--container', {
        'breadcrumb--container__overflowfull': afterOverflowItems.length === 1,
      })}
      ref={breadcrumbRef}
      data-testid="overflow"
    >
      {hasOverflow ? (
        <CarbonBreadcrumb className={className} {...other}>
          {childrenItems[0]}
          {overflowItems.length > 0 && (
            <span className="breadcrumb--overflow">
              <OverflowMenu
                renderIcon={OverflowMenuHorizontal20}
                menuOptionsClass="breadcrumb--overflow-items"
              >
                {overflowItems.map((child, i) => (
                  <OverflowMenuItem
                    {...child.props}
                    title={child.props.children}
                    key={`${child.props.children}-${i}`}
                    primaryFocus={i === 0}
                    itemText={child.props.children}
                  />
                ))}
              </OverflowMenu>
            </span>
          )}
          {afterOverflowItems}
        </CarbonBreadcrumb>
      ) : (
        <CarbonBreadcrumb className={className} {...other}>
          {children}
        </CarbonBreadcrumb>
      )}
    </div>
  );
};

Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;

export default Breadcrumb;
