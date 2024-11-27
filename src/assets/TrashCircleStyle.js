const circleConfig = {
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  'circle-radius': {
    'base': 1,
    'stops': [
      [12, 3],
      [15, 5]
    ]
  },
  'circle-color': [
    'match',
    ['get', 'type_name'],
    'Trash', '#3357FF',
    'AccumulationZone', '#c11812',
    'BulkyTrash', '#33FF57',
    '#5c4aff'
  ],
}

export default circleConfig;
