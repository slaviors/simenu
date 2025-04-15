import Image from "next/image";

export default function MenuList({ items, onItemClick }) {
  const sortedItems = [...items].sort((a, b) => b.id - a.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
