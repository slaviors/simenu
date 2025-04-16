import Image from "next/image";
import { useState } from "react";

export default function MenuList({ items, onItemClick }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Get unique categories from items
  const categories = ["all", ...new Set(items.map((item) => item.category))];
  
  // Filter items based on selected category
  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter((item) => item.category === selectedCategory);
  
  // Sort filtered items by ID
  const sortedItems = [...filteredItems].sort((a, b) => b.id - a.id);

  return (
    <div>
      {/* Category Filter Buttons */}
      <div className="bg-white rounded-2xl p-4 mb-6">
        <div className="flex overflow-x-auto gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-[#99BC85] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-2xl p-4">
        {sortedItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onItemClick(item)}
          >
            <div className="h-48 overflow-hidden relative">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <p className="text-gray-600 mt-1">
                {item.description.substring(0, 80)}...
              </p>
              <p className="font-bold text-lg mt-2">
                ${parseFloat(item.price).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
