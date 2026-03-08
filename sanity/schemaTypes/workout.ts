import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID',
      description: 'Clerk user id for the workout owner',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'durationSeconds',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Reps',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      validation: (Rule) => Rule.min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'lbs', value: 'lbs'},
                          {title: 'kg', value: 'kg'},
                        ],
                      },
                      initialValue: 'lbs',
                    }),
                  ],
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: 'exercise.name',
              sets: 'sets',
            },
            prepare(selection) {
              const {title, sets} = selection
              const parts = []
              if (title) parts.push(title)
              if (Array.isArray(sets) && sets.length > 0) {
                const firstSet = sets[0]
                if (firstSet.reps !== undefined) parts.push(`${firstSet.reps} reps`)
                if (firstSet.weight !== undefined)
                  parts.push(`${firstSet.weight} ${firstSet.weightUnit || ''}`.trim())
                parts.push(`+${sets.length - 1} more set${sets.length === 2 ? '' : 's'}`)
              }
              return {
                title: parts.join(' • ') || 'Exercise',
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'userId',
      date: 'date',
      duration: 'durationSeconds',
    },
    prepare(selection) {
      const {title, date, duration} = selection
      const dateStr = date ? new Date(date).toLocaleDateString() : 'No date'
      const durStr = duration != null ? `${duration}s` : '—'
      return {
        title: `Workout for ${title || 'Unknown'}`,
        subtitle: `${dateStr} • ${durStr}`,
      }
    },
  },
})
