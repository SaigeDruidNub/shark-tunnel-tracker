import { defineType, defineField } from "sanity";

export const feedPost = defineType({
  name: "feedPost",
  title: "Feed Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: 'e.g. "Just crossed into Iowa! 🦈"',
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 4,
      description: "A short update about what's happening right now.",
      validation: (Rule) => Rule.required().max(1000),
    }),
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      description:
        "Optional photo to go with this update. Leave blank if using a YouTube link instead.",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoUrl",
      title: "YouTube Link",
      type: "url",
      description:
        "Optional YouTube URL (e.g. https://youtu.be/abc123). Used instead of a photo.",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "When this post should appear in the feed.",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "relatedStopId",
      title: "Related Stop",
      type: "string",
      description: "Optional: the stop this update is tied to.",
      options: {
        list: [
          { title: "Mineral Point, WI", value: "mineral-point" },
          { title: "Dubuque, IA", value: "dubuque" },
          { title: "Cedar Rapids, IA", value: "cedar-rapids" },
          { title: "Des Moines, IA", value: "des-moines" },
          { title: "Kansas City, MO", value: "kansas-city" },
          { title: "Topeka, KS", value: "topeka" },
          { title: "Manhattan, KS", value: "manhattan" },
          { title: "Salina, KS", value: "salina" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      media: "image",
    },
    prepare({
      title,
      subtitle,
      media,
    }: {
      title?: string;
      subtitle?: string;
      media?: React.ReactNode;
    }) {
      return {
        title: title ?? "Untitled post",
        subtitle: subtitle
          ? new Date(subtitle).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })
          : undefined,
        media,
      };
    },
  },
});
