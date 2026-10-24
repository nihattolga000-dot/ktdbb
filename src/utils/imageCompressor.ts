/**
 * Tarayıcı tarafında görselleri sıkıştıran ve WebP/JPEG formatında Base64 Data URL'e dönüştüren yardımcı fonksiyon.
 * Canlı sunucularda (Vercel Serverless vb.) dosya boyutu sınırlarını aşmamak ve hızlı yükleme sağlamak için
 * görseli maksimum 1200x1200 boyutlarına ve ~%82 kaliteye ölçeklendirir.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Görsel değilse hata ver
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Lütfen geçerli bir görsel dosyası seçin (PNG, JPG, WEBP vb.).'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Görsel dosyası okunamadı.'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Görsel yüklenemedi veya bozuk.'));
      img.onload = () => {
        let { width, height } = img;

        // En boy oranını koruyarak yeniden boyutlandır
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Canvas 2D desteklenmiyorsa orijinal base64'ü döndür
          return resolve(readerEvent.target?.result as string);
        }

        // Yumuşak ölçekleme
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // WebP formatı destekleniyorsa webp, yoksa jpeg
        try {
          const webpDataUrl = canvas.toDataURL('image/webp', quality);
          if (webpDataUrl.startsWith('data:image/webp')) {
            return resolve(webpDataUrl);
          }
        } catch {
          // fallback
        }

        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(jpegDataUrl);
      };

      img.src = readerEvent.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
