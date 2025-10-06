"use client";

import { useState } from "react";
import { Career } from "./careertable";

interface Props {
    career: Career;
    onClose: () => void;
    onSave: (updated: Career) => void;
}

export default function EditCareerModal({ career, onClose, onSave }: Props) {
    const [form, setForm] = useState<Career>({ ...career });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            onSave(form);
            setLoading(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-lg w-[600px] max-h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Edit Career</h3>
                </div>

                {/* Body scrollable */}
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Career Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Qualifications */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Qualifications
                        </label>
                        <textarea
                            name="qualifications"
                            value={form.qualifications}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            required
                        />
                    </div>

                    {/* Benefits */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Benefits
                        </label>
                        <textarea
                            name="benefits"
                            value={form.benefits}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                        />
                    </div>

                    {/* Responsibilities */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Key Responsibilities
                        </label>
                        <textarea
                            name="keyResponsibilities"
                            value={form.keyResponsibilities}
                            onChange={handleChange}
                            rows={3}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Work Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Work Type
                            </label>
                            <select
                                name="workType"
                                value={form.workType}
                                onChange={handleChange}
                                className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                            >
                                <option value="WFO">WFO</option>
                                <option value="WFH">WFH</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Deadline
                        </label>
                        <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            className="mt-1 w-full border rounded-md px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm bg-[#134280] text-white rounded-md hover:bg-[#0f2e5c]"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
