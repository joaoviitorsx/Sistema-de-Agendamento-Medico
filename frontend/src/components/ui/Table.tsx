import { Table as AntTable, TableProps as AntTableProps } from 'antd';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> extends Omit<AntTableProps<T>, 'columns'> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
}

export function Table<T extends Record<string, any>>({ 
  data, 
  columns, 
  loading = false,
  className = '',
  ...props 
}: TableProps<T>) {
  const antdColumns = columns.map((col) => ({
    title: col.label,
    dataIndex: col.dataIndex || col.key,
    key: col.key,
    render: col.render,
    width: col.width,
    align: col.align,
  }));

  return (
    <AntTable
      dataSource={data}
      columns={antdColumns}
      loading={loading}
      rowKey={(record) => record.id || record.key}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total: ${total} itens`,
        className: 'mt-4',
      }}
      className={`medical-table ${className}`}
      {...props}
    />
  );
}
