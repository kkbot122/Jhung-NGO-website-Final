import { supabase } from '../config/supabase.js';

export const createDonation = async (req, res) => {
  const user_id = req.user.id;
  const { campaign_id, amount, note } = req.body;
  if (!campaign_id || !amount) return res.status(400).json({ error: 'campaign_id and amount required' });

  try {
    const { data, error } = await supabase
      .from('donations')
      .insert([{ user_id, campaign_id, amount, note }])
      .select()
      .single();
    
    if (error) return res.status(500).json({ error: error.message });

    // Update campaign collected amount using RPC
    const { error: rpcError } = await supabase.rpc('increment_campaign_collected', { 
      campaign_uuid: data.campaign_id, 
      add_amount: data.amount 
    });
    
    // If RPC fails, use fallback update method
    if (rpcError) {
      console.error('RPC failed, using fallback:', rpcError);
      
      // Fallback: manually update the campaign collected amount
      const { data: campaignData, error: campaignError } = await supabase
        .from('campaigns')
        .select('collected')
        .eq('id', campaign_id)
        .single();
      
      if (!campaignError) {
        await supabase
          .from('campaigns')
          .update({ collected: Number(campaignData.collected || 0) + Number(amount) })
          .eq('id', campaign_id);
      }
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Donation creation error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const listDonations = async (req, res) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*, users(name,email), campaigns(title)')
    .order('created_at', { ascending: false });
  
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

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