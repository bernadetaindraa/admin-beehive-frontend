// src/app/dashboard/careers/page.tsx
"use client";

import DashboardLayout from "@/components/dashboardlayouts";
import CareerForm from "./components/careerform";
import CareerTable from "./components/careertable";
import { useState } from "react";

export default function CareersPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Manage Careers</h1>
                    <p className="text-gray-600 text-sm">
                        Add a new career opportunity or manage the existing ones.
                    </p>
                </div>

                <CareerForm onSuccess={handleRefresh} />
                <CareerTable key={refreshKey} onRefresh={handleRefresh} />
            </div>
        </DashboardLayout>
    );
}