"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface Category {
    id: number;
    name: string;
}

interface ArticleFormData {
    title: string;
    content: string;
    author: string;
    categories: number[];
    image: File | null;
}

interface ArticleFormProps {
    onSuccess?: () => void;
}

export default function ArticleForm({ onSuccess }: ArticleFormProps = {}) {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<ArticleFormData>({
        title: "",
        content: "",
        author: "",
        categories: [],
        image: null,
    });

    const apiBase = "http://127.0.0.1:8000";

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${apiBase}/api/articles/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data: Category[] = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories");
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (id: number) => {
        setForm(prev => {
            const exists = prev.categories.includes(id);
            const newCategories = exists
                ? prev.categories.filter(c => c !== id)
                : [...prev.categories, id];
            return { ...prev, categories: newCategories.slice(0, 2) };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, image: file }));
        }
    };

    const handleRemoveImage = () => {
        setForm(prev => ({ ...prev, image: null }));
        const input = document.getElementById("image-upload") as HTMLInputElement;
        if (input) input.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.categories.length === 0) {
            Swal.fire("Warning", "Please select at least 1 category", "warning");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("author", form.author);
        form.categories.forEach(id => formData.append("categories[]", id.toString()));
        if (form.image) {
            formData.append("image", form.image);
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token not found. Please log in again.");

            const res = await fetch(`${apiBase}/api/articles`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                const msg = data.message || "Failed to save article";
                const err = data.errors
                    ? Object.values(data.errors).flat().join(", ")
                    : "";
                throw new Error(err ? `${msg}: ${err}` : msg);
            }

            setForm({ title: "", content: "", author: "", categories: [], image: null });
            handleRemoveImage();

            await Swal.fire({
                title: "Success!",
                text: "Article added successfully.",
                icon: "success",
                confirmButtonColor: "#134280",
                timer: 2000,
                timerProgressBar: true,
            });

            onSuccess?.();
            window.location.reload();

        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred";
            setError(message);
            Swal.fire("Error!", message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Add New Article</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280] focus:border-transparent"
                    placeholder="Enter article title"
                    required
                />
            </div>

            {/* Content */}
            <div data-color-mode="light">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                <div className="border rounded-md overflow-hidden">
                    <MDEditor
                        value={form.content}
                        onChange={value => setForm(prev => ({ ...prev, content: value || "" }))}
                        height={300}
                        preview="edit"
                    />
                </div>
            </div>

            {/* Author */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#134280]"
                    placeholder="Enter author name"
                    required
                />
            </div>

            {/* Categories */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories <span className="text-gray-500">(max 2)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    {categories.length === 0 ? (
                        <p className="text-sm text-gray-500">Loading categories...</p>
                    ) : (
                        categories.map(cat => (
                            <button
                                type="button"
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat.id)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md border transition ${form.categories.includes(cat.id)
                                    ? "bg-[#134280] text-white border-[#134280]"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Upload Image + Preview */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Article Image <span className="text-gray-500">(optional, 1 image)</span>
                </label>
                <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#134280] file:text-white hover:file:bg-[#0f2e5c]"
                />

                {/* Preview */}
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
                                x
                            </button>
                        </div>
                        <span className="text-xs text-gray-600">{form.image.name}</span>
                    </div>
                )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading || categories.length === 0 || form.categories.length === 0}
                    className="bg-[#134280] text-white px-6 py-2.5 rounded-md hover:bg-[#0f2e5c] transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        "Save Article"
                    )}
                </button>
            </div>
        </form>
    );
}