"use client";

import DashboardLayout from "@/components/dashboardlayouts";
import ArticleForm from "./components/articleform";
import ArticleTable from "./components/articletable";

export default function ArticlesPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                 <div>
                    <h1 className="text-xl font-semibold text-gray-800">Manage Articles</h1>
                    <p className="text-gray-600 text-sm">
                        Add new articles or manage existing ones.
                    </p>
                </div>

                <ArticleForm onSuccess={() => console.log("Article added!")} />
                <ArticleTable />
            </div>
        </DashboardLayout>
    );
}
