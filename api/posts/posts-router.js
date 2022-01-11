// implement your posts router here

const express = require("express")

const posts = require("./posts-model.js")

const router = express.Router()

router.get("/", (req, res) => {
    posts.find()
        .then(item => {
            res.status(200).json(item)
        })
        .catch(err => {
            res.status(500).json({
                message: "The posts information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})

router.get("/:id", (req, res) => {
    posts.findById(req.params.id)
        .then(item => {
            item ?
                res.status(200).json(item) :
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: "The post information could not be retrieved",
                err: err.message,
                stack: err.stack
            })
        })
})


router.post("/", (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: "Please provide title and contents for the post"
        })
    } else {
        posts.insert({ title, contents })
            .then( ({ id }) => {
                return posts.findById(id)
            })
            .then(item => {
                res.status(201).json(item)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack
                })

            })
    }
})

router.put("/:id", (req, res) => {
    const { title , contents } = req.body;
    if( !title || !contents) {
        res.status(400).json({
            message:"Please provide title and contents for the post"
        })
    } else {
        posts.findById(req.params.id)
        .then( item => {
            if( !item ) {
                res.status(404).json({
                    message:"The post with the specified ID does not exist"
                })
            } else {
                return posts.update(req.params.id, req.body)
            }
        })
        .then(item => {
            if(item) {
                return posts.findById(req.params.id)
            }
        })
        .then( post => {
            if(post) {
                res.json(post)
            }
        })
        .catch(err => {
            res.status(500).json({
                message:"The post information could not be modified",
                err:err.message,
                stack:err.stack
            })
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const post = await posts.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message:"The post with the specified ID does not exist"
            })
        } else {
            await posts.remove(req.params.id)
            res.status(200).json(post)
        }
    } catch (err) {
        res.status(500).json({
            message:"The post could not be removed",
            err:err.message,
            stack:err.stack
        })
    }
})

router.get("./:id/comments", async (req, res) => {
    try {
        const post = await posts.findById(req.params.id)
        if( !post ) {
            res.status(404).json({
                message:"The post with the specified ID does not exist"
            })
        } else {
            const comments = await posts.findPostComments(req.params.id)
            res.status(200).json(comments)
        }
    } catch( err ) {
        res.status(500).json({
            message:"The comments information could not be retrieved",
            err:err.message,
            stack:err.stack
        })
    }
})

module.exports = router;