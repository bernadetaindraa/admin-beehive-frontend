"use client";

import { useState } from "react";
import { Product } from "./producttable";
import ProductForm from "./productform";

interface Props {
    product: Product;
    onClose: () => void;
    onSave: (product: Product) => void;
}

export default function EditProductModal({ product, onClose, onSave }: Props) {
    const [form, setForm] = useState<Product>(product);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[90vh] flex flex-col"
            >
                <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
                <ProductForm product={form} onChange={setForm} />
                <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
}
