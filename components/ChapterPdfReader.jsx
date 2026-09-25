"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Minus, Plus } from "lucide-react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

export default function ChapterPdfReader({ file, title }) {
  const canvasRef = useRef(null);
  const documentRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const task = pdfjs.getDocument(file);

    task.promise.then((document) => {
      if (cancelled) return;
      documentRef.current = document;
      setPageCount(document.numPages);
      setPageNumber(1);
    }).catch(() => {
      if (!cancelled) setError("This chapter could not be opened. Please try again.");
    });

    return () => {
      cancelled = true;
      documentRef.current?.destroy();
      documentRef.current = null;
    };
  }, [file]);

  useEffect(() => {
    const render = async () => {
      const document = documentRef.current;
      const canvas = canvasRef.current;
      if (!document || !canvas) return;
      const page = await document.getPage(pageNumber);
      const viewport = page.getViewport({ scale });
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(viewport.width * pixelRatio);
      canvas.height = Math.floor(viewport.height * pixelRatio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      const context = canvas.getContext("2d");
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      await page.render({ canvasContext: context, viewport }).promise;
    };

    render().catch(() => setError("This page could not be rendered. Please try again."));
  }, [pageNumber, pageCount, scale]);

  const changePage = (delta) => setPageNumber((current) => Math.min(pageCount, Math.max(1, current + delta)));
  const changeScale = (delta) => setScale((current) => Math.min(1.5, Math.max(0.75, Number((current + delta).toFixed(2)))));

  if (error) return <p role="alert" className="grid min-h-[50vh] place-items-center p-8 text-center text-sm text-red-700">{error}</p>;

  return <div className="flex min-h-[65vh] flex-col bg-stone-950">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-stone-900 px-4 py-3 text-sm text-white">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => changePage(-1)} disabled={pageNumber <= 1} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-35" aria-label="Previous page"><ChevronLeft size={18}/></button>
        <span className="min-w-20 text-center tabular-nums">{pageNumber} / {pageCount || "–"}</span>
        <button type="button" onClick={() => changePage(1)} disabled={!pageCount || pageNumber >= pageCount} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-35" aria-label="Next page"><ChevronRight size={18}/></button>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => changeScale(-0.25)} disabled={scale <= 0.75} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-35" aria-label="Zoom out"><Minus size={17}/></button>
        <span className="w-12 text-center tabular-nums">{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => changeScale(0.25)} disabled={scale >= 1.5} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10 disabled:opacity-35" aria-label="Zoom in"><Plus size={17}/></button>
        <a href={file} download={title || "chapter"} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-white/10" aria-label="Download chapter"><Download size={17}/></a>
      </div>
    </div>
    <div className="flex flex-1 items-start justify-center overflow-auto p-5 sm:p-8">
      <canvas ref={canvasRef} className="h-auto max-w-full bg-white shadow-[0_8px_18px_rgba(0,0,0,0.45)]" />
    </div>
  </div>;
}
