"use client";

import { useState, useEffect } from "react";
import { Project } from "./projecttable";

interface Props {
    project: Project;
    onClose: () => void;
    onSave: (updated: Project) => void;
}

export default function EditProjectModal({ project, onClose, onSave }: Props) {
    const [form, setForm] = useState({
        id: "",
        title: "",
        description: "",
        location: "",
        goal: "",
        product_service_id: "",
        industry_id: "",
    });

    const [loading, setLoading] = useState(false);
    const [dropdowns, setDropdowns] = useState({
        product_services: [] as any[],
        industries: [] as any[],
    });

    const apiBase = "http://127.0.0.1:8000";

    // 🔹 Update form ketika prop project berubah
    useEffect(() => {
        if (project) {
            setForm({
                id: String(project.id),
                title: project.title || "",
                description: project.description || "",
                location: project.location || "",
                goal: project.goal || "",
                product_service_id: String(project.product_service_id || ""),
                industry_id: String(project.industry_id || ""),
            });
        }
    }, [project]);

    // 🔹 Ambil data dropdown (pakai token)
    useEffect(() => {
        const fetchDropdowns = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${apiBase}/api/projects/dropdowns`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch dropdowns");
                const data = await res.json();
                setDropdowns(data);
            } catch (err) {
                console.error("❌ Error fetching dropdowns:", err);
            }
        };
        fetchDropdowns();
    }, []);

    // 🔹 Handle perubahan input
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 🔹 Handle submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first.");
            return;
        }

        try {
            const res = await fetch(`${apiBase}/api/projects/${form.id}`, {
                method: "POST", // ✅ sesuai route-mu yang pakai POST untuk update
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    location: form.location,
                    goal: form.goal,
                    product_service_id: form.product_service_id,
                    industry_id: form.industry_id,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("❌ Validation error:", data);
                alert("Failed to update project: " + (data.message || "Validation error"));
            } else {
                console.log("✅ Project updated:", data);
                alert("Project updated successfully!");
                onSave(data);
                onClose();
            }
        } catch (err) {
            console.error("❌ Error updating project:", err);
            alert("Something went wrong while updating.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-[500px] space-y-4"
            >
                <h3 className="text-lg font-semibold text-gray-800">Edit Project</h3>

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Project Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                        required
                    />
                </div>

                {/* Location & Goal */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Project Goal
                        </label>
                        <input
                            type="text"
                            name="goal"
                            value={form.goal}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                            required
                        />
                    </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product / Service
                        </label>
                        <select
                            name="product_service_id"
                            value={form.product_service_id || ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                            required
                        >
                            <option value="">-- Select --</option>
                            {dropdowns.product_services.map((ps: any) => (
                                <option key={ps.id} value={ps.id}>
                                    {ps.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Industry
                        </label>
                        <select
                            name="industry_id"
                            value={form.industry_id || ""}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                            required
                        >
                            <option value="">-- Select --</option>
                            {dropdowns.industries.map((ind: any) => (
                                <option key={ind.id} value={ind.id}>
                                    {ind.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-[#134280] text-white rounded-md hover:bg-[#0f2e5c]"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
