import type { Identifier } from 'dnd-core';
import type { ReactNode } from 'react';
import type { XYCoord } from 'react-dnd';
import type { PaginationClasses } from './pagination.tsx';
import { use, useEffect, useMemo, useRef, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';

import { HTML5Backend } from 'react-dnd-html5-backend';
import Input from '../form/input.tsx';
import { I18nContext } from '../I18nContext.ts';
import Icon from '../ui/icon.tsx';
import Pagination from './pagination.tsx';

export interface TableColumnBase {
  id: string | number | symbol
  title: ReactNode
  hideFromChooser?: boolean
}

export interface TableColumn<DataType> extends TableColumnBase {
  id: keyof DataType
  initialWidth?: string | number
  hidden?: boolean
  sorting?: '+' | '-'
  // Mutually exclusive with onClick
  sortKey?: string
  filterKey?: string
  filterType?: 'filter' | 'fieldSearch'
  // Mutually exclusive with sorting
  onClick?: () => void
  allowResize?: boolean
  filterable?: boolean
  grow?: boolean
  lastFilter?: boolean
  filterComponent?: (
    filters: Record<string, string[]>,
    setFilters: (filters: Record<string, string[]>, triggeringFilterId: string) => Promise<void>,
  ) => ReactNode
}

interface DragItem {
  index: number
  id: string
  type: string
}

const baseClasses = {
  wrapperClasses: 'relative h-full',
  tableClasses:
    'max-h-full max-w-full overflow-x-auto overflow-y-auto rounded-krc-table outline-1 outline-solid outline-secondary-300 divide-y divide-secondary-200',
  headerClasses:
    'flex flex-col items-start truncate bg-krc-table-header justify-center px-4 py-3 text-xs font-medium first:rounded-tl-krc-table gap-2',
  columnsWrapperClasses: 'flex flex-row overflow-x-auto overflow-y-auto h-full',
  columnsClasses: 'flex grow flex-row h-fit overflow-x-auto first:rounded-tl-krc-table last:rounded-tr-krc-table',
  auxColumnsClasses: 'flex flex-row h-fit overflow-x-auto border-l first:rounded-tl-krc-table last:rounded-tr-krc-table',
  noDataClasses: 'flex h-16 items-center justify-start pl-16 rounded-b-krc-table bg-white text-secondary-500 w-full text-sm',
  rowClasses: 'group relative flex flex-row justify-between bg-white last:rounded-b-krc-table hover:bg-primary-100 h-fit',
  subRowClasses: 'group relative flex flex-row justify-between bg-base-200 last:rounded-b-krc-table hover:bg-primary-100 h-fit',
  rowWrapperClasses: 'bg-white first:grow group-hover:bg-primary-100 h-fit',
  rowAuxWrapperClasses: 'bg-white group-hover:bg-primary-100 h-fit',
  subRowWrapperClasses: 'bg-base-200 first:grow group-hover:bg-primary-100 h-fit',
  subRowAuxWrapperClasses: 'bg-base-200 group-hover:bg-primary-100 h-fit',
};

export default function Table<DataType extends { dragRef?: React.RefObject<HTMLDivElement>, index?: number }>({
  noDataClasses = baseClasses.noDataClasses,
  wrapperClasses = baseClasses.wrapperClasses,
  tableClasses = baseClasses.tableClasses,
  rowClasses = baseClasses.rowClasses,
  rowWrapperClasses = baseClasses.rowWrapperClasses,
  rowAuxWrapperClasses = baseClasses.rowAuxWrapperClasses,
  subRowClasses = baseClasses.subRowClasses,
  subRowWrapperClasses = baseClasses.subRowWrapperClasses,
  subRowAuxWrapperClasses = baseClasses.subRowAuxWrapperClasses,
  headerClasses = baseClasses.headerClasses,
  paginationClasses,
  filterComponents,
  columns,
  columnsAux,
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
  detailsRowOpenIconName,
  detailsRowOpenIconPath,
  detailsRowCloseIconName,
  detailsRowCloseIconPath,
  sortingNeutralIconName,
  sortingNeutralIconPath,
  triggeredFilter,
  isRowSelectable,
  setTriggeredFilter,
  onDragRow = () => {

  },
  onDropRow = () => {

  },
  onRowClick = () => {

  },
  onRowDoubleClick = () => {

  },
  onScroll = () => {

  },
  onUpdateFilters = async () => {

  },
  onSort = () => {

  },
  onFirstPage = () => {

  },
  onPreviousPage = () => {

  },
  onNextPage = () => {

  },
  onLastPage = () => {

  },
  toPage = () => {

  },
}: Readonly<{
  wrapperClasses?: string
  tableClasses?: string
  rowClasses?: string
  rowWrapperClasses?: string
  rowAuxWrapperClasses?: string
  subRowClasses?: string
  subRowWrapperClasses?: string
  subRowAuxWrapperClasses?: string
  columnsWrapperClasses?: string
  columnsClasses?: string
  columnsCenterClasses?: string
  auxColumnsClasses?: string
  headerClasses?: string
  noDataClasses?: string
  currentPage?: number
  totalPagesProp?: number
  paginationClasses?: PaginationClasses
  columns: TableColumn<DataType>[]
  columnsAux?: TableColumn<DataType>[]
  cellRenderer?: { [key in keyof DataType]?: (data: DataType & { dragRef?: React.RefObject<HTMLDivElement> }) => ReactNode }
  filterComponents?: {
    [key in keyof DataType]?: (
      filters: Record<string, string[]>,
      setFilters: (filters: Record<string, string[]>, triggeringFilterId: string) => Promise<void>,
    ) => ReactNode;
  }
  filters?: Record<string, string[]>
  showFilters?: boolean
  data: DataType[]
  pagination?: boolean
  totalRows: number
  noEntryLabel?: string
  detailsRow?: (data: DataType) => ReactNode | DataType[]
  allowReorder?: boolean
  xToY?: string
  isInfinite?: boolean
  pagesize?: number
  name?: string
  firstPageIconName?: string
  firstPageIconPath?: string
  previousPageIconName?: string
  previousPageIconPath?: string
  nextPageIconName?: string
  nextPageIconPath?: string
  lastPageIconName?: string
  lastPageIconPath?: string
  sortingAscIconName?: string
  sortingAscIconPath?: string
  sortingDescIconName?: string
  sortingDescIconPath?: string
  removeFilterIconName?: string
  removeFilterIconPath?: string
  detailsRowOpenIconName?: string
  detailsRowOpenIconPath?: string
  detailsRowCloseIconName?: string
  detailsRowCloseIconPath?: string
  sortingNeutralIconName?: string
  sortingNeutralIconPath?: string
  triggeredFilter?: string
  isRowSelectable?: boolean
  setTriggeredFilter?: (filterId: string) => void
  onDragRow?: (dragIndex: number, hoverIndex: number) => void
  onDropRow?: (dragIndex: number, hoverIndex: number) => void
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
  onFirstPage?: () => void
  onPreviousPage?: () => void
  onNextPage?: () => void
  onLastPage?: () => void
  toPage?: (page: number) => void
  onRowClick?: (data: DataType) => void
  onRowDoubleClick?: (data: DataType) => void
  onSort?: (column: TableColumn<DataType>) => void
  onUpdateFilters?: (filters: Record<string, string[]>) => Promise<void>
  onUpdateColumns?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void
  onUpdateColumnsAux?: (columns: TableColumn<DataType>[], updateMeta?: boolean) => void
}>) {
  const { locale } = use(I18nContext);

  const hasFilters = !!(
    showFilters
    && (columns.some(column => column.filterable)
      || columnsAux?.some(column => column.filterable))
  );

  const totalPages = totalPagesProp || Math.ceil(totalRows / pagesize);
  const currentStart = (currentPage - 1) * pagesize;
  const currentEnd = currentPage * pagesize;

  const headerRef = useRef<HTMLDivElement>(null);

  const currentColumns = useMemo(() => columns?.filter(column => !column?.hidden) || [], [columns]);
  const currentColumnsAux = useMemo(() => columnsAux?.filter(column => !column?.hidden) || [], [columnsAux]);

  useEffect(() => {
    // scroll triggered column into view
    if (!triggeredFilter) {
      return;
    }
    const columnIndex
      = currentColumns.some(col => col.filterKey === triggeredFilter)
        ? currentColumns.findIndex(col => col.filterKey === triggeredFilter)
        : currentColumns.length
          + currentColumnsAux.findIndex(col => col.filterKey === triggeredFilter);
    const columnElement = headerRef.current?.children.item(columnIndex) as HTMLDivElement | null;
    if (columnElement) {
      columnElement.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  // eslint-disable-next-line react/exhaustive-deps
  }, []);

  async function updateFilters(newFilters: Record<string, string[]>, triggeringFilterId: string) {
    setTriggeredFilter?.(triggeringFilterId);
    await onUpdateFilters(newFilters);
  }

  return (
    <div className={wrapperClasses} data-testid={`${name}-table`}>
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
          ref={headerRef}
          data-testid={`${name}-table-header`}
          key={locale}
          className="rounded-t-krc-table bg-krc-table-header sticky top-0 z-1 flex flex-row items-center justify-between"
        >
          {detailsRow && (
            <div className="sticky left-0 z-1">
              <div className={[headerClasses, 'w-12', hasFilters ? 'h-24' : 'h-12'].join(' ')} />
            </div>
          )}
          {!!currentColumns.length && currentColumns.map(column => (
            <div
              key={column.id.toString()}
              data-testid={`${name}-table-header-left-${column.id.toString()}`}
              style={{
                minWidth: column.initialWidth,
                maxWidth: column.grow ? undefined : column.initialWidth,
              }}
              onClick={() => {
                return (
                  column.sortKey
                  && onSort(
                    { ...column, sorting: column.sorting ? ({ '+': '-', '-': undefined }[column.sorting] as '+' | '-' | undefined) : '+' },
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
              <div className="flex w-full flex-row items-center justify-between gap-2 truncate">

                {typeof column.title === 'string'
                  ? (
                      <span className="truncate" title={column.title}>
                        {column.title}
                      </span>
                    )
                  : (
                      <>
                        {column.title}
                      </>
                    )}
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
                          : sortingNeutralIconName || 'heroicons:chevron-up-down-16-solid'
                      }
                      path={column.sorting ? (column.sorting === '+' ? sortingAscIconPath : sortingDescIconPath) : sortingNeutralIconPath}
                    />
                  </div>
                )}
              </div>
              {/* Filter */}
              {hasFilters && (
                <div
                  className="bg-krc-table-header text-secondary-500 min-h-10 w-full text-xs font-medium"
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
          {!!currentColumnsAux.length && (
            <div className="sticky -right-px flex h-full flex-row items-center">
              {currentColumnsAux.map(column => (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: column.grow ? undefined : column.initialWidth,
                  }}
                  data-testid={`${name}-table-header-right-${column.id.toString()}`}
                  className="bg-krc-table-header last:rounded-tr-krc-table flex h-full flex-row items-start justify-end truncate px-4 py-3 text-xs font-medium"
                >
                  {column.title}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Body */}

        {allowReorder
          ? (
              <DndProvider backend={HTML5Backend} debugMode>
                {data.map((entry, i) => {
                  return (
                    <Row<DataType>
                      key={entry.index}
                      index={i}
                      name={name}
                      entry={entry}
                      allowReorder={allowReorder}
                      onDragRow={onDragRow}
                      onDropRow={onDropRow}
                      currentColumns={currentColumns}
                      currentColumnsAux={currentColumnsAux}
                      cellRenderer={cellRenderer}
                      header={headerRef}
                      onRowClick={onRowClick}
                      onRowDoubleClick={onRowDoubleClick}
                      rowClasses={[isRowSelectable && 'cursor-pointer', rowClasses].join(' ')}
                      rowWrapperClasses={rowWrapperClasses}
                      rowAuxWrapperClasses={rowAuxWrapperClasses}
                      subRowClasses={subRowClasses}
                      subRowWrapperClasses={subRowWrapperClasses}
                      subRowAuxWrapperClasses={subRowAuxWrapperClasses}
                      detailsRowCloseIconName={detailsRowCloseIconName}
                      detailsRowOpenIconName={detailsRowOpenIconName}
                      detailsRowCloseIconPath={detailsRowCloseIconPath}
                      detailsRowOpenIconPath={detailsRowOpenIconPath}
                      detailsRow={detailsRow}
                    />
                  );
                })}
              </DndProvider>
            )
          : (
              <>
                {data.map((entry, i) => {
                  return (
                    <Row<DataType>
                      // eslint-disable-next-line react/no-array-index-key
                      key={i}
                      index={i}
                      name={name}
                      entry={entry}
                      allowReorder={allowReorder}
                      onDragRow={onDragRow}
                      onDropRow={onDropRow}
                      currentColumns={currentColumns}
                      currentColumnsAux={currentColumnsAux}
                      cellRenderer={cellRenderer}
                      header={headerRef}
                      onRowClick={onRowClick}
                      onRowDoubleClick={onRowDoubleClick}
                      rowClasses={[isRowSelectable && 'cursor-pointer', rowClasses].join(' ')}
                      rowWrapperClasses={rowWrapperClasses}
                      rowAuxWrapperClasses={rowAuxWrapperClasses}
                      subRowClasses={subRowClasses}
                      subRowWrapperClasses={subRowWrapperClasses}
                      subRowAuxWrapperClasses={subRowAuxWrapperClasses}
                      detailsRowCloseIconName={detailsRowCloseIconName}
                      detailsRowOpenIconName={detailsRowOpenIconName}
                      detailsRowCloseIconPath={detailsRowCloseIconPath}
                      detailsRowOpenIconPath={detailsRowOpenIconPath}
                      detailsRow={detailsRow}
                    />
                  );
                })}
              </>
            )}

        {data.length === 0 && (
          <div data-testid={`${name}-table-no-data`} className={noDataClasses}>
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
  currentColumns,
  currentColumnsAux,
  cellRenderer,
  header,
  rowClasses,
  rowWrapperClasses,
  rowAuxWrapperClasses,
  subRowClasses,
  subRowWrapperClasses,
  subRowAuxWrapperClasses,
  detailsRowOpenIconName,
  detailsRowOpenIconPath,
  detailsRowCloseIconName,
  detailsRowCloseIconPath,
  allowReorder,
  detailsRow,
  name,
}: Readonly<{
  index: number
  entry: DataType
  onDragRow: (dragIndex: number, hoverIndex: number) => void
  onDropRow: (dragIndex: number, hoverIndex: number) => void
  onRowClick: (data: DataType) => void
  onRowDoubleClick: (data: DataType) => void
  currentColumns: TableColumn<DataType>[]
  currentColumnsAux: TableColumn<DataType>[]
  cellRenderer?: { [key in keyof DataType]?: (data: DataType & { dragRef: React.RefObject<HTMLDivElement | null> }) => ReactNode }
  header: React.RefObject<HTMLDivElement | null>
  rowClasses: string
  rowWrapperClasses: string
  rowAuxWrapperClasses: string
  subRowClasses?: string
  subRowWrapperClasses?: string
  subRowAuxWrapperClasses?: string
  detailsRowOpenIconName?: string
  detailsRowOpenIconPath?: string
  detailsRowCloseIconName?: string
  detailsRowCloseIconPath?: string
  allowReorder?: boolean
  detailsRow?: (data: DataType) => ReactNode | DataType[]
  name: string
}>) {
  const dragRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  if (allowReorder && !Object.hasOwn(entry as object, 'index')) {
    throw new Error('Entry must have index property');
  }

  const [{ handlerId }, drop] = allowReorder
    // eslint-disable-next-line react/rules-of-hooks
    ? useDrop<DragItem, undefined, { handlerId: Identifier | null }>({
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
      })
    : [{ handlerId: null }, () => undefined];

  const [{ opacity }, drag, preview] = allowReorder
    // eslint-disable-next-line react/rules-of-hooks
    ? useDrag({
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
      })
    : [{ opacity: 1 }, () => undefined, () => undefined];

  if (allowReorder) {
    const dropResult = drop(previewRef);
    if (dropResult) {
      preview(dropResult);
    }
    drag(dragRef);
  }
  return (
    <div className="flex flex-col">
      <div
        className={[rowClasses, detailsRow && detailsOpen ? 'shadow' : ''].join(' ')}
        onClick={() => onRowClick(entry)}
        onDoubleClick={() => onRowDoubleClick(entry)}
        ref={previewRef}
        style={allowReorder ? { opacity } : {}}
        data-handler-id={allowReorder ? handlerId : undefined}
        data-testid={`${name}-table-row`}
      >
        {detailsRow && (
          <div className="sticky left-0 border-r flex flex-row items-center justify-center z-10">
            <div className={['flex items-center justify-center w-12', rowWrapperClasses].join(' ')}>
              {detailsRow?.(entry) && (
                <button
                  className="w-8 cursor-pointer flex flex-row items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setDetailsOpen(!detailsOpen);
                  }}
                >
                  <Icon
                    name={detailsOpen ? (detailsRowOpenIconName || 'heroicons:chevron-down') : (detailsRowCloseIconName || 'heroicons:chevron-right')}
                    className="h-5 w-5"
                    path={detailsOpen ? detailsRowOpenIconPath : detailsRowCloseIconPath}
                  />
                </button>
              )}
            </div>
          </div>
        )}
        {currentColumns.map((column) => {
          return (
            <div
              key={column.id.toString()}
              style={{
                minWidth: column.initialWidth,
                maxWidth: column.grow ? undefined : column.initialWidth,
              }}
              className={[rowWrapperClasses, column.grow ? 'grow' : ''].join(' ')}
              title={(entry[column.id] as string) || ''}
            >
              {(dragRef && cellRenderer?.[column.id]?.({ ...entry, dragRef })) || (
                <div className="h-14 truncate p-4 text-sm">{(entry[column.id] as string) || '-'}</div>
              )}
            </div>
          );
        })}
        {!!currentColumnsAux.length && (
          <div className="sticky -right-px flex flex-row border-l">
            {currentColumnsAux.map((column) => {
              return (
                <div
                  key={column.id.toString()}
                  style={{
                    minWidth: column.initialWidth,
                    maxWidth: column.grow ? undefined : column.initialWidth,
                  }}
                  className={[rowAuxWrapperClasses, column.grow ? 'grow' : ''].join(' ')}
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
          className="bg-secondary-50 absolute -right-px bottom-0 left-0 h-px"
        >
        </div>
      </div>
      {detailsRow
        && detailsOpen
        && (Array.isArray(detailsRow(entry))
          ? (
              (detailsRow(entry) as DataType[])?.map((e, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="group" key={i}>
                  <Row<DataType>
                    index={i}
                    name={name}
                    entry={e}
                    allowReorder={allowReorder}
                    onDragRow={onDragRow}
                    onDropRow={onDropRow}
                    currentColumns={currentColumns}
                    currentColumnsAux={currentColumnsAux}
                    cellRenderer={cellRenderer}
                    header={header}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onRowDoubleClick}
                    rowClasses={subRowClasses || rowClasses}
                    rowWrapperClasses={subRowWrapperClasses || rowWrapperClasses}
                    rowAuxWrapperClasses={subRowAuxWrapperClasses || rowAuxWrapperClasses}
                    detailsRowCloseIconName={detailsRowCloseIconName}
                    detailsRowOpenIconName={detailsRowOpenIconName}
                    detailsRowCloseIconPath={detailsRowCloseIconPath}
                    detailsRowOpenIconPath={detailsRowOpenIconPath}
                    detailsRow={() => undefined}
                  />
                </div>
              ))
            )
          : (
              <div className="ml-12">{detailsRow(entry) as ReactNode}</div>
            ))}
    </div>
  );
}
