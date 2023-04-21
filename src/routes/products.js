import express from 'express';
import { product, products } from '../controllers/products.js';

const router = express.Router();

// GET /product
router.post('/product', product);
router.get('/products', products);

export default router;