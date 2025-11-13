"use client";

import { useEffect, useState } from "react";
import { Product } from "./producttable";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:8000";

const resolveImageUrl = (img: string) => {
  if (!img) return "";

  if (img.startsWith("data:image/")) return img;

  if (img.startsWith("http://") || img.startsWith("https://")) return img;

  if (img.startsWith("/")) return `${BACKEND_URL}${img}`;

  return img;
};

interface Props {
  product: Product;
  onChange: (updated: Product) => void;
  onSuccess?: () => void;
}

export default function ProductForm({ product, onChange }: Props) {
  const [packageName, setPackageName] = useState("");
  const [packagePrice, setPackagePrice] = useState<number>(0);
  const [packageDesc, setPackageDesc] = useState("");

  const [includeText, setIncludeText] = useState<string>(
    (product.include || []).join("\n")
  );

  useEffect(() => {
    setIncludeText((product.include || []).join("\n"));
  }, [product.include]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "basePrice") {
      onChange({
        ...product,
        basePrice: Number(value) || 0,
      });
      return;
    }

    onChange({
      ...product,
      [name]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4 max-h-[70vh] overflow-y-auto pr-2">
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

      <div>
        <label className="block text-sm font-medium">Images (max 4)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            const selected = files.slice(0, 4);

            const readers = selected.map(
              (file) =>
                new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = () => resolve(reader.result as string);
                  reader.readAsDataURL(file);
                })
            );

            Promise.all(readers).then((base64Images) => {
              onChange({
                ...product,
                images: base64Images,
              });
            });
          }}
          className="border rounded-md px-3 py-2 text-sm w-full"
        />

        <div className="flex gap-2 mt-2 flex-wrap">
          {(product.images ?? []).map((img, i) => (
            <img
              key={i}
              src={resolveImageUrl(img)}
              alt={`preview-${i}`}
              className="w-20 h-20 object-cover border rounded"
            />
          ))}
        </div>
      </div>

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
          name="otherDetails"
          value={product.otherDetails}
          onChange={handleChange}
          placeholder="Other Details"
          className="border rounded-md px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Include</label>
        <textarea
          value={includeText}
          onChange={(e) => {
            const v = e.target.value;
            setIncludeText(v);
            const lines = v.split("\n").map((s) => s.trim());
            onChange({ ...product, include: lines });
          }}
          onBlur={() => {
            const cleaned = includeText
              .split("\n")
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
            setIncludeText(cleaned.join("\n"));
            onChange({ ...product, include: cleaned });
          }}
          placeholder={
            "Tulis satu item per baris, contoh:\nRemote Control\nBattery 6000mAh\nCharger Fast-60W"
          }
          className="w-full border rounded-md px-3 py-2 text-sm h-32"
        />
        <div className="mt-1 text-xs text-gray-500">
          {(product.include || []).filter((s) => s.trim().length > 0).length}{" "}
          item • tekan Enter untuk baris baru
        </div>
        <div className="mt-2">
          <button
            type="button"
            onClick={() => {
              setIncludeText("");
              onChange({ ...product, include: [] });
            }}
            className="px-2 py-1 text-xs bg-gray-200 rounded"
          >
            Clear
          </button>
        </div>
      </div>

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
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <input
            type="number"
            value={packagePrice}
            onChange={(e) => setPackagePrice(parseInt(e.target.value) || 0)}
            placeholder="Price"
            className="border rounded-md px-2 py-1 text-sm"
          />
          <input
            type="text"
            value={packageDesc}
            onChange={(e) => setPackageDesc(e.target.value)}
            placeholder="Description"
            className="border rounded-md px-2 py-1 text-sm col-span-2"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (packageName.trim()) {
              onChange({
                ...product,
                packageOptions: [
                  ...(product.packageOptions ?? []),
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
          {(product.packageOptions ?? []).map((c, i) => (
            <li key={i}>
              {c.name} - Rp{(c.price ?? 0).toLocaleString("id-ID")}{" "}
              {c.description ? `(${c.description})` : ""}
            </li>
          ))}
        </ul>
      </div>

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
    </div>
  );
}
