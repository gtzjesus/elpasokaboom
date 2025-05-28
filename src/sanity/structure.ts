import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Shop Worldhello')
    .items([
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('customer').title('Customers'),
      S.documentTypeListItem('order').title('Orders'),
      S.documentTypeListItem('sale').title('Sales'),

      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            'post',
            'category',
            'product',
            'customer',
            'order',
            'sale',
          ].includes(item.getId()!) // ✅ Avoid duplicate entry
      ),
    ]);
