import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
