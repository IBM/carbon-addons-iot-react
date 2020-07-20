import React from 'react';
import { render, screen } from '@testing-library/react';

import HotspotContent from './HotspotContent';

describe('HotspotContent', () => {
  it('basic attributes', () => {
    render(
      <HotspotContent
        title="My hotspot"
        description="My hotspot description"
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          { dataSourceId: 'temperature', label: 'Temp', precision: 2 },
        ]}
      />
    );
    // check the titles first
    expect(screen.getAllByText(/My hotspot/)).toHaveLength(2);

    expect(screen.getAllByText(/Device:/)).toHaveLength(1);
    expect(screen.getAllByText(/Temp:/)).toHaveLength(1);
    expect(screen.getAllByText(/73000/)).toHaveLength(1);
    // should be english formatted
    expect(screen.getAllByText(/35.05/)).toHaveLength(1);
  });
  it('can support react element for title', () => {
    render(
      <HotspotContent
        title={<span>My hotspot</span>}
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          { dataSourceId: 'temperature', label: 'Temp', precision: 2 },
        ]}
      />
    );
    // check the titles first
    expect(screen.getAllByText(/My hotspot/)).toHaveLength(1);
  });
  it('empty values show --', () => {
    render(
      <HotspotContent
        title={<span>My hotspot</span>}
        values={{ deviceid: '73000' }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          { dataSourceId: 'temperature', label: 'Temp', precision: 2, unit: 'Celsius' },
        ]}
      />
    );
    // empty values shouldn't render units
    expect(screen.getAllByText(/--/)).toHaveLength(1);
    expect(screen.queryAllByText(/Celsius/)).toHaveLength(0);
  });
  it('precision tests', () => {
    render(
      <HotspotContent
        title={<span>My hotspot</span>}
        values={{ deviceid: '73000', temperature: 35.05, humidity: 0, accuracy: 0.1245 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          { dataSourceId: 'temperature', label: 'Temp' },
          { dataSourceId: 'humidity', label: 'Humidity' },
          { dataSourceId: 'accuracy', label: 'Accuracy' },
        ]}
      />
    );
    expect(screen.getAllByText(/35.1/)).toHaveLength(1);
    expect(screen.getAllByText(/^0$/)).toHaveLength(1);
    expect(screen.getAllByText(/0.125/)).toHaveLength(1);
  });
  it('units', () => {
    render(
      <HotspotContent
        title={<span>My hotspot</span>}
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          { dataSourceId: 'temperature', label: 'Temp', precision: 2, unit: 'Celsius' },
        ]}
      />
    );
    // values should render units
    expect(screen.getAllByText(/Celsius/)).toHaveLength(1);
  });
  it('locale formatting', () => {
    render(
      <HotspotContent
        title="My hotspot"
        description="My hotspot description"
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          { dataSourceId: 'temperature', label: 'Temp', precision: 2 },
        ]}
        locale="fr"
      />
    );

    expect(screen.getAllByText(/73000/)).toHaveLength(1);
    // should be french formatted
    expect(screen.getAllByText(/35,05/)).toHaveLength(1);
  });
  it('attribute thresholds', () => {
    render(
      <HotspotContent
        title="My hotspot"
        description="My hotspot description"
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          {
            dataSourceId: 'temperature',
            label: 'Temp',
            precision: 2,
            thresholds: [{ comparison: '>', value: 0.05, icon: 'Warning', color: '#FF0000' }],
          },
        ]}
        locale="fr"
      />
    );
    // threshold should be found and french formatted
    expect(screen.getAllByTitle(/temperature > 0,05/)).toHaveLength(1);
  });
  it('hotspot threshold', () => {
    render(
      <HotspotContent
        title="My hotspot"
        description="My hotspot description"
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          {
            dataSourceId: 'temperature',
            label: 'Temp',
            precision: 2,
          },
        ]}
        hotspotThreshold={{
          dataSourceId: 'temperature',
          comparison: '>',
          value: 0.05,
          icon: 'Warning',
          color: '#FF0000',
        }}
      />
    );
    // threshold should be found
    expect(screen.getAllByTitle(/temperature > 0.05/)).toHaveLength(1);
  });
  it('custom render Icon By Name', () => {
    const mockRenderIconByName = jest.fn().mockReturnValue(<span />);
    render(
      <HotspotContent
        title="My hotspot"
        description="My hotspot description"
        values={{ deviceid: '73000', temperature: 35.05 }}
        attributes={[
          { dataSourceId: 'deviceid', label: 'Device' },
          {
            dataSourceId: 'temperature',
            label: 'Temp',
            precision: 2,
          },
        ]}
        hotspotThreshold={{
          dataSourceId: 'temperature',
          comparison: '>',
          value: 0.05,
          icon: 'Warning',
          color: '#FF0000',
        }}
        renderIconByName={mockRenderIconByName}
      />
    );
    // custom render icon should be called
    expect(mockRenderIconByName).toHaveBeenCalledWith('Warning', expect.anything());
  });
});
