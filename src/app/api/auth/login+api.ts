import { ExpoRequest } from 'expo-router/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectToDatabase from '../../../lib/db';
import { User } from '../../../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_businessx_key_2026';

export async function POST(req: ExpoRequest) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return Response.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return Response.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
