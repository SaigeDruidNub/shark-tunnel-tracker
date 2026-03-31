import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

const stops = [
  { id: "mineral-point", order: 1, name: "Mineral Point", state: "WI" },
  { id: "dubuque", order: 2, name: "Dubuque", state: "IA" },
  { id: "cedar-rapids", order: 3, name: "Cedar Rapids", state: "IA" },
  { id: "des-moines", order: 4, name: "Des Moines", state: "IA" },
  { id: "kansas-city", order: 5, name: "Kansas City", state: "MO" },
  { id: "topeka", order: 6, name: "Topeka", state: "KS" },
  { id: "manhattan", order: 7, name: "Manhattan", state: "KS" },
  { id: "salina", order: 8, name: "Salina", state: "KS" },
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
