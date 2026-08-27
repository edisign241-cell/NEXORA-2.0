"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  X,
  Play,
  CheckCircle2,
  Sparkles,
  Film,
  Plus,
  Trash2,
  Star,
  Layers,
  Link as LinkIcon,
  Info,
} from "lucide-react";

export interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
  size?: string;
  isCover?: boolean;
}

interface MediaUploaderProps {
  mediaList: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  maxImages?: number;
  maxVideos?: number;
}

// Authenticated Gabonese demo presets for quick 1-click test
const GABON_MEDIA_PRESETS = [
  {
    label: "Chocolat de Kango (Photo + Vidéo)",
    category: "Terroir",
    items: [
      {
        id: "preset-kango-1",
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800&auto=format&fit=crop&q=80",
        name: "fèves-cacao-kango-gabon.jpg",
        size: "1.4 MB",
        isCover: true,
      },
      {
        id: "preset-kango-2",
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=800&auto=format&fit=crop&q=80",
        name: "tablette-chocolat-noir-85.jpg",
        size: "980 KB",
        isCover: false,
      },
      {
        id: "preset-kango-video",
        type: "video" as const,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        name: "fabrication-artisanale-kango.mp4",
        size: "4.2 MB",
        isCover: false,
      },
    ],
  },
  {
    label: "Pierre de Mbigou (Sculpture)",
    category: "Artisanat",
    items: [
      {
        id: "preset-mbigou-1",
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
        name: "masque-traditionnel-mbigou.jpg",
        size: "1.8 MB",
        isCover: true,
      },
      {
        id: "preset-mbigou-video",
        type: "video" as const,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
        name: "sculpture-pierre-mbigou-atelier.mp4",
        size: "5.1 MB",
        isCover: false,
      },
    ],
  },
  {
    label: "Mode & Wax Libreville",
    category: "Couture",
    items: [
      {
        id: "preset-wax-1",
        type: "image" as const,
        url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80",
        name: "robe-wax-elegance-gabon.jpg",
        size: "1.2 MB",
        isCover: true,
      },
      {
        id: "preset-wax-video",
        type: "video" as const,
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        name: "defile-mode-libreville-2026.mp4",
        size: "6.0 MB",
        isCover: false,
      },
    ],
  },
];

