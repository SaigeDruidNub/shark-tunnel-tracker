import type { Stop } from '../types/stop';

/**
 * The 8 stops along the shark tunnel's journey from Mineral Point, WI to Salina, KS.
 *
 * SVG coordinates match mapBackground.png (1152 × 922).
 * Route flows right-to-left / top-to-bottom: WI upper-right → KS lower-left.
 *
 * To fine-tune marker positions: open mapBackground.png in an image editor,
 * hover over each stop circle to read pixel coordinates, then update svgX/svgY.
 */
export const stops: Stop[] = [
  {
    id: 'mineral-point',
    order: 1,
    name: 'Mineral Point',
    city: 'Mineral Point',
    state: 'WI',
    description:
      'Home base! The shark tunnel starts its adventure right here in Mineral Point, Wisconsin — the birthplace of this wind-powered journey to Kansas.',
    svgX: 905,
    svgY: 243,
  },
  {
    id: 'dubuque',
    order: 2,
    name: 'Dubuque',
    city: 'Dubuque',
    state: 'IA',
    description:
      'The tunnel crosses the mighty Mississippi River into Iowa at Dubuque! Keep an eye out for barges and river bluffs along the way.',
    svgX: 875,
    svgY: 285,
  },
  {
    id: 'cedar-rapids',
    order: 3,
    name: 'Cedar Rapids',
    city: 'Cedar Rapids',
    state: 'IA',
    description:
      'Cedar Rapids is the second-largest city in Iowa and home to the National Czech & Slovak Museum. The Quaker Oats factory here makes it smell like breakfast!',
    svgX: 783,
    svgY: 345,
  },
  {
    id: 'des-moines',
    order: 4,
    name: 'Des Moines',
    city: 'Des Moines',
    state: 'IA',
    description:
      'The capital of Iowa! Des Moines has a beautiful gold-domed capitol building. Students here are big fans of clean energy and wind power.',
    svgX: 630,
    svgY: 387,
  },
  {
    id: 'kansas-city',
    order: 5,
    name: 'Kansas City',
    city: 'Kansas City',
    state: 'MO',
    description:
      'The big city! Kansas City straddles the Missouri-Kansas border. Home of great barbecue and the final state line crossing before Salina.',
    svgX: 545,
    svgY: 658,
  },
  {
    id: 'topeka',
    order: 6,
    name: 'Topeka',
    city: 'Topeka',
    state: 'KS',
    description:
      'The capital of Kansas! Topeka\'s state capitol dome is a landmark visible for miles across the prairie. Wind power is a huge deal in Kansas!',
    svgX: 440,
    svgY: 680,
  },
  {
    id: 'manhattan',
    order: 7,
    name: 'Manhattan',
    city: 'Manhattan',
    state: 'KS',
    description:
      'Almost there! Manhattan, KS (the "Little Apple") is home to Kansas State University. The Flint Hills nearby are one of the last tallgrass prairies on Earth.',
    svgX: 378,
    svgY: 635,
  },
  {
    id: 'salina',
    order: 8,
    name: 'Salina',
    city: 'Salina',
    state: 'KS',
    description:
      'The finish line! The shark tunnel has arrived in Salina, Kansas for the Kansas KidWind State Challenge. Time to see what students have built!',
    svgX: 290,
    svgY: 680,
  },
  {
    id: 'on-the-road',
    order: 0,
    name: 'On the Road',
    city: '',
    state: '',
    description: 'The shark tunnel is currently in transit between stops.',
    svgX: 0,
    svgY: 0,
    hideFromMap: true,
  },
];
