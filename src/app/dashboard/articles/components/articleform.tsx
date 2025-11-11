"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

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
        categories: [] as number[],
        images: [] as File[],
        error: "",
    });
    const [categoryIds, setCategoryIds] = useState<{ [key: string]: number }>({});
    const router = useRouter();

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
            } catch (error) {
                console.error("Gagal mengambil kategori:", error);
                setForm((prev) => ({ ...prev, error: "Gagal memuat kategori" }));
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value, error: "" });
    };

    const handleCategoryChange = (cat: string) => {
        const catId = categoryIds[cat] || 0;
        if (!catId) return; // Hindari perubahan jika ID tidak ada

        setForm((prev) => {
            const exists = prev.categories.includes(catId);
            const newCategories = exists
                ? prev.categories.filter((c) => c !== catId)
                : [...prev.categories, catId];
            return { ...prev, categories: newCategories, error: "" };
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 2); // Max 2 images
            setForm({ ...form, images: files, error: "" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setForm({ ...form, error: "" });

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("content", form.content);
        formData.append("author", form.author);
        form.categories.forEach((catId) => formData.append("categories[]", catId.toString()));
        form.images.forEach((image) => formData.append("images[]", image));

        try {
            const token = localStorage.getItem("token"); // Ambil token dari localStorage
            const response = await fetch("http://127.0.0.1:8000/api/articles", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Gagal menyimpan artikel");
            }

            setForm({
                title: "",
                content: "",
                author: "",
                categories: [],
                images: [],
                error: "",
            });
            onSuccess();
            router.refresh(); // Refresh halaman jika menggunakan Next.js
        } catch (error) {
            setForm({ ...form, error: error instanceof Error ? error.message : "Terjadi kesalahan" });
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Add Article</h2>

            {form.error && <div className="text-red-500 text-sm">{form.error}</div>}

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

            <div data-color-mode="light" className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown)</label>
                <div className="border rounded-md p-2">
                    <MDEditor
                        value={form.content}
                        onChange={(value) => setForm({ ...form, content: value || "", error: "" })}
                        height={300}
                    />
                </div>
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
                {!Object.keys(categoryIds).length && (
                    <p className="text-sm text-gray-500 mt-2">Memuat kategori...</p>
                )}
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
                disabled={loading || !Object.keys(categoryIds).length} // Nonaktifkan jika kategori belum dimuat
                className="bg-[#134280] text-white px-4 py-2 rounded-md hover:bg-[#0f2e5c] transition text-sm"
            >
                {loading ? "Saving..." : "Save Article"}
            </button>
        </form>
    );
}