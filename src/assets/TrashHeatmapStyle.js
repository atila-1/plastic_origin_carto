const heatmapConfig = {
  // increase intensity as zoom level increases
  'heatmap-intensity': {
    stops: [
      [13, 1],
      [17, 3]
    ]
  },
  'heatmap-weight': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    0.1, // set a lower weight for points with a density of 0
    1,
    1    // set a weight of 1 for all other points
  ],
  // assign color values be applied to points depending on their density
  'heatmap-color': [
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,
    'rgba(0, 0, 0, 0)',
    0.2,
    'rgba(0, 115, 190, 0.2)',
    0.4,
    'rgba(0, 115, 190, 0.4)',
    0.6,
    'rgba(0, 115, 190, 0.6)',
    0.8,
    'rgba(0, 115, 190, 0.8)',
    1,
    'rgba(0, 115, 190, 1)'
  ],
  // increase radius as zoom increases
  'heatmap-radius': [
    'interpolate',
    ['linear'],
    ['zoom'],
    0,
    5,
    9,
    17
  ],
};

export default heatmapConfig;
