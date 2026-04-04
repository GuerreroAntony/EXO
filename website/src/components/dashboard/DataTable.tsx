"use client";

import { Inbox } from "lucide-react";
import { type ReactNode } from "react";

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado",
  onRowClick,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur p-12 flex flex-col items-center justify-center text-center">
        <Inbox size={40} className="text-white/10 mb-3" />
        <p className="text-sm text-white/30">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl backdrop-blur overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-[11px] font-mono uppercase text-white/30 tracking-wider px-5 py-3"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={i}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="text-sm text-white/70 px-5 py-3.5">
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
