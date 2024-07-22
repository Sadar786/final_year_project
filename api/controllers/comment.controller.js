// comment.controller.js

import { errorHandler } from "../utils/error.js";
import Comment from '../modules/comment.model.js'



export const createComment = async (req, res, next) => {
   try {
    
    const {content, postId, userId} = req.body;
    
    if(userId !== req.user.id){
        return next(errorHandler(403, "Your are not allowed to create this comment"))
    }

    const newComment = new Comment({
        content,
        postId,
        userId,
    })
    await newComment.save();

    res.status(200).json(newComment)

  } catch (error) {
    next(error)
  }
};

export const getComment = async (req, res, next) => {
  try {
   const  {postId, userId }= req.params
   const query = {};

   if(postId){query.postId = postId}
   if(userId){query.userId= userId}
    const comments = await Comment.find(query).sort({createAt: -1})
    if(comments.length>0){
      res.status(200).json(comments);
    }
    else{
      res.status(500).json({message: "something want wrong"})
    }
  } catch (error) {
    next(error)
  }
}
export const getComments = async (req, res, next) => {
  try {
   const  {postId }= req.params
   const query = {};

   if(postId){query.postId = postId}
     const comments = await Comment.find(query).sort({createAt: -1})
    if(comments.length>0){
      res.status(200).json(comments);
    }
    else{
      res.status(500).json({message: "something want wrong"})
    }
  } catch (error) {
    next(error)
  }
}

export const likeComment = async (req, res , next)=>{
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandler(404, "comment not found"))
    }
    const userIdex = comment.likes.indexOf(req.user.id);
    if(userIdex === -1){
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
      }else{
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIdex, 1)
    }
    await comment.save();
    res.status(200).json(comment)
  } catch (error) {
    next(error)
  }
}

export const editComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if(!comment){
        return next(errorHandler(404, "the comment not found!"))
      }
      if(req.user.id !== comment.userId && !req.user.isAdmin){
        return next(errorHandler(403, "You are not allowed to edit the comment."))
      }
      const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
         {
          content: req.body.content
        },
        {new: true}
      );
      res.status(200).json(editedComment);
    } catch (error) {
      next(error)
    }
}

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if(!comment){
      return next(errorHandler(404, "the comment does not found."))
    }
    if(comment.userId !== req.user.id && !req.user.isAdmin){
      return next(errorHandler(403, "you are not authurized to delete "))
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json({message:"Comment deleted successfully."})
  } catch (error) {
    next(error)
  }
}

export const getTotalComment = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'desc' ? -1 : 1;
    
    const comments = await Comment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    
    const totalComments = await Comment.countDocuments();
    
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthComments = await Comment.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments
    });
  } catch (error) {
    next(error);
  }
};
