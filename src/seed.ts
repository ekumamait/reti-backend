import { DataSource } from 'typeorm';
import UserSeed from './seeds/UserSeed'; // Adjusted to default import
import { User } from './entities/User'; // Verify this path

async function seed() {
  const dataSource = new DataSource({ 
    type: 'postgres', // Specify your database type (e.g., 'postgres', 'mysql', etc.)
    host: 'localhost', // Your database host
    port: 5432, // Your database port
    username: 'your_username', // Your database username
    password: 'your_password', // Your database password
    database: 'your_database', // Your database name
    // ... other options if needed
  });
  await dataSource.initialize();
  const userSeed = new UserSeed();
  await userSeed.run(dataSource.getRepository(User));
  console.log('Seeding completed!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
});
