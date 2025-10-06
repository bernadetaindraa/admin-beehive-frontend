"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import EditCareerModal from "@/app/dashboard/careers/components/editcareermodal";

export interface Career {
    id: number;
    title: string;
    qualifications: string;
    benefits: string;
    keyResponsibilities: string;
    location: string;
    workType: "WFH" | "WFO" | "Remote";
    deadline: string;
}

export default function CareerTable() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);

    useEffect(() => {
        setCareers([
            {
                id: 1,
                title: "Software Engineer",
                qualifications: "Bachelor’s degree in Computer Science",
                benefits: "Health insurance, remote allowance",
                keyResponsibilities: "Develop and maintain web applications",
                location: "Jakarta",
                workType: "WFH",
                deadline: "2025-12-31",
            },
            {
                id: 2,
                title: "UI/UX Designer",
                qualifications: "Experience with Figma/Adobe XD",
                benefits: "Flexible hours, team events",
                keyResponsibilities: "Design intuitive user interfaces",
                location: "Bandung",
                workType: "WFO",
                deadline: "2025-11-15",
            },
        ]);
    }, []);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This career will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#134280",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                setCareers(careers.filter((c) => c.id !== id));
                Swal.fire("Deleted!", "The career has been deleted.", "success");
            }
        });
    };

    const handleSaveCareer = (updated: Career) => {
        setCareers((prev) =>
            prev.map((c) => (c.id === updated.id ? updated : c))
        );
        setEditingCareer(null);
        Swal.fire("Success!", "Career updated successfully.", "success");
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6 relative">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Career List</h2>
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                        <th className="p-2">Title</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Work Type</th>
                        <th className="p-2">Deadline</th>
                        <th className="p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {careers.map((c) => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{c.title}</td>
                            <td className="p-2">{c.location}</td>
                            <td className="p-2">{c.workType}</td>
                            <td className="p-2">{c.deadline}</td>
                            <td className="p-2 text-center space-x-2">
                                <button
                                    onClick={() => setEditingCareer(c)}
                                    className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {careers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500 italic">
                                No careers available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {editingCareer && (
                <EditCareerModal
                    career={editingCareer}
                    onClose={() => setEditingCareer(null)}
                    onSave={handleSaveCareer}
                />
            )}
        </div>
    );
}
