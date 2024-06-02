const express = require('express');
const auth = require('../middleware/auth');
const Post = require('./models/Post');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { title, content, categoryId } = req.body;
    try {
        const newPost = new Post({
            title,
            content,
            authorId: req.user.id,
            categoryId
        });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('authorId', 'username').populate('categoryId', 'name');
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('authorId', 'username').populate('categoryId', 'name');
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { title, content, categoryId } = req.body;
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        if (post.authorId.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        post.title = title;
        post.content = content;
        post.categoryId = categoryId;
        post.updatedAt = Date.now();

        post = await Post.findByIdAndUpdate(req.params.id, post, { new: true });
        res.json(post);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        if (post.authorId.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        await Post.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Post removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;