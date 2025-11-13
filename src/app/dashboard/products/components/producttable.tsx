"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AddProductModal from "./addproductmodal";
import EditProductModal from "./editproductmodal";

export interface PackageOption {
    name: string;
    price: number;
    description: string;
}

export interface Product {
    id: number;
    title: string;
    subtitle: string;
    images: string[];
    description: string;
    type: string;
    wingspan: string;
    flightEndurance: string;
    flightRange: string;
    flightHeight: string;
    otherDetails: string;
    include: string[];
    packageOptions: PackageOption[];
    financing: string[];
    basePrice: number;
}

interface ApiPackageOption {
    name: string;
    price: number;
    description: string;
}

interface ApiProduct {
    id: number;
    title: string;
    subtitle: string | null;
    images: string[] | null;
    description: string | null;
    type: string | null;
    wingspan: string | null;
    flight_endurance: string | null;
    flight_range: string | null;
    flight_height: string | null;
    other_details: string | null;
    include_items: string[] | null;
    package_options: ApiPackageOption[] | null;
    financing: string[] | null;
    base_price: number | null;
}

interface ProductIndexResponse {
    data: ApiProduct[];
    current_page: number;
    last_page: number;
    total: number;
}

const mapApiProductToProduct = (api: ApiProduct): Product => ({
    id: api.id,
    title: api.title,
    subtitle: api.subtitle ?? "",
    images: api.images ?? [],
    description: api.description ?? "",
    type: api.type ?? "",
    wingspan: api.wingspan ?? "",
    flightEndurance: api.flight_endurance ?? "",
    flightRange: api.flight_range ?? "",
    flightHeight: api.flight_height ?? "",
    otherDetails: api.other_details ?? "",
    include: api.include_items ?? [],
    packageOptions: (api.package_options ?? []).map((p) => ({
        name: p.name,
        price: p.price,
        description: p.description,
    })),
    financing: api.financing ?? [],
    basePrice: api.base_price ?? 0,
});

const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export default function ProductTable() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const getToken = () => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem("token");
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const token = getToken();

            const res = await fetch(`${API_BASE}/products`, {
                headers: {
                    Accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch products: ${res.status}`);
            }

            const json: ProductIndexResponse = await res.json();

            const mapped = json.data.map(mapApiProductToProduct);
            setProducts(mapped);
        } catch (err: any) {
            console.error(err);
            Swal.fire(
                "Error",
                err.message || "Failed to load products from server.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = async (newProduct: Omit<Product, "id">) => {
        try {
            const token = getToken();

            const res = await fetch(`${API_BASE}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    title: newProduct.title,
                    subtitle: newProduct.subtitle,
                    description: newProduct.description,
                    type: newProduct.type,
                    wingspan: newProduct.wingspan,
                    flightEndurance: newProduct.flightEndurance,
                    flightRange: newProduct.flightRange,
                    flightHeight: newProduct.flightHeight,
                    otherDetails: newProduct.otherDetails,
                    basePrice: newProduct.basePrice,
                    images: newProduct.images,
                    include: newProduct.include,
                    packageOptions: newProduct.packageOptions,
                    financing: newProduct.financing,
                }),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                console.error(errBody);
                throw new Error("Failed to create product.");
            }

            const json = await res.json();
            const createdApi: ApiProduct = json.data;
            const created = mapApiProductToProduct(createdApi);
            setProducts((prev) => [...prev, created]);
            Swal.fire("Success", "Product created successfully.", "success");
        } catch (err: any) {
            Swal.fire(
                "Error",
                err.message || "Failed to create product.",
                "error"
            );
        }
    };

    const handleUpdate = async (updated: Product) => {
        try {
            const token = getToken();

            const res = await fetch(`${API_BASE}/products/${updated.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({
                    title: updated.title,
                    subtitle: updated.subtitle,
                    description: updated.description,
                    type: updated.type,
                    wingspan: updated.wingspan,
                    flightEndurance: updated.flightEndurance,
                    flightRange: updated.flightRange,
                    flightHeight: updated.flightHeight,
                    otherDetails: updated.otherDetails,
                    basePrice: updated.basePrice,
                    images: updated.images,
                    include: updated.include,
                    packageOptions: updated.packageOptions,
                    financing: updated.financing,
                }),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                console.error(errBody);
                throw new Error("Failed to update product.");
            }

            const json = await res.json();
            const apiUpdated: ApiProduct = json.data;
            const mapped = mapApiProductToProduct(apiUpdated);

            setProducts((prev) =>
                prev.map((p) => (p.id === mapped.id ? mapped : p))
            );
            Swal.fire("Success", "Product updated successfully.", "success");
        } catch (err: any) {
            Swal.fire(
                "Error",
                err.message || "Failed to update product.",
                "error"
            );
        }
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This product will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#134280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            try {
                const token = getToken();

                const res = await fetch(`${API_BASE}/products/${id}`, {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });

                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    console.error(errBody);
                    throw new Error("Failed to delete product.");
                }

                setProducts((prev) => prev.filter((p) => p.id !== id));
                Swal.fire("Deleted!", "The product has been deleted.", "success");
            } catch (err: any) {
                Swal.fire(
                    "Error",
                    err.message || "Failed to delete product.",
                    "error"
                );
            }
        });
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Products</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                    Add Product
                </button>
            </div>

            {loading ? (
                <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : (
                <table className="w-full border border-gray-200 rounded-md overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">Title</th>
                            <th className="p-2 text-left">Type</th>
                            <th className="p-2 text-left">Base Price</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-center p-4 text-gray-500"
                                >
                                    No products yet
                                </td>
                            </tr>
                        )}
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-2">{p.title}</td>
                                <td className="p-2">{p.type}</td>
                                <td className="p-2">
                                    Rp{p.basePrice.toLocaleString("id-ID")}
                                </td>
                                <td className="p-2 flex gap-2">
                                    <button
                                        onClick={() => setEditingProduct(p)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded-md"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="px-3 py-1 bg-red-600 text-white rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {isAdding && (
                <AddProductModal
                    onClose={() => setIsAdding(false)}
                    onSave={handleAdd}
                />
            )}

            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}
