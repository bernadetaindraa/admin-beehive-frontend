"use client";

import DashboardLayout from "@/components/dashboardlayouts";
import CareerForm from "./components/careerform";
import CareerTable from "./components/careertable";

export default function CareersPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-xl font-semibold text-gray-800">Manage Careers</h1>
                <p className="text-gray-600 text-sm">
                    Add a new career opportunity or manage the existing ones.
                </p>

                {/* Form to add career */}
                <CareerForm onSuccess={() => console.log("Career added!")} />

                {/* Table list of careers */}
                <CareerTable />
            </div>
        </DashboardLayout>
    );
}
