import type { ExtendedRefs, FloatingContext } from '@floating-ui/react';
import type { TableColumn } from './table.tsx';

import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ColumnChooserEntry from './columnChooserEntry.tsx';

const baseClasses = {
  wrapperClasses: 'flex flex-col rounded-krc-table-column-chooser bg-white px-4 py-3 shadow-sm z-1',
  headerClasses: 'h-8',
  columnsWrapperClasses: 'ml-2 mt-3 flex max-h-100 flex-col gap-1 overflow-y-auto',
  entryClasses: 'cursor-pointer px-4 py-2 text-sm font-medium text-secondary-600 flex flex-row items-center gap-4',
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
  columnsLabel,
  updateColumns,
  updateOrder,
  getFloatingProps,
}: Readonly<{
  columns: TableColumn<DataType>[]
  context: FloatingContext
  refs: ExtendedRefs<unknown>
  floatingStyles: React.CSSProperties
  wrapperClasses?: string
  headerClasses?: string
  columnsWrapperClasses?: string
  visibleColumnClasses?: string
  hiddenColumnClasses?: string
  entryClasses?: string
  columnsLabel?: string
  updateColumns: (column: TableColumn<DataType>) => void
  updateOrder: (columns: TableColumn<DataType>[]) => void
  getFloatingProps: () => Record<string, unknown>
}>) {
  const visibleColumns = columns.filter(column => !column.hidden).map(column => column.id);

  const [orderedColumnsPreview, setOrderedColumnsPreview] = useState<TableColumn<DataType>[]>(columns);

  function update(id: keyof DataType) {
    const columnToUpdate = columns.find(column => column.id === id);
    if (!columnToUpdate) {
      return;
    }
    updateColumns({ ...columnToUpdate, hidden: !columnToUpdate?.hidden });
  }

  const onDragColumn = (dragIndex: number, hoverIndex: number) => {
    setOrderedColumnsPreview((currentColumns) => {
      const updatedColumns = [...currentColumns];
      const [draggedColumn] = updatedColumns.splice(dragIndex, 1);
      updatedColumns.splice(hoverIndex, 0, draggedColumn);
      return updatedColumns;
    });
  };

  const onDropColumn = (dragIndex: number, hoverIndex: number) => {
    const updatedColumns = [...orderedColumnsPreview];
    const [draggedColumn] = updatedColumns.splice(dragIndex, 1);
    updatedColumns.splice(hoverIndex, 0, draggedColumn);
    setOrderedColumnsPreview(updatedColumns);
    updateOrder(updatedColumns);
  };

  return (
    <div>
      <FloatingPortal>
        <FloatingFocusManager context={context} modal={false}>
          <div className={wrapperClasses} ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <div className={headerClasses}>{columnsLabel}</div>
            <div className={columnsWrapperClasses}>
              <DndProvider backend={HTML5Backend} debugMode>
                {orderedColumnsPreview
                  .filter(c => c.title && !c.hideFromChooser)
                  .map((col, i) => (
                    <ColumnChooserEntry
                      key={col.id.toString() ?? col.id}
                      id={col.id}
                      index={i}
                      title={col.title as string}
                      visibleColumns={visibleColumns}
                      updateColumns={update}
                      entryClasses={entryClasses}
                      visibleColumnClasses={visibleColumnClasses}
                      hiddenColumnClasses={hiddenColumnClasses}
                      onDragColumn={onDragColumn}
                      onDropColumn={onDropColumn}
                    />
                  ))}
              </DndProvider>
            </div>
          </div>
        </FloatingFocusManager>
      </FloatingPortal>
    </div>
  );
}
