import { supabase } from '../config/supabase.js';

export const listCampaigns = async (req, res) => {
  const { data, error } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// export const createCampaign = async (req, res) => {
//   const { title, description, goal, start_date, end_date } = req.body;
//   const created_by = req.user.id;
//   const { data, error } = await supabase.from('campaigns').insert([{ title, description, goal, start_date, end_date, created_by }]).select().single();
//   if (error) return res.status(500).json({ error: error.message });
//   res.status(201).json(data);
// };

export const getCampaign = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
};

export const updateCampaign = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { data, error } = await supabase.from('campaigns')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error || !data) return res.status(404).json({ error: 'Update failed or campaign not found' });
  res.json(data);
};

export const deleteCampaign = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('campaigns')
    .delete()
    .eq('id', id)
    .select();
  if (error) return res.status(500).json({ error: error.message });
  if (!data || data.length === 0) return res.status(404).json({ error: 'Campaign not found' });
  res.json({ message: 'Campaign deleted successfully' });
};

export const createCampaign = async (req, res) => {
  const { title, description, goal, start_date, end_date, category } = req.body;
  const created_by = req.user.id;

  // Validation
  if (!title || !description || !goal) {
    return res.status(400).json({ error: 'Title, description, and goal are required' });
  }

  // Validate goal is a positive number
  if (isNaN(goal) || parseFloat(goal) <= 0) {
    return res.status(400).json({ error: 'Goal must be a positive number' });
  }

  try {
    // Prepare campaign data
    const campaignData = {
      title: title.trim(), 
      description: description.trim(), 
      goal: parseFloat(goal),
      collected: 0,
      category: (category && category.trim()) || 'General',
      created_by,
      start_date: start_date || new Date().toISOString().split('T')[0] // Default to today
    };

    // Only add end_date if it's provided and valid
    if (end_date && end_date.trim() !== '') {
      // Validate date format (basic check)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(end_date)) {
        return res.status(400).json({ error: 'End date must be in YYYY-MM-DD format' });
      }
      campaignData.end_date = end_date;
    }

    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    res.status(201).json(data);
  } catch (error) {
    console.error('Create campaign error:', error);
    
    // More specific error messages
    if (error.message.includes('invalid input syntax for type date')) {
      res.status(400).json({ error: 'Invalid date format. Please use YYYY-MM-DD format.' });
    } else if (error.message.includes('value too long')) {
      res.status(400).json({ error: 'Text fields are too long. Please shorten your input.' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};