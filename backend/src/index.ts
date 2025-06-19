import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/dbConnection.ts';
import bodyParser from 'body-parser';
import cors from 'cors';
const registerRouter = await import('./routes/RegisterRoutes.ts');
const loginRouter = await import('./routes/LoginRoutes.ts');
const profileRouter = await import('./routes/ProfileRoutes.ts');
const locationRouter = await import('./routes/LocationRoutes.ts');
const friendshipRouter = await import('./routes/FriendshipRoutes.ts');
const notificationRouter = await import('./routes/NotificationRoutes.ts');
const userRouter = await import('./routes/UserRoutes.ts');
const { authenticateJWT } = await import('./middleware/auth.ts');

async function start() {

    // Load environment variables

    dotenv.config({
        path: "./.env",
    });

    // Connect to Database

    await connectToDatabase();

    // Create a new express application

    const app = express();

    app.use(bodyParser.json({
        limit: "10kb"
    }));

    app.use(
        cors({
            origin: process.env.CORS_ORIGIN as string,
            credentials: true
        })
    )

    // Routes

    app.use('/auth/register', registerRouter.default);
    app.use('/auth/login', loginRouter.default);
    app.use('/api/profile', authenticateJWT, profileRouter.default);
    app.use('/api/location', authenticateJWT, locationRouter.default);
    app.use('/api/friends', authenticateJWT, friendshipRouter.default);
    app.use('/api/notification', authenticateJWT, notificationRouter.default);
    app.use('/api/users', authenticateJWT, userRouter.default);

    app.listen(process.env.PORT, () => {
        console.log('Server is running on port ' + process.env.PORT);
    });

}

start();