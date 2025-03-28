import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Enter category name.',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Enter slug (same as name).',

      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'description',
      description: 'Enter summary description for the product.',

      type: 'text',
    }),
    defineField({
      name: 'image', // This is the new image field
      title: 'Category Image',
      type: 'image', // Field type is 'image'
      description: 'Upload image thumbnail.',

      options: {
        hotspot: true, // Allow cropping if needed
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image', // Display the image in the preview panel
    },
  },
});
