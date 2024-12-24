// src/main.ts

// Utilities
import * as dotenv from 'dotenv';
// Load environment variables
dotenv.config();

// Modules
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedDatabase } from './seed';
import { DataSource } from 'typeorm';

/**
 * @fileoverview The entry point of the application, responsible for bootstrapping the NestJS server and initializing the database.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the Angular application
  app.enableCors({
    origin: 'http://localhost:4200', // Origin of the Angular application
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow sending cookies and authorization headers
  });

  // Get the TypeORM DataSource
  const dataSource = app.get(DataSource);

  // Initialize the DataSource if it's not already initialized
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  // Run the seed function to populate the database
  await seedDatabase(dataSource);

  // Start listening on port 3000
  await app.listen(3000);
}
bootstrap();