const circleConfig = {
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  'circle-radius': {
    'base': 1,
    'stops': [
      [12, 4],
      [15, 6]
    ]
  },
  'circle-color': [
    'match',
    ['get', 'type_name'],
    'Trash', '#3088D9',
    'AccumulationZone', '#E74319',
    'BulkyTrash', '#3EB756',
    '#CCCCCC'
  ],
}

export default circleConfig;
