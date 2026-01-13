import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import products from "../assets/data/products.json";

export default function Products() {
  const [items, setItems] = useState(products);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch("https://api.escuelajs.co/api/v1/products?limit=12", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setItems(data))
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(err.message ?? "Failed to load products");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-slate-600">Manage your product catalog</p>
        </div>

        <Link
          to="/products/new"
          className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Add product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="text-sm text-slate-500">Loading products…</div>
        ) : error ? (
          <div className="text-sm text-red-500">Failed to load products</div>
        ) : (
          items.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="rounded-xl border bg-white p-4 hover:shadow-sm transition"
            >
              {/* Card layout */}
              <div className="flex gap-3 md:block">
                {/* Image */}
                <img
                  src={p.images?.[0] ?? "https://placehold.co/600x400"}
                  alt={p.title}
                  className="
              h-20 w-20 shrink-0 rounded-lg object-cover
              md:h-40 md:w-full
            "
                  loading="lazy"
                />

                {/* Content */}
                <div className="flex flex-1 flex-col md:mt-3">
                  {/* Title + price row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium line-clamp-1">{p.title}</div>

                    </div>

                    {/* Price */}
                    <div className="shrink-0 font-semibold">
                      ${p.price}
                    </div>
                  </div>

                  {/* Description — visible on all screens */}
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
