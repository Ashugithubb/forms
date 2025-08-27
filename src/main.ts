import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import session from 'express-session';

import passport from 'passport';
import process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      // store: new (RedisStore(session))({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: Boolean(process.env.SESSION_RESAVE),
      saveUninitialized: Boolean(process.env.SESSION_SAVE_UNINITIALIZED),
      cookie: {
        maxAge: process.env.SESSION_COOKIE_MAX_AGE
          ? parseInt(process.env.SESSION_COOKIE_MAX_AGE, 10)
          : 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}

bootstrap().then(() => { });






// 1. Install Redis on your system (server/database layer)

// Linux/macOS: sudo apt install redis or brew install redis

// Windows: Use Redis for Windows via WSL or Docker

// Make sure it’s running:

// redis-server

// 2. Install required NPM packages (Node.js side)

// In your NestJS project, install:

// npm install connect-redis ioredis


// connect-redis → session store adapter for express-session.

// ioredis → Redis client library (recommended).

// 3. Update your main.ts

// Example:

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import session from 'express-session';
// import passport from 'passport';
// import RedisStore from 'connect-redis';
// import { createClient } from 'ioredis';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);


//   const redisClient = new createClient({
//     host: '127.0.0.1', 
//     port: 6379,
//   });

  
//   const redisStore = new (RedisStore(session))({
//     client: redisClient,
//   });

//   app.use(
//     session({
//       store: redisStore,
//       secret: process.env.SESSION_SECRET || 'super_secured',
//       resave: false,
//       saveUninitialized: false,
//       cookie: {
//         maxAge: 1000 * 60 * 60 * 24, 
//         secure: false,
//         httpOnly: true,
//       },
//     }),
//   );

//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(3000);
// }

// bootstrap();