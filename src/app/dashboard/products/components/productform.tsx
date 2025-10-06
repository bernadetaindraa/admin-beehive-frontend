"use client";

import { useState } from "react";
import { Product } from "./producttable";

interface Props {
    product: Product;
    onChange: (updated: Product) => void;
    onSuccess?: () => void;
}

export default function ProductForm({ product, onChange, onSuccess }: Props) {
    const [imageUrl, setImageUrl] = useState("");
    const [includeItem, setIncludeItem] = useState("");
    const [packageName, setPackageName] = useState("");
    const [packagePrice, setPackagePrice] = useState<number>(0);
    const [packageDesc, setPackageDesc] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange({ ...product, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        // misalnya simpan data ke server di sini (axios/fetch)
        console.log("Produk disimpan:", product);

        // callback ke parent
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Title & Subtitle */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="title"
                    value={product.title}
                    onChange={handleChange}
                    placeholder="Product Title"
                    className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    name="subtitle"
                    value={product.subtitle}
                    onChange={handleChange}
                    placeholder="Subtitle"
                    className="border rounded-md px-3 py-2 text-sm"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Product Description"
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    rows={3}
                />
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium">Images (max 4)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const selected = files.slice(0, 4); // max 4 file

                        const readers = selected.map(
                            (file) =>
                                new Promise<string>((resolve) => {
                                    const reader = new FileReader();
                                    reader.onload = () => resolve(reader.result as string);
                                    reader.readAsDataURL(file); // hasil base64 untuk preview
                                })
                        );

                        Promise.all(readers).then((base64Images) => {
                            onChange({
                                ...product,
                                images: base64Images, // simpan array base64
                            });
                        });
                    }}
                    className="border rounded-md px-3 py-2 text-sm w-full"
                />

                {/* Preview */}
                <div className="flex gap-2 mt-2 flex-wrap">
                    {product.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`preview-${i}`}
                            className="w-20 h-20 object-cover border rounded"
                        />
                    ))}
                </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    name="type"
                    value={product.type}
                    onChange={handleChange}
                    placeholder="Type"
                    className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    name="wingspan"
                    value={product.wingspan}
                    onChange={handleChange}
                    placeholder="Wingspan"
                    className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    name="flightEndurance"
                    value={product.flightEndurance}
                    onChange={handleChange}
                    placeholder="Flight Endurance"
                    className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    name="flightRange"
                    value={product.flightRange}
                    onChange={handleChange}
                    placeholder="Flight Range"
                    className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    name="flightHeight"
                    value={product.flightHeight}
                    onChange={handleChange}
                    placeholder="Flight Height"
                    className="border rounded-md px-3 py-2 text-sm"
                />
                <input
                    type="text"
                    name="otherdetails"
                    value={product.otherDetails}
                    onChange={handleChange}
                    placeholder="Other Details"
                    className="border rounded-md px-3 py-2 text-sm"
                />
            </div>

            {/* Include */}
            <div>
                <label className="block text-sm font-medium">Include</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={includeItem}
                        onChange={(e) => setIncludeItem(e.target.value)}
                        className="flex-1 border rounded-md px-3 py-2 text-sm"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (includeItem.trim()) {
                                onChange({
                                    ...product,
                                    include: [...product.include, includeItem],
                                });
                                setIncludeItem("");
                            }
                        }}
                        className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                    >
                        Add
                    </button>
                </div>
                <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                    {product.include.map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* package Options */}
            <div>
                <label className="block text-sm font-medium">Package Options</label>
                <div className="grid grid-cols-3 gap-2">
                    <input
                        type="text"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        placeholder="Name"
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                    <input
                        type="number"
                        value={packagePrice}
                        onChange={(e) =>
                            setPackagePrice(parseInt(e.target.value) || 0)
                        }
                        placeholder="Price"
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                    <input
                        type="text"
                        value={packageDesc}
                        onChange={(e) => setPackageDesc(e.target.value)}
                        placeholder="Description"
                        className="border rounded-md px-2 py-1 text-sm"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => {
                        if (packageName.trim()) {
                            onChange({
                                ...product,
                                packageOptions: [
                                    ...product.packageOptions,
                                    {
                                        name: packageName,
                                        price: packagePrice,
                                        description: packageDesc,
                                    },
                                ],
                            });
                            setPackageName("");
                            setPackagePrice(0);
                            setPackageDesc("");
                        }
                    }}
                    className="mt-2 px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
                >
                    Add package
                </button>
                <ul className="mt-2 text-sm text-gray-700">
                    {product.packageOptions.map((c, i) => (
                        <li key={i}>
                            {c.name} - Rp{c.price.toLocaleString()} ({c.description})
                        </li>
                    ))}
                </ul>
            </div>

            {/* Base Price */}
            <div>
                <label className="block text-sm font-medium">Base Price</label>
                <input
                    type="number"
                    name="basePrice"
                    value={product.basePrice}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm"
                >
                    Save Product
                </button>
            </div>
        </div>
    );
}
