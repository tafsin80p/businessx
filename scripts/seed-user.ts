import mongoose from 'mongoose';
import * as path from 'path';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function createDummyUser() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected to MongoDB');

  const email = 'hello@businessx.com';
  const password = 'password123';

  let user = await User.findOne({ email });
  if (user) {
    console.log('User already exists, updating password...');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name: 'Admin', email, password: hashedPassword });
  }

  console.log(`✅ User ${email} created/updated with password: ${password}`);
  process.exit(0);
}

createDummyUser();
