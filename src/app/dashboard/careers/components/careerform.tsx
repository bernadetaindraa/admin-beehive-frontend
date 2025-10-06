"use client";

import { useState } from "react";

interface CareerFormProps {
    onSuccess: () => void;
}

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
        onSuccess(); // ✅ callback saat sukses
        // reset form kalau mau
        setTitle("");
        setQualifications("");
        setBenefits("");
        setKeyResponsibilities("");
        setLocation("");
        setWorkType("WFO");
        setDeadline("");
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full">
            <h2 className="text-lg font-semibold mb-4">Add New Career</h2>

            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Career Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <textarea
                    placeholder="Qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    rows={3}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <textarea
                    placeholder="Benefits"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    rows={3}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <textarea
                    placeholder="Key Responsibilities"
                    value={keyResponsibilities}
                    onChange={(e) => setKeyResponsibilities(e.target.value)}
                    rows={3}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border px-3 py-2 rounded-md"
                />

                <div>
                    <p className="text-sm font-medium mb-1">Work Type</p>
                    <select
                        value={workType}
                        onChange={(e) =>
                            setWorkType(e.target.value as "WFH" | "WFO" | "Hybrid")
                        }
                        className="w-full border px-3 py-2 rounded-md"
                    >
                        <option value="WFO">WFO</option>
                        <option value="WFH">WFH</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>

                <div>
                    <p className="text-sm font-medium mb-1">Deadline</p>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full border px-3 py-2 rounded-md"
                    />
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </div>
    );
}
