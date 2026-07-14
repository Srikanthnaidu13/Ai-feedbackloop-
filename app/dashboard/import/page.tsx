"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import Papa from "papaparse";

export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [rows, setRows] = useState<any[]>([]);

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [failedRows, setFailedRows] = useState<any[]>([]);

  function downloadFailedRows() {
  if (failedRows.length === 0) return;

  const csv = Papa.unparse(failedRows);

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "duplicate_rows.csv";

  link.click();

  URL.revokeObjectURL(url);
}

  const [summary, setSummary] = useState<{
  total: number;
  imported: number;
  skipped: number;
} | null>(null);

  const [error, setError] = useState("");

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files?.length) return;

    setSelectedFile(e.target.files[0]);

    setRows([]);
    setSummary(null);
    setError("");
  }

  function removeFile() {
    setSelectedFile(null);

    setRows([]);

   setSummary(null);

    setError("");
  }

  async function importCsv() {
    if (!selectedFile) return;

    setUploading(true);

    setSummary(null);

    setError("");

    Papa.parse(selectedFile, {
      header: true,

      skipEmptyLines: true,

      async complete(results) {
        try {
          const headers = (results.meta.fields ?? []).map((h) =>
  h.trim().toLowerCase()
);

const requiredColumns = [
  "content",
  "channel",
];

const missingColumns = requiredColumns.filter(
  (column) => !headers.includes(column)
);

if (missingColumns.length > 0) {
  setUploading(false);

  setError(
    `Missing required column(s): ${missingColumns.join(", ")}`
  );

  return;
}
          const parsedRows = (results.data as any[]).map((row) => ({
  content: row.content ?? row.Content,
  channel: row.channel ?? row.Channel,
  sentiment: row.sentiment ?? row.Sentiment,
  theme: row.theme ?? row.Theme,
}));

const uniqueRows = parsedRows.filter(
  (row, index, self) =>
    index ===
    self.findIndex(
      (r) =>
        r.content?.trim() === row.content?.trim() &&
        r.channel?.trim() === row.channel?.trim()
    )
);

const skippedRows = parsedRows.filter(
  (row) =>
    !uniqueRows.some(
      (u) =>
        u.content?.trim() === row.content?.trim() &&
        u.channel?.trim() === row.channel?.trim()
    )
);

setFailedRows(skippedRows);

setRows(uniqueRows);

          const response = await fetch("/api/import", {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
  rows: uniqueRows,
}),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error);
          }

          
         setSummary({
  total: parsedRows.length,
  imported: data.imported,
  skipped:
    data.skipped +
    (parsedRows.length - uniqueRows.length),
});
        } catch (err) {
          console.error(err);

          setError("Unable to import CSV.");
        } finally {
          setUploading(false);
        }
      },

      error() {
        setUploading(false);

        setError("Unable to parse CSV.");
      },
    });
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
  e.preventDefault();
  setDragActive(true);
}

function handleDragLeave(e: DragEvent<HTMLDivElement>) {
  e.preventDefault();
  setDragActive(false);
}



