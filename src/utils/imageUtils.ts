/**
 * Yardımcı Görsel Fonksiyonları
 * Proje, Etkinlik ve Haberlerde hem tek görsel (eski kayıtlar) hem de çoklu görsel (yeni kayıtlar)
 * desteklemek için JSON veya virgülle ayrılmış URL yapılarını ayrıştırır.
 */

export function parseImageUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];

  // JSON dizi formatı kontrolü: ["url1", "url2"]
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
      }
    } catch {
      // JSON parse başarısız olursa aşağıya devam et
    }
  }

  // Virgülle ayrılmış format kontrolü (data:image base64 değilse)
  if (trimmed.includes(',') && !trimmed.startsWith('data:image')) {
    return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
  }

  // Tekil URL
  return [trimmed];
}

export function getFirstImageUrl(raw: string | null | undefined, fallback = ''): string {
  const urls = parseImageUrls(raw);
  return urls.length > 0 ? urls[0] : fallback;
}

export function formatImageUrls(urls: string[]): string {
  const cleaned = urls.map((u) => u.trim()).filter(Boolean);
  if (cleaned.length === 0) return '';
  if (cleaned.length === 1) return cleaned[0];
  return JSON.stringify(cleaned);
}
