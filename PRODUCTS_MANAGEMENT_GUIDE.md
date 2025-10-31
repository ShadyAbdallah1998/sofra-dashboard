# Products & Categories Management System

## Overview
Complete product and category management system following the established patterns from the auth system. Built with shadcn/ui components, Zustand stores, and TypeScript.

## Features Created

### ✅ Categories Management
- List all categories with pagination
- Create new categories
- Edit existing categories
- Delete categories
- Image upload support
- Active/inactive toggle
- Display order management

### ✅ Products Management
- List all products with pagination
- Create new products
- Edit existing products
- Delete products
- Category assignment
- Price and calories tracking
- Image upload support
- Active/inactive toggle
- Display order management

## File Structure

```
src/
├── types/
│   ├── categories.types.ts      ✅ Category type definitions
│   └── products.types.ts         ✅ Product type definitions
│
├── constants/
│   ├── categories.ts             ✅ Category API endpoints
│   └── products.ts               ✅ Product API endpoints
│
├── services/
│   ├── categoriesService.ts      ✅ Category API calls
│   └── productsService.ts        ✅ Product API calls
│
├── store/
│   ├── categoriesStore.ts        ✅ Category state management
│   ├── productsStore.ts          ✅ Product state management
│   └── index.ts                  ✅ Updated with new stores
│
├── components/
│   ├── categories/
│   │   ├── CategoryForm.tsx      ✅ Create/Edit category form
│   │   └── CategoriesList.tsx    ✅ Categories grid display
│   │
│   └── products/
│       ├── ProductForm.tsx       ✅ Create/Edit product form
│       └── ProductsList.tsx      ✅ Products grid display
│
└── app/[locale]/
    ├── categories/
    │   └── page.tsx              ✅ Categories management page
    │
    ├── products/
    │   └── page.tsx              ✅ Products management page
    │
    └── dashboard/
        └── page.tsx              ✅ Updated with navigation links
```

## API Integration

### Categories Endpoints
- `GET /categories` - List categories (with pagination)
- `GET /categories/:id` - Get single category
- `POST /categories` - Create category
- `PATCH /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Products Endpoints
- `GET /products` - List products (with pagination)
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## Store Pattern

Both stores follow the established pattern:

```typescript
type State = {
  items: Item[];
  currentItem: Item | null;
  pagination: PaginationMetadata | null;
  isLoading: boolean;
  error: Error | undefined;
  filters: Filters;
};

type Actions = {
  getItems: (filters?: Filters) => Promise<void>;
  getItem: (id: string) => Promise<void>;
  createItem: (data: CreateRequest) => Promise<void>;
  updateItem: (id: string, data: UpdateRequest) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setFilters: (filters: Filters) => void;
  clearError: () => void;
  reset: () => void;
};
```

## Component Features

### Forms
- **Validation**: Using react-hook-form + zod
- **Loading States**: Disabled inputs during submission
- **Error Display**: Field-level error messages
- **Cancel Action**: Return to list view
- **Auto-populate**: Edit mode pre-fills form

### Lists
- **Grid Layout**: Responsive 1/2/3 column grid
- **Image Display**: Product/category images
- **Status Badges**: Active/inactive indicators
- **Quick Actions**: Edit and delete buttons
- **Loading State**: Spinner during data fetch
- **Empty State**: Message when no items

### Pagination
- **Previous/Next**: Navigation buttons
- **Page Info**: Current page / total pages
- **Disabled States**: First/last page handling

## Usage Examples

### Creating a Category
```typescript
import { useCategoriesStore } from '@/store';

const createCategory = useCategoriesStore((state) => state.createCategory);

await createCategory({
  name: 'Burgers',
  description: 'Delicious burgers',
  isActive: true,
  image: 'https://example.com/burger.jpg',
  order: 1,
  createdBy: user.email,
});
```

### Creating a Product
```typescript
import { useProductsStore } from '@/store';

const createProduct = useProductsStore((state) => state.createProduct);

await createProduct({
  name: 'Cheeseburger',
  price: 9.99,
  categoryId: 'category-id',
  calories: 500,
  description: 'Classic cheeseburger',
  isActive: true,
  image: 'https://example.com/cheeseburger.jpg',
  order: 1,
  createdBy: user.email,
});
```

### Listing Products with Pagination
```typescript
import { useProductsStore } from '@/store';

const products = useProductsStore((state) => state.products);
const pagination = useProductsStore((state) => state.pagination);
const getProducts = useProductsStore((state) => state.getProducts);

