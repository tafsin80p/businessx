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
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    return Response.json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });
  } catch (error) {
    console.error('Register Error:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
