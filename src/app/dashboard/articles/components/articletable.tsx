"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EditArticleModal from "./editarticlemodal";

export interface Article {
    id: number;
    title: string;
    content: string;
    author: string;
    categories: { id: number; name: string }[];
    images: { id: number; image_url: string }[];
}

export default function ArticleTable() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    // Ambil data artikel dari backend
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const token = localStorage.getItem("token"); // Ambil token dari localStorage
                const response = await fetch("http://127.0.0.1:8000/api/articles", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Gagal mengambil artikel dari server");
                }

                const data = await response.json();
                setArticles(data); // Data langsung dari backend
            } catch (err) {
                setError(err instanceof Error ? err.message : "Terjadi kesalahan");
                Swal.fire("Error!", "Gagal memuat artikel.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    const handleDelete = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This article will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#134280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem("token");
                    const response = await fetch(`http://127.0.0.1:8000/api/articles/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Gagal menghapus artikel");
                    }

                    setArticles((prev) => prev.filter((a) => a.id !== id));
                    Swal.fire("Deleted!", "The article has been deleted.", "success");
                } catch (err) {
                    Swal.fire("Error!", "Gagal menghapus artikel.", "error");
                    console.error("Error deleting article:", err);
                }
            }
        });
    };

    const handleSaveArticle = (updated: Article) => {
        setArticles((prev) =>
            prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a))
        );
        setEditingArticle(null);
        Swal.fire("Success!", "Article updated successfully.", "success");
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-4 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Articles List</h2>
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                        <th className="p-2">Title</th>
                        <th className="p-2">Author</th>
                        <th className="p-2">Categories</th>
                        <th className="p-2">Images</th>
                        <th className="p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((a) => (
                        <tr key={a.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{a.title}</td>
                            <td className="p-2">{a.author}</td>
                            <td className="p-2">
                                {a.categories.map((cat) => cat.name).join(", ")}
                            </td>
                            <td className="p-2">
                                {a.images.length > 0 ? (
                                    <div className="flex gap-2">
                                        {a.images.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img.image_url}
                                                alt={`thumb-${i}`}
                                                className="w-12 h-12 object-cover rounded-md border"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 italic">No images</span>
                                )}
                            </td>
                            <td className="p-2 text-center space-x-2">
                                <button
                                    onClick={() => setEditingArticle(a)}
                                    className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(a.id)}
                                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {articles.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                                No articles available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingArticle && (
                <EditArticleModal
                    article={editingArticle}
                    onClose={() => setEditingArticle(null)}
                    onSave={handleSaveArticle}
                />
            )}
        </div>
    );
}