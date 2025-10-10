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

export default function EditArticleModal({ article, onClose, onSave }: Props) {
    const [form, setForm] = useState<Article>(article);
    const [categoryIds, setCategoryIds] = useState<{ [key: string]: number }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ambil mapping kategori dari backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/categories");
                if (!response.ok) throw new Error("Gagal mengambil kategori");
                const data = await response.json();
                const idsMap = data.reduce((acc: { [key: string]: number }, cat: { id: number; name: string }) => {
                    acc[cat.name] = cat.id;
                    return acc;
                }, {});
                setCategoryIds(idsMap);

                // Inisialisasi kategori berdasarkan ID dari artikel
                const initialCategories = article.categories.map((cat) => cat.name);
                setForm((prev) => ({
                    ...prev,
                    categories: initialCategories.map((name) => categoryIds[name] || 0).filter((id) => id !== 0),
                }));
            } catch (err) {
                setError(err instanceof Error ? err.message : "Terjadi kesalahan");
            }
        };
        fetchCategories();
    }, [article.categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value, error: "" });
    };

    const handleCategoryChange = (cat: string) => {
        const catId = categoryIds[cat] || 0;
        setForm((prev) => {
            const exists = prev.categories.includes(catId);
            return {
                ...prev,
                categories: exists
                    ? prev.categories.filter((c) => c !== catId)
                    : [...prev.categories, catId].filter((id) => id !== 0),
                error: "",
            };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 2); // Max 2 images
            setForm((prev) => ({ ...prev, images: files, error: "" }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("author", form.author);
        form.categories.forEach((catId) => formData.append("categories[]", catId.toString()));
        if (form.images) {
            form.images.forEach((image) => formData.append("images[]", image));
        }

        try {
            const token = localStorage.getItem("token"); // Ambil token dari localStorage
            const response = await fetch(`http://127.0.0.1:8000/api/articles/${article.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal memperbarui artikel");
            }

            onSave({ ...form, ...data.article, images: data.article.images }); // Perbarui dengan data dari server
            onClose();
            Swal.fire("Success!", "Article updated successfully.", "success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan");
            Swal.fire("Error!", "Gagal memperbarui artikel.", "error");
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categories</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {categories.map((cat) => (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => handleCategoryChange(cat)}
                                    className={`px-3 py-1 text-sm border rounded-md ${form.categories.includes(categoryIds[cat] || 0)
                                            ? "bg-[#134280] text-white border-[#134280]"
                                            : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                    disabled={!categoryIds[cat]} // Nonaktifkan jika ID belum dimuat
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