// Load first page
await getProducts({ page: 1, limit: 10 });

// Load next page
await getProducts({ page: 2, limit: 10 });
```

## Styling Consistency

All components follow the auth system styling:

### Colors
- `bg-background` - Page background
- `bg-card` - Card background
- `bg-muted` - Muted backgrounds
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `border-border` - Borders

### Typography
- `fz-12` - Small text (12px)
- `fz-14` - Body text (14px)
- `fz-16` - Medium text (16px)
- `fz-18` - Subheading (18px)
- `fz-20` - Heading (20px)
- `fz-25` - Page title (25px)

### Spacing
- `space-y-2` - Small vertical spacing
- `space-y-4` - Medium vertical spacing
- `space-y-6` - Large vertical spacing
- `gap-3` - Button groups
- `gap-6` - Grid gaps

### Components
- `Button` - Primary actions
- `Button variant="outline"` - Secondary actions
- `Button variant="destructive"` - Delete actions
- `Input` - Text inputs
- `Checkbox` - Boolean toggles

## Navigation Flow

```
Dashboard
  ├─► Categories Page
  │     ├─► Create Category
  │     ├─► Edit Category
  │     └─► Delete Category
  │
  ├─► Products Page
  │     ├─► Create Product
  │     ├─► Edit Product
  │     └─► Delete Product
  │
  └─► Profile Page
```

## Error Handling

All stores use consistent error handling:

```typescript
try {
  await action();
} catch (err) {
  const error = err as Error;
  reportError(error, { componentStack: 'Store.action' });
  set({ error, isLoading: false });
  throw error;
}
```

Errors are:
1. Logged with `reportError()`
2. Stored in state for UI display
3. Re-thrown for component handling

## Form Validation

### Category Form
- **Name**: Required, min 2 characters
- **Description**: Optional
- **Image**: Optional, must be valid URL
- **Order**: Optional number
- **Is Active**: Boolean

### Product Form
- **Name**: Required, min 2 characters
- **Price**: Required, must be positive
- **Category**: Required, dropdown selection
- **Calories**: Required, must be positive
- **Description**: Optional
- **Image**: Optional, must be valid URL
- **Order**: Optional number
- **Is Active**: Boolean

## Best Practices

### 1. Always Check Auth
```typescript
useEffect(() => {
  if (!user) {
    router.push('/auth/login');
    return;
  }
  // ... fetch data
}, [user, router]);
```

### 2. Cleanup on Unmount
```typescript
useEffect(() => {
  getData();
  return () => {
    useStore.getState().reset();
  };
}, [getData]);
```

### 3. Confirm Deletions
```typescript
onClick={() => {
  if (confirm(`Delete "${item.name}"?`)) {
    onDelete(item.id);
  }
}}
```

### 4. Handle Loading States
```typescript
<Button disabled={isLoading}>
  {isLoading ? 'Saving...' : 'Save'}
</Button>
```

### 5. Display Errors
```typescript
{error && (
  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
    <p className="fz-14 text-destructive">{error.message}</p>
  </div>
)}
```

## Testing Checklist

### Categories
- [ ] List categories
- [ ] Create new category
- [ ] Edit existing category
- [ ] Delete category
- [ ] Toggle active/inactive
- [ ] Upload image
- [ ] Pagination works
- [ ] Form validation works
- [ ] Error handling works

### Products
- [ ] List products
- [ ] Create new product
- [ ] Edit existing product
- [ ] Delete product
- [ ] Select category
- [ ] Toggle active/inactive
- [ ] Upload image
- [ ] Pagination works
- [ ] Form validation works
- [ ] Error handling works

## Future Enhancements

1. **Image Upload**: Direct file upload instead of URL
2. **Bulk Actions**: Select multiple items for bulk delete
3. **Search**: Search products/categories by name
4. **Filters**: Filter by active status, category, etc.
5. **Sorting**: Sort by name, price, order, etc.
6. **Drag & Drop**: Reorder items with drag and drop
7. **Preview**: Preview product/category before saving
8. **Duplicate**: Duplicate existing items
9. **Export**: Export data to CSV/Excel
10. **Import**: Bulk import from CSV/Excel

## Support

For questions or issues:
1. Check existing components for examples
2. Review store documentation in `src/store/`
3. Follow the established patterns
4. Test thoroughly before deployment

---

**Status**: ✅ Complete and Ready for Use
**Created**: October 31, 2025
**Pattern**: Following auth system design
**Components**: shadcn/ui
**State Management**: Zustand
**Validation**: react-hook-form + zod
