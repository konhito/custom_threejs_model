'use client';

import { useState } from 'react';
import { CheckCircle, Music, Upload } from 'lucide-react';
import { adminAPI } from '@/lib/api';

const ACCEPTED = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/mp4', 'video/mpeg', 'application/octet-stream'];

export default function MusicUploadPage() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState([]);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  function chooseFiles(event) {
    const selected = [...event.target.files];
    const invalid = selected.find((file) => !ACCEPTED.includes(file.type) || file.size > 20 * 1024 * 1024);
    setError(invalid ? `${invalid.name} is not a supported audio file or exceeds 20MB.` : '');
    setFiles(invalid ? [] : selected.slice(0, 40));
    setUploaded([]);
  }

  async function uploadMusic() {
    if (!files.length || isUploading) return;
    setIsUploading(true);
    setError('');
    setProgress(0);

    try {
      const body = new FormData();
      files.forEach((file) => body.append('music', file));
      const response = await adminAPI.uploadMusic(body, (event) => setProgress(Math.round(event.loaded * 100 / event.total)));
      setUploaded(response.data.files);
      setFiles([]);
    } catch (uploadError) {
      setError(uploadError.message || 'Music upload failed.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <Music className="h-7 w-7 text-emerald-700" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-950">Music library upload</h1>
          <p className="mt-1 text-sm text-gray-700">Upload up to 40 soundtrack files to the S3 National_music folder.</p>
        </div>
      </div>

      <section className="mt-8 rounded-xl border border-gray-300 bg-white p-6">
        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-gray-300 p-10 text-center transition hover:border-emerald-600 hover:bg-emerald-50">
          <Upload className="mx-auto h-10 w-10 text-emerald-700" />
          <span className="mt-3 block font-semibold text-gray-950">Choose music files</span>
          <span className="mt-1 block text-sm text-gray-700">MP3, MPEG, WAV, OGG or M4A · 20MB each</span>
          <input type="file" multiple accept=".mp3,.mpeg,.wav,.ogg,.m4a,audio/*" onChange={chooseFiles} className="sr-only" />
        </label>

        {files.length > 0 && <p className="mt-4 text-sm font-medium text-gray-800">{files.length} file{files.length === 1 ? '' : 's'} selected</p>}
        {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}

        {isUploading && <div className="mt-5"><div className="mb-2 flex justify-between text-sm font-medium text-gray-800"><span>Uploading</span><span>{progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-gray-200"><div className="h-full bg-emerald-600 transition-[width]" style={{ width: `${progress}%` }} /></div></div>}

        <button type="button" onClick={uploadMusic} disabled={!files.length || isUploading} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-gray-400">
          <Upload className="h-5 w-5" /> {isUploading ? 'Uploading…' : 'Upload music to S3'}
        </button>
      </section>

      {uploaded.length > 0 && <section className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-5"><h2 className="flex items-center gap-2 font-semibold text-emerald-900"><CheckCircle className="h-5 w-5" /> {uploaded.length} files uploaded</h2><ul className="mt-4 space-y-2">{uploaded.map((file) => <li key={file.url} className="text-sm"><a href={file.url} target="_blank" rel="noreferrer" className="break-all font-medium text-emerald-800 underline">{file.fileName}</a></li>)}</ul></section>}
    </div>
  );
}
