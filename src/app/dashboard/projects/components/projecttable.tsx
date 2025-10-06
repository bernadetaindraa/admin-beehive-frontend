"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EditProjectModal from "@/app/dashboard/projects/components/editprojectmodal";

export interface Project {
    id: number;
    title: string;
    location: string;
    goal: string;
    productService: string;
    industry: string;
    description: string; // ✅ tambah description
}

export default function ProjectTable() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    useEffect(() => {
        setProjects([
            {
                id: 1,
                title: "Drone Mapping",
                location: "Jakarta",
                goal: "Mapping large plantations",
                productService: "Drone Service",
                industry: "Agriculture & Plantations",
                description:
                    "A project focusing on aerial mapping using drones for plantations.",
            },
            {
                id: 2,
                title: "Automated Pesticide",
                location: "Bandung",
                goal: "Improve crop yield",
                productService: "R&D Service",
                industry: "Forestry",
                description:
                    "Developing automated pesticide spraying technology for efficiency.",
            },
        ]);
    }, []);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This project will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#134280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setProjects(projects.filter((p) => p.id !== id));
                Swal.fire("Deleted!", "The project has been deleted.", "success");
            }
        });
    };

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
                            <td className="p-2">{p.productService}</td>
                            <td className="p-2">{p.industry}</td>
                            <td className="p-2 text-center space-x-2">
                                <button
                                    onClick={() => setEditingProject(p)}
                                    className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {projects.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-4 text-center text-gray-500 italic">
                                No projects available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

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
