import React from 'react';
import { text, select, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { Tree16 } from '@carbon/icons-react';

import { CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';
import Table from '../Table/Table';
import Button from '../Button/Button';

import CardREADME from './Card.mdx';
import Card from './Card';

export const getDataStateProp = () => ({
  label: text('dataState.label', 'No data available for this score at this time'),
  description: text(
    'dataState.description',
    'The last successful score was 68 at 13:21 - 10/21/2019 but wait, there is more, according to the latest test results this line is too long.'
  ),
  extraTooltipText: text(
    'dataState.extraTooltipText',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  ),
  learnMoreElement: (
    <a className="bx--link" href="#top">
      Learn more
    </a>
  ),
});

export default {
  title: '1 - Watson IoT/Card',

  parameters: {
    component: Card,
    docs: {
      page: CardREADME,
    },
  },

  excludeStories: ['getDataStateProp'],
};

const CardStoryStateManager = ({ children }) => {
  const [selected, setSelected] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const handleClick = (e) => {
    setSelected(true);
    action('onClick')(e);
  };
  const handleBlur = (e) => {
    if (
      !e.currentTarget.contains(e.relatedTarget) ||
      (e.target === e.currentTarget && e.relatedTarget === null)
    ) {
      setSelected(false);
    }
    action('onBlur')(e);
  };

  const handleCardAction = (cardId, cardAction) => {
    if (cardAction === 'OPEN_EXPANDED_CARD') {
      setExpanded(true);
    }

    if (cardAction === 'CLOSE_EXPANDED_CARD') {
      setExpanded(false);
    }

    action('onCardAction')(cardId, cardAction);
  };

  return React.Children.map(children, (child) => {
    return React.cloneElement(child, {
      ...child.props,
      onClick: handleClick,
      onBlur: handleBlur,
      isSelected: selected,
      isExpanded: expanded,
      onCardAction: handleCardAction,
    });
  });
};

export const Basic = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'lg');

  return (
    <div style={{ width: `${getCardMinSize(breakpoint, size).x}px`, margin: 20 }}>
      <CardStoryStateManager>
        <Card
          title={text('title', 'Card title')}
          id="facilitycard-basic"
          size={size}
          isLoading={boolean('isloading', false)}
          isEmpty={boolean('isEmpty', false)}
          isEditable={boolean('isEditable', false)}
          breakpoint={breakpoint}
          availableActions={object('availableActions', {
            range: true,
            expand: true,
            edit: true,
            clone: false,
            delete: false,
          })}
          renderExpandIcon={Tree16}
          onFocus={action('onFocus')}
          tabIndex={0}
        />
      </CardStoryStateManager>
    </div>
  );
};

Basic.storyName = 'basic stateful example with custom expand icon';

export const WithEllipsedTitleTooltipExternalTooltip = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'lg');
  return (
    <div style={{ width: `${getCardMinSize(breakpoint, size).x}px`, margin: 20 }}>
      <Card
        title={text(
          'title',
          'Card Title that should be truncated and presented in a tooltip while the cards also has an external tooltip.'
        )}
        id="facilitycard-basic"
        size={size}
        isLoading={boolean('isloading', false)}
        isEmpty={boolean('isEmpty', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpanded', false)}
        breakpoint={breakpoint}
        availableActions={object('availableActions', {
          range: true,
          expand: true,
          edit: true,
          clone: false,
          delete: false,
        })}
        onCardAction={action('onCardAction')}
        onFocus={action('onFocus')}
        onBlur={action('onBlur')}
        onClick={action('onClick')}
        tabIndex={0}
        tooltip={<p>this is the external tooltip content</p>}
      />
    </div>
  );
};

WithEllipsedTitleTooltipExternalTooltip.storyName =
  'with ellipsed title tooltip & external tooltip';

export const BasicWithRenderProp = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'lg');
  return (
    <div style={{ width: `${getCardMinSize(breakpoint, size).x}px`, margin: 20 }}>
      <Card
        title={text('title', 'Card with render prop')}
        id="facilitycard-basic"
        size={size}
        isLoading={boolean('isloading', false)}
        isEmpty={boolean('isEmpty', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpanded', false)}
        breakpoint={breakpoint}
        availableActions={object('availableActions', {
          range: true,
          expand: true,
          edit: true,
          clone: false,
          delete: false,
        })}
        onCardAction={action('onCardAction')}
        onFocus={action('onFocus')}
        onBlur={action('onBlur')}
        onClick={action('onClick')}
        tabIndex={0}
      >
        {(childSize) => (
          <p>
            Content width is {childSize.width} and height is {childSize.height}
          </p>
        )}
      </Card>
    </div>
  );
};

BasicWithRenderProp.storyName = 'with render prop';

export const WithCustomRangeSelector = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <Card
        title={text('title', 'Card Title')}
        id="facilitycard-with-loading"
        size={size}
        isLoading={boolean('isLoading', false)}
        isEmpty={boolean('isEmpty', false)}
        isEditable={boolean('isEditable', false)}
        isExpanded={boolean('isExpanded', false)}
        breakpoint="lg"
        onCardAction={action('onCardAction')}
        availableActions={{
          range: true,
        }}
        timeRangeOptions={object('timeRangeOptions', {
          last8Hours: 'Last 8 Hours',
          last4Hours: 'Last 4 Hours',
          last2Hours: 'Last 2 Hours',
          lastHour: 'Last Hour',
          this8Hours: 'This 8 Hours',
          this4Hours: 'This 4 Hours',
          this2Hours: 'This 2 Hours',
          thisHour: 'This Hour',
        })}
      />
    </div>
  );
};

