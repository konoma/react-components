import type { Identifier } from 'dnd-core';
import type { JSX } from 'react';
import { useMemo, useRef } from 'react';
import type { XYCoord } from 'react-dnd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Input from '../form/input';
import Icon from '../ui/icon';
import type { ColumnClasses } from './column';
import type { PaginationClasses } from './pagination';
import Pagination from './pagination';

export interface TableColumn<DataType> {
  id: keyof DataType;
  title: string | JSX.Element;
  initialWidth?: string | number;
  hidden?: boolean;
  sorting?: '+' | '-' | undefined;
  // Mutually exclusive with onClick
  sortKey?: string;
  filterKey?: string;
  // Mutually exclusive with sorting
  onClick?: () => void;
  allowResize?: boolean;
  filterable?: boolean;
  grow?: boolean;
  filterComponent?: (filters: Record<string, string>, setFilters: (filters: Record<string, string>) => Promise<void>) => JSX.Element;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const baseClasses = {
  wrapperClasses: 'relative h-full',
  tableClasses:
    'max-h-full max-w-full overflow-x-auto overflow-y-auto rounded-krc-table outline-1 outline outline-secondary-300 divide-y divide-secondary-200',
  columnsWrapperClasses: 'flex flex-row overflow-x-auto overflow-y-auto h-full',
  columnsLeftClasses: 'flex flex-row h-fit overflow-x-auto border-r first:rounded-tl-krc-table last:rounded-tr-krc-table',
  columnsCenterClasses: 'flex grow flex-row h-fit overflow-x-auto first:rounded-tl-krc-table last:rounded-tr-krc-table',
  columnsRightClasses: 'flex flex-row h-fit overflow-x-auto border-l first:rounded-tl-krc-table last:rounded-tr-krc-table',
  noDataClasses: 'flex h-16 items-center justify-start pl-16 rounded-b-krc-table bg-white text-secondary-500 w-full',
  rowClasses: 'group relative flex flex-row justify-between bg-white last:rounded-b-krc-table hover:bg-primary-100',
  rowLeftWrapperClasses: 'bg-white group-hover:bg-primary-100',
  rowCenterWrapperClasses: 'bg-white first:grow group-hover:bg-primary-100',
  rowRightWrapperClasses: 'bg-white group-hover:bg-primary-100',
};

export default function Table<DataType extends { dragRef?: React.RefObject<HTMLDivElement> }>({
  noDataClasses = baseClasses.noDataClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  tableClasses = baseClasses.tableClasses,
  rowClasses = baseClasses.rowClasses,
  rowLeftWrapperClasses = baseClasses.rowLeftWrapperClasses,
  rowCenterWrapperClasses = baseClasses.rowCenterWrapperClasses,
  rowRightWrapperClasses = baseClasses.rowRightWrapperClasses,
  paginationClasses,
  columnsCenter,
  columnsRight,
  columnsLeft,
  cellRenderer,
  filters = {},
  data,
  pagination,
  totalRows,
  noEntryLabel,
  allowReorder,
  showFilters,
  onDragRow = () => {
    return;
  },
  onDropRow = () => {
    return;
  },
  onRowClick = () => {
    return;
  },
  onRowDoubleClick = () => {
    return;
  },
  onScroll = () => {
    return;
  },
  onUpdateFilters = async () => {
    return;
  },
  onSort = () => {
    return;
  },
}: {
  wrapperClasses?: string;
  tableClasses?: string;
  rowClasses?: string;
  rowLeftWrapperClasses?: string;
  rowCenterWrapperClasses?: string;
  rowRightWrapperClasses?: string;
  columnsWrapperClasses?: string;
  columnsLeftClasses?: string;
  columnsCenterClasses?: string;
  columnsRightClasses?: string;
  noDataClasses?: string;
  paginationClasses?: PaginationClasses;
  columnClasses?: ColumnClasses;
  columnsCenter: TableColumn<DataType>[];
  columnsRight?: TableColumn<DataType>[];
  columnsLeft?: TableColumn<DataType>[];
  cellRenderer?: { [key in keyof DataType]?: (data: DataType & { dragRef?: React.RefObject<HTMLDivElement> }) => JSX.Element };
  filterComponent?: { [key in keyof DataType]?: (data: DataType) => JSX.Element };
  filters?: Record<string, string>;
  showFilters?: boolean;
  data: DataType[];
  pagination?: boolean;
  totalRows: number;
  noEntryLabel?: string;
  allowReorder?: boolean;
  onDragRow?: (dragIndex: number, hoverIndex: number) => void;
  onDropRow?: (dragIndex: number, hoverIndex: number) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  onFirstPage?: () => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onLastPage?: () => void;
  toPage?: (page: number) => void;
  onRowClick?: (data: DataType) => void;
  onRowDoubleClick?: (data: DataType) => void;
  onSort?: (column: TableColumn<DataType>) => void;
  onUpdateFilters?: (filters: Record<string, string>) => Promise<void>;
  onUpdateColumnsLeft?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
  onUpdateColumnsCenter?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
  onUpdateColumnsRight?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
}) {
  const hasFilters = !!(
    showFilters &&
    (columnsCenter.some((column) => column.filterable) ||
      columnsLeft?.some((column) => column.filterable) ||
      columnsRight?.some((column) => column.filterable))
  );

  const header = useRef<HTMLDivElement>(null);

  const currentColumnsLeft = useMemo(() => columnsLeft?.filter((column) => !column?.hidden) || [], [columnsLeft]);
  const currentColumnsCenter = useMemo(() => columnsCenter?.filter((column) => !column?.hidden) || [], [columnsCenter]);
  const currentColumnsRight = useMemo(() => columnsRight?.filter((column) => !column?.hidden) || [], [columnsRight]);

  async function updateFilters(newFilters: Record<string, string>) {
    await onUpdateFilters(newFilters);
  }
  return (
    <div className={wrapperClasses}>
      <div
        style={{
          gridTemplateRows: `repeat(${data.length + 1}, auto)`,
          display: 'grid',
          gridAutoFlow: 'row',
          gridAutoRows: 'auto',
        }}
        className={tableClasses}
        onScroll={onScroll}
      >
        {/* Header */}
        <div ref={header} className="sticky top-0 z-[1] flex flex-row items-center justify-between rounded-t-krc-table bg-secondary-50">
          {!!currentColumnsLeft.length && (
            <div className="sticky left-0 flex flex-row z-[1]">
              {currentColumnsLeft.map((column) => (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: column.initialWidth,
                  }}
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
                  className={[
                    'flex flex-col items-center truncate bg-secondary-50 justify-center px-4 py-3 text-xs font-medium first:rounded-tl-krc-table gap-2',
                    hasFilters ? 'h-24' : 'h-12',
                    column.sortKey ? 'cursor-pointer' : '',
                  ].join(' ')}
                >
                  <div className="flex flex-row items-center gap-2 w-full justify-between">
                    <span>{column.title}</span>
                    {column.sortKey && (
                      <div>
                        <Icon
                          className="h-4 w-4"
                          name={
                            column.sorting
                              ? {
                                  '+': 'heroicons:chevron-down-16-solid',
                                  '-': 'heroicons:chevron-up-16-solid',
                                }[column.sorting]
                              : 'heroicons:chevron-up-down-16-solid'
                          }
                        />
                      </div>
                    )}
                  </div>
                  {/* Filter */}
                  {hasFilters && (
                    <div className="bg-secondary-50 text-xs font-medium text-secondary-500">
                      {column.filterable && column.filterKey && (
                        <>
                          {column.filterComponent?.(filters, updateFilters) || (
                            <Input
                              defaultValue={filters[column.filterKey]}
                              key={filters[column.filterKey]}
                              onKeyDown={async (e) => {
                                if (e.key === 'Enter' && column.filterKey) {
                                  const key = column.filterKey;
                                  const value = (e.currentTarget as HTMLInputElement).value;
                                  if (e) {
                                    await updateFilters({ ...filters, [key]: value });
                                  } else {
                                    const newFilters = { ...filters };
                                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                                    delete newFilters[key];
                                    await updateFilters(newFilters);
                                  }
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onIconRightClick={async (e) => {
                                e.stopPropagation();
                                const key = column.filterKey;
                                if (key) {
                                  const newFilters = { ...filters };
                                  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                                  delete newFilters[key];
                                  await updateFilters(newFilters);
                                }
                              }}
                              isClearable
                              className="h-10"
                              iconRightName={filters[column.filterKey] ? 'heroicons:x-mark' : ''}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {currentColumnsCenter.map((column) => (
            <div
              key={column.id.toString()}
              style={{
                minWidth: column.initialWidth,
                maxWidth: column.initialWidth,
              }}
              className={[
                'flex flex-col items-center truncate bg-secondary-50 justify-center px-4 py-3 text-xs font-medium first:rounded-tl-krc-table gap-2',
                hasFilters ? 'h-24' : 'h-12',
                column.sortKey ? 'cursor-pointer' : '',
              ].join(' ')}
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
              <div className="flex flex-row items-center gap-2 w-full justify-between">
                <span>{column.title}</span>
                {column.sortKey && (
                  <div>
                    <Icon
                      className="h-4 w-4"
                      name={
                        column.sorting
                          ? {
                              '+': 'heroicons:chevron-down-16-solid',
                              '-': 'heroicons:chevron-up-16-solid',
                            }[column.sorting]
                          : 'heroicons:chevron-up-down-16-solid'
                      }
                    />
                  </div>
                )}
              </div>
              {/* Filter */}
              {hasFilters && (
                <div className="bg-secondary-50 text-xs font-medium text-secondary-500">
                  {column.filterable && column.filterKey && (
                    <>
                      {column.filterComponent?.(filters, updateFilters) || (
                        <Input
                          defaultValue={filters[column.filterKey]}
                          key={filters[column.filterKey]}
                          onKeyDown={async (e) => {
                            if (e.key === 'Enter' && column.filterKey) {
                              const key = column.filterKey;
                              const value = (e.currentTarget as HTMLInputElement).value;
                              if (e) {
                                await updateFilters({ ...filters, [key]: value });
                              } else {
                                const newFilters = { ...filters };
                                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                                delete newFilters[key];
                                await updateFilters(newFilters);
                              }
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          onIconRightClick={async (e) => {
                            e.stopPropagation();
                            const key = column.filterKey;
                            if (key) {
                              const newFilters = { ...filters };
                              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                              delete newFilters[key];
                              await updateFilters(newFilters);
                            }
                          }}
                          isClearable
                          className="h-10"
                          iconRightName={filters[column.filterKey] ? 'heroicons:x-mark' : ''}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {!!currentColumnsRight.length && (
            <div className="sticky right-0 flex flex-row h-full items-center">
              {currentColumnsRight.map((column) => (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: column.initialWidth,
                  }}
                  className="flex h-full flex-row items-center justify-end truncate bg-secondary-50 px-4 py-3 text-xs font-medium last:rounded-tr-krc-table"
                >
                  {column.title}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Body */}
        {allowReorder ? (
          <DndProvider backend={HTML5Backend} debugMode>
            {data.map((entry, i) => {
              return (
                <Row<DataType>
                  key={i}
                  index={i}
                  entry={entry}
                  onDragRow={onDragRow}
                  onDropRow={onDropRow}
                  currentColumnsCenter={currentColumnsCenter}
                  currentColumnsLeft={currentColumnsLeft}
                  currentColumnsRight={currentColumnsRight}
                  cellRenderer={cellRenderer}
                  header={header}
                  onRowClick={onRowClick}
                  onRowDoubleClick={onRowDoubleClick}
                  rowClasses={rowClasses}
                  rowLeftWrapperClasses={rowLeftWrapperClasses}
                  rowCenterWrapperClasses={rowCenterWrapperClasses}
                  rowRightWrapperClasses={rowRightWrapperClasses}
                />
              );
            })}
          </DndProvider>
        ) : (
          <>
            {data.map((entry, i) => {
              return (
                <div key={i} className={rowClasses} onClick={() => onRowClick(entry)} onDoubleClick={() => onRowDoubleClick(entry)}>
                  {!!currentColumnsLeft.length && (
                    <div className="sticky left-0 flex flex-row border-r">
                      {currentColumnsLeft.map((column) => {
                        return (
                          <div
                            key={column.id.toString()}
                            style={{
                              minWidth: column.initialWidth,
                              maxWidth: column.initialWidth,
                            }}
                            className={rowLeftWrapperClasses}
                            title={(entry[column.id] as string) || ''}
                          >
                            {cellRenderer?.[column.id]?.(entry) || (
                              <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {currentColumnsCenter.map((column) => {
                    return (
                      <div
                        key={column.id.toString()}
                        style={{
                          minWidth: column.initialWidth,
                          maxWidth: column.initialWidth,
                        }}
                        className={rowCenterWrapperClasses}
                        title={entry[column.id] ? (entry[column.id] as string).toString() : ''}
                      >
                        {cellRenderer?.[column.id]?.(entry) || (
                          <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                        )}
                      </div>
                    );
                  })}
                  {!!currentColumnsRight.length && (
                    <div className="sticky right-0 flex flex-row border-l">
                      {currentColumnsRight.map((column) => {
                        return (
                          <div
                            key={column.id.toString()}
                            style={{
                              minWidth: column.initialWidth,
                              maxWidth: column.initialWidth,
                            }}
                            className={rowRightWrapperClasses}
                            title={(entry[column.id] as string) || ''}
                          >
                            {cellRenderer?.[column.id]?.(entry) || (
                              <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div
                    style={{ width: `${(header.current?.scrollWidth || 0) - 1}px` }}
                    className="absolute bottom-0 left-0 right-0 h-px bg-secondary-50"
                  ></div>
                </div>
              );
            })}
          </>
        )}
        {data.length === 0 && <div className={noDataClasses}>{noEntryLabel}</div>}
      </div>
      {pagination && data.length > 0 && <Pagination currentTotal={totalRows} currentLoaded={data.length} {...paginationClasses} />}
    </div>
  );
}

function Row<DataType>({
  index,
  entry,
  onDragRow,
  onDropRow,
  onRowClick,
  onRowDoubleClick,
  currentColumnsLeft,
  currentColumnsCenter,
  currentColumnsRight,
  cellRenderer,
  header,
  rowClasses,
  rowLeftWrapperClasses,
  rowCenterWrapperClasses,
  rowRightWrapperClasses,
}: {
  index: number;
  entry: DataType;
  onDragRow: (dragIndex: number, hoverIndex: number) => void;
  onDropRow: (dragIndex: number, hoverIndex: number) => void;
  onRowClick: (data: DataType) => void;
  onRowDoubleClick: (data: DataType) => void;
  currentColumnsLeft: TableColumn<DataType>[];
  currentColumnsCenter: TableColumn<DataType>[];
  currentColumnsRight: TableColumn<DataType>[];
  cellRenderer?: { [key in keyof DataType]?: (data: DataType & { dragRef?: React.RefObject<HTMLDivElement> }) => JSX.Element };
  header: React.MutableRefObject<HTMLDivElement | null>;
  rowClasses: string;
  rowLeftWrapperClasses: string;
  rowCenterWrapperClasses: string;
  rowRightWrapperClasses: string;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  if (!Object.prototype.hasOwnProperty.call(entry, 'index')) {
    throw new Error('Entry must have index property');
  }

  const [{ handlerId }, drop] = useDrop<DragItem, undefined, { handlerId: Identifier | null }>({
    accept: 'row',
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

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onDragRow(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ opacity }, drag, preview] = useDrag({
    type: 'row',
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }
      const dropResult = monitor.getDropResult<DragItem>();
      if (dropResult) {
        onDropRow(item.index, dropResult.index);
      }
    },
    item: () => {
      return { id: (entry as DataType & { index: number }).index, index };
    },
    collect: (monitor: { isDragging: () => boolean }) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  preview(drop(previewRef));
  drag(dragRef);
  return (
    <div
      className={rowClasses}
      onClick={() => onRowClick(entry)}
      onDoubleClick={() => onRowDoubleClick(entry)}
      ref={previewRef}
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      {!!currentColumnsLeft.length && (
        <div className="sticky left-0 flex flex-row border-r">
          {currentColumnsLeft.map((column) => {
            return (
              <div
                key={column.id.toString()}
                style={{
                  minWidth: column.initialWidth,
                  maxWidth: column.initialWidth,
                }}
                className={rowLeftWrapperClasses}
                title={(entry[column.id] as string) || ''}
              >
                {cellRenderer?.[column.id]?.({ ...entry, dragRef }) || (
                  <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {currentColumnsCenter.map((column) => {
        return (
          <div
            key={column.id.toString()}
            style={{
              minWidth: column.initialWidth,
              maxWidth: column.initialWidth,
            }}
            className={rowCenterWrapperClasses}
            title={entry[column.id] ? (entry[column.id] as string).toString() : ''}
          >
            {cellRenderer?.[column.id]?.({ ...entry, dragRef }) || (
              <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
            )}
          </div>
        );
      })}
      {!!currentColumnsRight.length && (
        <div className="sticky right-0 flex flex-row border-l">
          {currentColumnsRight.map((column) => {
            return (
              <div
                key={column.id.toString()}
                style={{
                  minWidth: column.initialWidth,
                  maxWidth: column.initialWidth,
                }}
                className={rowRightWrapperClasses}
                title={(entry[column.id] as string) || ''}
              >
                {cellRenderer?.[column.id]?.({ ...entry, dragRef }) || (
                  <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <div
        style={{ width: `${(header.current?.scrollWidth || 0) - 1}px` }}
        className="absolute bottom-0 left-0 right-0 h-px bg-secondary-50"
      ></div>
    </div>
  );
}
