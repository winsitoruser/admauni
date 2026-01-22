import { sequelize } from './server/models/index.js';
import createDemoUsers from './server/seeds/createDemoUsers.js';

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');

    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized.\n');

    console.log('🔄 Creating demo users...');
    await createDemoUsers();

    console.log('\n✅ Database setup complete!');
    console.log('\n📝 You can now login with:');
    console.log('   Alumni: alumni@admauni.ac.id / password123');
    console.log('   Admin:  admin@admauni.ac.id / admin123');
    console.log('\n🚀 Start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.log('\n💡 Make sure to update your .env file with correct PostgreSQL credentials:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_PORT=5432');
    console.log('   DB_NAME=admauni_alumni');
    console.log('   DB_USER=postgres');
    console.log('   DB_PASSWORD=your_postgres_password');
    process.exit(1);
  }
}

setupDatabase();
