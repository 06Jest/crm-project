import { supabase } from "./supabase";
import type { Customer } from '../types/customer';

export const fetchCustomersFromDB = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Customer[];
};

export const addCustomerToDB = async (
  customer: Omit<Customer, 'id' | 'created_at'>
): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Customer;
};

export const updateCustomerInDB = async (
  customer: Customer
): Promise<Customer> => {
  const { data, error} = await supabase
    .from('customers')
    .update({
      name: customer.name,
      industry: customer.industry,
      website: customer.website,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      latitude: customer.latitude,
      longitude: customer.longitude,
      notes: customer.notes,
      status: customer.status,
    })
    .eq('id', customer.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Customer;
}

export const deleteCustomerFromDB = async (id: string): Promise<string> => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
  return id;
};

export const geocodeAddress = async (
  address: string
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const encoded = encodeURIComponent(address);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'uniThread/1.0 (uni.mailer1@gmail.com)',
        },
      }
    );

    const data = await response.json();

    if (data && data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    }

    return null;;
  } catch {
    return null;
  }
};