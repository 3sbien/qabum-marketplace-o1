import type { Category } from '../../types/category';

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const renderCategorias = (
  categories: Category[],
  selected: string | null,
  onSelect: (id: string | null) => void,
  nivel = 0
) => {
  return categories.map((category) => (
    <div key={category.id} className="space-y-2">
      <button
        type="button"
        onClick={() => onSelect(selected === category.id ? null : category.id)}
        className={`flex w-full items-center justify-between rounded-full px-4 py-2 text-sm transition ${
          selected === category.id ? 'bg-secondary text-white' : 'bg-grisFondo text-secondary hover:bg-grisFondo/80'
        }`}
      >
        <span className="text-left">
          {'—'.repeat(nivel)} {category.nombre}
        </span>
      </button>
      {category.children?.length ? (
        <div className="ml-4 space-y-2 border-l border-grisFondo pl-4">
          {renderCategorias(category.children, selected, onSelect, nivel + 1)}
        </div>
      ) : null}
    </div>
  ));
};

export const CategoryFilter: React.FC<Props> = ({ categories, selected, onSelect }) => {
  return <div className="space-y-2">{renderCategorias(categories, selected, onSelect)}</div>;
};
