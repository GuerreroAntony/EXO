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
      <div className="bg-[#151515] border border-[#333] rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <Inbox size={40} className="text-[#333] mb-3" />
        <p className="text-sm text-[#999]">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#151515] border border-[#333] rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#111]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left text-xs text-[#666] uppercase tracking-wider font-medium px-5 py-3"
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
                className={`border-b border-[#2a2a2a] last:border-b-0 hover:bg-[#1a1a1a] transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="text-sm text-white px-5 py-3.5">
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
