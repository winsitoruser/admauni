import { User, AlumniProfile } from '../models/index.js';
import bcrypt from 'bcryptjs';

async function createDemoUsers() {
  try {
    console.log('Creating demo users...');

    const salt = await bcrypt.genSalt(10);

    const alumniUser = await User.findOne({ where: { email: 'alumni@admauni.ac.id' } });
    if (!alumniUser) {
      const alumni = await User.create({
        email: 'alumni@admauni.ac.id',
        password: await bcrypt.hash('password123', salt),
        nim: '2019001',
        fullName: 'John Doe Alumni',
        role: 'alumni',
        isVerified: true,
        isActive: true
      });

      await AlumniProfile.create({
        userId: alumni.id,
        major: 'Teknik Informatika',
        faculty: 'Teknik',
        graduationYear: 2023,
        phone: '081234567890',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        currentJob: 'Software Engineer',
        currentCompany: 'Tech Company',
        currentPosition: 'Senior Developer',
        bio: 'Alumni demo account for testing purposes',
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
        interests: ['Technology', 'Programming', 'Innovation']
      });

      console.log('✓ Alumni user created: alumni@admauni.ac.id / password123');
    } else {
      console.log('✓ Alumni user already exists');
    }

    const adminUser = await User.findOne({ where: { email: 'admin@admauni.ac.id' } });
    if (!adminUser) {
      const admin = await User.create({
        email: 'admin@admauni.ac.id',
        password: await bcrypt.hash('admin123', salt),
        nim: '2018001',
        fullName: 'Admin ADMA',
        role: 'admin',
        isVerified: true,
        isActive: true
      });

      await AlumniProfile.create({
        userId: admin.id,
        major: 'Sistem Informasi',
        faculty: 'Teknik',
        graduationYear: 2022,
        phone: '081234567891',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        country: 'Indonesia',
        bio: 'Administrator account'
      });

      console.log('✓ Admin user created: admin@admauni.ac.id / admin123');
    } else {
      console.log('✓ Admin user already exists');
    }

    console.log('\n✅ Demo users setup complete!');
    console.log('\nYou can now login with:');
    console.log('Alumni: alumni@admauni.ac.id / password123');
    console.log('Admin:  admin@admauni.ac.id / admin123');

  } catch (error) {
    console.error('Error creating demo users:', error);
    throw error;
  }
}

export default createDemoUsers;
