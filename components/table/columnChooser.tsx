import type { ExtendedRefs, FloatingContext } from '@floating-ui/react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';

import ColumnChooserEntry from './columnChooserEntry';
import type { TableColumn } from './table';

const baseClasses = {
  wrapperClasses: 'flex flex-col rounded-krc-tableColumnChooser bg-white px-4 py-3 shadow z-[1]',
  headerClasses: 'h-8',
  columnsWrapperClasses: 'ml-2 mt-3 flex max-h-[25rem] flex-col gap-1 overflow-y-auto',
  entryClasses: 'cursor-pointer px-4 py-2 text-sm font-medium text-secondary-600',
  visibleColumnClasses: 'bg-primary-100',
  hiddenColumnClasses: 'bg-white',
};

export default function ColumnChooser<DataType>({
  columns,
  context,
  refs,
  floatingStyles,
  wrapperClasses = baseClasses.wrapperClasses,
  headerClasses = baseClasses.headerClasses,
  columnsWrapperClasses = baseClasses.columnsWrapperClasses,
  entryClasses = baseClasses.entryClasses,
  visibleColumnClasses = baseClasses.visibleColumnClasses,
  hiddenColumnClasses = baseClasses.hiddenColumnClasses,
  columsLabel,
  updateColumns,
  getFloatingProps,
}: {
  columns: TableColumn<DataType>[];
  context: FloatingContext;
  refs: ExtendedRefs<unknown>;
  floatingStyles: React.CSSProperties;
  wrapperClasses?: string;
  headerClasses?: string;
  columnsWrapperClasses?: string;
  visibleColumnClasses?: string;
  hiddenColumnClasses?: string;
  entryClasses?: string;
  columsLabel?: string;
  updateColumns: (column: TableColumn<DataType>) => void;
  getFloatingProps: () => Record<string, unknown>;
}) {
  const visibleColumns = columns.filter((column) => !column.hidden).map((column) => column.id);

  function update(id: keyof DataType) {
    const columnToUpdate = columns.find((column) => column.id === id);
    if (!columnToUpdate) {
      return;
    }
    updateColumns({ ...columnToUpdate, hidden: !columnToUpdate?.hidden });
  }
  return (
    <div>
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false}>
          <div className={wrapperClasses} ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <div className={headerClasses}>{columsLabel}</div>
            <div className={columnsWrapperClasses}>
              {columns
                .filter((c) => c.title)
                .map((col, i) => (
                  <ColumnChooserEntry
                    key={i}
                    id={col.id}
                    title={col.title as string}
                    visibleColumns={visibleColumns}
                    updateColumns={update}
                    entryClasses={entryClasses}
                    visibleColumnClasses={visibleColumnClasses}
                    hiddenColumnClasses={hiddenColumnClasses}
                  />
                ))}
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    </div>
  );
}
