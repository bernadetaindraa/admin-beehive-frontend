"use client";

import { useState } from "react";
import { Article } from "./articletable";

const categories = [
    "Drone Application",
    "Technology & Innovation",
    "Partnership & Collaboration",
    "Events & Projects",
    "Company News",
    "Product & Services",
    "Impact & Sustainability",
];

interface Props {
    article: Article;
    onClose: () => void;
    onSave: (updated: Article) => void;
}

export default function EditArticleModal({ article, onClose, onSave }: Props) {
    const [form, setForm] = useState<Article>(article);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoryChange = (cat: string) => {
        const exists = form.categories.includes(cat);
        setForm({
            ...form,
            categories: exists
                ? form.categories.filter((c) => c !== cat)
                : [...form.categories, cat],
        });
    };

    const handleSave = () => {
        onSave(form);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Article</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
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
                </div>

                <div className="flex justify-end mt-6 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-[#134280] text-white rounded-md hover:bg-[#0f2e5c]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
