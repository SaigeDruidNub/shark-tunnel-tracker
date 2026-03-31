import { defineType, defineField } from 'sanity'

export const photoSubmission = defineType({
  name: 'photoSubmission',
  title: 'Photo Submission',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'videoUrl',
      title: 'YouTube URL (optional)',
      type: 'url',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submitterName',
      title: 'Your Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Flip to true to publish this submission in the public feed.',
    }),
    defineField({
      name: 'relatedStopId',
      title: 'Related Stop ID (optional)',
      type: 'string',
      description: 'Matches one of the static stop IDs, e.g. "kansas-city".',
    }),
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'submitterName',
      media: 'image',
    },
  },
})
