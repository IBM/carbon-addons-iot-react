import { TableItem, TableHeaderItem } from 'carbon-components-angular';
import { AITableModel } from './table-model.class';

describe('Table', () => {
  it('empty model should have length 0', () => {
    let tableModel = new AITableModel();
    tableModel.setData([[]]);

    expect(tableModel.totalDataLength).toEqual(0);
  });

  it('model should handle different variants of empty data', () => {
    let tableModel = new AITableModel();
    tableModel.setData(undefined);

    expect(tableModel.totalDataLength).toEqual(0);

    tableModel.setData(null);

    expect(tableModel.totalDataLength).toEqual(0);

    tableModel.setData([]);

    expect(tableModel.totalDataLength).toEqual(0);
  });

  it('should set rowsSelected when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['rowsSelected'].length).toEqual(2);
  });

  it('should set rowsExpanded when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['rowsExpanded'].length).toEqual(2);
  });

  it('should set rowsContext when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['rowsContext'].length).toEqual(2);
  });

  it('should set header when setting data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should have same data in same table cell', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    expect(tableModel.row(1)[1]).toBe(tableModel.column(1)[1]);
  });

  it('should modify the data via row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    tableModel.row(1)[1].data = 'test';

    expect(tableModel.column(1)[1].data).toEqual('test');
  });

  it('should modify the data via column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    tableModel.column(1)[1].data = 'test';

    expect(tableModel.row(1)[1].data).toEqual('test');
  });

  it('should modify the data via data', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
    ]);

    tableModel.setItemData(1, 1, 'test');

    expect(tableModel.column(1)[1].data).toEqual('test');
    expect(tableModel.row(1)[1].data).toEqual('test');
  });

  /* ****************************************************************
   ***********                                             ***********
   ***********                  SORTING                    ***********
   ***********                                             ***********
   ***************************************************************** */

  it('should sort data ascending', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
    ]);
    tableModel.selectRow(1, true, false);
    tableModel.setRowContext(1, 'success');

    tableModel.sort(1);
    expect(tableModel.row(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'C' }),
    ]);
    expect(tableModel.row(1)).toEqual([
      new TableItem({ data: 'D' }),
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.row(2)).toEqual([
      new TableItem({ data: 'G' }),
      new TableItem({ data: 'H' }),
      new TableItem({ data: 'I' }),
    ]);
    expect(tableModel['rowsSelected']).toEqual([false, false, true]);
    expect(tableModel.selectedRowIndices()).toEqual([2]);
    expect(tableModel['rowsContext']).toEqual([undefined, undefined, 'success']);
  });

  it('should sort data descending', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
      [new TableItem({ data: 'G' }), new TableItem({ data: 'H' }), new TableItem({ data: 'I' })],
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
    ]);
    tableModel.selectRow(1, true, false);
    tableModel.setRowContext(1, 'success');
    tableModel.getClosestHeader(1).descending = true;

    tableModel.sort(1);
    expect(tableModel.row(0)).toEqual([
      new TableItem({ data: 'G' }),
      new TableItem({ data: 'H' }),
      new TableItem({ data: 'I' }),
    ]);
    expect(tableModel.row(1)).toEqual([
      new TableItem({ data: 'D' }),
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.row(2)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'C' }),
    ]);
    expect(tableModel['rowsSelected']).toEqual([true, false, false]);
    expect(tableModel.selectedRowIndices()).toEqual([0]);
    expect(tableModel['rowsContext']).toEqual(['success', undefined, undefined]);
  });

  /* ****************************************************************
   ***********                                             ***********
   ***********                   ROWS                      ***********
   ***********                                             ***********
   ***************************************************************** */

  it('should get row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);
  });

  it('should get last row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.row(-1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'D' }),
    ]);
  });

  it('should add empty row to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addRow();

    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel.row(0).length).toEqual(1);
    expect(tableModel.row(0)).toEqual([new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should add row to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addRow([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel.row(0).length).toEqual(2);
    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('first and last row in one row table should be the same', () => {
    let tableModel = new AITableModel();
    tableModel.addRow([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.row(0)).toBe(tableModel.row(-1));
  });

  it('should add row to the beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 0);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add row in the middle', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 1);

    expect(tableModel.row(1)).toEqual([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add row to the end', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);

    expect(tableModel.row(-1)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add shorter row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([new TableItem({ data: 'E' })]);

    expect(tableModel.row(-1)).toEqual([new TableItem({ data: 'E' }), new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should add longer row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addRow([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);

    expect(tableModel.row(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
      new TableItem(),
    ]);
    expect(tableModel.row(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'D' }),
      new TableItem(),
    ]);
    expect(tableModel.row(2)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should delete first row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteRow(0);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'C' }), new TableItem({ data: 'D' })]);
    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should delete last row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteRow(-1);

    expect(tableModel.row(-1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should delete middle row', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
      [new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.deleteRow(1);

    expect(tableModel.row(0)).toEqual([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);
    expect(tableModel.row(1)).toEqual([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  /* ****************************************************************
   ***********                                             ***********
   ***********                  COLUMNS                    ***********
   ***********                                             ***********
   ***************************************************************** */

  it('should get column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'C' }),
    ]);
  });

  it('should get last column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    expect(tableModel.column(-1)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'D' }),
    ]);
  });

  it('should add empty column to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addColumn();

    expect(tableModel.totalDataLength).toEqual(1);
    expect(tableModel.row(0).length).toEqual(1);
    expect(tableModel.column(0)).toEqual([new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(1);
    expect(tableModel['rowsContext'].length).toEqual(1);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should add column to empty table', () => {
    let tableModel = new AITableModel();
    tableModel.addColumn([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel.row(0).length).toEqual(1);
    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'B' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('first and last column in one column table should be the same', () => {
    let tableModel = new AITableModel();
    tableModel.addColumn([new TableItem({ data: 'A' }), new TableItem({ data: 'B' })]);

    expect(tableModel.column(0)).toEqual(tableModel.column(-1));
  });

  it('should add column to the beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add column in the middle', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })], 1);

    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add column to the end', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' }), new TableItem({ data: 'F' })]);

    expect(tableModel.column(-1)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add shorter column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([new TableItem({ data: 'E' })]);

    expect(tableModel.column(-1)).toEqual([new TableItem({ data: 'E' }), new TableItem()]);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should add longer column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.addColumn([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'C' }),
      new TableItem(),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'D' }),
      new TableItem(),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'E' }),
      new TableItem({ data: 'F' }),
      new TableItem({ data: 'G' }),
    ]);
    expect(tableModel['rowsSelected'].length).toEqual(3);
    expect(tableModel['rowsContext'].length).toEqual(3);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should delete first column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteColumn(0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should delete last column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' })],
      [new TableItem({ data: 'C' }), new TableItem({ data: 'D' })],
    ]);

    tableModel.deleteColumn(-1);

    expect(tableModel.column(-1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'C' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(1);
  });

  it('should delete middle column', () => {
    let tableModel = new AITableModel();
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.deleteColumn(1);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.totalDataLength).toEqual(2);
    expect(tableModel['rowsSelected'].length).toEqual(2);
    expect(tableModel['rowsContext'].length).toEqual(2);
    expect(tableModel['header'].length).toEqual(1);
    expect(tableModel['header'][0].length).toEqual(2);
  });

  it('should move column to beginning', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(1, 0);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.getClosestHeader(0).data).toEqual('h2');
    expect(tableModel.getClosestHeader(1).data).toEqual('h1');
    expect(tableModel.getClosestHeader(2).data).toEqual('h3');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move column to end', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(1, 3);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);
    expect(tableModel.getClosestHeader(0).data).toEqual('h1');
    expect(tableModel.getClosestHeader(1).data).toEqual('h3');
    expect(tableModel.getClosestHeader(2).data).toEqual('h2');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move column to left', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(2, 1);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);

    expect(tableModel.getClosestHeader(0).data).toEqual(tableModel['header'][0][0].data);
    expect(tableModel.getClosestHeader(1).data).toEqual(tableModel['header'][0][1].data);
    expect(tableModel.getClosestHeader(2).data).toEqual(tableModel['header'][0][2].data);

    expect(tableModel.getClosestHeader(0).data).toEqual('h1');
    expect(tableModel.getClosestHeader(1).data).toEqual('h3');
    expect(tableModel.getClosestHeader(2).data).toEqual('h2');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should move column to right', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);

    tableModel.moveColumn(0, 2);

    expect(tableModel.column(0)).toEqual([
      new TableItem({ data: 'B' }),
      new TableItem({ data: 'E' }),
    ]);
    expect(tableModel.column(1)).toEqual([
      new TableItem({ data: 'A' }),
      new TableItem({ data: 'D' }),
    ]);
    expect(tableModel.column(2)).toEqual([
      new TableItem({ data: 'C' }),
      new TableItem({ data: 'F' }),
    ]);
    expect(tableModel.getClosestHeader(0).data).toEqual('h2');
    expect(tableModel.getClosestHeader(1).data).toEqual('h1');
    expect(tableModel.getClosestHeader(2).data).toEqual('h3');
    expect(tableModel['header'][0].length).toEqual(3);
  });

  it('should preserve header if data is emptied', () => {
    let tableModel = new AITableModel();
    tableModel.setHeader([
      new TableHeaderItem({ data: 'h1' }),
      new TableHeaderItem({ data: 'h2' }),
      new TableHeaderItem({ data: 'h3' }),
    ]);
    tableModel.setData([
      [new TableItem({ data: 'A' }), new TableItem({ data: 'B' }), new TableItem({ data: 'C' })],
      [new TableItem({ data: 'D' }), new TableItem({ data: 'E' }), new TableItem({ data: 'F' })],
    ]);
    tableModel.setData([[]]);
    expect(tableModel['header'][0].length).toEqual(3);
    expect(tableModel.getClosestHeader(0).data).toEqual('h1');
    expect(tableModel.getClosestHeader(1).data).toEqual('h2');
    expect(tableModel.getClosestHeader(2).data).toEqual('h3');
  });
});
