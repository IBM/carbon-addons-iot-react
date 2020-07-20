import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  DataTable,
  OverflowMenu,
  OverflowMenuItem,
  Loading,
} from 'carbon-components-react';
import styled from 'styled-components';
import classnames from 'classnames';
import omit from 'lodash/omit';

import { settings } from '../../../../constants/Settings';
import { RowActionPropTypes, RowActionErrorPropTypes } from '../../TablePropTypes';
import icons from '../../../../utils/bundledIcons';

import RowActionsError from './RowActionsError';

const { TableCell } = DataTable;
const { iotPrefix } = settings;

const StyledTableCell = styled(TableCell)`
  && {
    padding: 0;
    vertical-align: middle;
  }
`;

const RowActionsContainer = styled.div`
  &&& {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    /* If the actions are focused on, they should show up */
    > *:focus {
      opacity: 1;
    }

    /* the spinner was a little too big and causing the row to scroll so need to scale down a bit */
    .bx--loading--small {
      width: 1.875rem;
      height: 1.875rem;
    }
  }
`;

const OverflowMenuContent = styled.div`
  & {
    display: flex;
    align-items: center;
  }
`;

const StyledOverflowMenu = styled(({ isRowExpanded, isOpen, ...other }) => (
  <OverflowMenu {...other} />
))`
  &&& {
    margin-left: 0.5rem;
    svg {
      margin-left: ${props => (props.hideLabel !== 'false' ? '0' : '')};
    }
  }
`;

const propTypes = {
  /** Need to render different styles if expanded */
  isRowExpanded: PropTypes.bool,
  /** Unique id for each row, passed back for each click */
  id: PropTypes.string.isRequired,
  /** Unique id for the table */
  tableId: PropTypes.string.isRequired,
  /** Array with all the actions to render */
  actions: RowActionPropTypes,
  /** Callback called if a row action is clicked */
  onApplyRowAction: PropTypes.func.isRequired,
  /** translated text for more actions */
  overflowMenuAria: PropTypes.string,
  /** Is a row action actively running */
  isRowActionRunning: PropTypes.bool,
  /** row action error out */
  rowActionsError: RowActionErrorPropTypes,
  onClearError: PropTypes.func,
  /** I18N label for in progress */
  inProgressText: PropTypes.string,
  /** I18N label for action failed */
  actionFailedText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** I18N label for learn more */
  learnMoreText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** I18N label for dismiss */
  dismissText: PropTypes.string, // eslint-disable-line react/require-default-props
  /** `true` to make this menu item a divider. */
  hasDivider: PropTypes.bool,
  /** `true` to make this menu item a "danger button". */
  isDelete: PropTypes.bool,
  /** `true` hides all the normal actions/statuses and shows the singleRowEditButtons */
  showSingleRowEditButtons: PropTypes.bool,
  singleRowEditButtons: PropTypes.element,
  /**
   * Direction of document. Passed in at Table
   */
  langDir: PropTypes.oneOf(['ltr', 'rtl']),
};

const defaultProps = {
  isRowExpanded: false,
  actions: null,
  isRowActionRunning: false,
  rowActionsError: null,
  overflowMenuAria: 'More actions',
  inProgressText: 'In progress',
  onClearError: null,
  hasDivider: false,
  isDelete: false,
  showSingleRowEditButtons: false,
  singleRowEditButtons: null,
  langDir: 'ltr',
};

const onClick = (e, id, action, onApplyRowAction) => {
  onApplyRowAction(action, id);
  e.preventDefault();
  e.stopPropagation();
};

class RowActionsCell extends React.Component {
  state = {
    isOpen: false,
  };

  handleOpen = () => {
    const { isOpen } = this.state;
    if (!isOpen) {
      this.setState({ isOpen: true });
    }
  };

