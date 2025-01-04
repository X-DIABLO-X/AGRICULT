import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

const SUPABASE_URL = 'https://pojuqqnftsunpiutlyrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvanVxcW5mdHN1bnBpdXRseXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODAwOTIsImV4cCI6MjA1MDI1NjA5Mn0.0QASIiNcOib_pClL7XMi45_MoK3cMNjLbmvfhp982UQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const uploadImages = async (base64DataArray) => {
  try {
    console.log('Starting Base64 image upload...');

    // Process each base64 string in the array
    const uploadPromises = base64DataArray.map(async (base64Data) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const uniqueFileName = `uploaded_image_${timestamp}_${randomString}.jpg`;

      console.log('Uploading image to Supabase...');

      // Upload the base64 data directly
      const { data, error } = await supabase.storage
        .from('images/PRODUCT')
        .upload(uniqueFileName, decode(base64Data), {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Image uploaded to Supabase:', data);

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('images/PRODUCT')
        .getPublicUrl(uniqueFileName);

      return publicUrlData.publicUrl;
    });

    // Wait for all uploads to complete
    const urls = await Promise.all(uploadPromises);
    console.log('All images uploaded, URLs:', urls);

    return urls;
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};