import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

export const register = async (req, res) => {
  const { name, email, password, role = 'user', mobile } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    // Check if user exists
    const { data: existing, error: existingError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected
      throw existingError;
    }

    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // Create new user
    const password_hash = await bcrypt.hash(password, saltRounds);
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash, role, mobile }])
      .select()
      .single();

    if (error) throw error;

    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
    
    res.json({
      token,
      user: { id: data.id, email: data.email, name: data.name, role: data.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle here too

    if (error) throw error;
    if (!data) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, data.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );
    
    res.json({
      token,
      user: { id: data.id, email: data.email, name: data.name, role: data.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};
