import { defineType, defineField } from "sanity";

export const stopRecap = defineType({
  name: "stopRecap",
  title: "Stop Recap",
  type: "document",
  fields: [
    defineField({
      name: "blurb",
      title: "What Happened",
      type: "text",
      rows: 5,
      description: "A short write-up about what happened at this stop.",
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: "videoUrl",
      title: "Video Link",
      type: "url",
      description:
        "Link to a YouTube or Snapchat video from this stop (optional).",
      validation: (Rule) =>
        Rule.uri({
          scheme: ["http", "https"],
        }),
    }),
  ],
  preview: {
    select: {
      title: "blurb",
    },
    prepare({ title }) {
      return {
        title: title ? title.slice(0, 60) : "No blurb yet",
      };
    },
  },
});
