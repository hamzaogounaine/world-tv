import { Skeleton } from '@/components/ui/skeleton';

interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

interface CategoriesListProps {
  categories: Category[];
  loading: boolean;
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
}

export default function CategoriesList({
  categories,
  loading,
  selectedCategory,
  onSelectCategory,
}: CategoriesListProps) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Categories</h2>
      </div>
      
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {loading ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No categories found
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {categories.map((category) => (
              <button
                key={category.category_id}
                onClick={() => onSelectCategory(category)}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${
                  selectedCategory?.category_id === category.category_id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent text-foreground'
                }`}
                title={category.category_name}
              >
                <span className="truncate block">{category.category_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
