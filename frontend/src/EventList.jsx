// EventsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { getToken } from "./utils";
import { BASE_URL, limit } from "./config";
import { formatDate } from "./formatdate";

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [totalItems, setTotalItems] = useState(0);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(
        `${BASE_URL}/events?limit=${limit}&offset=${offset}&search=${encodeURIComponent(
          search
        )}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setEvents(Array.isArray(data.events) ? data.events : []);
      setTotalItems(data.total ?? 0);
    } catch (err) {
      console.error("Failed to fetch events:", err);
      setEvents([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [offset, search, sortBy, sortOrder]);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setOffset(0);
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalItems / limit);
  const rangeStart = totalItems === 0 ? 0 : offset + 1;
  const rangeEnd = Math.min(offset + limit, totalItems);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">Events List</h2>

        <Link
          to="/events/create"
          className="bg-cyan-300 hover:bg-cyan-500 px-3 py-2 rounded text-black transition font-semibold flex items-center gap-2 translate-y-11"
        >
          <Plus size={16} /> Create Event
        </Link>
      </div>

      {/* Search + Sort */}
      <div className="mb-4 flex gap-2 items-center">
        <div className="relative w-82">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOffset(0);
            }}
            placeholder="Search events…"
            className="w-full pr-10 pl-3 py-2 border border-cyan-300 rounded bg-gray-200 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 transition"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <Search size={29} className="border border-cyan-400 rounded-full p-1" />
          </div>
        </div>

        <button
          onClick={() => toggleSort("id")}
          className="px-3 py-1 bg-cyan-300 hover:bg-cyan-200 rounded transition flex items-center gap-1"
        >
          Sort by ID
          {sortBy === "id" &&
            (sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
        </button>

        <button
          onClick={() => toggleSort("event_date")}
          className="px-3 py-1 bg-cyan-300 hover:bg-cyan-200 rounded transition flex items-center gap-1"
        >
          Sort by Date
          {sortBy === "event_date" &&
            (sortOrder === "asc" ? <ArrowUp size={16} /> : <ArrowDown size={16} />)}
        </button>
      </div>

      {/* Table */}
      <div className="w-full border border-gray-300 rounded bg-white overflow-x-auto">
        {loading ? (
          <div className="p-4">Loading events…</div>
        ) : (
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-cyan-400/25 sticky top-0 z-10">
              <tr>
                {[
                  "ID",
                  "Thumbnail",
                  "Wallpaper",
                  "Title",
                  "Kind",
                  "Event Date",
                  "Status",
                  "Join Start",
                  "Join End",
                  "Pre Exposure Start",
                  "Pre Exposure End",
                  "Main Exposure Start",
                  "Main Exposure End",
                  "Created",
                  "Updated",
                  "Detail",
                ].map((c, i) => (
                  <th
                    key={i}
                    className="p-3.5 border-b border-gray-300 text-center whitespace-nowrap"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-gray-100 transition-colors">
                  <td className="p-3.5 border-b text-center">{e.id}</td>

                  {/* Thumbnail Preview */}
                  <td className="p-3.5 border-b text-center">
                    {e.url_thumbnail ? (
                      <img
                        src={e.url_thumbnail}
                        className="w-14 h-14 rounded object-cover border"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Wallpaper Preview */}
                  <td className="p-3.5 border-b text-center">
                    {e.url_image_big ? (
                      <img
                        src={e.url_image_big}
                        className="w-20 h-12 rounded object-cover border"
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="p-3.5 border-b">{e.title ?? "Untitled"}</td>

                  <td className="p-3.5 border-b text-center">{e.kind ?? "-"}</td>

                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.event_date)}
                  </td>

                  {/* Status = 0/1 */}
                  <td className="p-3.5 border-b text-center">
                    {e.status === 1 ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Closed</span>
                    )}
                  </td>

                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.join_start)}
                  </td>
                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.join_end)}
                  </td>
                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.exposure_pre_start)}
                  </td>
                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.exposure_pre_end)}
                  </td>
                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.exposure_main_start)}
                  </td>
                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.exposure_main_end)}
                  </td>

                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.createdat)}
                  </td>
                  <td className="p-3.5 border-b text-center">
                    {formatDate(e.updatedat)}
                  </td>

                  <td className="p-3.5 border-b text-center">
                    <Link
                      to={`/events/${e.id}`}
                      className="text-cyan-400 underline font-semibold"
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="font-small text-gray-600">
          Showing <b>{rangeStart}</b> - <b>{rangeEnd}</b> of <b>{totalItems}</b>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="px-3 py-1 bg-cyan-400 rounded hover:bg-cyan-500 transition disabled:bg-cyan-200 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Prev
          </button>

          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= totalItems}
            className="px-3 py-1 bg-cyan-400 rounded hover:bg-cyan-500 transition disabled:bg-cyan-200 disabled:cursor-not-allowed"
          >
            Next <ArrowRight size={16} />
          </button>
        </div>

        <div className="font-small text-gray-600">
          Page <b>{currentPage}</b> of <b>{totalPages}</b>
        </div>
      </div>
    </div>
  );
}
