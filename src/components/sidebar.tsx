"use client";
import { LayoutDashboard, FolderKanban, FileText, Users, Store, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
    const menus = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
        { name: "Articles", icon: FileText, path: "/dashboard/articles" },
        { name: "Careers", icon: Users, path: "/dashboard/careers" },
        { name: "Products", icon: Store, path: "/dashboard/products" },
    ];

    const handleLogout = () => {
        // TODO: tambahkan logic logout (hapus session/cookie/token)
        console.log("User logged out");
        window.location.href = "/login"; // redirect ke halaman login
    };

    return (
        <aside className="w-64 h-screen bg-white shadow-lg flex flex-col justify-between">
            {/* Logo & Title */}
            <div>
                <div className="flex items-center gap-2 px-6 py-4">
                    <div className="w-8 h-8 rounded-full bg-[#134280] flex items-center justify-center text-white font-bold">
                        B
                    </div>
                    <span className="font-semibold text-[#134280]">Beehive Drones</span>
                </div>

                {/* Menu List */}
                <nav className="mt-4 px-4">
                    {menus.map((menu) => (
                        <Link
                            key={menu.path}
                            href={menu.path}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-[#134280]/10 hover:text-[#134280] transition"
                        >
                            <menu.icon className="w-5 h-5" />
                            <span>{menu.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* User Section */}
            <div className="bg-[#134280] text-white p-4">
                <div className="flex items-center gap-3">
                    <Image
                        src="/user-avatar.png"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white"
                    />
                    <div>
                        <p className="text-sm">Welcome back 👋</p>
                        <p className="font-semibold">Admin</p>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1 mt-1 text-xs text-red-200 hover:text-red-400 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