  handleClose = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.setState({ isOpen: false });
    }
  };

  render() {
    const {
      isRowExpanded,
      id,
      tableId,
      actions,
      onApplyRowAction,
      overflowMenuAria,
      actionFailedText,
      learnMoreText,
      dismissText,
      isRowActionRunning,
      rowActionsError,
      onClearError,
      inProgressText,
      showSingleRowEditButtons,
      singleRowEditButtons,
      langDir,
    } = this.props;
    const { isOpen } = this.state;
    const overflowActions = actions ? actions.filter(action => action.isOverflow) : [];
    const hasOverflow = overflowActions.length > 0;
    const firstSelectableItemIndex = overflowActions.findIndex(action => !action.disabled);

    return showSingleRowEditButtons ? (
      <StyledTableCell key={`${id}-single-row-edit-buttons`}>
        {singleRowEditButtons}
      </StyledTableCell>
    ) : actions && actions.length > 0 ? (
      <StyledTableCell key={`${id}-row-actions-cell`}>
        <RowActionsContainer
          isRowExpanded={isRowExpanded}
          className={`${iotPrefix}--row-actions-container`}
        >
          <div
            data-testid="row-action-container-background"
            className={classnames(`${iotPrefix}--row-actions-container__background`, {
              [`${iotPrefix}--row-actions-container__background--overflow-menu-open`]: isOpen,
            })}
          >
            {rowActionsError ? (
              <RowActionsError
                actionFailedText={actionFailedText}
                learnMoreText={learnMoreText}
                dismissText={dismissText}
                rowActionsError={rowActionsError}
                onClearError={onClearError}
              />
            ) : isRowActionRunning ? (
              <Fragment>
                <Loading small withOverlay={false} />
                {inProgressText}
              </Fragment>
            ) : (
              <Fragment>
                {actions
                  .filter(action => !action.isOverflow)
                  .map(({ id: actionId, labelText, iconDescription, ...others }) => (
                    <Button
                      {...omit(others, ['isOverflow'])}
                      iconDescription={labelText || iconDescription}
                      key={`${tableId}-${id}-row-actions-button-${actionId}`}
                      data-testid={`${tableId}-${id}-row-actions-button-${actionId}`}
                      kind="ghost"
                      hasIconOnly={!labelText}
                      tooltipPosition="left"
                      tooltipAlignment="end"
                      size="small"
                      onClick={e => onClick(e, id, actionId, onApplyRowAction)}
                    >
                      {labelText}
                    </Button>
                  ))}
                {hasOverflow ? (
                  <StyledOverflowMenu
                    id={`${tableId}-${id}-row-actions-cell-overflow`}
                    data-testid={`${tableId}-${id}-row-actions-cell-overflow`}
                    flipped={langDir === 'ltr'}
                    ariaLabel={overflowMenuAria}
                    onClick={event => event.stopPropagation()}
                    isRowExpanded={isRowExpanded}
                    iconDescription={overflowMenuAria}
                    onOpen={this.handleOpen}
                    onClose={this.handleClose}
                  >
                    {overflowActions.map((action, actionIndex) => (
                      <OverflowMenuItem
                        // We need to focus a MenuItem for the keyboard navigation to work
                        primaryFocus={actionIndex === firstSelectableItemIndex}
                        className={`${iotPrefix}--action-overflow-item`}
                        key={`${id}-row-actions-button-${action.id}`}
                        onClick={e => onClick(e, id, action.id, onApplyRowAction)}
                        requireTitle={!action.renderIcon}
                        hasDivider={action.hasDivider}
                        isDelete={action.isDelete}
                        itemText={
                          action.renderIcon ? (
                            <OverflowMenuContent title={action.labelText}>
                              {typeof action.renderIcon === 'string' ? (
                                React.createElement(icons[action.renderIcon], {
                                  'aria-label': action.labelText,
                                })
                              ) : (
                                <action.renderIcon description={action.labelText} />
                              )}
                              {action.labelText}
                            </OverflowMenuContent>
                          ) : (
                            action.labelText
                          )
                        }
                        disabled={action.disabled}
                      />
                    ))}
                  </StyledOverflowMenu>
                ) : null}
              </Fragment>
            )}
          </div>
        </RowActionsContainer>
      </StyledTableCell>
    ) : null;
  }
}

RowActionsCell.propTypes = propTypes;
RowActionsCell.defaultProps = defaultProps;

export default RowActionsCell;
