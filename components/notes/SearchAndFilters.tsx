"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotesStore } from "@/store/useNotesStore";
import { Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const colorMap = {
  default: "bg-gray-300 dark:bg-zinc-500",
  yellow: "bg-yellow-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  pink: "bg-pink-400",
  purple: "bg-purple-400",
  orange: "bg-orange-400",
};

export function SearchAndFilters() {
  const { searchQuery, selectedColor, setSearchQuery, setSelectedColor } =
    useNotesStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 transition-all duration-300">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md animate-in fade-in zoom-in duration-500">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white dark:bg-zinc-800 dark:text-white dark:placeholder-gray-400"
        />
      </div>

      {/* Color Filter */}
      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 shrink-0" />
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-full sm:w-44 bg-white dark:bg-zinc-800 dark:text-white">
            <SelectValue placeholder="Filter">
              {selectedColor && (
                <div className="flex items-center gap-2">
                  {selectedColor !== "all" && (
                    <span
                      className={cn(
                        "w-3 h-3 rounded-full inline-block",
                        colorMap[selectedColor as keyof typeof colorMap] ||
                          "bg-gray-300"
                      )}
                    />
                  )}
                  <span className="capitalize">
                    {selectedColor === "all" ? "All colors" : selectedColor}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="dark:bg-zinc-800 dark:text-white z-[100]">
            <SelectItem value="all">All colors</SelectItem>
            {Object.entries(colorMap).map(([value, colorClass]) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center gap-2">
                  <span className={cn("w-3 h-3 rounded-full", colorClass)} />
                  <span className="capitalize">{value}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
