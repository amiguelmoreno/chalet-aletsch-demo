import { defineField, defineType } from "sanity";

export const regionGuide = defineType({
  name: "regionGuide",
  title: "Region guide",
  type: "document",
  description: "Stories and recommendations for the Aletsch region.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),
    defineField({
      name: "locale",
      type: "string",
      options: {
        list: [
          { title: "Deutsch", value: "de" },
          { title: "English", value: "en" },
        ],
        layout: "radio",
      },
      initialValue: "de",
    }),
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Wandern", value: "hiking" },
          { title: "Skifahren", value: "skiing" },
          { title: "Essen & Trinken", value: "food" },
          { title: "Kultur", value: "culture" },
        ],
      },
    }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({
      name: "heroImage",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "season",
      type: "string",
      options: {
        list: [
          { title: "Ganzjährig", value: "all" },
          { title: "Sommer", value: "summer" },
          { title: "Winter", value: "winter" },
          { title: "Übergangszeit", value: "shoulder" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "heroImage" },
  },
});
