/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */

import React from 'react';
import PropTypes from 'prop-types';
import { ArrowRight16, Bee32 } from '@carbon/icons-react';
import { ButtonSkeleton } from 'carbon-components-react';

import { settings } from '../../../constants/Settings';
import Button from '../../Button';
import { SkeletonText } from '../../SkeletonText';
import SuiteHeader, { SuiteHeaderApplicationPropTypes } from '../SuiteHeader';

const defaultProps = {
  applications: null,
  customApplications: [],
  allApplicationsLink: null,
  onRouteChange: async () => true,
  i18n: {
    myApplications: 'My applications',
    allApplicationsLink: 'All applications',
    requestAccess: 'Contact your administrator to request application access.',
    learnMoreLink: 'Learn more',
  },
};

const propTypes = {
  applications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  customApplications: PropTypes.arrayOf(PropTypes.shape(SuiteHeaderApplicationPropTypes)),
  allApplicationsLink: PropTypes.string,
  noAccessLink: PropTypes.string.isRequired,
  onRouteChange: PropTypes.func,
  i18n: PropTypes.shape({
    allApplicationsLink: PropTypes.string,
    requestAccess: PropTypes.string,
    learnMoreLink: PropTypes.string,
  }),
};

const SuiteHeaderAppSwitcher = ({
  applications,
  customApplications,
  allApplicationsLink,
  noAccessLink,
  i18n,
  onRouteChange,
}) => {
  const mergedI18n = { ...defaultProps.i18n, ...i18n };
  const baseClassName = `${settings.iotPrefix}--suite-header-app-switcher`;
  const mergedApplications = applications
    ? [...customApplications, ...applications]
    : customApplications.length > 0
    ? [...customApplications]
    : null;
  return (
    <ul className={baseClassName}>
      <li className={`${baseClassName}--nav-link`}>
        <p>{mergedI18n.myApplications}</p>
        {allApplicationsLink === null ? (
          <div className={`${baseClassName}--nav-link--button--loading`}>
            <ButtonSkeleton />
          </div>
        ) : (
          <Button
            kind="tertiary"
            data-testid="suite-header-app-switcher--all-applications"
            onClick={async () => {
              const result = await onRouteChange(
                SuiteHeader.ROUTE_TYPES.NAVIGATOR,
                allApplicationsLink
              );
              if (result) {
                window.location.href = allApplicationsLink;
              }
            }}
            renderIcon={ArrowRight16}
          >
            {mergedI18n.allApplicationsLink}
          </Button>
        )}
      </li>
      <div className={`${baseClassName}--nav-link--separator`} />
      {mergedApplications === null ? (
        <li>
          <div
            className={`${baseClassName}--nav-link--loading`}
            data-testid="suite-header-app-switcher--loading"
          >
            <SkeletonText paragraph lineCount={3} />
          </div>
        </li>
      ) : (
        mergedApplications.map(({ id, name, href, isExternal = false }) => (
          <li
            id={`suite-header-application-${id}`}
            key={`key-${id}`}
            className={`${baseClassName}--app-link`}
          >
            <a
              href="javascript:void(0)"
              data-testid={`suite-header-app-switcher--${id}`}
              onClick={async () => {
                const result = await onRouteChange(SuiteHeader.ROUTE_TYPES.APPLICATION, href, {
                  appId: id,
                });
                if (result) {
                  if (isExternal) {
                    window.open(href, 'blank');
                  } else {
                    window.location.href = href;
                  }
                }
              }}
            >
              {name}
            </a>
          </li>
        ))
      )}
      {mergedApplications?.length === 0 ? (
        <div className={`${baseClassName}--no-app`}>
          <div className="bee-icon-container">
            <Bee32 />
            <div className="bee-shadow" />
          </div>
          <span>{mergedI18n.requestAccess}</span>
          <a
            href="javascript:void(0)"
            data-testid="suite-header-app-switcher--no-access"
            onClick={async () => {
              const result = await onRouteChange(
                SuiteHeader.ROUTE_TYPES.DOCUMENTATION,
                noAccessLink
              );
              if (result) {
                window.location.href = noAccessLink;
              }
            }}
          >
            {mergedI18n.learnMoreLink}
          </a>
        </div>
      ) : null}
    </ul>
  );
};

SuiteHeaderAppSwitcher.defaultProps = defaultProps;
SuiteHeaderAppSwitcher.propTypes = propTypes;

export default SuiteHeaderAppSwitcher;
