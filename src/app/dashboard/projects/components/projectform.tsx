"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ProjectForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [dropdowns, setDropdowns] = useState({
        product_services: [] as any[],
        industries: [] as any[],
    });
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        goal: "",
        product_service_id: "",
        industry_id: "",
        image: null as File | null,
    });

    const apiBase = "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchDropdowns = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const res = await fetch(`${apiBase}/api/projects/dropdowns`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch dropdowns");
                const data = await res.json();
                setDropdowns(data);
            } catch (err) {
                console.error("Failed to fetch dropdowns:", err);
            }
        };
        fetchDropdowns();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm((prev) => ({ ...prev, image: file }));
        }
    };

    const handleRemoveImage = () => {
        setForm((prev) => ({ ...prev, image: null }));
        const input = document.getElementById("image-upload") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
        await Swal.fire({
            title: "Unauthorized",
            text: "Please log in first.",
            icon: "warning",
            confirmButtonColor: "#134280",
        });
        setLoading(false);
        return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("location", form.location);
    formData.append("goal", form.goal);
    formData.append("product_service_id", form.product_service_id);
    formData.append("industry_id", form.industry_id);
    if (form.image) {
        formData.append("image", form.image);
    }

    try {
        const response = await fetch(`${apiBase}/api/projects`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.message || "Failed to save project";
            const errors = data.errors
                ? Object.values(data.errors).flat().join(", ")
                : "";
            throw new Error(errors ? `${errorMsg}: ${errors}` : errorMsg);
        }

        await Swal.fire({
            title: "Success!",
            text: "Project has been successfully added.",
            icon: "success",
            confirmButtonColor: "#134280",
            allowOutsideClick: false,
        });

        setForm({
            title: "",
            description: "",
            location: "",
            goal: "",
            product_service_id: "",
            industry_id: "",
            image: null,
        });
        handleRemoveImage();

        onSuccess();

        window.location.reload();

    } catch (error: any) {
        await Swal.fire({
            title: "Failed!",
            text: error.message || "An error occurred while saving the project.",
            icon: "error",
            confirmButtonColor: "#d33",
        });
    } finally {
        setLoading(false);
    }
};

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-6"
        >
            <h2 className="text-xl font-bold text-gray-800">Add New Project</h2>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title
                </label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                    placeholder="Enter project title"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                    placeholder="Describe your project"
                    required
                />
            </div>

            {/* Location & Goal */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                        placeholder="e.g., Jakarta, Indonesia"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Goal
                    </label>
                    <input
                        type="text"
                        name="goal"
                        value={form.goal}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                        placeholder="e.g., Raise $50,000"
                        required
                    />
                </div>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product / Service
                    </label>
                    <select
                        name="product_service_id"
                        value={form.product_service_id}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                        required
                    >
                        <option value="">-- Select Product/Service --</option>
                        {dropdowns.product_services.map((ps) => (
                            <option key={ps.id} value={ps.id}>
                                {ps.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                    </label>
                    <select
                        name="industry_id"
                        value={form.industry_id}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                        required
                    >
                        <option value="">-- Select Industry --</option>
                        {dropdowns.industries.map((ind) => (
                            <option key={ind.id} value={ind.id}>
                                {ind.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Upload Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Image <span className="text-gray-500">(optional, 1 image)</span>
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#134280] file:text-white hover:file:bg-[#0f2e5c]"
                />
                {form.image && (
                    <div className="mt-3 flex items-center gap-3">
                        <div className="relative group">
                            <img
                                src={URL.createObjectURL(form.image)}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-md border shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                            >
                                ×
                            </button>
                        </div>
                        <span className="text-xs text-gray-600">{form.image.name}</span>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#134280] text-white px-6 py-2.5 rounded-md hover:bg-[#0f2e5c] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        "Save Project"
                    )}
                </button>
            </div>
        </form>
    );
}