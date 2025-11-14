"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";

interface CareerFormProps {
    onSuccess: () => void;
}

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CareerForm({ onSuccess }: CareerFormProps) {
    const [title, setTitle] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [benefits, setBenefits] = useState("");
    const [keyResponsibilities, setKeyResponsibilities] = useState("");
    const [location, setLocation] = useState("");
    const [workType, setWorkType] = useState<"WFH" | "WFO" | "Hybrid">("WFO");
    const [deadline, setDeadline] = useState("");
    const [loading, setLoading] = useState(false);

    const apiBase = "http://127.0.0.1:8000";

    const handleSubmit = async () => {
        if (!title || !qualifications || !location || !deadline) {
            Swal.fire("Error", "Title, Qualifications, Location, dan Deadline wajib diisi!", "error");
            return;
        }

        setLoading(true);

        const payload = {
            title,
            qualifications,
            benefits: benefits || null,
            responsibilities: keyResponsibilities || null,
            location,
            work_type: workType,
            deadline,
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${apiBase}/api/careers`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Gagal menyimpan karir");
            }

            Swal.fire("Sukses!", "Lowongan karir berhasil ditambahkan.", "success");
            onSuccess();

            // Reset form
            setTitle("");
            setQualifications("");
            setBenefits("");
            setKeyResponsibilities("");
            setLocation("");
            setWorkType("WFO");
            setDeadline("");
        } catch (err: any) {
            Swal.fire("Error!", err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full" data-color-mode="light">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Career</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Career Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                    required
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Qualifications (Markdown)
                    </label>
                    <div className="border rounded-md p-2">
                        <MDEditor
                            value={qualifications}
                            onChange={(value) => setQualifications(value || "")}
                            height={200}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Benefits (Markdown)
                    </label>
                    <div className="border rounded-md p-2">
                        <MDEditor
                            value={benefits}
                            onChange={(value) => setBenefits(value || "")}
                            height={200}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Responsibilities (Markdown)
                    </label>
                    <div className="border rounded-md p-2">
                        <MDEditor
                            value={keyResponsibilities}
                            onChange={(value) => setKeyResponsibilities(value || "")}
                            height={200}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                    <select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value as "WFH" | "WFO" | "Hybrid")}
                        className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                    >
                        <option value="WFO">WFO</option>
                        <option value="WFH">WFH</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-5">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-[#134280] text-white hover:bg-[#0f2e5c] transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}