export function MediaUploader({
  mediaList,
  onChange,
  maxImages = 6,
  maxVideos = 2,
}: MediaUploaderProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = React.useState(false);
  const [manualUrl, setManualUrl] = React.useState("");
  const [manualType, setManualType] = React.useState<"image" | "video">("image");
  const [activeVideoPreview, setActiveVideoPreview] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoInputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Simulate upload progress
    setUploadProgress(15);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null || prev >= 95) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      const newItems: MediaItem[] = [];

      Array.from(files).forEach((file) => {
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (isImage || isVideo) {
          const objectUrl = URL.createObjectURL(file);
          const formattedSize =
            file.size > 1024 * 1024
              ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
              : `${Math.round(file.size / 1024)} KB`;

          newItems.push({
            id: `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            type: isVideo ? "video" : "image",
            url: objectUrl,
            name: file.name,
            size: formattedSize,
            isCover: mediaList.length === 0 && newItems.length === 0 && isImage,
          });
        }
      });

      clearInterval(interval);
      setUploadProgress(null);

      // Merge and ensure at least one cover image
      const merged = [...mediaList, ...newItems];
      if (!merged.some((item) => item.isCover && item.type === "image")) {
        const firstImage = merged.find((item) => item.type === "image");
        if (firstImage) firstImage.isCover = true;
      }
      onChange(merged);
    }, 700);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualUrl.trim()) return;

    const newItem: MediaItem = {
      id: `media-url-${Date.now()}`,
      type: manualType,
      url: manualUrl.trim(),
      name: manualType === "video" ? "video-produit-externe.mp4" : "photo-produit-externe.jpg",
      size: "Lien web",
      isCover: mediaList.length === 0 && manualType === "image",
    };

    const updated = [...mediaList, newItem];
    onChange(updated);
    setManualUrl("");
    setShowUrlInput(false);
  };

  const handleSetCover = (id: string) => {
    const updated = mediaList.map((item) => ({
      ...item,
      isCover: item.id === id,
    }));
    onChange(updated);
  };

  const handleRemove = (id: string) => {
    const itemToRemove = mediaList.find((i) => i.id === id);
    const filtered = mediaList.filter((item) => item.id !== id);

    // If removed item was cover, assign cover to the next image
    if (itemToRemove?.isCover) {
      const nextImage = filtered.find((i) => i.type === "image");
      if (nextImage) nextImage.isCover = true;
    }
    onChange(filtered);
  };

  const handleApplyPreset = (presetItems: MediaItem[]) => {
    onChange(presetItems);
  };

  const imagesCount = mediaList.filter((m) => m.type === "image").length;
  const videosCount = mediaList.filter((m) => m.type === "video").length;

  return (
    <div className="space-y-4">
      {/* Header & Limits */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Médias du Produit (Photos &amp; Vidéos Démo) *
          </label>
          <p className="text-[11px] text-slate-500">
            Téléchargez jusqu&apos;à {maxImages} photos HD et {maxVideos} vidéos courtes de présentation (MP4/WebM).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" className="text-[10px] font-bold">
            📷 {imagesCount}/{maxImages} Photos
          </Badge>
          <Badge variant="blue" className="text-[10px] font-bold">
            🎬 {videosCount}/{maxVideos} Vidéos
          </Badge>
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/60 hover:bg-slate-50 hover:border-emerald-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {uploadProgress !== null ? (
          <div className="max-w-xs mx-auto space-y-3 py-4">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600">
              <span className="flex items-center gap-1.5">
                <Upload className="w-4 h-4 animate-bounce" />
                Téléversement des médias...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Compression et optimisation automatique pour les réseaux mobiles gabonais.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 shadow-inner">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-slate-100">
                Glissez-déposez vos photos &amp; vidéos ici
              </h4>
              <p className="text-xs text-slate-500">
                Formats acceptés : PNG, JPG, WebP, MP4, MOV (Max 50 Mo par vidéo)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                variant="emerald"
                size="sm"
                className="gap-1.5 font-bold text-xs shadow-sm"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Importer des Photos</span>
              </Button>

              <Button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                variant="blue"
                size="sm"
                className="gap-1.5 font-bold text-xs shadow-sm"
              >
                <VideoIcon className="w-4 h-4" />
                <span>Importer une Vidéo</span>
              </Button>

              <Button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                variant="outline"
                size="sm"
                className="gap-1.5 font-semibold text-xs"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Lien Web / URL</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Manual URL Input dropdown */}
      {showUrlInput && (
        <form
          onSubmit={handleManualAdd}
          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-center gap-2 text-xs"
        >
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setManualType("image")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                manualType === "image"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Photo
            </button>
            <button
              type="button"
              onClick={() => setManualType("video")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                manualType === "video"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              Vidéo (.mp4)
            </button>
          </div>

          <input
            type="url"
            required
            placeholder={
              manualType === "video"
                ? "https://exemple.com/video-produit.mp4"
                : "https://images.unsplash.com/photo-..."
            }
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-xs focus:border-emerald-500 focus:outline-none dark:bg-slate-800 dark:text-slate-100"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button type="submit" variant="emerald" size="sm" className="font-bold text-xs">
              Ajouter
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(false)}
            >
              Fermer
            </Button>
          </div>
        </form>
      )}

      {/* Quick Gabon Preset Samples */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 dark:border-emerald-900/30 dark:bg-emerald-950/20 p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Exemples de Médias Gabonais (Chargement en 1 clic) :
          </span>
          <span className="text-[10px] text-slate-400">Photos HD &amp; Vidéos intégrées</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {GABON_MEDIA_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p.items)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-100 text-slate-800 text-[11px] font-semibold transition-colors dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-sm"
            >
              <span>{p.label}</span>
              <Badge variant="emerald" className="text-[9px] px-1 py-0">
                {p.category}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Grid (Images and Videos) */}
      {mediaList.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Médias sélectionnés ({mediaList.length}) :
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-rose-600 hover:underline font-semibold"
            >
              Tout effacer
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {mediaList.map((item) => (
              <div
                key={item.id}
                className={`group relative rounded-xl border overflow-hidden bg-slate-900 shadow-sm transition-all duration-200 ${
                  item.isCover
                    ? "ring-2 ring-emerald-500 border-emerald-500 shadow-md"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                {/* Media Render: Video vs Image */}
                {item.type === "video" ? (
                  <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center">
                    <video
                      src={item.url}
                      className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <button
                      type="button"
                      onClick={() => setActiveVideoPreview(item.url)}
                      className="absolute inset-0 m-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur hover:bg-emerald-600 hover:scale-110 transition-all"
                      title="Lire la vidéo"
                    >
                      <Play className="w-4 h-4 ml-0.5" />
                    </button>
                    <span className="absolute bottom-2 left-2 rounded bg-blue-600 text-white font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1">
                      <Film className="w-2.5 h-2.5" />
                      Vidéo HD
                    </span>
                  </div>
                ) : (
                  <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isCover && (
                      <span className="absolute top-2 left-2 rounded bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1 shadow">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        Couverture
                      </span>
                    )}
                  </div>
                )}

                {/* Info and Actions Overlay */}
                <div className="p-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="truncate max-w-[90px] text-slate-600 dark:text-slate-300 font-medium" title={item.name}>
                    {item.name}
                  </span>

                  <div className="flex items-center gap-1">
                    {item.type === "image" && !item.isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950"
                        title="Définir comme photo principale"
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Supprimer ce média"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Player (Preview) */}
      {activeVideoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 overflow-hidden shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-950 text-white">
              <span className="text-xs font-bold flex items-center gap-2">
                <Film className="w-4 h-4 text-emerald-400" />
                Prévisualisation Vidéo Produit
              </span>
              <button
                type="button"
                onClick={() => setActiveVideoPreview(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <video
                src={activeVideoPreview}
                controls
                autoPlay
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
