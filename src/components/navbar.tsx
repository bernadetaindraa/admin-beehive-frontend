"use client";
import { Bell, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className="w-full h-16 bg-white shadow-sm flex items-center justify-between px-6">
            {/* Left - Title */}
            <h1 className="text-lg font-semibold text-[#134280]">Admin Dashboard</h1>

            {/* Right - Notification & User */}
            <div className="flex items-center gap-6">
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        3
                    </span>
                </button>
            </div>
        </header>
    );
}
