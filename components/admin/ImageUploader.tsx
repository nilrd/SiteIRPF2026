"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Copy, Trash2, Check, X, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ImageItem {
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt?: string;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageUploader() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      if (res.ok) {
        const data = await res.json();
        setImages(data.images || []);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    setUploadProgress(`Preparando envio de ${file.name}...`);

    try {
      // Passo 1 — servidor gera URL assinada (request leve, sem arquivo)
      const signRes = await fetch("/api/upload/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, type: file.type }),
      });

      const signData = await signRes.json();
      if (!signRes.ok) {
        setError(signData.error || "Erro ao gerar URL de upload");
        return;
      }

      const { path, token, publicUrl } = signData as {
        path: string;
        token: string;
        publicUrl: string;
      };

      // Passo 2 — upload DIRETO ao Supabase Storage (bypassa Vercel, sem limite)
      setUploadProgress(`Enviando ${file.name}...`);

      const { error: uploadError } = await supabase.storage
        .from("imagens")
        .uploadToSignedUrl(path, token, file, { contentType: file.type });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      // Prepend na galeria
      setImages((prev) => [
        { name: path, url: publicUrl, size: file.size, type: file.type },
        ...prev,
      ]);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      // Upload sequentially if multiple
      Array.from(files).forEach((f) => uploadFile(f));
    },
    [uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const deleteImage = async (name: string) => {
    if (!confirm(`Deletar "${name}"?`)) return;
    setDeleting(name);
    try {
      const res = await fetch(`/api/upload?file=${encodeURIComponent(name)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.name !== name));
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao deletar");
      }
    } catch {
      setError("Erro de conexão ao deletar");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-[#C6FF00] bg-[#C6FF00]/5"
            : "border-white/20 hover:border-white/40"
        } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploading ? (
          <>
            <div className="w-8 h-8 border-2 border-[#C6FF00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-white/60">{uploadProgress}</p>
          </>
        ) : (
          <>
            <Upload className="w-10 h-10 mx-auto mb-4 text-white/30" />
            <p className="text-lg font-serif mb-1">
              {dragActive ? "Solte aqui" : "Arraste imagens ou clique para selecionar"}
            </p>
            <p className="text-xs text-white/40">
              JPG, PNG, WebP, GIF · máx. 10 MB por arquivo
            </p>
          </>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">
          <X className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Gallery header */}
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Galeria{" "}
          <span className="text-white/30 text-base font-sans">({images.length})</span>
        </h2>
        <button
          onClick={loadImages}
          disabled={loading}
          className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </button>
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="border border-white/10 p-12 text-center text-white/30 text-sm">
          Nenhuma imagem ainda. Faça o primeiro upload acima.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.name} className="group border border-white/10 hover:border-white/30 transition overflow-hidden">
              {/* Thumbnail */}
              <div className="aspect-square bg-white/5 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    onClick={() => copyUrl(img.url)}
                    title="Copiar URL"
                    className="p-2 bg-white/10 hover:bg-[#C6FF00] hover:text-black transition rounded-none"
                  >
                    {copiedUrl === img.url ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteImage(img.name)}
                    disabled={deleting === img.name}
                    title="Deletar"
                    className="p-2 bg-white/10 hover:bg-red-500 transition"
                  >
                    {deleting === img.name ? (
                      <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Info + URL bar */}
              <div className="p-3">
                <p className="text-xs text-white/60 truncate mb-2" title={img.name}>
                  {img.name}
                </p>
                {img.size > 0 && (
                  <p className="text-[10px] text-white/30 mb-2">{formatBytes(img.size)}</p>
                )}
                {/* URL input + copy button */}
                <div className="flex gap-1">
                  <input
                    readOnly
                    value={img.url}
                    className="flex-1 bg-white/5 border border-white/10 text-[10px] px-2 py-1 text-white/50 truncate min-w-0 outline-none focus:border-white/30"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={() => copyUrl(img.url)}
                    className="shrink-0 px-2 py-1 border border-white/10 hover:border-[#C6FF00] hover:text-[#C6FF00] transition"
                    title="Copiar URL"
                  >
                    {copiedUrl === img.url ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
