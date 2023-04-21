import mongoose from "mongoose";

// import Schema
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: Object,
        required: true
    }
},{
    timestamps: true
})
const Blog = mongoose.model('Blog', blogSchema)

export default Blog;
