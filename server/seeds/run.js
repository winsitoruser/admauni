import { sequelize } from '../models/index.js';
import createDemoUsers from './createDemoUsers.js';

async function runSeeds() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.\n');

    await createDemoUsers();

    console.log('\n✅ All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error running seeds:', error);
    process.exit(1);
  }
}

runSeeds();
