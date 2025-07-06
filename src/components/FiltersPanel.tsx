"use client";

import { useState } from "react";
import { Filter } from "@/lib/filtersByCategory";

interface FiltersPanelProps {
    readonly filters: readonly Filter[];
}

const conditionOptions = ["الكل", "جديد", "حالة ممتازة", "مستعمل"];

const offeredSinceOptions = [
    { value: "today", label: "اليوم" },
    { value: "yesterday", label: "أمس" },
    { value: "week", label: "أسبوع" },
    { value: "always", label: "دائمًا" },
];

export default function FiltersPanel({ filters }: FiltersPanelProps) {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
    const [instantSale, setInstantSale] = useState(false);
    const [offeredSince, setOfferedSince] = useState<string[]>(["always"]);

    const handleFilterChange = (name: string, value: string) => {
        setSelectedFilters((prev) => ({ ...prev, [name]: value }));
    };

    const toggleArrayValue = (prev: string[], selected: string) =>
        prev.includes(selected)
            ? prev.filter((v) => v !== selected)
            : [...prev, selected];

    const handleConditionChange = (condition: string) => {
        setSelectedConditions((prev) => toggleArrayValue(prev, condition));
    };

    const handleOfferedSinceChange = (value: string) => {
        setOfferedSince((prev) => toggleArrayValue(prev, value));
    };

    return (
        <div className="space-y-6">
            {/* ✅ Price Range */}
            <div>
                <label htmlFor="price-min" className="block text-sm font-bold mb-2">السعر</label>
                <div className="flex gap-2">
                    <input
                        id="price-min"
                        type="number"
                        placeholder="من"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                    <input
                        id="price-max"
                        type="number"
                        placeholder="إلى"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
            </div>

            {/* ✅ Condition Checkboxes */}
            <div>
                <span className="block text-sm font-bold mb-2">الحالة</span>
                <div className="space-y-1 pr-4">
                    {conditionOptions.map((condition) => (
                        <label key={condition} className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={selectedConditions.includes(condition)}
                                onChange={() => handleConditionChange(condition)}
                            />
                            {condition}
                        </label>
                    ))}
                </div>
            </div>

            {/* ✅ Instant Sale */}
            <div>
                <p className="block text-sm font-bold mb-2">للبيع فورًا</p>
                <div className="space-y-1 pr-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            id="instant-sale"
                            type="checkbox"
                            checked={instantSale}
                            onChange={(e) => setInstantSale(e.target.checked)}
                        />
                        <span>نعم</span>
                    </label>
                </div>
            </div>

            {/* ✅ Offered Since */}
            <div>
                <p className="block text-sm font-bold mb-2">معروض منذ</p>
                <div className="pr-4 flex flex-col gap-2 pl-1 text-sm">
                    {offeredSinceOptions.map(({ value, label }) => (
                        <label key={value} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={offeredSince.includes(value)}
                                onChange={() => handleOfferedSinceChange(value)}
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* ✅ Dynamic Filters */}
            {filters.map((filter) => (
                <div key={filter.name}>
                    <label htmlFor={filter.name} className="block text-sm font-bold mb-2">
                        {filter.label}
                    </label>
                    <select
                        id={filter.name}
                        name={filter.name}
                        value={selectedFilters[filter.name] || ""}
                        onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-sm"
                    >
                        <option value="">اختر</option>
                        {filter.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
}
