import dotenv from 'dotenv';
import express from 'express';

const app = express();

// Force dotenv to load in the .env file
dotenv.config();

// Use the express.json() middleware to parse JSON bodies
app.use(express.json());

app.listen('8080', () => {
    console.log('Server is running on port 8080');
});
