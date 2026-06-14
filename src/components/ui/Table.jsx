export default function Table({ columns, data, loading }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface-secondary">
            {columns.map(col => (
              <th key={col.key} className="text-left px-4 py-3 text-xs font-600 text-text-muted uppercase tracking-wide whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length} className="text-center py-10 text-text-muted">Loading…</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-10 text-text-muted">No data found</td></tr>
          ) : data.map((row, i) => (
            <tr key={i} className="border-b border-border/60 hover:bg-surface-secondary transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-text-primary">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
