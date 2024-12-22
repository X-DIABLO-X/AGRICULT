import { supabase } from './supabaseClient';

const insertRow = async (userName, fullName, email, password, phoneNumber, businessName, location) => {
  const { data, error } = await supabase
    .from('BUYERS')
    .insert([
      {
        "userName": userName, 
        "fullName": fullName, 
        "email": email, 
        "password": password, 
        "phoneNumber": phoneNumber, 
        "businessName": businessName, 
        "location": location
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
