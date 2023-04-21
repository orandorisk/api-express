import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import multer from 'multer';
import * as dotenv from 'dotenv';

// untuk mengatasi __dirname pada ES6 Javascript
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ProductRoutes from './src/routes/products.js';
import RegisterRoutes from './src/routes/auth.js';
import BlogRoutes from './src/routes/blog.js';

const app = express();
const port = 3000;
dotenv.config();

// multer upload foto
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})
// this function to filter type of image
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png'  ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}
// this function to send
app.use('/images', express.static(path.join(__dirname, 'images')));
const upload = multer({ storage: fileStorage, fileFilter: fileFilter}).single('image');
app.use(upload);

app.use(bodyParser.json());
app.use(cors());

app.use('/v1/customer', ProductRoutes);
app.use('/v1/auth', RegisterRoutes);
app.use('/v1/blog', BlogRoutes);


// app.use((error, req, res, next) => {
//     res.status(400).json({
//         message: 'Error',
//         data: 'data di sini'
//     });
// })

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(port, () => {
            console.log(`Connection Success Example app listening at http://localhost:${port}`)
        });
    })
    .catch((err) => {
        console.log(err);
    });