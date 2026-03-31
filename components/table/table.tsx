import type { Identifier } from 'dnd-core';
import type { ReactNode } from 'react';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { XYCoord } from 'react-dnd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Input from '../form/input.tsx';
import Icon from '../ui/icon.tsx';
import { i18nContext } from '../wrapper.tsx';
import type { PaginationClasses } from './pagination.tsx';
import Pagination from './pagination.tsx';

export interface TableColumnBase {
  id: string | number | symbol;
  title: ReactNode;
  hideFromChooser?: boolean;
}

export interface TableColumn<DataType> extends TableColumnBase {
  id: keyof DataType;
  initialWidth?: string | number;
  hidden?: boolean;
  sorting?: '+' | '-' | undefined;
  // Mutually exclusive with onClick
  sortKey?: string;
  filterKey?: string;
  filterType?: 'filter' | 'fieldSearch';
  // Mutually exclusive with sorting
  onClick?: () => void;
  allowResize?: boolean;
  filterable?: boolean;
  grow?: boolean;
  lastFilter?: boolean;
  filterComponent?: (
    filters: Record<string, string[]>,
    setFilters: (filters: Record<string, string[]>, triggeringFilterId: string) => Promise<void>
  ) => ReactNode;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const baseClasses = {
  wrapperClasses: 'relative h-full',
  tableClasses:
    'max-h-full max-w-full overflow-x-auto overflow-y-auto rounded-krc-table outline-1 outline-solid outline-secondary-300 divide-y divide-secondary-200',
  headerClasses:
    'flex flex-col items-start truncate bg-krc-table-header justify-center px-4 py-3 text-xs font-medium first:rounded-tl-krc-table gap-2',
  columnsWrapperClasses: 'flex flex-row overflow-x-auto overflow-y-auto h-full',
  columnsLeftClasses: 'flex flex-row h-fit overflow-x-auto border-r first:rounded-tl-krc-table last:rounded-tr-krc-table',
  columnsCenterClasses: 'flex grow flex-row h-fit overflow-x-auto first:rounded-tl-krc-table last:rounded-tr-krc-table',
  columnsRightClasses: 'flex flex-row h-fit overflow-x-auto border-l first:rounded-tl-krc-table last:rounded-tr-krc-table',
  noDataClasses: 'flex h-16 items-center justify-start pl-16 rounded-b-krc-table bg-white text-secondary-500 w-full text-sm',
  rowClasses: 'group relative flex flex-row justify-between bg-white last:rounded-b-krc-table hover:bg-primary-100 h-fit',
  subRowClasses: 'group relative flex flex-row justify-between bg-base-200 last:rounded-b-krc-table hover:bg-primary-100 h-fit',
  rowLeftWrapperClasses: 'bg-white group-hover:bg-primary-100 h-fit',
  rowCenterWrapperClasses: 'bg-white first:grow group-hover:bg-primary-100 h-fit',
  rowRightWrapperClasses: 'bg-white group-hover:bg-primary-100 h-fit',
  subRowLeftWrapperClasses: 'bg-base-200 group-hover:bg-primary-100 h-fit',
  subRowCenterWrapperClasses: 'bg-base-200 first:grow group-hover:bg-primary-100 h-fit',
  subRowRightWrapperClasses: 'bg-base-200 group-hover:bg-primary-100 h-fit',
};

export default function Table<DataType extends { dragRef?: React.RefObject<HTMLDivElement>; index?: number }>({
  noDataClasses = baseClasses.noDataClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  tableClasses = baseClasses.tableClasses,
  rowClasses = baseClasses.rowClasses,
  rowLeftWrapperClasses = baseClasses.rowLeftWrapperClasses,
  rowCenterWrapperClasses = baseClasses.rowCenterWrapperClasses,
  rowRightWrapperClasses = baseClasses.rowRightWrapperClasses,
  subRowClasses = baseClasses.subRowClasses,
  subRowLeftWrapperClasses = baseClasses.subRowLeftWrapperClasses,
  subRowCenterWrapperClasses = baseClasses.subRowCenterWrapperClasses,
  subRowRightWrapperClasses = baseClasses.subRowRightWrapperClasses,
  headerClasses = baseClasses.headerClasses,
  paginationClasses,
  filterComponents,
  columnsCenter,
  columnsRight,
  columnsLeft,
  cellRenderer,
  filters = {},
  data,
  pagination,
  totalRows,
  totalPagesProp,
  detailsRow,
  currentPage = 0,
  noEntryLabel,
  allowReorder,
  showFilters,
  pagesize = 10,
  xToY,
  isInfinite = true,
  name = '',
  firstPageIconName,
  firstPageIconPath,
  previousPageIconName,
  previousPageIconPath,
  nextPageIconName,
  nextPageIconPath,
  lastPageIconName,
  lastPageIconPath,
  sortingAscIconName,
  sortingAscIconPath,
  sortingDescIconName,
  sortingDescIconPath,
  removeFilterIconName,
  removeFilterIconPath,
  triggeredFilter,
  setTriggeredFilter,
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
  onFirstPage = () => {
    return;
  },
  onPreviousPage = () => {
    return;
  },
  onNextPage = () => {
    return;
  },
  onLastPage = () => {
    return;
  },
  toPage = (page: number) => {
    return;
  },
}: {
  wrapperClasses?: string;
  tableClasses?: string;
  rowClasses?: string;
  rowLeftWrapperClasses?: string;
  rowCenterWrapperClasses?: string;
  rowRightWrapperClasses?: string;
  subRowClasses?: string;
  subRowLeftWrapperClasses?: string;
  subRowCenterWrapperClasses?: string;
  subRowRightWrapperClasses?: string;
  columnsWrapperClasses?: string;
  columnsLeftClasses?: string;
  columnsCenterClasses?: string;
  columnsRightClasses?: string;
  headerClasses?: string;
  noDataClasses?: string;
  currentPage?: number;
  totalPagesProp?: number;
  paginationClasses?: PaginationClasses;
  columnsCenter: TableColumn<DataType>[];
  columnsRight?: TableColumn<DataType>[];
  columnsLeft?: TableColumn<DataType>[];
  cellRenderer?: { [key in keyof DataType]?: (data: DataType & { dragRef?: React.RefObject<HTMLDivElement> }) => ReactNode };
  filterComponents?: {
    [key in keyof DataType]?: (
      filters: Record<string, string[]>,
      setFilters: (filters: Record<string, string[]>, triggeringFilterId: string) => Promise<void>
    ) => ReactNode;
  };
  filters?: Record<string, string[]>;
  showFilters?: boolean;
  data: DataType[];
  pagination?: boolean;
  totalRows: number;
  noEntryLabel?: string;
  detailsRow?: (data: DataType) => ReactNode | DataType[];
  allowReorder?: boolean;
  xToY?: string;
  isInfinite?: boolean;
  pagesize?: number;
  name?: string;
  firstPageIconName?: string;
  firstPageIconPath?: string;
  previousPageIconName?: string;
  previousPageIconPath?: string;
  nextPageIconName?: string;
  nextPageIconPath?: string;
  lastPageIconName?: string;
  lastPageIconPath?: string;
  sortingAscIconName?: string;
  sortingAscIconPath?: string;
  sortingDescIconName?: string;
  sortingDescIconPath?: string;
  removeFilterIconName?: string;
  removeFilterIconPath?: string;
  triggeredFilter?: string;
  setTriggeredFilter?: (filterId: string) => void;
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
  onUpdateFilters?: (filters: Record<string, string[]>) => Promise<void>;
  onUpdateColumnsLeft?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
  onUpdateColumnsCenter?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
  onUpdateColumnsRight?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void;
}) {
  const { locale } = useContext(i18nContext);

  const hasFilters = !!(
    showFilters &&
    (columnsCenter.some((column) => column.filterable) ||
      columnsLeft?.some((column) => column.filterable) ||
      columnsRight?.some((column) => column.filterable))
  );

  const totalPages = totalPagesProp || Math.ceil(totalRows / pagesize);
  const currentStart = (currentPage - 1) * pagesize;
  const currentEnd = currentPage * pagesize;

  const header = useRef<HTMLDivElement>(null);

  const currentColumnsLeft = useMemo(() => columnsLeft?.filter((column) => !column?.hidden) || [], [columnsLeft]);
  const currentColumnsCenter = useMemo(() => columnsCenter?.filter((column) => !column?.hidden) || [], [columnsCenter]);
  const currentColumnsRight = useMemo(() => columnsRight?.filter((column) => !column?.hidden) || [], [columnsRight]);

  const [detailsOpen, setDetailsOpen] = useState<boolean[]>([]);

  useEffect(() => {
    // scroll triggered column into view
    if (!triggeredFilter) {
      return;
    }
    const columnIndex =
      currentColumnsLeft.findIndex((col) => col.filterKey === triggeredFilter) >= 0
        ? currentColumnsLeft.findIndex((col) => col.filterKey === triggeredFilter)
        : currentColumnsCenter.findIndex((col) => col.filterKey === triggeredFilter) >= 0
          ? currentColumnsLeft.length + currentColumnsCenter.findIndex((col) => col.filterKey === triggeredFilter)
          : currentColumnsLeft.length +
            currentColumnsCenter.length +
            currentColumnsRight.findIndex((col) => col.filterKey === triggeredFilter);
    const columnElement = header.current?.children.item(columnIndex) as HTMLDivElement | null;
    if (columnElement) {
      columnElement.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  }, []);

  async function updateFilters(newFilters: Record<string, string[]>, triggeringFilterId: string) {
    setTriggeredFilter?.(triggeringFilterId);
    await onUpdateFilters(newFilters);
  }

  return (
    <div className={wrapperClasses} data-testid={name + '-table'}>
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
        <div
          ref={header}
          data-testid={name + '-table-header'}
          key={locale}
          className="sticky top-0 z-1 flex flex-row items-center justify-between rounded-t-krc-table bg-krc-table-header"
        >
          {(detailsRow || !!currentColumnsLeft.length) && (
            <div className="sticky left-0 flex flex-row z-1" data-testid={name + '-table-header-left'}>
              {detailsRow && <div className={[headerClasses, 'w-12', hasFilters ? 'h-24' : 'h-12'].join(' ')}></div>}
              {currentColumnsLeft.map((column) => (
                <div
                  key={column.id.toString()}
                  data-testid={`${name}-table-header-left-${column.id.toString()}`}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: !column.grow ? column.initialWidth : undefined,
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
                    headerClasses,
                    hasFilters ? 'h-24' : 'h-12',
                    column.sortKey ? 'cursor-pointer' : '',
                    column.grow ? 'grow' : '',
                  ].join(' ')}
                >
                  <div className="flex flex-row items-center gap-2 w-full justify-between truncate">
                    <span className="truncate" title={typeof column.title === 'string' ? column.title : undefined}>
                      {column.title}
                    </span>
                    {column.sortKey && (
                      <div>
                        <Icon
                          className="h-4 w-4"
                          name={
                            column.sorting
                              ? {
                                  '+': sortingAscIconName || 'heroicons:chevron-down-16-solid',
                                  '-': sortingDescIconName || 'heroicons:chevron-up-16-solid',
                                }[column.sorting]
                              : sortingDescIconName || 'heroicons:chevron-up-down-16-solid'
                          }
                          path={column.sorting ? (column.sorting === '+' ? sortingAscIconPath : sortingDescIconPath) : undefined}
                        />
                      </div>
                    )}
                  </div>
                  {/* Filter */}
                  {hasFilters && (
                    <div
                      className="bg-krc-table-header w-full text-xs font-medium text-secondary-500 min-h-10"
                      key={Object.keys(filters).join('-')}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {column.filterable && column.filterKey && (
                        <>
                          {column.filterComponent?.(filters, updateFilters) || filterComponents?.[column.id]?.(filters, updateFilters) || (
                            <Input
                              defaultValue={filters[column.filterKey]?.join(', ')}
                              dataTestId={`${name}-table-header-left-filter-${column.id.toString()}`}
                              key={filters[column.filterKey]?.join(', ')}
                              onKeyDown={async (e: React.KeyboardEvent<HTMLElement>) => {
                                if (e.key === 'Enter' && column.filterKey) {
                                  const key = column.filterKey;
                                  const value = (e.currentTarget as HTMLInputElement).value;
                                  if (e) {
                                    await updateFilters({ ...filters, [key]: [value] }, key);
                                  } else {
                                    const newFilters = { ...filters };
                                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                                    delete newFilters[key];
                                    await updateFilters(newFilters, '');
                                  }
                                }
                              }}
                              onClick={(e: React.MouseEvent<Element>) => {
                                e.stopPropagation();
                              }}
                              onIconRightClick={async (e: React.MouseEvent<Element>) => {
                                e.stopPropagation();
                                const key = column.filterKey;
                                if (key) {
                                  const newFilters = { ...filters };
                                  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                                  delete newFilters[key];
                                  await updateFilters(newFilters, '');
                                }
                              }}
                              isClearable
                              classes="h-10 relative"
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
                maxWidth: !column.grow ? column.initialWidth : undefined,
              }}
              data-testid={`${name}-table-header-center-${column.id.toString()}`}
              className={[
                headerClasses,
                hasFilters ? 'h-24' : 'h-12',
                column.sortKey ? 'cursor-pointer' : '',
                column.grow ? 'grow' : '',
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
              <div className="flex flex-row items-center gap-2 w-full justify-between truncate">
                <span className="truncate" title={typeof column.title === 'string' ? column.title : undefined}>
                  {column.title}
                </span>
                {column.sortKey && (
                  <div>
                    <Icon
                      className="h-4 w-4"
                      name={
                        column.sorting
                          ? {
                              '+': sortingAscIconName || 'heroicons:chevron-down-16-solid',
                              '-': sortingDescIconName || 'heroicons:chevron-up-16-solid',
                            }[column.sorting]
                          : sortingDescIconName || 'heroicons:chevron-up-down-16-solid'
                      }
                      path={column.sorting ? (column.sorting === '+' ? sortingAscIconPath : sortingDescIconPath) : undefined}
                    />
                  </div>
                )}
              </div>
              {/* Filter */}
              {hasFilters && (
                <div
                  className="bg-krc-table-header text-xs font-medium w-full text-secondary-500 min-h-10"
                  key={Object.keys(filters).join('-')}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {column.filterable && column.filterKey && (
                    <>
                      {column.filterComponent?.(filters, updateFilters) || filterComponents?.[column.id]?.(filters, updateFilters) || (
                        <Input
                          defaultValue={filters[column.filterKey]?.join(', ')}
                          dataTestId={`${name}-table-header-center-filter-${column.id.toString()}`}
                          key={filters[column.filterKey]?.join(', ')}
                          onKeyDown={async (e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' && column.filterKey) {
                              const key = column.filterKey;
                              const value = (e.currentTarget as HTMLInputElement).value;
                              if (e) {
                                await updateFilters({ ...filters, [key]: [value] }, key);
                              } else {
                                const newFilters = { ...filters };
                                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                                delete newFilters[key];
                                await updateFilters(newFilters, '');
                              }
                            }
                          }}
                          onClick={(e: React.MouseEvent<Element>) => {
                            e.stopPropagation();
                          }}
                          onIconRightClick={async (e: React.MouseEvent<Element>) => {
                            e.stopPropagation();
                            const key = column.filterKey;
                            if (key) {
                              const newFilters = { ...filters };
                              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                              delete newFilters[key];
                              await updateFilters(newFilters, '');
                            }
                          }}
                          isClearable
                          classes="h-10 relative"
                          iconRightName={filters[column.filterKey] ? removeFilterIconName || 'heroicons:x-mark' : ''}
                          iconRightPath={filters[column.filterKey] ? removeFilterIconPath : ''}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
          {!!currentColumnsRight.length && (
            <div className="sticky -right-px flex flex-row h-full items-center">
              {currentColumnsRight.map((column) => (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: !column.grow ? column.initialWidth : undefined,
                  }}
                  data-testid={`${name}-table-header-right-${column.id.toString()}`}
                  className="flex h-full flex-row items-start justify-end truncate bg-krc-table-header px-4 py-3 text-xs font-medium last:rounded-tr-krc-table"
                >
                  {column.title}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Body */}

        <DndProvider backend={HTML5Backend} debugMode>
          {data.map((entry, i) => {
            return (
              <Row<DataType>
                key={i}
                index={i}
                name={name}
                entry={entry}
                allowReorder={allowReorder}
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
                subRowClasses={subRowClasses}
                subRowLeftWrapperClasses={subRowLeftWrapperClasses}
                subRowCenterWrapperClasses={subRowCenterWrapperClasses}
                subRowRightWrapperClasses={subRowRightWrapperClasses}
                detailsRow={detailsRow}
              />
            );
          })}
        </DndProvider>

        {data.length === 0 && (
          <div data-testid={name + '-table-no-data'} className={noDataClasses}>
            {noEntryLabel}
          </div>
        )}
      </div>
      {pagination && xToY && data.length > 0 && (
        <Pagination
          showButtons={!isInfinite}
          xToY={xToY}
          dataTestId={`${name}-table-pagination`}
          currentTotal={totalRows}
          currentLoaded={data.length}
          currentStart={currentStart}
          currentEnd={currentEnd}
          currentPage={currentPage}
          firstPageIconName={firstPageIconName}
          firstPageIconPath={firstPageIconPath}
          previousPageIconName={previousPageIconName}
          previousPageIconPath={previousPageIconPath}
          nextPageIconName={nextPageIconName}
          nextPageIconPath={nextPageIconPath}
          lastPageIconName={lastPageIconName}
          lastPageIconPath={lastPageIconPath}
          totalPages={totalPages}
          onFirstPage={onFirstPage}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
          onLastPage={onLastPage}
          toPage={toPage}
          {...paginationClasses}
        />
      )}
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
  subRowClasses,
  subRowLeftWrapperClasses,
  subRowCenterWrapperClasses,
  subRowRightWrapperClasses,
  allowReorder,
  detailsRow,
  name,
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
  cellRenderer?: { [key in keyof DataType]?: (data: DataType & { dragRef: React.RefObject<HTMLDivElement | null> }) => ReactNode };
  header: React.RefObject<HTMLDivElement | null>;
  rowClasses: string;
  rowLeftWrapperClasses: string;
  rowCenterWrapperClasses: string;
  rowRightWrapperClasses: string;
  subRowClasses?: string;
  subRowLeftWrapperClasses?: string;
  subRowCenterWrapperClasses?: string;
  subRowRightWrapperClasses?: string;
  allowReorder?: boolean;
  detailsRow?: (data: DataType) => ReactNode | DataType[];
  name: string;
}) {
  const dragRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  if (allowReorder && !Object.prototype.hasOwnProperty.call(entry, 'index')) {
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
      if (!allowReorder || !previewRef.current) {
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

  if (allowReorder) {
    preview(drop(previewRef));
    drag(dragRef);
  }
  return (
    <div className="flex flex-col">
      <div
        className={rowClasses}
        onClick={() => onRowClick(entry)}
        onDoubleClick={() => onRowDoubleClick(entry)}
        ref={previewRef}
        style={{ opacity }}
        data-handler-id={handlerId}
        data-testid={`${name}-table-row`}
      >
        {(detailsRow || !!currentColumnsLeft.length) && (
          <div className="sticky left-0 flex flex-row border-r">
            {detailsRow && (
              <div className={['flex items-center justify-center w-12', rowLeftWrapperClasses].join(' ')}>
                {detailsRow?.(entry) && (
                  <button
                    className="w-8 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setDetailsOpen(!detailsOpen);
                    }}
                  >
                    <Icon name={detailsOpen ? 'heroicons:chevron-down' : 'heroicons:chevron-right'} className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}
            {currentColumnsLeft.map((column) => {
              return (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: !column.grow ? column.initialWidth : undefined,
                  }}
                  className={[rowLeftWrapperClasses, column.grow ? 'grow' : ''].join(' ')}
                  title={(entry[column.id] as string) || ''}
                >
                  {(dragRef && cellRenderer?.[column.id]?.({ ...entry, dragRef })) || (
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
                maxWidth: !column.grow ? column.initialWidth : undefined,
              }}
              className={[rowCenterWrapperClasses, column.grow ? 'grow' : ''].join(' ')}
              title={entry[column.id] ? (entry[column.id] as string).toString() : ''}
            >
              {cellRenderer?.[column.id]?.({ ...entry, dragRef }) || (
                <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
              )}
            </div>
          );
        })}
        {!!currentColumnsRight.length && (
          <div className="sticky -right-px flex flex-row border-l">
            {currentColumnsRight.map((column) => {
              return (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: !column.grow ? column.initialWidth : undefined,
                  }}
                  className={[rowRightWrapperClasses, column.grow ? 'grow' : ''].join(' ')}
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
          className="absolute bottom-0 left-0 -right-px h-px bg-secondary-50"
        ></div>
      </div>
      {detailsRow &&
        detailsOpen &&
        (Array.isArray(detailsRow(entry)) ? (
          (detailsRow(entry) as DataType[])?.map((e, i) => (
            <div className="group" key={i}>
              <Row<DataType>
                index={i}
                name={name}
                entry={e}
                allowReorder={allowReorder}
                onDragRow={onDragRow}
                onDropRow={onDropRow}
                currentColumnsCenter={currentColumnsCenter}
                currentColumnsLeft={currentColumnsLeft}
                currentColumnsRight={currentColumnsRight}
                cellRenderer={cellRenderer}
                header={header}
                onRowClick={onRowClick}
                onRowDoubleClick={onRowDoubleClick}
                rowClasses={subRowClasses || rowClasses}
                rowLeftWrapperClasses={subRowLeftWrapperClasses || rowLeftWrapperClasses}
                rowCenterWrapperClasses={subRowCenterWrapperClasses || rowCenterWrapperClasses}
                rowRightWrapperClasses={subRowRightWrapperClasses || rowRightWrapperClasses}
                detailsRow={() => undefined}
              />
            </div>
          ))
        ) : (
          <div className="ml-12">{detailsRow(entry) as ReactNode}</div>
        ))}
    </div>
  );
}
