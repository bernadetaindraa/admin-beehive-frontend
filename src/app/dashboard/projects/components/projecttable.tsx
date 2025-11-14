"use client";

import { useState, useEffect } from "react";
import { Edit, Trash } from "lucide-react";
import Swal from "sweetalert2";
import EditProjectModal from "@/app/dashboard/projects/components/editprojectmodal";

export interface Project {
    id: number;
    title: string;
    location: string;
    goal: string;
    description: string;
    product_service_id?: number;
    industry_id?: number;
    product_service?: { id: number; name: string };
    industry?: { id: number; name: string };
    image?: string | null;
    created_at?: string;
    updated_at?: string;
}

export default function ProjectTable() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const apiBase = "http://127.0.0.1:8000";

    // 🔹 Ambil data project dari Laravel
    const fetchProjects = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire("Unauthorized", "Please login first.", "warning");
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch(`${apiBase}/api/projects`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch projects (${res.status})`);
            }

            const data = await res.json();
            console.log("Full API Response:", data); // LIHAT DI CONSOLE
            setProjects(data);
        } catch (error) {
            console.error("❌ Error fetching projects:", error);
            Swal.fire("Error", "Failed to load projects", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // 🔹 Hapus project
    const handleDelete = async (id: number) => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire("Unauthorized", "Please login first.", "warning");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This project will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#134280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${apiBase}/api/projects/${id}`, {
                        method: "DELETE",
                        headers: {
                            "Accept": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) throw new Error("Delete failed");

                    setProjects(projects.filter((p) => p.id !== id));
                    Swal.fire("Deleted!", "Project has been deleted.", "success");
                } catch (err) {
                    console.error("❌ Delete error:", err);
                    Swal.fire("Error", "Failed to delete project", "error");
                }
            }
        });
    };

    // 🔹 Simpan perubahan project
    const handleSaveProject = (updated: Project) => {
        setProjects((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingProject(null);
        Swal.fire("Success!", "Project updated successfully.", "success");
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Project List</h2>

            {loading ? (
                <p className="text-center text-gray-500 italic">Loading projects...</p>
            ) : (
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-700">
                            <th className="p-2">Title</th>
                            <th className="p-2">Location</th>
                            <th className="p-2">Goal</th>
                            <th className="p-2">Product/Service</th>
                            <th className="p-2">Industry</th>
                            <th className="p-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((p) => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="p-2 font-medium">{p.title}</td>
                                <td className="p-2">{p.location}</td>
                                <td className="p-2">{p.goal}</td>
                                <td className="p-2">{p.product_service?.name || "-"}</td>
                                <td className="p-2">{p.industry?.name || "-"}</td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-3">
                                        {/* Edit Button */}
                                        <button
                                            onClick={() => setEditingProject(p)}
                                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition group"
                                            title="Edit Project"
                                        >
                                            <Edit className="w-5 h-5 group-hover:scale-110 transition" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition group"
                                            title="Delete Project"
                                        >
                                            <Trash className="w-5 h-5 group-hover:scale-110 transition" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-4 text-center text-gray-500 italic"
                                >
                                    No projects available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}

            {editingProject && (
                <EditProjectModal
                    project={editingProject}
                    onClose={() => setEditingProject(null)}
                    onSave={handleSaveProject}
                />
            )}
        </div>
    );
}
