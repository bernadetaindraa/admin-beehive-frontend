"use client";

import { useState, useEffect } from "react";

export default function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [dropdowns, setDropdowns] = useState({ product_services: [], industries: [] });
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        goal: "",
        product_service_id: "",
        industry_id: "",
    });

    const apiBase = "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchDropdowns = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${apiBase}/api/projects/dropdowns`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                    },
                });
                const data = await res.json();
                setDropdowns(data);
            } catch (err) {
                console.error("❌ Error fetching dropdowns:", err);
            }
        };
        fetchDropdowns();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first.");
            return;
        }

        try {
            const response = await fetch(`${apiBase}/api/projects`, {
                method: "POST",
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

            const data = await response.json();

            if (!response.ok) {
                console.error("Error:", data);
                alert("Failed to save project: " + (data.message || "Validation error"));
            } else {
                console.log("✅ Project created:", data);
                alert("Project created successfully!");
                onSuccess();
                setForm({
                    title: "",
                    description: "",
                    location: "",
                    goal: "",
                    product_service_id: "",
                    industry_id: "",
                });
            }
        } catch (error) {
            console.error("❌ Error submitting project:", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
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
                {/* Product / Service */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product / Service</label>
                    <select
                        name="product_service_id"
                        value={form.product_service_id}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                        required
                    >
                        <option value="">-- Select --</option>
                        {dropdowns.product_services.map((ps: any) => (
                            <option key={ps.id} value={ps.id}>{ps.name}</option>
                        ))}
                    </select>
                </div>

                {/* Industry */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <select
                        name="industry_id"
                        value={form.industry_id}
                        onChange={handleChange}
                        className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                        required
                    >
                        <option value="">-- Select --</option>
                        {dropdowns.industries.map((ind: any) => (
                            <option key={ind.id} value={ind.id}>{ind.name}</option>
                        ))}
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
