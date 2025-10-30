"use client";

import { useState, useEffect } from "react";
import { Article } from "./articletable";
import Swal from "sweetalert2";

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

type EditableArticle = Omit<Article, "images"> & {
    images: (File | { id: number; image_url: string })[];
};


export default function EditArticleModal({ article, onClose, onSave }: Props) {
    const [form, setForm] = useState<EditableArticle>({
        ...article,
        images: article.images || [],
    });
    const [categoryIds, setCategoryIds] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ambil kategori dari backend dan inisialisasi form
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/categories");
                if (!response.ok) throw new Error("Failed to fetch categories");
                const data = await response.json();

                // Mapping nama kategori ke ID
                const idsMap = data.reduce(
                    (acc: { [key: string]: number }, cat: { id: number; name: string }) => {
                        acc[cat.name] = cat.id;
                        return acc;
                    },
                    {}
                );
                setCategoryIds(idsMap);

                // Sinkronisasi kategori artikel yang ada
                const updatedCategories = article.categories.map((cat) => ({
                    id: idsMap[cat.name] || cat.id,
                    name: cat.name,
                }));

                setForm((prev) => ({
                    ...prev,
                    categories: updatedCategories,
                }));
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unexpected error occurred");
            }
        };

        fetchCategories();
    }, [article.categories]);

    // Handle perubahan input teks
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle perubahan kategori (klik tombol)
    const handleCategoryChange = (cat: string) => {
        const catId = categoryIds[cat] || 0;
        if (!catId) return;

        setForm((prev) => {
            const exists = prev.categories.some((c) => c.id === catId);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter((c) => c.id !== catId)
                    : [...prev.categories, { id: catId, name: cat }],
            };
        });
    };

    // Handle upload gambar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 2); // max 2 gambar
            setForm((prev) => ({ ...prev, images: files }));
        }
    };

    // Handle simpan perubahan
    const handleSave = async () => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("author", form.author);
        form.categories.forEach((cat) => formData.append("categories[]", cat.id.toString()));
        if (form.images) {
            form.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append("images[]", image); // cuma kirim file baru ke server
                }
            });
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://127.0.0.1:8000/api/articles/${article.id}`, {
                method: "POST", // Laravel biasanya butuh POST + _method=PUT untuk multipart
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update article");
            }

            onSave({ ...form, ...data.article, images: data.article.images });
            onClose();
            Swal.fire("Success!", "Article updated successfully.", "success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
            Swal.fire("Error!", "Failed to update article.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Edit Article</h3>

                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

                <div className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Content</label>
                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        />
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded-md text-sm"
                            required
                        />
                    </div>

                    {/* Categories */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categories</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {categories.map((cat) => {
                                const catId = categoryIds[cat];
                                const isActive = form.categories.some((c) => c.id === catId);

                                return (
                                    <button
                                        type="button"
                                        key={cat}
                                        onClick={() => handleCategoryChange(cat)}
                                        className={`px-3 py-1 text-sm border rounded-md transition ${isActive
                                            ? "bg-[#134280] text-white border-[#134280]"
                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                                            }`}
                                        disabled={!catId}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Images (max 2)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="mt-1"
                        />
                        {form.images && form.images.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">
                                {form.images.length} file(s) selected
                            </p>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6 gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-[#134280] text-white rounded-md hover:bg-[#0f2e5c]"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
