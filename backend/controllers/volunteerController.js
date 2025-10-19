import { supabase } from '../config/supabase.js';

export const applyVolunteer = async (req, res) => {
  const user_id = req.user.id; // This comes from the authenticate middleware
  const { campaign_id, message } = req.body;
  
  if (!campaign_id) {
    return res.status(400).json({ error: 'campaign_id required' });
  }

  try {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([{ 
        user_id, 
        campaign_id, 
        message,
        status: 'pending' // Set default status
      }])
      .select(`
        *,
        campaigns (
          title
        )
      `)
      .single();

    if (error) throw error;
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Volunteer application error:', error);
    res.status(500).json({ error: error.message });
  }
};
export const listApplications = async (req, res) => {
  // admin only route
  const { data, error } = await supabase.from('volunteers').select('*, users(name,email,mobile), campaigns(title)').order('applied_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getUserApplications = async (req, res) => {
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
