import { useState } from "react";
import Image from "next/image";

export default function MenuManagementPanel({ menuItems, onEditItem }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <div className="flex overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 mr-2 rounded-md whitespace-nowrap ${
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden shadow-sm"
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
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {item.category}
                  </p>
                </div>
                <span className="font-bold">
                  ${parseFloat(item.price).toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                {item.description}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => onEditItem(item)}
                  className="w-full py-2 bg-[#99BC85] text-white rounded-md hover:bg-[#E4EFE7] hover:text-[#99BC85] transition-colors"
                >
                  Edit Item
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">
            No menu items found for this category.
          </div>
        )}
      </div>
    </div>
  );
}
