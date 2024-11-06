export function getTypeName(typeId) {
  console.log('getTypeName', typeId);
  switch (typeId) {
    case 1:
      return 'Plastic fragment'; //'Fragment plastique'; //'Sheet / tarp / plastic bag / fragment';
    case 2:
      return 'Insulating material'; //'Matériau isolant'; //'Insulating material';
    case 3:
      return 'Bottle'; //'Bouteille'; //'Bottle-shaped';
    case 4:
      return 'Can'; //'Canette'; //'Can-shaped';
    case 5:
      return 'Drum'; //'Rouleau'; //'Drum';
    case 6:
      return 'Other packaging'; //'Autre emballage'; //'Other packaging';
    case 7:
      return 'Tire'; //'Pneu'; //'Tire';
    case 8:
      return 'Fishing net'; //'Filet'; //'Fishing net / cord';
    case 9:
      return 'Unclear'; //'Facilement nommable'; //'Easily namable';
    case 10:
      return 'Unclear'; //'Indéterminé'; //'Unclear';
    default:
      return 'Unclear'; //'Indéterminé';
  }
}