const express = require('express')
const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();



router.post('/', validateUser, async (req, res) => {
    try {
        const post = await Users.insert(req.body)
        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

router.post('/:id/posts', validatePost, async (req, res) => {
    try {
        const body = req.body
        const newPost = await Posts.insert(body)
        res.status(201).json(newPost)
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await Users.get()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

router.get('/:id', validateUserId, async (req, res) => {
    try {
        const { id } = req.params
        const user = await Users.getById(id)
        res.status(200).json(user)        
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const { id } = req.params
        const posts = await Users.getUserPosts(id)
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const id = req.user
        const deletedUser = await Users.remove(id)
        res.status(200).json({ message: `ID: ${id} was removed, ${deletedUser} user(s) deleted` })
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

router.put('/:id', validateUserId, async (req, res) => {
    try {
        const { id } = req.params
        const { body } = req
        const updateUser = await Users.update(id, body)
        res.status(200).json({ message: `${updateUser} user(s) updated` })
    } catch (error) {
        res.status(500).json({ message: 'There was an error with the server database.'})
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const { id } = req.params
        const user = await Users.getById(id)
        if (!user) {
            throw {
                code: 400,
                message: 'invalid user id'
            }
        }
        req.user = id
        next()
    } catch (error) {
        if(!error.code) {
            res.status(500).json({ message: 'There was an error with the server database.'})
        }
        res.status(error.code).json({
            message: error.message
        })
    }
    
};

function validateUser(req, res, next) {
    const body = req.body
    if (Object.keys(body).length < 1) {
        res.status(400).json({ message: 'missing user data'})
    }
    if (!body.name) {
        res.status(400).json({ message: `missing required name field` })
    }
    next()
};

function validatePost(req, res, next) {
    const body = req.body
    if (Object.keys(body).length < 1) {
        res.status(400).json({ message: 'missing post data'})
    }
    if (!body.text || !body.user_id) {
        res.status(400).json({ message: `missing required text or userid field` })
    }
    next()
};

module.exports = router;
