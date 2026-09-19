import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadToSupabase = async (file: File, bucket: string = 'tdb-gallery'): Promise<string> => {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase bağlantı ayarları (URL veya Key) eksik. Lütfen .env dosyanızı veya Vercel ayarlarınızı kontrol edin.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error('Görsel yüklenirken Supabase tarafında hata oluştu.');
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return publicUrlData.publicUrl;
};
