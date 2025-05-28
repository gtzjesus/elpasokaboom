import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shop Worldhello')
    .items([
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('customer').title('Customers'), // ✅ Explicitly add customer
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !['post', 'category', 'customer'].includes(item.getId()!) // ✅ Avoid duplicate entry
      ),
    ]);
