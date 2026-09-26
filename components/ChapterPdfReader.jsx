"use client";

import { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

function linesFrom(items) {
  const lines = [];
  for (const item of items) {
    const value = item.str?.trim();
    if (!value) continue;
    const y = Math.round(item.transform[5]);
    const line = lines.findLast((entry) => Math.abs(entry.y - y) < 3);
    if (line) line.text += `${item.hasEOL ? "\n" : " "}${value}`;
    else lines.push({ y, text: value });
  }
  const readable = lines.map((line) => ({ ...line, text: line.text.replace(/\s+\n/g, "\n").trim() })).filter((line) => line.text && !/^\d+$/.test(line.text));
  return readable.map((line, index) => {
    const next = readable[index + 1];
    if (!next) return line.text;
    return `${line.text}${Math.abs(line.y - next.y) > 38 ? "\n\n" : " "}`;
  }).join("");
}

export default function ChapterPdfReader({ file, title, summary, content }) {
  const [text, setText] = useState(content || "");
  const [artwork, setArtwork] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const task = pdfjs.getDocument({ url: file });
    task.promise.then(async (pdfDocument) => {
      const renderArtwork = async (pageNumber) => {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
        return canvas.toDataURL("image/png");
      };
      const [opening, ending] = await Promise.all([renderArtwork(1), renderArtwork(pdfDocument.numPages)]);
      const sections = content ? [content] : [];
      if (!content) {
        for (let index = 1; index <= pdfDocument.numPages; index += 1) {
          const page = await pdfDocument.getPage(index);
          const section = linesFrom((await page.getTextContent()).items);
          if (section) sections.push(section);
        }
      }
      if (!cancelled) { setArtwork({ opening, ending }); setText(sections.join("\n\n")); }
    }).catch(() => !cancelled && setError("This chapter could not be prepared for reading. Please try again."));
    return () => { cancelled = true; task.destroy(); };
  }, [content, file]);

  if (error) return <p role="alert" className="mx-auto grid min-h-[50vh] max-w-2xl place-items-center p-8 text-center text-sm text-red-700">{error}</p>;
  if (!text) return <div className="grid min-h-[58vh] place-items-center p-8 text-sm text-stone-500">Preparing your chapter…</div>;

  const extractedText = text.replace(/^.*?Capítulo\s+\d+\s*/s, "");
  const readingText = extractedText.startsWith(title) ? extractedText.slice(title.length).trim() : extractedText;
  return <article className="px-5 py-14 sm:px-10 sm:py-20">
    <div className="mx-auto max-w-[42rem]">
      {artwork && <img src={artwork.opening} alt={`Opening artwork for ${title}`} className="mx-auto mb-14 max-h-[72svh] max-w-full w-auto" />}
      <p className="text-sm font-semibold text-amber-800">Tomo I · Nahiara</p>
      <h1 className="mt-4 font-serif text-4xl leading-[1.05] text-stone-950 sm:text-6xl">{title}</h1>
      {summary && <p className="mt-5 text-lg leading-relaxed text-stone-700">{summary}</p>}
      <div className="my-10 h-px bg-stone-300" />
      <div className="space-y-6 font-serif text-[1.125rem] leading-8 text-stone-900 sm:text-xl sm:leading-9">
        {readingText.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      {artwork && <img src={artwork.ending} alt={`Closing artwork for ${title}`} className="mx-auto mt-16 max-h-[72svh] max-w-full w-auto" />}
    </div>
  </article>;
}
