import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { TableItem } from 'carbon-components-angular';

import { AITableModel } from './ai-table-model.class';
import { AITableHeaderItem } from './ai-table-header-item.class';
import { AITableModule } from './ai-table.module';

const simpleModel = new AITableModel();

simpleModel.header = [
  [
    new AITableHeaderItem({
      data:
        'Name Name Name Name Name Name Name Name Name Name \
	Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name \
	Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name Name \
	Name Name Name Name Name Name Name Name Name Name \
	Name',
      rowSpan: 2,
      alignment: 'center'
    }),
    new AITableHeaderItem({ data: 'hwer', colSpan: 2, sortable: false, alignment: 'center' }),
    null,
  ],
  [
    null,
    new AITableHeaderItem({ data: 'hwer1', alignment: 'start' }),
    new AITableHeaderItem({ data: 'hwer2', alignment: 'end', style: { width: '300px' } })
  ]
];

simpleModel.data = [
  [
    new TableItem({ data: 'Name 1' }),
    new TableItem({ data: 'qwer' }),
    new TableItem({ data: 'qwer1' }),
  ],
  [new TableItem({ data: 'Name 3' }), new TableItem({ data: 'zwer', colSpan: 2 }), null],
  [
    new TableItem({ data: 'Name 2' }),
    new TableItem({ data: 'swer' }),
    new TableItem({ data: 'swer1' }),
  ],
  [
    new TableItem({ data: 'Name 4' }),
    new TableItem({ data: 'twer' }),
    new TableItem({ data: 'twer1' }),
  ],
];

storiesOf('Components/Table', module)
  .addDecorator(
    moduleMetadata({
      imports: [AITableModule],
    })
  )
  .addDecorator(withKnobs)
  .add('Basic', () => {
    return {
      template: `
			<ai-table
				[model]="model"
				[size]="size"
				[showSelectionColumn]="showSelectionColumn"
				[striped]="striped"
				[skeleton]="skeleton"
				[isDataGrid]="isDataGrid"
				(sort)="customSort($event)"
				(rowClick)="rowClick($event)">
			</ai-table>
		`,
      props: {
        model: simpleModel,
        size: select('size', { Small: 'sm', Short: 'sh', Normal: 'md', Large: 'lg' }, 'md'),
        showSelectionColumn: boolean('showSelectionColumn', true),
        striped: boolean('striped', true),
        isDataGrid: boolean('Data grid keyboard interactions', true),
        skeleton: boolean('Skeleton mode', false),
        rowClick: action('row clicked'),
        customSort: (index: number) => {
          if (simpleModel.getHeader(index).sorted) {
            // if already sorted flip sorting direction
            simpleModel.getHeader(index).ascending = simpleModel.getHeader(index).descending;
          }
          simpleModel.sort(index);
        },
      },
    };
  });
