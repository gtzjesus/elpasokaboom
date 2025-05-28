import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const customerType = defineType({
  name: 'customer',
  title: 'Customer',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clerkUserId',
      title: 'Clerk User ID',
      type: 'string',
    }),
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'orders',
      title: 'Orders',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'order' }],
        },
      ],
    }),
    defineField({
      name: 'totalSpent',
      title: 'Total Spent',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
  },
});
