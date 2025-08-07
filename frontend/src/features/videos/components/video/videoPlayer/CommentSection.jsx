import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getCommentsByVideoId } from '@/features/videos/api'

const CommentSection = () => {
    const { videoId } = useParams()
    const [comments, setComments] = useState([])
    const pageAndLimit = {
        page: 1,
        limit: 10
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await getCommentsByVideoId(videoId, pageAndLimit)
                if (response?.status === 200) {
                    console.log("IN THE IF BLOCK!!")
                    console.log("comments", response?.data)
                    setComments(response?.data?.comments)
                }
                else {
                    throw new Error("Failed to fetch comments")
                }
            } catch (error) {
                console.error("Error fetching comments:", error.message)
            }
        }
        fetchComments()
    }, [])

  return (
    <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Comments</h2>
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                    <div className="flex items-center mb-2">
                        <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full mr-2" />
                        <span className="font-semibold">{comment.user.name}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{comment.content}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default CommentSection