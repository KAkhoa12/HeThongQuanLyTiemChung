import React from 'react';

// Column definition interface
export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

// Action button interface
export interface ActionButton<T> {
  key: string;
  icon: React.ReactNode;
  onClick: (item: T) => void;
  tooltip?: string;
  className?: string;
  disabled?: (item: T) => boolean;
}

// DataTable props interface
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: ActionButton<T>[];
  title?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  rowKey?: keyof T | ((item: T) => string);
  className?: string;
  showHeader?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
}

// Status badge component
const StatusBadge: React.FC<{ status: string; variant?: 'success' | 'danger' | 'warning' | 'info' }> = ({ 
  status, 
  variant = 'info' 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-success text-success bg-opacity-10';
      case 'danger':
        return 'bg-danger text-danger bg-opacity-10';
      case 'warning':
        return 'bg-warning text-warning bg-opacity-10';
      default:
        return 'bg-primary text-primary bg-opacity-10';
    }
  };

  return (
    <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${getVariantClasses()}`}>
      {status}
    </span>
  );
};

// Main DataTable component
function DataTable<T>({
  data,
  columns,
  actions = [],
  title,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  onRowClick,
  rowKey ,
  className = '',
  showHeader = true,
  striped = true,
  hoverable = true,
  compact = false
}: DataTableProps<T>) {
  
  const getRowKey = (item: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(item);
    }
    if (typeof rowKey === 'string') {
      return String(item[rowKey as keyof T]) || `row-${index}`;
    }
    return `row-${index}`;
  };

  const renderCell = (column: Column<T>, item: T) => {
    const value = item[column.key as keyof T];
    
    if (column.render) {
      return column.render(value, item);
    }

    // Default rendering based on value type
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex rounded-full py-1 px-3 text-sm font-medium ${
          value ? 'bg-success text-success bg-opacity-10' : 'bg-danger text-danger bg-opacity-10'
        }`}>
          {value ? 'Có' : 'Không'}
        </span>
      );
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>;
    }

    return String(value);
  };

  const getAlignmentClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  if (loading) {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-500">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 ${className}`}>
      {title && (
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          {title}
        </h4>
      )}

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          {showHeader && (
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {columns.map((column, index) => (
                  <th
                    key={column.key as string}
                    className={`min-w-[${column.width || '120px'}] py-4 px-4 font-medium text-black dark:text-white ${
                      index === 0 ? 'xl:pl-11' : ''
                    } ${getAlignmentClass(column.align)}`}
                  >
                    {column.header}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="py-4 px-4 font-medium text-black dark:text-white">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
          )}
          
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={getRowKey(item, index)}
                  className={`
                    ${striped && index % 2 === 1 ? 'bg-gray-50 dark:bg-boxdark-2' : ''}
                    ${hoverable ? 'hover:bg-gray-100 dark:hover:bg-boxdark-3' : ''}
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${compact ? 'py-2' : 'py-5'}
                  `}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={column.key as string}
                      className={`
                        border-b border-[#eee] px-4 dark:border-strokedark
                        ${colIndex === 0 ? 'pl-9 xl:pl-11' : ''}
                        ${compact ? 'py-2' : 'py-5'}
                        ${getAlignmentClass(column.align)}
                      `}
                    >
                      {renderCell(column, item)}
                    </td>
                  ))}
                  
                  {actions.length > 0 && (
                    <td className="border-b border-[#eee] px-4 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        {actions.map((action) => {
                          const isDisabled = action.disabled?.(item) || false;
                          return (
                            <button
                              key={action.key}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isDisabled) {
                                  action.onClick(item);
                                }
                              }}
                              disabled={isDisabled}
                              className={`
                                hover:text-primary transition-colors
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                ${action.className || ''}
                              `}
                              title={action.tooltip}
                            >
                              {action.icon}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable; 