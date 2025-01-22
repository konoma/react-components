const baseClasses = {
  wrapperClasses: 'flex flex-row gap-10 pt-4 border-b border-secondary-200',
  tabActiveClasses: '',
  tabInactiveClasses: 'text-secondary-600',
  countActiveClasses: 'bg-info-300',
  countInactiveClasses: 'bg-secondary-200',
  tabBaseClasses: 'h-12 px-1 text-sm font-semibold text-primary-900 cursor-pointer flex flex-row gap-2 items-center relative',
  countBaseClasses: 'rounded-full px-3',
  activeMarkerClasses: 'absolute -bottom-0.5 left-0 h-0.5 w-full bg-primary-600',
};

interface Tab<DataType> {
  id: DataType;
  label: string;
  count: number;
}

export default function Tabs<DataType>({
  wrapperClasses = baseClasses.wrapperClasses,
  tabActiveClasses = baseClasses.tabActiveClasses,
  tabInactiveClasses = baseClasses.tabInactiveClasses,
  countActiveClasses = baseClasses.countActiveClasses,
  countInactiveClasses = baseClasses.countInactiveClasses,
  tabBaseClasses = baseClasses.tabBaseClasses,
  countBaseClasses = baseClasses.countBaseClasses,
  activeMarkerClass = baseClasses.activeMarkerClasses,
  showCounts = true,
  tabs,
  active,
  onClick,
}: {
  wrapperClasses?: string;
  tabActiveClasses?: string;
  tabInactiveClasses?: string;
  countActiveClasses?: string;
  countInactiveClasses?: string;
  tabBaseClasses?: string;
  countBaseClasses?: string;
  activeMarkerClass?: string;
  showCounts?: boolean;
  tabs: Tab<DataType>[];
  active: DataType;
  onClick: (tab: DataType) => void;
}) {
  function equalTabs<DataType>(tab1: DataType, tab2: DataType) {
    if (Array.isArray(tab1) && Array.isArray(tab2)) {
      return tab1.length === tab2.length && tab1.every((value, index) => value === tab2[index]);
    }
    return tab1 === tab2;
  }
  return (
    <div className={wrapperClasses}>
      {tabs.map((tab, i) => (
        <div
          key={i}
          onClick={() => {
            onClick(tab.id);
          }}
          className={[tabBaseClasses, equalTabs(tab.id, active) ? tabActiveClasses : tabInactiveClasses].join(' ')}
        >
          <span>{tab.label}</span>
          {showCounts && (
            <div className={[countBaseClasses, equalTabs(tab.id, active) ? countActiveClasses : countInactiveClasses].join(' ')}>
              {tab.count}
            </div>
          )}
          {tab.id === active && <div className={activeMarkerClass}></div>}
        </div>
      ))}
    </div>
  );
}
