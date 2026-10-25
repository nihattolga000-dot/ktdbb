import { useState, useRef } from 'react';
import { X, Star, Loader2, Plus } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export default function MultiImageUploader({
  images,
  onChange,
  maxImages = 15,
  label = 'Görseller',
  helperText = 'Birden fazla görsel seçebilirsiniz. İlk görsel kapak fotoğrafı olarak kullanılır.',
}: MultiImageUploaderProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setError(`Maksimum ${maxImages} görsel ekleyebilirsiniz.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setProcessing(true);

    try {
      const compressedList: string[] = [];
      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImage(file);
        compressedList.push(compressed);
      }

      if (compressedList.length === 0) {
        setError('Geçerli bir görsel dosyası seçilmedi.');
      } else {
        onChange([...images, ...compressedList]);
      }
    } catch (err: any) {
      setError(err?.message || 'Görseller işlenirken bir hata oluştu.');
    } finally {
      setProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetCover = (indexToCover: number) => {
    if (indexToCover === 0) return;
    const target = images[indexToCover];
    const rest = images.filter((_, idx) => idx !== indexToCover);
    onChange([target, ...rest]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
          {label} ({images.length}/{maxImages})
        </label>
        {images.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] text-red-400 hover:text-red-300 transition-colors"
          >
            Tümünü Temizle
          </button>
        )}
      </div>

      {helperText && (
        <p className="text-xs text-neutral-400 leading-relaxed">{helperText}</p>
      )}

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-400">
          {error}
        </div>
      )}

      {/* GÖRSEL LİSTESİ VE YÜKLEME ALANI */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, idx) => {
          const isCover = idx === 0;
          return (
            <div
              key={idx}
              className={`group relative aspect-video rounded-xl overflow-hidden border bg-neutral-900 shadow-sm transition-all ${
                isCover ? 'border-[#cc1616] ring-1 ring-[#cc1616]/50' : 'border-neutral-800'
              }`}
            >
              <img
                src={img}
                alt={`Görsel ${idx + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Karartma katmanı */}
              <div className="absolute inset-0 bg-black/40 opacity-20 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Kapak Rozeti */}
              {isCover ? (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-[#cc1616] text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                  <Star size={10} className="fill-white" />
                  Kapak
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetCover(idx)}
                  className="absolute top-1.5 left-1.5 p-1 rounded-md bg-black/75 hover:bg-[#cc1616] text-white/90 hover:text-white text-[10px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow active:scale-90"
                  title="Kapak Fotoğrafı Yap"
                >
                  <Star size={12} />
                </button>
              )}

              {/* Sil Butonu */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/75 hover:bg-red-600 text-white/90 hover:text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow active:scale-90"
                title="Görseli Kaldır"
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        {/* YENİ GÖRSEL EKLEME KARTI */}
        {images.length < maxImages && (
          <label
            className={`relative aspect-video rounded-xl border-2 border-dashed border-neutral-700/80 hover:border-[#cc1616]/70 bg-neutral-900/40 hover:bg-neutral-900/70 cursor-pointer flex flex-col items-center justify-center p-3 text-center transition-all ${
              processing ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={processing}
            />
            {processing ? (
              <div className="flex flex-col items-center gap-2 text-neutral-400">
                <Loader2 size={22} className="animate-spin text-[#cc1616]" />
                <span className="text-[11px]">Görseller işleniyor...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-neutral-400 hover:text-white transition-colors">
                <div className="p-2 rounded-full bg-neutral-800 text-neutral-300">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-medium">Görsel Ekle</span>
                <span className="text-[10px] text-neutral-500">Çoklu seçim yapabilirsiniz</span>
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
