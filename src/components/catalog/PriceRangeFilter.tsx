interface Props {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export const PriceRangeFilter: React.FC<Props> = ({ min, max, value, onChange }) => {
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoMin = Number(event.target.value);
    onChange([Math.min(nuevoMin, value[1]), value[1]]);
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoMax = Number(event.target.value);
    onChange([value[0], Math.max(nuevoMax, value[0])]);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-secondary">Rango de precios</p>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col text-xs text-grisTexto">
          Mínimo (USD)
          <input
            type="number"
            min={min}
            max={max}
            value={value[0]}
            onChange={handleMinChange}
            className="mt-1 rounded-full border border-grisFondo px-4 py-2 text-sm"
          />
        </label>
        <label className="flex flex-1 flex-col text-xs text-grisTexto">
          Máximo (USD)
          <input
            type="number"
            min={min}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            className="mt-1 rounded-full border border-grisFondo px-4 py-2 text-sm"
          />
        </label>
      </div>
    </div>
  );
};
