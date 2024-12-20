import { supabase } from './supabaseClient';

const fetchRowsByUser = async (userId) => {
  const { data, error } = await supabase
    .from('BUYERS')
    .select('*') // Or specify specific columns like 'QUANTITY, QUALITY, etc.'
    .eq('user_id', userId);  // Filter by user_id column

  if (error) {
    console.error('Error fetching rows:', error);
  } else {
    console.log('Rows fetched:', data);
  }

  return data; // Return the fetched data, if needed
};

export default fetchRowsByUser;
