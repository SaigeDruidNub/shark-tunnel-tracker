import type { Stop } from '../types/stop';

/**
 * The 8 stops along the shark tunnel's journey from Mineral Point, WI to Salina, KS.
 *
 * SVG coordinates match the illustrated map viewBox (1400 × 1044).
 * Route flows right-to-left / top-to-bottom: WI upper-right → KS lower-left.
 *
 * To update a stop: edit name, description, videoUrl, or svgX/svgY here and redeploy.
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
    svgX: 1090,
    svgY: 248,
  },
  {
    id: 'dubuque',
    order: 2,
    name: 'Dubuque',
    city: 'Dubuque',
    state: 'IA',
    description:
      'The tunnel crosses the mighty Mississippi River into Iowa at Dubuque! Keep an eye out for barges and river bluffs along the way.',
    svgX: 1018,
    svgY: 346,
  },
  {
    id: 'cedar-rapids',
    order: 3,
    name: 'Cedar Rapids',
    city: 'Cedar Rapids',
    state: 'IA',
    description:
      'Cedar Rapids is the second-largest city in Iowa and home to the National Czech & Slovak Museum. The Quaker Oats factory here makes it smell like breakfast!',
    svgX: 950,
    svgY: 414,
  },
  {
    id: 'des-moines',
    order: 4,
    name: 'Des Moines',
    city: 'Des Moines',
    state: 'IA',
    description:
      'The capital of Iowa! Des Moines has a beautiful gold-domed capitol building. Students here are big fans of clean energy and wind power.',
    svgX: 748,
    svgY: 465,
  },
  {
    id: 'kansas-city',
    order: 5,
    name: 'Kansas City',
    city: 'Kansas City',
    state: 'MO',
    description:
      'The big city! Kansas City straddles the Missouri-Kansas border. Home of great barbecue and the final state line crossing before Salina.',
    svgX: 708,
    svgY: 633,
  },
  {
    id: 'topeka',
    order: 6,
    name: 'Topeka',
    city: 'Topeka',
    state: 'KS',
    description:
      'The capital of Kansas! Topeka\'s state capitol dome is a landmark visible for miles across the prairie. Wind power is a huge deal in Kansas!',
    svgX: 662,
    svgY: 725,
  },
  {
    id: 'manhattan',
    order: 7,
    name: 'Manhattan',
    city: 'Manhattan',
    state: 'KS',
    description:
      'Almost there! Manhattan, KS (the "Little Apple") is home to Kansas State University. The Flint Hills nearby are one of the last tallgrass prairies on Earth.',
    svgX: 564,
    svgY: 812,
  },
  {
    id: 'salina',
    order: 8,
    name: 'Salina',
    city: 'Salina',
    state: 'KS',
    description:
      'The finish line! The shark tunnel has arrived in Salina, Kansas for the Kansas KidWind State Challenge. Time to see what students have built!',
    svgX: 456,
    svgY: 838,
  },
];
