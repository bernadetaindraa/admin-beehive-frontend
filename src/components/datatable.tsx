"use client";
import { Card, CardContent } from "@/components/ui/card";

interface Column {
    key: string;
    label: string;
}
interface DataTableProps {
    title: string;
    columns: Column[];
    data: Record<string, any>[];
}

export default function DataTable({ title, columns, data }: DataTableProps) {
    return (
        <Card className="rounded-2xl shadow-md border border-gray-100 mt-6">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-600">
                                {columns.map((col) => (
                                    <th key={col.key} className="py-2 px-4 border-b">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                data.map((row, idx) => (
                                    <tr
                                        key={idx}
                                        className="hover:bg-gray-50 transition text-gray-700"
                                    >
                                        {columns.map((col) => (
                                            <td key={col.key} className="py-2 px-4 border-b">
                                                {row[col.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={columns.length}
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
