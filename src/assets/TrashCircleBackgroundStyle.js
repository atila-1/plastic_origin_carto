const circleBackgroundConfig = {
  'circle-radius': {
    'base': 1,
    'stops': [
      [15, 3],
      [22, 20]
    ]
  },
  'circle-color': [
    'match',
    ['get', 'type_id'],
    1, '#2d2d2d',
    2, '#434343',
    3, '#464646',
    4, '#4d4d4d',
    5, '#525252',
    6, '#575757',
    7, '#6b6b6b',
    8, '#7f7f7f',
    9, '#949494',
    10, '#a8a8a8',
      /* other */ '#CCCCCC'
  ],
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  'circle-opacity': {
    stops: [
      [13, 0],
      [14, 1]
    ]
  }
}

export default circleBackgroundConfig;
