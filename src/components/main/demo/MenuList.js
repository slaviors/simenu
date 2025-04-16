import Image from "next/image";
import { useState } from "react";

export default function MenuList({ items, onItemClick }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["all", ...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => b.id - a.id);

  return (
    <div>
      <div className="bg-white rounded-2xl p-4 mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 rounded-md border-2 border-black focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-2 pb-2 -mx-1 px-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md whitespace-nowrap border-2 border-black ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white rounded-2xl p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {sortedItems.length > 0 ? (
          sortedItems.map((item) => (
            <div
              key={item.id}
              className="border-2 border-black rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
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
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No items found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
