import PropTypes from 'prop-types';

export const RuleBuilderColumnsPropType = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,

    /**
     * An array of operands that will be passed to the second dropdown and used for determining
     * the filtering logic. Operands require an id and a name. the onChange events will pass the
     * operand id into the operand propery of the rule object.
     */
    operands: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),

    /**
     * The renderField function will be passed one object parameter.
     * The onChange property expects only the new value of the rule to be passed--not events or other
     * details. Just the value  that will be assigned to the rule object's value property.
     *
     * @param {object} props The value property of the rule and the onChange handler to pass
     *                       changes back to the rule tree.
     */
    renderField: PropTypes.func,
  })
);

export const GroupLogicPropType = PropTypes.oneOf(['ALL', 'ANY']);
export const RulesPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  operand: PropTypes.string.isRequired,
});

export const RuleGroupPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  groupLogic: GroupLogicPropType.isRequired,
});

RuleGroupPropType.rules = PropTypes.arrayOf(PropTypes.oneOf([RulesPropType, RuleGroupPropType]));