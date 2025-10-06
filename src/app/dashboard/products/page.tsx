"use client";

import DashboardLayout from "@/components/dashboardlayouts";
import ProductForm from "./components/productform";
import ProductTable from "./components/producttable";

export default function Page() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Manage Products</h1>
                    <p className="text-gray-600 text-sm">
                        Add new products or view the existing ones.
                    </p>
                </div>

                {/* Form tambah produk */}
                <ProductForm
                    product={{
                        id: Date.now(),
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
                    }}
                    onChange={(p) => console.log("produk berubah", p)}
                    onSuccess={() => console.log("Produk ditambahkan!")}
                />

                {/* Tabel daftar produk */}
                <ProductTable />
            </div>
        </DashboardLayout>
    );
}
