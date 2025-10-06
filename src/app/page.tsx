import DashboardLayout from "@/components/dashboardlayouts";
import StatCard from "@/components/statcard";
import DataTable from "@/components/datatable";
import { LayoutDashboard, FolderKanban, FileText, Users } from "lucide-react";

export default function DashboardPage() {
  const projects = [
    { title: "Drone Mapping", category: "Agriculture", status: "Active" },
    { title: "Surveying", category: "Construction", status: "Completed" },
  ];

  const articles = [
    { title: "How Drones Help Farmers", author: "Admin", date: "2025-09-20" },
  ];

  const careers = [
    { title: "Procurement Staff", type: "WFO", location: "Yogyakarta" },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <h2 className="text-2xl font-semibold text-gray-800">Welcome to Dashboard</h2>
      <p className="mt-2 text-gray-600">
        This is your admin control panel for Beehive Drones.
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <StatCard
          title="Projects"
          value={projects.length}
          icon={<FolderKanban className="w-6 h-6" />}
        />
        <StatCard
          title="Articles"
          value={articles.length}
          icon={<FileText className="w-6 h-6" />}
          color="bg-green-600"
        />
        <StatCard
          title="Careers"
          value={careers.length}
          icon={<Users className="w-6 h-6" />}
          color="bg-purple-600"
        />
      </div>

      {/* Tables */}
      <DataTable
        title="Latest Projects"
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
        ]}
        data={projects}
      />

      <DataTable
        title="Latest Articles"
        columns={[
          { key: "title", label: "Title" },
          { key: "author", label: "Author" },
          { key: "date", label: "Date" },
        ]}
        data={articles}
      />

      <DataTable
        title="Open Careers"
        columns={[
          { key: "title", label: "Title" },
          { key: "type", label: "Type" },
          { key: "location", label: "Location" },
        ]}
        data={careers}
      />
    </DashboardLayout>
  );
}
