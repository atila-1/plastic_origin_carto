const circleConfig = {
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  'circle-radius': {
    'base': 1,
    'stops': [
      [15, 3],
      [22, 20]
    ]
  },
  'circle-color': [
    'match',
    ['get', 'type_name'],
    'Trash', '#3357FF',
    'AccumulationZone', '#c11812',
    'BulkyTrash', '#33FF57',
    '#CCCCCC'
  ],
}

export default circleConfig;
