import type { Stop } from "../types/stop";

/**
 * The 9 stops along the shark tunnel's journey from Mineral Point, WI to Salina, KS.
 *
 * SVG coordinates match mapBackground.png (1152 × 922).
 * Route flows right-to-left / top-to-bottom: WI upper-right → KS lower-left.
 *
 * Calibration scale: ~80 px/degree longitude, ~113 px/degree latitude.
 * Fine-tune svgX/svgY by opening mapBackground.png in an image editor.
 */
export const stops: Stop[] = [
  {
    id: "mineral-point",
    order: 1,
    name: "Mineral Point",
    city: "Mineral Point",
    state: "WI",
    description:
      "Home base! The shark tunnel starts its adventure right here in Mineral Point, Wisconsin — the birthplace of this wind-powered journey to Kansas.",
    svgX: 905,
    svgY: 243,
  },
  {
    id: "eagle-point-park",
    order: 2,
    name: "Eagle Point Park",
    city: "Dubuque",
    state: "IA",
    description:
      "Eagle Point Park sits high above the Mississippi River in Dubuque, Iowa with stunning bluff-top views. The tunnel crosses from Wisconsin into Iowa right here!",
    svgX: 868,
    svgY: 281,
  },
  {
    id: "van-buren-elementary",
    order: 3,
    name: "Van Buren Elementary School",
    city: "Iowa",
    state: "IA",
    description:
      "A stop in the heart of Iowa to say hello to students excited about clean energy! The kids here are pumped to see the Shark Wind Tunnel roll through.",
    svgX: 719,
    svgY: 335,
  },
  {
    id: "science-center-iowa",
    order: 4,
    name: "Science Center of Iowa",
    city: "Des Moines",
    state: "IA",
    description:
      "The Science Center of Iowa in Des Moines is the perfect stop for a wind energy adventure! Interactive exhibits and a huge community of curious learners await.",
    svgX: 628,
    svgY: 387,
  },
  {
    id: "national-wwi-museum",
    order: 5,
    name: "National WWI Museum and Memorial",
    city: "Kansas City",
    state: "MO",
    description:
      "The National WWI Museum and Memorial stands as a tribute to history in the heart of Kansas City. A brief stop to appreciate this landmark before heading west!",
    svgX: 552,
    svgY: 670,
  },
  {
    id: "elmont-elementary",
    order: 6,
    name: "Elmont Elementary School",
    city: "Topeka",
    state: "KS",
    description:
      "Elmont Elementary School in Topeka brings the tunnel through the heart of Kansas. The Flint Hills are just around the corner!",
    svgX: 520,
    svgY: 680,
  },
  {
    id: "logan-elementary",
    order: 7,
    name: "Logan Elementary School",
    city: "Topeka",
    state: "KS",
    description:
      "Logan Elementary School in Topeka welcomes the Shark Tunnel! Students here have been learning about wind energy and are ready to cheer it on.",
    svgX: 439,
    svgY: 650,
  },
  {
    id: "woodrow-wilson-elementary",
    order: 8,
    name: "Woodrow Wilson Elementary School",
    city: "Manhattan",
    state: "KS",
    description:
      "Woodrow Wilson Elementary School is almost at the finish line! Manhattan, Kansas — the Little Apple — gives the tunnel a warm send-off toward Salina.",
    svgX: 341,
    svgY: 688,
  },
  {
    id: "salina",
    order: 9,
    name: "Salina",
    city: "Salina",
    state: "KS",
    description:
      "The finish line! The shark tunnel has arrived in Salina, Kansas for the Kansas KidWind State Challenge at Tony’s Pizza Events Center. Time to see what students have built!",
    svgX: 290,
    svgY: 680,
  },
];
