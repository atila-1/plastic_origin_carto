const circleHighlightConfig = {
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  'circle-radius': {
    'base': 5,
    'stops': [
      [12, 6],
      [15, 10]
    ]
  },
  'circle-color': [
    'match',
    ['get', 'type_name'],
    'Sheet / tarp / plastic bag / fragment', '#3088D9',
    'Insulating material', '#E74319',
    'Bottle-shaped', '#3EB756',
    '#CCCCCC'
  ],

  'circle-opacity': {
    stops: [
      [13, 0],
      [14, 1]
    ]
  }
}

export default circleHighlightConfig;
