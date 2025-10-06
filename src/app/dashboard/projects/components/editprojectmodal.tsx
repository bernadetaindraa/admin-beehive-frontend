"use client";

import { useState } from "react";
import { Project } from "./projecttable";

interface Props {
    project: Project;
    onClose: () => void;
    onSave: (updated: Project) => void;
}

export default function EditProjectModal({ project, onClose, onSave }: Props) {
    const [form, setForm] = useState<Project>({ ...project });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            onSave(form);
            setLoading(false);
        }, 500);
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
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
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
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Project Goal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Project Goal
                        </label>
                        <input
                            type="text"
                            name="goal"
                            value={form.goal}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Product/Service */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product / Service
                        </label>
                        <select
                            name="productService"
                            value={form.productService}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            required
                        >
                            <option value="">-- Select --</option>
                            <option value="Drone Service">Drone Service</option>
                            <option value="Advance Manufacturing">
                                Advance Manufacturing
                            </option>
                            <option value="R&D Service">R&D Service</option>
                            <option value="Training">Training</option>
                        </select>
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Industry
                        </label>
                        <select
                            name="industry"
                            value={form.industry}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            required
                        >
                            <option value="">-- Select --</option>
                            <option value="Forestry">Forestry</option>
                            <option value="Agriculture & Plantations">
                                Agriculture & Plantations
                            </option>
                            <option value="Mining & Minerals">Mining & Minerals</option>
                            <option value="Construction & Real Estate">
                                Construction & Real Estate
                            </option>
                            <option value="Village Development">Village Development</option>
                        </select>
                    </div>
                </div>

                {/* Actions */}
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
