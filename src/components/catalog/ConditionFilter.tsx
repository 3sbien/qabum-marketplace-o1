import { condicionesProducto } from '../../utils/constants';

interface Props {
  selected: string | null;
  onSelect: (condicion: string | null) => void;
}

export const ConditionFilter: React.FC<Props> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`rounded-full px-4 py-2 text-sm transition ${
          selected === null ? 'bg-secondary text-white' : 'bg-grisFondo text-secondary hover:bg-grisFondo/80'
        }`}
      >
        Todas
      </button>
      {condicionesProducto.map((condicion) => (
        <button
          key={condicion}
          type="button"
          onClick={() => onSelect(condicion)}
          className={`rounded-full px-4 py-2 text-sm transition ${
            selected === condicion ? 'bg-secondary text-white' : 'bg-grisFondo text-secondary hover:bg-grisFondo/80'
          }`}
        >
          {condicion}
        </button>
      ))}
    </div>
  );
};
