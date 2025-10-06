"use client";

import { useState } from "react";

const categories = [
    "Drone Application",
    "Technology & Innovation",
    "Partnership & Collaboration",
    "Events & Projects",
    "Company News",
    "Product & Services",
    "Impact & Sustainability",
];

export default function ArticleForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        content: "",
        author: "",
        categories: [] as string[],
        images: [] as File[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (cat: string) => {
        setForm((prev) => {
            const exists = prev.categories.includes(cat);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter((c) => c !== cat)
                    : [...prev.categories, cat],
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 2); // max 2 images
            setForm({ ...form, images: files });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log("New Article:", form);

        setTimeout(() => {
            setLoading(false);
            setForm({
                title: "",
                content: "",
                author: "",
                categories: [],
                images: [],
            });
            onSuccess();
        }, 1000);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-4"
        >
            <h2 className="text-lg font-semibold text-gray-800">Add Article</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={6}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    className="mt-1 w-full border rounded-md px-3 py-2 text-sm focus:outline-[#134280]"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Categories</label>
                <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                        <button
                            type="button"
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-3 py-1 text-sm border rounded-md ${form.categories.includes(cat)
                                    ? "bg-[#134280] text-white border-[#134280]"
                                    : "bg-white text-gray-700 border-gray-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Upload Images (max 2)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mt-1"
                />
                {form.images.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                        {form.images.length} file(s) selected
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-[#134280] text-white px-4 py-2 rounded-md hover:bg-[#0f2e5c] transition text-sm"
            >
                {loading ? "Saving..." : "Save Article"}
            </button>
        </form>
    );
}
