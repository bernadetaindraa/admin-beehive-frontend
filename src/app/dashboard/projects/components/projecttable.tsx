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
    productService?: { name: string };
    industry?: { name: string };
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
                                <td className="p-2">{p.productService?.name || "-"}</td>
                                <td className="p-2">{p.industry?.name || "-"}</td>
                                <td className="p-2 text-center">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button
                                            onClick={() => setEditingProject(p)}
                                            className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="p-2 rounded-md bg-red-500 text-white hover:bg-red-600"
                                            title="Delete"
                                        >
                                            <Trash size={16} />
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
