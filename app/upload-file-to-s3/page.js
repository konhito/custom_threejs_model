"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronLeft,
  Clipboard,
  ExternalLink,
  FileArchive,
  Loader2,
  UploadCloud,
} from "lucide-react";
import { getAssetUploadPresignedUrl } from "../actions/upload";

const folderOptions = [
  { value: "assets", label: "General assets" },
  { value: "models", label: "3D models / GLB" },
  { value: "audio", label: "Music / audio" },
  { value: "video", label: "Video" },
  { value: "documents", label: "Documents" },
  { value: "images", label: "Images" },
];

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function snippetsFor(url, file) {
  const type = file?.type || "";
  const name = file?.name || "asset";
  const lowerName = name.toLowerCase();

  if (type.startsWith("image/")) {
    return [`<img src="${url}" alt="${name}" />`, `const assetUrl = "${url}";`];
  }

  if (type.startsWith("audio/")) {
    return [`<audio controls src="${url}"></audio>`, `const audioSrc = "${url}";`];
  }

  if (type.startsWith("video/")) {
    return [`<video controls src="${url}"></video>`, `const videoSrc = "${url}";`];
  }

  if (lowerName.endsWith(".glb") || lowerName.endsWith(".gltf")) {
    return [
      `const glbPath = "${url}";`,
      `const proxiedGlbPath = "/api/glb-proxy?url=" + encodeURIComponent("${url}");`,
    ];
  }

  return [`<a href="${url}">${name}</a>`, `const assetUrl = "${url}";`];
}

export default function UploadFileToS3Page() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("assets");
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const pickFile = (nextFile) => {
    setFile(nextFile);
    setResult(null);
    setError("");
    setCopied("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    setStatus("uploading");
    setProgress(0);
    setError("");
    setResult(null);

    try {
      const presign = await getAssetUploadPresignedUrl(
        file.name,
        file.type || "application/octet-stream",
        folder
      );

      if (!presign.success || !presign.url) {
        throw new Error(presign.error || "No secure upload URL returned from server.");
      }

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else reject(new Error(`S3 upload failed with status ${xhr.status}.`));
        });

        xhr.addEventListener("error", () => reject(new Error("Network error during upload.")));
        xhr.open("PUT", presign.url);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.send(file);
      });

      setStatus("success");
      setProgress(100);
      setResult({
        publicUrl: presign.publicUrl || `https://aquamundi-glb-models.s3.ap-south-1.amazonaws.com/${presign.key}`,
        key: presign.key,
      });
    } catch (uploadError) {
      setStatus("error");
      setError(uploadError.message || "Upload failed.");
    }
  };

  const copyText = async (label, value) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
          className="inline-flex items-center gap-1 text-sm font-semibold text-slate-300 transition hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
          Close
        </button>
        <Link href="/" className="text-sm font-semibold text-emerald-300 underline decoration-emerald-500/60 underline-offset-4">
          Home
        </Link>
      </div>

      <section className="mx-auto mt-8 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="bg-slate-950 p-8 text-slate-100 md:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
            <FileArchive className="h-7 w-7" />
          </div>
          <h1 className="mt-7 max-w-md text-4xl font-semibold leading-tight tracking-[-0.03em] text-white md:text-5xl">
            Upload file to S3 and get link
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
            Upload heavier runtime assets such as GLB models, music, videos, documents, and image batches to S3 instead of shipping them from the Vercel public folder.
          </p>
          <div className="mt-8 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-50">
            For GLB files, copy the proxied snippet when a Three.js loader needs the existing local proxy route.
          </div>
        </aside>

        <div className="p-6 md:p-10">
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-100">S3 folder</label>
              <select
                value={folder}
                onChange={(event) => setFolder(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
              >
                {folderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                if (event.dataTransfer.files?.[0]) pickFile(event.dataTransfer.files[0]);
              }}
              className="flex min-h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 p-8 text-center transition hover:border-emerald-400 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
            >
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(event) => event.target.files?.[0] && pickFile(event.target.files[0])}
              />
              <UploadCloud className="h-10 w-10 text-emerald-300" />
              <span className="mt-4 text-base font-semibold text-white">
                {file ? file.name : "Choose a file or drop it here"}
              </span>
              <span className="mt-2 text-sm text-slate-400">
                {file ? `${file.type || "Unknown type"} - ${formatBytes(file.size)}` : "Any file type is accepted"}
              </span>
            </button>

            {status === "uploading" && (
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-200">
                  <span>Uploading</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            {error && <p className="rounded-xl bg-rose-950 px-4 py-3 text-sm font-medium text-rose-100 ring-1 ring-rose-800">{error}</p>}

            <button
              type="submit"
              disabled={!file || status === "uploading"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {status === "uploading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
              Upload to S3
            </button>
          </form>

          {result && (
            <section className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5">
              <div className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle className="h-5 w-5" />
                Uploaded
              </div>
              <p className="mt-3 break-all rounded-lg bg-slate-950 p-3 text-sm text-slate-100">{result.publicUrl}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => copyText("url", result.publicUrl)} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-emerald-400/30 transition hover:bg-slate-800">
                  <Clipboard className="h-4 w-4" />
                  {copied === "url" ? "Copied" : "Copy URL"}
                </button>
                <a href={result.publicUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-emerald-400/30 transition hover:bg-slate-800">
                  <ExternalLink className="h-4 w-4" />
                  Open
                </a>
              </div>
              <div className="mt-5 space-y-3">
                {snippetsFor(result.publicUrl, file).map((snippet, index) => (
                  <button
                    key={snippet}
                    type="button"
                    onClick={() => copyText(`snippet-${index}`, snippet)}
                    className="block w-full rounded-lg bg-slate-950 p-3 text-left font-mono text-xs text-slate-100 ring-1 ring-emerald-400/30 transition hover:bg-slate-800"
                  >
                    {snippet}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
