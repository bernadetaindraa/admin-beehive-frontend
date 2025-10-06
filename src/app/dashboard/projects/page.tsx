"use client";

import DashboardLayout from "@/components/dashboardlayouts";
import ProjectForm from "./components/projectform";
import ProjectTable from "./components/projecttable";

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-xl font-semibold text-gray-800">Kelola Project</h1>
                <p className="text-gray-600 text-sm">
                    Tambahkan project baru atau lihat daftar project yang sudah ada.
                </p>

                {/* Form tambah project */}
                <ProjectForm onSuccess={() => console.log("Project ditambahkan!")} />

                {/* Tabel daftar project */}
                <ProjectTable />
            </div>
        </DashboardLayout>
    );
}
