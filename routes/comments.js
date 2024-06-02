const express = require('express');
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');
const router = express.Router();

router.post('/:postId/comments', auth, async (req, res) => {
    const { content } = req.body;
    try {
        const newComment = new Comment({
            postId: req.params.postId,
            authorId: req.user.id,
            content
        });
        const comment = await newComment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.get('/:postId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('authorId', 'username');
        res.json(comments);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

router.delete('/:postId/comments/:commentId', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ msg: 'Comment not found' });
        if (comment.authorId.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        await Comment.findByIdAndRemove(req.params.commentId);
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;