import { defineType, defineField } from "sanity";

/**
 * Singleton-style document — only one should ever exist.
 * The studio user creates it once and then edits it in place.
 * Displayed as a thought bubble above the shark truck on the live map.
 */
export const truckStatus = defineType({
  name: "truckStatus",
  title: "Shark Truck Status",
  type: "document",
  fields: [
    defineField({
      name: "message",
      title: "Status Message",
      type: "string",
      description:
        'What should the shark truck be thinking? e.g. "Just arrived at Kansas City! 🦈" or "On our way to Topeka now!"',
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "showBubble",
      title: "Show on Map",
      type: "boolean",
      description:
        "Toggle the thought bubble above the shark truck on the live map.",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "message",
      subtitle: "showBubble",
    },
    prepare({ title, subtitle }: { title?: string; subtitle?: boolean }) {
      return {
        title: title ?? "(no message set)",
        subtitle: subtitle ? "✅ Visible on map" : "🚫 Hidden",
      };
    },
  },
});
