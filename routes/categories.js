const express = require('express');
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCategory = new Category({
            name,
            description
        });
        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.put('/:id', auth, async (req, res) => {
    const { name, description } = req.body;
    try {
        let category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        category.name = name;
        category.description = description;

        category = await Category.findByIdAndUpdate(req.params.id, category, { new: true });
        res.json(category);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ msg: 'Category not found' });

        await Category.findByIdAndRemove(req.params.id);
        res.json({ msg: 'Category removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
        const posts = await Post.find({ categoryId: req.params.id }).populate('authorId', 'username').populate('categoryId', 'name');
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;