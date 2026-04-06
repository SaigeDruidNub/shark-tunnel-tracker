import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const stops = [
  { id: "mineral-point", order: 1, name: "Mineral Point", state: "WI" },
  { id: "eagle-point-park", order: 2, name: "Eagle Point Park", state: "IA" },
  {
    id: "van-buren-elementary",
    order: 3,
    name: "Van Buren Elementary",
    state: "IA",
  },
  {
    id: "science-center-iowa",
    order: 4,
    name: "Science Center of Iowa",
    state: "IA",
  },
  {
    id: "national-wwi-museum",
    order: 5,
    name: "National WWI Museum",
    state: "MO",
  },
  { id: "elmont-elementary", order: 6, name: "Elmont Elementary", state: "KS" },
  { id: "logan-elementary", order: 7, name: "Logan Elementary", state: "KS" },
  {
    id: "woodrow-wilson-elementary",
    order: 8,
    name: "Woodrow Wilson Elementary",
    state: "KS",
  },
  { id: "salina", order: 9, name: "Salina", state: "KS" },
];

export default defineConfig({
  name: "shark-tunnel-tracker",
  title: "Shark Tunnel Tracker",

  projectId: "w1cjzznh",
  dataset: "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Stop Recaps")
              .icon(() => "🦈")
              .child(
                S.list()
                  .title("Stop Recaps")
                  .items(
                    stops.map((stop) =>
                      S.listItem()
                        .title(`${stop.order}. ${stop.name}, ${stop.state}`)
                        .id(`stopRecap-${stop.id}`)
                        .child(
                          S.document()
                            .schemaType("stopRecap")
                            .documentId(`stopRecap-${stop.id}`)
                            .title(`${stop.name}, ${stop.state}`),
                        ),
                    ),
                  ),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== "stopRecap",
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
