"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  color?: string;
}

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card className={cn("rounded-2xl shadow-md border border-gray-100")}>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div
          className={cn(
            "w-12 h-12 flex items-center justify-center rounded-xl text-white",
            color || "bg-[#134280]"
          )}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
