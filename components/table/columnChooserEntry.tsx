import type { Identifier } from 'dnd-core'
import type { XYCoord } from 'react-dnd';
import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Icon from '../ui/icon.tsx';

interface DragItem {
  index: number
  id: string
  type: string
}

export default function ColumnChooserEntry<DataType>({
  title,
  id,
  index,
  visibleColumns,
  entryClasses,
  visibleColumnClasses,
  hiddenColumnClasses,
  updateColumns,
  onDragColumn,
  onDropColumn,
}: Readonly<{
  title: string
  id: keyof DataType
  index: number
  entryClasses: string
  visibleColumnClasses: string
  hiddenColumnClasses: string
  visibleColumns: (keyof DataType)[]
  updateColumns: (id: keyof DataType) => void
  onDragColumn: (dragIndex: number, hoverIndex: number) => void
  onDropColumn: (dragIndex: number, hoverIndex: number) => void
}>) {
  const dragRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, { index: number }, { handlerId: Identifier | null }>({
    accept: 'row',
    drop: () => ({ index }),
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
      onDragColumn(dragIndex, hoverIndex);

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
        onDropColumn(item.index, dropResult.index);
      }
    },
    item: () => {
      return { id, index };
    },
    collect: (monitor: { isDragging: () => boolean }) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  });

  const dropResult = drop(previewRef);
  if (dropResult) {
    preview(dropResult);
  }
  drag(dragRef);
  return (
    <div
      className={[entryClasses, visibleColumns.includes(id) ? visibleColumnClasses : hiddenColumnClasses].join(' ')}
      ref={previewRef}
      style={{ opacity }}
      data-handler-id={handlerId}
      onClick={() => updateColumns(id)}
    >
      <div>
        <div className="h-5 w-5 cursor-grab" ref={dragRef}>
          <Icon name="heroicons:bars-3" className="h-5 w-5" />
        </div>
      </div>
      <span>
        {title}
      </span>
    </div>
  );
}
