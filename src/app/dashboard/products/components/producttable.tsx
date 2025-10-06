"use client";

import { useState } from "react";
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

export default function ProductTable() {
    const [products, setProducts] = useState<Product[]>([
        {
            id: 1,
            title: "Beehive X1 Drone",
            subtitle: "Professional Survey Drone",
            images: ["/images/drone1-1.jpg", "/images/drone1-2.jpg"],
            description: "A professional-grade drone designed for aerial mapping and agriculture.",
            type: "Fixed Wing",
            wingspan: "2.5 m",
            flightEndurance: "2 hours",
            flightRange: "40 km",
            flightHeight: "400 m",
            otherDetails: "Yes",
            include: ["Drone body", "Controller", "Battery Pack"],
            packageOptions: [
                { name: "RGB Camera", price: 5000000, description: "Standard RGB camera for aerial photos" },
                { name: "Multispectral Camera", price: 15000000, description: "For agricultural analysis" }
            ],
            financing: ["Installment 6 months", "Installment 12 months"],
            basePrice: 75000000
        },
        {
            id: 2,
            title: "Beehive X2 Drone",
            subtitle: "Advanced Mapping Drone",
            images: ["/images/drone2-1.jpg", "/images/drone2-2.jpg", "/images/drone2-3.jpg"],
            description: "High-end drone with advanced sensors for precision mapping.",
            type: "VTOL",
            wingspan: "3 m",
            flightEndurance: "3 hours",
            flightRange: "60 km",
            flightHeight: "500 m",
            otherDetails: "Yes",
            include: ["Drone body", "Controller", "Battery Pack", "Landing gear"],
            packageOptions: [{ name: "LiDAR", price: 25000000, description: "For 3D terrain mapping" }],
            financing: ["Cash", "Installment 12 months", "Installment 24 months"],
            basePrice: 120000000
        }
    ]);

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = (newProduct: Product) => {
        setProducts([...products, { ...newProduct, id: Date.now() }]);
    };

    const handleUpdate = (updated: Product) => {
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
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
        }).then((result) => {
            if (result.isConfirmed) {
                setProducts(products.filter((p) => p.id !== id));
                Swal.fire("Deleted!", "The product has been deleted.", "success");
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Products</h2>
            </div>

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
                            <td colSpan={4} className="text-center p-4 text-gray-500">
                                No products yet
                            </td>
                        </tr>
                    )}
                    {products.map((p) => (
                        <tr key={p.id} className="border-t">
                            <td className="p-2">{p.title}</td>
                            <td className="p-2">{p.type}</td>
                            <td className="p-2">Rp{p.basePrice.toLocaleString()}</td>
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
