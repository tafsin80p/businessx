import mongoose from 'mongoose';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Business } from '../src/models/Business';

// Load .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

async function testDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB!');

    const emailToInsert = 'hello@businessx.com';

    // Check if it already exists
    let business = await Business.findOne({ email: emailToInsert });
    if (business) {
      console.log(`ℹ️ Email ${emailToInsert} already exists in the database.`);
    } else {
      console.log('📝 Creating new email entry...');
      business = await Business.create({
        name: 'BusinessX',
        email: emailToInsert
      });
      console.log(`✅ Successfully added ${emailToInsert} to the database!`);
      console.log('Document Details:', business);
    }

  } catch (error) {
    console.error('❌ Error connecting to MongoDB or saving data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
    process.exit(0);
  }
}

testDatabase();