WithCustomRangeSelector.storyName = 'with custom range selector';

export const SizeGallery = () => {
  return Object.keys(CARD_SIZES).map((i) => (
    <React.Fragment key={`card-${i}`}>
      <h3>{i}</h3>
      <div
        style={{
          width: `${getCardMinSize('lg', CARD_SIZES[i]).x}px`,
          margin: 20,
        }}
      >
        <Card
          title={text('title', 'Card Title')}
          id={`facilitycard-size-gallery-${i}`}
          size={CARD_SIZES[i]}
          isLoading={boolean('isLoading', false)}
          isEmpty={boolean('isEmpty', true)}
          isEditable={boolean('isEditable', false)}
          isExpanded={boolean('isExpanded', false)}
          breakpoint="lg"
          availableActions={{ range: i !== CARD_SIZES.SMALL }}
          onCardAction={action('onCardAction')}
        />
      </div>
    </React.Fragment>
  ));
};

SizeGallery.storyName = 'size gallery';

export const Error = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'lg');
  return (
    <div style={{ width: `${getCardMinSize(breakpoint, size).x}px`, margin: 20 }}>
      <Card
        title={text('title', 'Card Title')}
        id="facilitycard-error"
        size={size}
        error={text('error', 'API threw Nullpointer')}
        isLoading={boolean('isLoading', false)}
        breakpoint="lg"
        onCardAction={action('onCardAction')}
      />
    </div>
  );
};

Error.storyName = 'with error';

export const ImplementingACustomCard = () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  const isEditable = boolean('isEditable', false);
  const title = text('title', 'Custom Card Title');
  const breakpoint = select('breakpoint', ['lg', 'md', 'sm', 'xs'], 'lg');
  return (
    <div style={{ width: `${getCardMinSize(breakpoint, size).x}px`, margin: 20 }}>
      <Card
        title={title}
        id="mycard"
        size={size}
        values={[{ timestamp: 12341231231, value1: 'my value' }]}
        availableActions={{ range: false, expand: true }}
        onCardAction={action('onCardAction')}
        hideHeader
        customToolbarContent={
          <Button hasIconOnly kind="ghost">
            Custom
          </Button>
        }
      >
        {!isEditable
          ? (_$, { cardToolbar, values }) => (
              <Table
                id="my table"
                secondaryTitle={title}
                columns={[
                  {
                    id: 'value1',
                    name: 'String',
                    filter: { placeholderText: 'enter a string' },
                  },
                  {
                    id: 'timestamp',
                    name: 'Date',
                    filter: { placeholderText: 'enter a date' },
                  },
                ]}
                data={values.map((value, index) => ({
                  id: `rowid-${index}`,
                  values: value,
                }))}
                view={{ toolbar: { customToolbarContent: cardToolbar } }}
              />
            )
          : 'Fake Sample Data'}
      </Card>
    </div>
  );
};

ImplementingACustomCard.storyName = 'implementing a custom card';
ImplementingACustomCard.parameters = {
  inline: true,
  source: true,
  info: {
    text: `
  To develop a custom card component.
   - Create a new card component that uses the base Card component
   - See the simple SampleCustomCard in the source code of this story for an example
   - If you want to hide the title/toolbar, do not pass a title prop
   - If you want to add custom toolbar content such as a different date range selector, pass the node as a customToolbarContent prop. The node will be placed to the right of the other toolbar content
   - (Optionally, if you want to use the card in a Dashboard) Extend the Card Renderer so the Dashboard knows how to render your card type
   - (Optionally, if you want to use the card in a Dashboard) Create a validator for this card type within "utils/schemas/validators" and add it to the validateDashboardJSON function used to validate dashboards on import.

   ## Data flow for a card in the dashboard
   All data loading for a card goes through the dashboard's onFetchData function.  There are two ways to trigger a refetch of data for a card.  The first is to directly interact
   with the Card's range controls.  The second is for the Dashboard to trigger that all of the cards need a reload by updating it's isLoading bit.  The CardRenderer component will call the onSetupCard function of the dashboard first
   for each card (if it exists), then will call the onFetchData function for the dashboard.
   `,
  },
};
