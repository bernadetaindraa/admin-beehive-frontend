// src/app/dashboard/careers/components/careertable.tsx
"use client";

import { useState, useEffect } from "react";
import { Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import EditCareerModal from "./editcareermodal";

export interface Career {
    id: number;
    title: string;
    qualifications: string;
    benefits: string | null;
    responsibilities: string | null;
    location: string;
    work_type: "WFH" | "WFO" | "Hybrid";
    deadline: string; // dari backend: "2025-11-14 00:00:00"
}

export default function CareerTable({ onRefresh }: { onRefresh: () => void }) {
    const [careers, setCareers] = useState<Career[]>([]);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [loading, setLoading] = useState(true);
    const apiBase = "http://127.0.0.1:8000";

    // Helper: Format "2025-11-14 00:00:00" → "14-11-2025"
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchCareers = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire("Unauthorized", "Please login first.", "warning");
            window.location.href = "/login";
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${apiBase}/api/careers`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch careers (${res.status})`);
            }

            const data: Career[] = await res.json();
            setCareers(data);
        } catch (error) {
            console.error("Error fetching careers:", error);
            Swal.fire("Error", "Gagal memuat data lowongan karir", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCareers();
    }, []);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Unauthorized", "Please login first.", "warning");
            return;
        }

        const result = await Swal.fire({
            title: "Yakin?",
            text: "Lowongan ini akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#134280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${apiBase}/api/careers/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Gagal menghapus");

                setCareers((prev) => prev.filter((c) => c.id !== id));
                Swal.fire("Terhapus!", "Lowongan telah dihapus.", "success");
            } catch (err) {
                console.error("Delete error:", err);
                Swal.fire("Error!", "Gagal menghapus lowongan.", "error");
            }
        }
    };

    const handleSave = (updated: Career) => {
        setCareers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setEditingCareer(null);
        onRefresh?.(); // Refresh form tambah
        Swal.fire("Sukses!", "Lowongan diperbarui.", "success");
    };

    if (loading) {
        return (
            <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                <p className="text-center text-gray-500 italic">Loading careers...</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Career List</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700">
                            <th className="p-3 font-medium">Title</th>
                            <th className="p-3 font-medium">Location</th>
                            <th className="p-3 font-medium">Work Type</th>
                            <th className="p-3 font-medium">Deadline</th>
                            <th className="p-3 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {careers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                                    No careers available
                                </td>
                            </tr>
                        ) : (
                            careers.map((c) => (
                                <tr key={c.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium text-gray-800">{c.title}</td>
                                    <td className="p-3 text-gray-600">{c.location}</td>
                                    <td className="p-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.work_type === "WFH"
                                                    ? "bg-green-100 text-green-800"
                                                    : c.work_type === "WFO"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : "bg-purple-100 text-purple-800"
                                                }`}
                                        >
                                            {c.work_type}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-600">{formatDate(c.deadline)}</td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-3">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => setEditingCareer(c)}
                                                className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition group"
                                                title="Edit Career"
                                            >
                                                <Edit className="w-5 h-5 group-hover:scale-110 transition" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-2 rounded-full hover:bg-red-100 text-red-600 transition group"
                                                title="Delete Career"
                                            >
                                                <Trash className="w-5 h-5 group-hover:scale-110 transition" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingCareer && (
                <EditCareerModal
                    career={editingCareer}
                    onClose={() => setEditingCareer(null)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}