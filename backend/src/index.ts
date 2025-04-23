import express from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './lib/dbConnection.ts';
import bodyParser from 'body-parser';
import cors from 'cors';
const registerRouter = await import('./routes/register.ts');
const loginRouter = await import('./routes/login.ts');
const logoutRouter = await import('./routes/logout.ts');
const profileRouter = await import('./routes/profile.ts');
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

    app.use('/register', registerRouter.default);
    app.use('/login', loginRouter.default);
    app.use('/logout', logoutRouter.default);
    app.use('/profile', authenticateJWT, profileRouter.default);

    app.listen(process.env.PORT, () => {
        console.log('Server is running on port ' + process.env.PORT);
    });
}

start();