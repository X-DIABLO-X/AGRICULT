import { supabase } from './supabaseClient';

const insertRow = async (qty, quality, ldate, edate, dlocation, region) => {
  const { data, error } = await supabase
    .from('BUYERS')
    .insert([
      {
        "QUANTITY": qty,
        "QUALITY": quality,
        "LOADING_DATE": ldate,
        "EXPIRATION": edate,
        "PIC": {url: "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg"},
        "DELIVERY_LOCATION": dlocation,
        "REGION": region
      },
    ])
    .select();

  if (error) {
    console.error('Error inserting row:', error);
  } else {
    console.log('Row inserted:', data);
  }
};

export default insertRow;
