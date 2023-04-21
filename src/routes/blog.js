import express from 'express';
import { blogPost, getBlogs, getBlogById, updatePost, deleteBlog } from '../controllers/blog.js';
import { check } from 'express-validator';
const router = express.Router();

// {blog}/post

router.post('/blog', 
    check('title')
        .notEmpty()
        .withMessage('Title tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Minimum 5 karakter'),
    check('body')
        .notEmpty()
        .withMessage('Body tidak boleh kosong')
        .isLength({ min: 10 })
        .withMessage('Body tidak memenuhi')
,blogPost);

// routes get blogs
router.get('/blogs', getBlogs);
// routes get blog by id
router.get('/blog/:blogId', getBlogById);
// routes update blog by id
router.patch('/blog/:blogId', 
    check('title')
        .notEmpty()
        .withMessage('Title tidak boleh kosong')
        .isLength({ min: 5 })
        .withMessage('Minimum 5 karakter'),
    check('body')
        .notEmpty()
        .withMessage('Body tidak boleh kosong')
        .isLength({ min: 10 })
        .withMessage('Body tidak memenuhi')
,updatePost);
// routes delete blog by id
router.delete('/blog/:blogId', deleteBlog);

export default router;