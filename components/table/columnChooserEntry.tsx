export default function ColumnChooserEntry<DataType>({
  title,
  id,
  visibleColumns,
  entryClasses,
  visibleColumnClasses,
  hiddenColumnClasses,
  updateColumns,
}: {
  title: string;
  id: keyof DataType;
  entryClasses: string;
  visibleColumnClasses: string;
  hiddenColumnClasses: string;
  visibleColumns: (keyof DataType)[];
  updateColumns: (id: keyof DataType) => void;
}) {
  return (
    <span
      className={[entryClasses, visibleColumns.includes(id) ? visibleColumnClasses : hiddenColumnClasses].join(' ')}
      onClick={() => updateColumns(id)}
    >
      {title}
    </span>
  );
}
