import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData, useNavigate, useSearchParams, Form } from "react-router";
import { Link } from "react-router";
import { authenticate } from "../shopify.server";
import { listRegistrations } from "../models/registration.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const query = url.searchParams.get("q") || "";
  const sort = (url.searchParams.get("sort") || "desc") as "asc" | "desc";

  const result = await listRegistrations({
    page,
    query,
    sort,
    perPage: 25,
    shop: session.shop,
  });
  return { ...result, query, sort };
};

export const headers: HeadersFunction = (headersArgs) =>
  boundary.headers(headersArgs);

type LoaderData = Awaited<ReturnType<typeof loader>>;

import type { CSSProperties } from "react";

const statusStyle = (status: string | undefined): CSSProperties => ({
  display: "inline-block",
  padding: "2px 10px",
  borderRadius: "999px",
  background: status === "uploaded" ? "#d1fae5" : "#f3f4f6",
  color: status === "uploaded" ? "#065f46" : "#6b7280",
  fontSize: "12px",
  fontWeight: 600,
});

const statusLabel = (status: string | undefined) =>
  status === "uploaded" ? "Report uploaded" : "Pending";

export default function RegistrationsIndex() {
  const { items, total, page, totalPages, query, sort } =
    useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();

  const buildSearch = (overrides: Record<string, string>) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sort !== "desc") params.set("sort", sort);
    params.set("page", String(page));
    for (const [k, v] of Object.entries(overrides)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    return `?${params.toString()}`;
  };

  return (
    <s-page heading="Kit Registrations">
      <s-section>
        {/* Filters */}
        <Form method="get" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
          <input
            name="q"
            defaultValue={query}
            placeholder="Search name, email, order #, kit #…"
            style={{
              flex: "1 1 260px",
              minHeight: "38px",
              padding: "0 12px",
              borderRadius: "10px",
              border: "1px solid rgba(15,23,42,0.2)",
              fontSize: "14px",
            }}
          />
          <select
            name="sort"
            defaultValue={sort}
            style={{
              minHeight: "38px",
              padding: "0 12px",
              borderRadius: "10px",
              border: "1px solid rgba(15,23,42,0.2)",
              fontSize: "14px",
              background: "#fff",
            }}
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
          <input type="hidden" name="page" value="1" />
          <button
            type="submit"
            style={{
              minHeight: "38px",
              padding: "0 18px",
              border: 0,
              borderRadius: "10px",
              background: "#111827",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Search
          </button>
          {query && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              style={{
                minHeight: "38px",
                padding: "0 14px",
                border: "1px solid rgba(15,23,42,0.2)",
                borderRadius: "10px",
                background: "#fff",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </Form>

        {/* Table */}
        <div>
          <table style={{ width: "100%", tableLayout: "fixed", borderCollapse: "collapse", fontSize: "14px" }}>
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "22%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "6%" }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: "2px solid #e5e7eb", textAlign: "left" }}>
                {["Customer", "Contact", "Order / Kit", "Shopify IDs", "Status", "Date", ""].map(
                  (h) => (
                    <th
                      key={h}
                      style={{ padding: "10px 12px", fontWeight: 600, color: "#374151" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#9ca3af" }}>
                    No registrations found.
                  </td>
                </tr>
              ) : (
                items.map((reg) => (
                  <tr
                    key={reg.id}
                    style={{ borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}
                    onClick={() => navigate(`/app/registrations/${reg.id}`)}
                  >
                    <td style={{ padding: "12px", fontWeight: 600, wordBreak: "break-word" }}>{reg.name}</td>
                    <td style={{ padding: "12px", color: "#6b7280", wordBreak: "break-word" }}>{reg.email}</td>
                    <td style={{ padding: "12px", wordBreak: "break-word" }}>
                      <div style={{ fontWeight: 600, color: "#111827" }}>#{reg.orderNumber}</div>
                      <div style={{ marginTop: "2px", color: "#6b7280", fontFamily: "monospace", fontSize: "12px" }}>
                        {reg.kitRegistrationNumber}
                      </div>
                    </td>
                    <td style={{ padding: "12px", color: "#6b7280", wordBreak: "break-word" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "12px" }}>O: {reg.shopifyOrderId || "-"}</div>
                      <div style={{ marginTop: "2px", fontFamily: "monospace", fontSize: "12px" }}>
                        C: {reg.shopifyCustomerId || "-"}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={statusStyle(reg.report?.status)}>
                        {statusLabel(reg.report?.status)}
                      </span>
                    </td>
                    <td style={{ padding: "12px", color: "#9ca3af", fontSize: "13px" }}>
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <Link
                        to={`/app/registrations/${reg.id}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "30px",
                          padding: "0 10px",
                          borderRadius: "8px",
                          border: "1px solid rgba(15,23,42,0.14)",
                          color: "#111827",
                          fontWeight: 600,
                          textDecoration: "none",
                          fontSize: "13px",
                        }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px", flexWrap: "wrap" }}>
            {page > 1 && (
              <a
                href={buildSearch({ page: String(page - 1) })}
                style={{ padding: "6px 14px", border: "1px solid #e5e7eb", borderRadius: "8px", textDecoration: "none", color: "#374151", fontSize: "14px" }}
              >
                ← Prev
              </a>
            )}
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <a
                  key={p}
                  href={buildSearch({ page: String(p) })}
                  style={{
                    padding: "6px 14px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "14px",
                    background: p === page ? "#111827" : "#fff",
                    color: p === page ? "#fff" : "#374151",
                    fontWeight: p === page ? 600 : 400,
                  }}
                >
                  {p}
                </a>
              );
            })}
            {page < totalPages && (
              <a
                href={buildSearch({ page: String(page + 1) })}
                style={{ padding: "6px 14px", border: "1px solid #e5e7eb", borderRadius: "8px", textDecoration: "none", color: "#374151", fontSize: "14px" }}
              >
                Next →
              </a>
            )}
          </div>
        )}

        <p style={{ marginTop: "16px", color: "#9ca3af", fontSize: "13px", textAlign: "center" }}>
          {total} registration{total !== 1 ? "s" : ""} total
          {query ? ` matching "${query}"` : ""}
        </p>
      </s-section>
    </s-page>
  );
}



