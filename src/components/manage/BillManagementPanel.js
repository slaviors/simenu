import { useState } from "react";

export default function BillManagementPanel({ billRequests, onProcessBill }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  const filteredRequests = billRequests.filter((request) => {
    if (statusFilter !== "all" && request.status !== statusFilter) {
      return false;
    }

    if (searchTerm) {
      return request.table_number.toString().includes(searchTerm);
    }

    return true;
  });

  return (
    <div>
      <div className="bg-white rounded-2xl p-4 mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "all"
                  ? "bg-[#99BC85] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "pending"
                  ? "bg-yellow-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap border-2 border-black ${
                statusFilter === "completed"
                  ? "bg-green-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-gray-700 hover:bg-gray-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              Completed
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by table number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#99BC85] focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`bg-white rounded-lg p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                request.status === "pending"
                  ? "border-l-4 border-l-yellow-500"
                  : "border-l-4 border-l-green-500"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-[#99BC85]">
                    Table #{request.table_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(request.request_time).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border border-black ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>

              {request.note && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Customer Note:
                  </h4>
                  <p className="text-sm bg-gray-50 p-2 rounded border border-gray-200">
                    {request.note}
                  </p>
                </div>
              )}

              {request.order_total && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Order Total:
                  </h4>
                  <p className="font-bold text-[#99BC85]">
                    ${parseFloat(request.order_total).toFixed(2)}
                  </p>
                </div>
              )}

              {request.status === "pending" && (
                <div className="flex mt-4">
                  <button
                    onClick={() => onProcessBill(request.id)}
                    className="w-full bg-[#99BC85] hover:bg-[#E4EFE7] hover:text-[#99BC85] text-white py-2 px-4 rounded-md border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Mark as Processed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No bill requests match your search/filter criteria"
              : "No bill requests available"}
          </p>
        </div>
      )}
    </div>
  );
}
