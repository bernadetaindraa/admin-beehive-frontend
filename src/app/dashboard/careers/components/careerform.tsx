"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

interface CareerFormProps {
    onSuccess: () => void;
}

// Import Markdown Editor secara dinamis biar gak error di SSR
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CareerForm({ onSuccess }: CareerFormProps) {
    const [title, setTitle] = useState("");
    const [qualifications, setQualifications] = useState("");
    const [benefits, setBenefits] = useState("");
    const [keyResponsibilities, setKeyResponsibilities] = useState("");
    const [location, setLocation] = useState("");
    const [workType, setWorkType] = useState<"WFH" | "WFO" | "Hybrid">("WFO");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = () => {
        const newCareer = {
            id: Date.now(),
            title,
            qualifications,
            benefits,
            keyResponsibilities,
            location,
            workType,
            deadline,
        };

        console.log("Career saved:", newCareer);
        onSuccess();

        // Reset form setelah simpan
        setTitle("");
        setQualifications("");
        setBenefits("");
        setKeyResponsibilities("");
        setLocation("");
        setWorkType("WFO");
        setDeadline("");
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full" data-color-mode="light">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Career</h2>

            <div className="space-y-4">
                {/* Title */}
                <input
                    type="text"
                    placeholder="Career Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                    required
                />

                {/* Qualifications */}
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

                {/* Benefits */}
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

                {/* Key Responsibilities */}
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

                {/* Location */}
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                />

                {/* Work Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
                    <select
                        value={workType}
                        onChange={(e) =>
                            setWorkType(e.target.value as "WFH" | "WFO" | "Hybrid")
                        }
                        className="w-full border px-3 py-2 rounded-md focus:outline-[#134280]"
                    >
                        <option value="WFO">WFO</option>
                        <option value="WFH">WFH</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                {/* Deadline */}
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
                    className="px-4 py-2 rounded-md bg-[#134280] text-white hover:bg-[#0f2e5c] transition"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
