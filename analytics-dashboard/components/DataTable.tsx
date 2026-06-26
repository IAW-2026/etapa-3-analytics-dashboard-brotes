interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
}

export default function DataTable<T extends object>({
  columns,
  data,
  keyField,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left text-[10px] font-medium tracking-widest uppercase text-[#7BA05D] px-2 pb-2.5 border-b border-[#EAF3E6]"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={String((row as Record<string, unknown>)[keyField as string])}
              className="hover:bg-[#F5F2EA] transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-2 py-2.5 text-[#243B27] border-b border-[#EAF3E6] last:border-b-0 align-middle"
                >
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}