function handleDrop(e: DragEvent<HTMLDivElement>) {
  e.preventDefault();

  setDragActive(false);

  if (!e.dataTransfer.files.length) return;

  const file = e.dataTransfer.files[0];

  if (!file.name.endsWith(".csv")) {
    setError("Please upload a CSV file.");
    return;
  }

  setSelectedFile(file);
  setRows([]);
  setSummary(null);
  setError("");
}

  return (
    <div className="space-y-8">

      {/* Header */}

      <section>

        <h1 className="text-4xl font-bold">
          CSV Feedback Import
        </h1>

        <p className="mt-2 text-gray-400">
          Import customer feedback in bulk using a CSV file.
          Each imported feedback will automatically appear inside
          Project LOOP.
        </p>

      </section>

      {/* Upload */}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

       <div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className={`
    rounded-3xl
    border-2
    border-dashed
    p-12
    text-center
    transition-all
    duration-300
    ${
      dragActive
        ? "border-blue-500 bg-blue-500/10 scale-[1.01]"
        : "border-blue-500/30 bg-slate-900/40"
    }
  `}
>

  <div className="flex flex-col items-center">

    <div
      className={`
        mb-6
        flex
        h-20
        w-20
        items-center
        justify-center
        rounded-full
        ${
          dragActive
            ? "bg-blue-600 text-white"
            : "bg-blue-500/10 text-blue-400"
        }
      `}
    >

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

    </div>

    <h2 className="text-2xl font-semibold">
      {dragActive
        ? "Drop your CSV here"
        : "Upload CSV File"}
    </h2>

    <p className="mt-3 text-gray-400">
      Drag & drop your CSV here or click below to browse.
    </p>

    <label className="mt-8 inline-flex cursor-pointer rounded-2xl bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500">

      Browse Files

      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

    </label>

  </div>

</div>

      </section>

      {/* Selected File */}

      {selectedFile && (

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-xl font-semibold">
            Selected File
          </h2>

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900 p-5">

            <div>

              <p className="font-medium">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-sm text-gray-400">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>

            </div>

            <button
              onClick={removeFile}
              className="rounded-xl border border-red-500/20 px-5 py-2 text-red-300 hover:bg-red-500/10"
            >
              Remove
            </button>

          </div>

          <button
            onClick={importCsv}
            disabled={uploading}
            className="mt-8 rounded-2xl bg-blue-600 px-8 py-3 font-medium transition hover:bg-blue-500 disabled:opacity-50"
          >
            {uploading ? "Importing..." : "Import CSV"}
          </button>

          {summary && (

<section className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/5 p-8">

<h2 className="text-xl font-semibold">
Import Summary
</h2>

<div className="mt-6 grid gap-6 md:grid-cols-3">

<div className="rounded-2xl border border-white/10 bg-slate-900 p-6">

<p className="text-sm text-gray-400">
Total Rows
</p>

<p className="mt-3 text-4xl font-bold">
{summary.total}
</p>

</div>

<div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6">

<p className="text-sm text-green-300">
Imported
</p>

<p className="mt-3 text-4xl font-bold text-green-400">
{summary.imported}
</p>

</div>

<div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">

<p className="text-sm text-red-300">
Skipped
</p>

<p className="mt-3 text-4xl font-bold text-red-400">
{summary.skipped}
</p>

</div>

</div>

</section>

)}

{/* ADD THIS BLOCK HERE 👇 */}

{failedRows.length > 0 && (

<div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">

<h3 className="text-lg font-semibold text-yellow-300">
Duplicate Rows Detected
</h3>

<p className="mt-2 text-sm text-yellow-200">
{failedRows.length} duplicate rows were skipped.
</p>

<button
  onClick={downloadFailedRows}
  className="
    mt-5
    rounded-xl
    bg-yellow-500
    px-5
    py-2
    font-medium
    text-black
    transition
    hover:bg-yellow-400
  "
>
  Download Failed Rows
</button>

</div>

)}

{/* Error block stays below */}

{error && (

<div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">

{error}

</div>

)}

</section>
      )}

      {/* Preview */}

      {rows.length > 0 && (

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h2 className="text-2xl font-semibold">
            CSV Preview
          </h2>

          <p className="mt-2 text-gray-400">
            Showing first five records.
          </p>

          <div className="mt-6 overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-white/10">

                <tr>

                  <th className="py-3 text-left">
                    Feedback
                  </th>

                  <th className="py-3 text-left">
                    Channel
                  </th>

                </tr>

              </thead>

              <tbody>

                {rows.slice(0, 5).map((row, index) => (

                  <tr
                    key={index}
                    className="border-b border-white/5"
                  >

                    <td className="py-4">
                      {row.content}
                    </td>

                    <td className="py-4">
                      {row.channel}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </section>

      )}

    </div>
  );
}