const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model("Post");
const requireLogin = require("../middleware/requireLogin")



router.get('/allpost', requireLogin, (req,res)=> {
    Post.find()
     .populate("postedBy", "_id name dp")
     .populate("comments.postedBy", "_id name dp")
     .sort("-createdAt")
     .then(posts => {
         res.json({posts})
     })
      .catch(err => {
          console.log(err);
      })
})

router.get('/getSubposts', requireLogin, (req,res)=> {
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name dp")
     .populate("comments.postedBy", "_id name dp")
     .sort("-createdAt")
     .then(posts => {
         res.json({posts})
     })
      .catch(err => {
          console.log(err);
      })
})


router.post('/createpost', requireLogin, (req,res) => {
    const {title, body, photo} = req.body;
    console.log(title, body, photo)
    
    if(!title || !body || !photo){
        return res.status(422).json({error: "Please add all the fields"});
    }

    req.user.password= undefined;
    const post = new Post({
        title,
        body,
        photo,
        postedBy: req.user
    })
    post.save().then(result => {
        res.json({post: result});
    })
    .catch(err => {
        console.log(err);
    })
})

 // poulate is used becuase in Schema we have used Objectid
 // which means We will be referncing other documents.
 // ref tells what will be in the collection.


router.get('/mypost',requireLogin, (req,res) => {
    Post.find({postedBy: req.user._id})
      .populate("postedBy", "_id name dp")
      .then(mypost => {
          res.json({mypost})
      })
      .catch(err => {
          console.log(err);
      })
})

router.put('/like', requireLogin, (req, res)=> {
     Post.findByIdAndUpdate(req.body.postId, {
         $push: {likes: req.user._id}
     }, {
         new: true
     }).populate("postedBy", "_id name dp")
     .exec((err, result)=>{
         if(err){
             return res.status(422).json({error: err})  
         }else{
            res.json(result)
         }
     })
})

router.put('/unlike', requireLogin, (req, res)=> {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {
        new: true
    }).populate("postedBy", "_id name dp")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})  
        }else{
           res.json(result)
        }
    })
})

router.put('/comment', requireLogin, (req, res)=> {
    const comment ={
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push: {comments: comment}
    }, {
        new: true
    })
    .populate("comments.postedBy", "_id name dp")
    .populate("postedBy", "_id name dp")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})  
        }else{
           res.json(result)
        }
    })
})

router.delete('/deletepost/:postId', requireLogin, (req,res)=> {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id name dp")
    .exec((err, post) =>{
        if(err || !post){
            return res.status(422).json({error: err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result => {
                res.json(result)
            }).catch(err => {
                console.log(err);
            })
        }

    })
})

router.delete('/deletecomment/:commentId', requireLogin, (req, res)=> {
    Post.findOneAndUpdate({"comments._id": req.params.commentId}, {
        $pull: {comments: {_id: req.params.commentId}}
    }, {
        new: true
    }).populate("postedBy", "_id name dp")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error: err})  
        }else{
           res.json(result)
        }
    })
})






module.exports = router