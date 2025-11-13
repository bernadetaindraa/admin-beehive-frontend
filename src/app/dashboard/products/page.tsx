"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import DashboardLayout from "@/components/dashboardlayouts";
import ProductForm from "./components/productform";
import ProductTable, { Product } from "./components/producttable";

const makeEmptyProduct = (): Product => ({
  id: 0,
  title: "",
  subtitle: "",
  images: [],
  description: "",
  type: "",
  wingspan: "",
  flightEndurance: "",
  flightRange: "",
  flightHeight: "",
  otherDetails: "",
  include: [],
  packageOptions: [],
  financing: ["Cash", "Installment"],
  basePrice: 0,
});

export default function Page() {
  const [form, setForm] = useState<Product>(makeEmptyProduct());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire("Error", "Token tidak ditemukan. Silakan login dulu.", "error");
        setIsSubmitting(false);
        return;
      }

      const { id, ...rest } = form;

      const payload = {
        ...rest,
        basePrice: Number(rest.basePrice) || 0,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Error create product:", errorBody);
        Swal.fire("Error", "Gagal menambahkan produk.", "error");
        setIsSubmitting(false);
        return;
      }

      const json = await res.json();
      const created = json.data;

      const newProduct: Product = {
        id: created.id,
        title: created.title,
        subtitle: created.subtitle ?? "",
        images: created.images ?? [],
        description: created.description ?? "",
        type: created.type ?? "",
        wingspan: created.wingspan ?? "",
        flightEndurance: created.flight_endurance ?? "",
        flightRange: created.flight_range ?? "",
        flightHeight: created.flight_height ?? "",
        otherDetails: created.other_details ?? "",
        include: created.include_items ?? [],
        packageOptions: created.package_options ?? [],
        financing: created.financing ?? [],
        basePrice: created.base_price ?? 0,
      };

      console.log("Produk berhasil dibuat:", newProduct);

      setForm(makeEmptyProduct());

      setRefreshKey((prev) => prev + 1);

      Swal.fire("Success", "Product created successfully.", "success");

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Terjadi kesalahan saat menyimpan produk.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Manage Products
          </h1>
          <p className="text-gray-600 text-sm">
            Add new products or view the existing ones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ProductForm product={form} onChange={setForm} />

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>

        <ProductTable key={refreshKey} />

      </div>
    </DashboardLayout>
  );
}
