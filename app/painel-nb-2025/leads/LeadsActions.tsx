"use client";

export default function LeadsActions() {
  function handleExport() {
    window.location.href = "/api/admin/leads/export";
  }

  return (
    <button
      onClick={handleExport}
      className="text-xs uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition"
    >
      Exportar CSV
    </button>
  );
}
