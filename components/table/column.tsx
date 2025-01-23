import { Icon } from '@iconify-icon/react';
import type { Identifier, XYCoord } from 'dnd-core';
import type { JSX } from 'react';
import { useContext, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import Input from '../form/input';
import { FilterContext } from './FilterContext';
import type { TableColumn } from './table';

interface DragItem {
  index: number;
  id: string;
  type: string;
}

export interface ColumnClasses {
  resizableClasses?: string;
  resizableComponentWrapperClasses?: string;
  resizableComponentWithFiltersClasses?: string;
  resizableComponentNoFiltersClasses?: string;
  resizableComponentStaticClasses?: string;
  resizableComponentHoveringClasses?: string;
  resizableComponentClasses?: string;
  headerWrapperClasses?: string;
  headerWrapperSortingClasses?: string;
  headerIconClasses?: string;
  filterWrapperClasses?: string;
  filterInputClasses?: string;
  cellClasses?: string;
  rowStaticClasses?: string;
  rowHoveringClasses?: string;
  firstColumnRowClasses?: string;
  intermediateColumnRowClasses?: string;
  lastColumnRowClasses?: string;
}

const baseClasses: ColumnClasses = {
  headerWrapperClasses:
    'flex h-12 flex-row items-center justify-between truncate bg-secondary-100 p-4 text-xs font-medium text-secondary-500',
  headerWrapperSortingClasses: 'cursor-pointer',
  headerIconClasses: 'h-4 w-4',
  filterWrapperClasses: 'h-12 bg-secondary-100 px-4 pb-4 text-xs font-medium text-secondary-500',
  filterInputClasses: 'h-10',
  rowStaticClasses: 'bg-white border-b last:border-none',
  firstColumnRowClasses: 'last:rounded-bl-2xl',
  intermediateColumnRowClasses: 'last:rounded-b-none',
  lastColumnRowClasses: 'last:rounded-br-2xl',
  rowHoveringClasses: 'bg-primary-200 border-b last:border-none',
  cellClasses: 'h-14 truncate p-4',
};

export default function Column<DataType>({
  column,
  data,
  cellRenderer,
  index,
  dragType,
  tableHasFilters,
  isFirst,
  isLast,
  headerWrapperClasses = baseClasses.headerWrapperClasses,
  headerWrapperSortingClasses = baseClasses.headerWrapperSortingClasses,
  headerIconClasses = baseClasses.headerIconClasses,
  filterWrapperClasses = baseClasses.filterWrapperClasses,
  filterInputClasses = baseClasses.filterInputClasses,
  cellClasses = baseClasses.cellClasses,
  rowStaticClasses = baseClasses.rowStaticClasses,
  rowHoveringClasses = baseClasses.rowHoveringClasses,
  firstColumnRowClasses = baseClasses.firstColumnRowClasses,
  intermediateColumnRowClasses = baseClasses.intermediateColumnRowClasses,
  lastColumnRowClasses = baseClasses.lastColumnRowClasses,
  filterComponent,
  hoveredRowIds,
  onRowHoverEnter = () => {
    return;
  },
  onRowHoverLeave = () => {
    return;
  },
  onRowClick = () => {
    return;
  },
  onRowDoubleClick = () => {
    return;
  },
  onSort = () => {
    return;
  },
  onDragEnd = () => {
    return;
  },
  moveColumn = () => {
    return;
  },
}: {
  column: TableColumn<DataType>;
  data: DataType[];
  cellRenderer?: { [key in keyof DataType]?: (data: DataType) => JSX.Element };
  index: number;
  dragType: string;
  tableHasFilters: boolean;
  headerWrapperClasses?: string;
  headerWrapperSortingClasses?: string;
  headerIconClasses?: string;
  filterWrapperClasses?: string;
  filterInputClasses?: string;
  cellClasses?: string;
  rowStaticClasses?: string;
  firstColumnRowClasses?: string;
  intermediateColumnRowClasses?: string;
  lastColumnRowClasses?: string;
  isFirst: boolean;
  isLast: boolean;
  rowHoveringClasses?: string;
  filterComponent?: JSX.Element;
  hoveredRowIds: number[];
  onRowHoverEnter?: (index: number) => void;
  onRowHoverLeave?: (index: number) => void;
  onRowClick?: (data: DataType) => void;
  onRowDoubleClick?: (data: DataType) => void;
  onSort?: (column: TableColumn<DataType>) => void;
  onDragEnd?: (dragIndex: number, hoverIndex: number) => void;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const { filters, setFilters } = useContext(FilterContext);

  const [{ handlerId }, drop] = useDrop<DragItem, unknown, { handlerId: Identifier | null }>({
    accept: dragType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!previewRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();

      // Get horizontal middle
      const hoverMiddleX = (hoverBoundingRect.left - hoverBoundingRect.right) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the right
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.right;

      // Only perform the move when the mouse has crossed half of the items width
      // When dragging left, only move when the cursor is below 50%
      // When dragging up, only move when the cursor is above 50%

      // Dragging left
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }

      // Dragging up
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      moveColumn(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
    drop(item: DragItem) {
      if (!previewRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      onDragEnd(dragIndex, hoverIndex);
    },
  });

  const [, drag, preview] = useDrag({
    type: dragType,
    item: () => {
      return { id: column.id, index };
    },
    collect: (monitor: { isDragging: () => boolean }) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  preview(drop(previewRef));
  drag(dragRef);

  return (
    <div className="grow" ref={previewRef} data-handler-id={handlerId} key={column.id.toString()}>
      {/* Header */}
      <div
        ref={dragRef}
        className={[headerWrapperClasses, column.sortKey && headerWrapperSortingClasses].join(' ')}
        onClick={() => {
          return (
            column.sortKey &&
            onSort(
              Object.assign({}, column, {
                sorting: column.sorting ? ({ '+': '-', '-': undefined }[column.sorting] as '+' | '-' | undefined) : '+',
              })
            )
          );
        }}
      >
        <span>{column.title}</span>
        {column.sortKey && (
          <div>
            <Icon
              className={headerIconClasses}
              icon={
                column.sorting
                  ? {
                      '+': 'heroicons:chevron-down-16-solid',
                      '-': 'heroicons:chevron-up-16-solid',
                    }[column.sorting]
                  : 'heroicons:chevron-up-16-solid'
              }
            />
          </div>
        )}
      </div>
      {/* Filter */}
      {tableHasFilters && (
        <div className={filterWrapperClasses}>
          {column.filterable && column.filterKey && (
            <>
              {filterComponent || (
                <Input
                  defaultValue={filters[column.filterKey]}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && column.filterKey) {
                      const key = column.filterKey;
                      const value = (e.currentTarget as HTMLInputElement).value;
                      if (e) {
                        await setFilters({ ...filters, [key]: value });
                      } else {
                        const newFilters = { ...filters };
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete newFilters[key];
                        await setFilters(newFilters);
                      }
                    }
                  }}
                  className={filterInputClasses}
                  iconRight="heroicons:magnifying-glass-16-solid"
                />
              )}
            </>
          )}
        </div>
      )}
      {/* Body */}
      {data.map((row, j) => {
        return (
          <div
            key={j}
            draggable={true}
            onDragStart={(event) => event.preventDefault()}
            className={[
              isFirst && firstColumnRowClasses,
              isLast && lastColumnRowClasses,
              !isFirst && !isLast && intermediateColumnRowClasses,
              hoveredRowIds.includes(j) ? rowHoveringClasses : rowStaticClasses,
            ].join(' ')}
            onMouseEnter={() => {
              onRowHoverEnter(j);
            }}
            onMouseLeave={() => onRowHoverLeave(j)}
          >
            {cellRenderer?.[column.id as keyof DataType]?.(row) || (
              <div
                className={cellClasses}
                title={(row[column.id as keyof DataType] as string) || undefined}
                onClick={() => onRowClick(row)}
                onDoubleClick={() => onRowDoubleClick(row)}
              >
                {row[column.id as keyof DataType] ? (row[column.id as keyof DataType] as string) : '-'}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
