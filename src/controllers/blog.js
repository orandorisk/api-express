import { validationResult } from 'express-validator';
import Blog from '../models/blog.js';

// import fs
import fs from 'fs';
// untuk mengatasi __dirname pada ES6 Javascript
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const _blogPost = (req, res, next) => {
    // validasi input data dari client
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    // validasi image
    if(!req.file) {
        return res.status(400).json({ message: "Image belum diupload"})
    }

    // ambil data dari client
    const { title, body } = req.body;
    const image = req.file.path;

    // buat object untuk disimpan ke database
    const blog = new Blog({
        title: title,
        body: body,
        image: image,
        author: {
            uid: 1,
            name: "orlando"
        }
    })

    // simpan ke database
    blog.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Create Blog Success",
                data: result
            })
        })
        .catch(err => {
            console.log(err);
        });

}

export const _updatePost = (req, res, next) => {
    // validasi input data dari client
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }

    // validasi image
    if(!req.file) {
        return res.status(400).json({ message: "Image belum diupload"})
    }

    // ambil data dari client
    const { title, body } = req.body;
    const image = req.file.path;
    const { blogId } = req.params;

    Blog.findById(blogId)
    .then(blog => {
        if(!blog) {
            return res.status(404).json({ message: "Blog tidak ditemukan"})
        }
        blog.title = title;
        blog.body = body;
        blog.image = image;

        return blog.save();
    })
    .then(result => {
        res.status(200).json({
            message: "Update Blog Success",
            data: result
        })
    })
    .catch(err => {
        console.log(err);
    })

}

// ================================================================//

// menggunakan async await
export const blogPost = async (req, res, next) => {
        // validasi input data dari client
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }

        // validasi image
        if(!req.file) {
            return res.status(400).json({ message: "Image belum diupload"})
        }

        // ambil data dari client
        const { title, body } = req.body;
        const image = req.file.path;
    
        // buat object untuk disimpan ke database
        const blog = new Blog({
            title: title,
            body: body,
            image: image,
            author: {
                uid: 1,
                name: "orlando"
            }
        })

        // simpan ke database
        try {
            const result = await blog.save();
            res.status(201).json({
                message: "Create Blog Success",
                data: result
            })
        }
        catch(err) {
            res.status(409).json({ message: err.message})
        }
}

export const getBlogs = async (req, res, next) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 5;
    
    try{
        const startIndex = (parseInt(page) - 1) * parseInt(perPage);
        const total = await Blog.countDocuments({});
        const blogs = await Blog.find().sort({ _id: -1 }).limit(parseInt(perPage)).skip(startIndex);
        res.status(200).json({
            message: "Data Blogs berhasil diambil",
            data: blogs,
            total_data: total,
            current_page: parseInt(page),
            per_page: parseInt(perPage)
        })
    } catch (error){
        res.status(500).json({ message: error.message})
    }
}

export const getBlogById = async (req, res, next) => {
    // get id from url
    const { blogId } = req.params;    
    try {
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({ message: "Blog tidak ditemukan"})
        }
        res.status(200).json({
            message: "Data Blog berhasil diambil",
            data: blog
        })
    } catch(error) {
        res.status(500).json({ message: error.message})
    }
}

export const updatePost = async (req, res, next) => {
        // validasi input data dari client
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()})
        }

        // validasi image
        if(!req.file) {
            return res.status(400).json({ message: "Image belum diupload"})
        }

        // ambil data dari client
        const { blogId } = req.params;
        const { title, body } = req.body;
        const image = req.file.path;

        try {
            const blog = await Blog.findById(blogId);
            if(!blog) {
                return res.status(404).json({ message: "Blog tidak ditemukan"})
            }

            // hapus image lama
            if(blog.image) {
                await removeImage(blog.image);
            }

            blog.title = title;
            blog.body = body;
            blog.image = image;

            const result = await blog.save();
            res.status(200).json({
                message: "Update Blog Success",
                data: result
            })
        }catch(error) {
            res.status(500).json({ message: error.message})
        }

}

export const deleteBlog = async (req, res, next) => {
    const { blogId } = req.params;
    try {
        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({ message: "Blog tidak ditemukan"})
        }

        await removeImage(blog.image);

        const result = await Blog.findByIdAndRemove(blogId);
        res.status(200).json({
            message: "Delete Blog Success",
            data: result
        })
    } catch {
        res.status(500).json({ message: error.message})
    }
}

const removeImage = (filePath) => {
    console.log('filepath', filePath);
    console.log('dirname', __dirname);

    // delete image /home/orlando/Downloads/Profile/myexpressapp/src/controllers
    filePath = path.join(__dirname, '../..', filePath);
    fs.unlink(filePath, err => console.log(err));
}

