"use client";

import { useState } from "react";

export default function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        goal: "",
        productService: "",
        industry: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Call Laravel API here
        console.log("New Project:", form);

        setTimeout(() => {
            setLoading(false);
            setForm({
                title: "",
                description: "",
                location: "",
                goal: "",
                productService: "",
                industry: "",
            });
            onSuccess();
        }, 1000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
            <h2 className="text-lg font-semibold text-gray-800">Add New Project</h2>

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
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
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
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
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
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                        required
                    >
                        <option value="">-- Select --</option>
                        <option value="Drone Service">Drone Service</option>
                        <option value="Advance Manufacturing">Advance Manufacturing</option>
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
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
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

            <button
                type="submit"
                disabled={loading}
                className="bg-[#134280] text-white px-4 py-2 rounded-md hover:bg-[#0f2e5c] transition text-sm"
            >
                {loading ? "Saving..." : "Save Project"}
            </button>
        </form>
    );
}
