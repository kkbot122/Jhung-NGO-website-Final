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

// UPDATED: createCampaign with image upload support
export const createCampaign = async (req, res) => {
  try {
    console.log('=== CREATE CAMPAIGN START ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    const { title, description, goal, start_date, end_date, category } = req.body;
    const created_by = req.user.id;

    // Validation
    if (!title || !description || !goal) {
      return res.status(400).json({ error: 'Title, description, and goal are required' });
    }

    let imageUrl = null;

    // Handle image upload - FIXED VERSION
    if (req.files && req.files.length > 0) {
      console.log('Files received:', req.files.length, 'files');
      
      // Since we're using upload.any(), all files are in req.files array
      // Find the first image file (there might be duplicates due to the double upload issue)
      const imageFile = req.files[0]; // Take the first file
      
      if (imageFile && imageFile.mimetype.startsWith('image/')) {
        console.log('Processing image file:', imageFile.originalname);
        
        try {
          const fileName = `campaigns/${Date.now()}-${imageFile.originalname}`;
          
          console.log('Uploading to Supabase storage...');
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('campaign-images')
            .upload(fileName, imageFile.buffer, {
              contentType: imageFile.mimetype,
              upsert: false
            });

          if (uploadError) {
            console.error('❌ Supabase storage upload error:', uploadError);
            // Don't throw, just continue without image
          } else {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('campaign-images')
              .getPublicUrl(fileName);

            imageUrl = publicUrl;
            console.log('✅ Image uploaded successfully. URL:', imageUrl);
          }
          
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          // Continue without image
        }
      }
    } else {
      console.log('No files uploaded');
    }

    // Prepare campaign data
    const campaignData = {
      title: title.trim(),
      description: description.trim(),
      goal: parseFloat(goal),
      collected: 0,
      category: (category && category.trim()) || 'General',
      created_by,
      start_date: start_date || new Date().toISOString().split('T')[0],
      image_url: imageUrl // This should now have the URL
    };

    if (end_date && end_date.trim() !== '') {
      campaignData.end_date = end_date;
    }

    console.log('Creating campaign with data:', campaignData);

    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single();

    if (error) throw error;
    
    console.log('✅ Campaign created successfully with image URL:', data.image_url);
    res.status(201).json(data);
    
  } catch (error) {
    console.error('❌ Create campaign error:', error);
    res.status(500).json({ error: error.message });
  }
};