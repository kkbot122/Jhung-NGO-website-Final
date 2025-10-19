import { supabase } from '../config/supabase.js';

export const getUserDonations = async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        campaigns (
          title,
          description
        )
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Get user donations error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserVolunteerApplications = async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select(`
        *,
        campaigns (
          title,
          description
        )
      `)
      .eq('user_id', user_id)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Get user volunteer applications error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, mobile, role, created_at')
      .eq('id', user_id)
      .single();

    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ error: error.message });
  }
};