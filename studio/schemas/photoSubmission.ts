import { defineType, defineField } from "sanity";
import { YouTubeLinkInput } from "../components/YouTubeLinkInput";

export const photoSubmission = defineType({
  name: "photoSubmission",
  title: "Photo Submission",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "videoUrl",
      title: "YouTube URL (optional)",
      type: "url",
      description:
        "⚠️ REVIEW BEFORE APPROVING: Always open this link and watch the video before setting Approved to true. User-submitted links may contain inappropriate content.",
      components: { input: YouTubeLinkInput },
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submitterName",
      title: "Your Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "approved",
      title: "Approved",
      type: "boolean",
      initialValue: false,
      description:
        "Flip to true to publish this submission in the public feed.",
    }),
    defineField({
      name: "relatedStopId",
      title: "Related Stop",
      type: "string",
      description: "Optional: the stop this submission is tied to.",
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
          { title: "On the Road", value: "on-the-road" },
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "caption",
      subtitle: "submitterName",
      media: "image",
    },
  },
});
