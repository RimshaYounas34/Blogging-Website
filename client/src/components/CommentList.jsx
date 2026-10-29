import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { Avatar } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { showToast } from '@/helpers/showToast'
import { FaTrashAlt, FaHeart, FaRegHeart } from 'react-icons/fa' // ✅ added FaRegHeart

const CommentList = forwardRef(({ props }, ref) => {
  const user = useSelector(state => state.user)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const { data, loading, error } = useFetch(
    `${getEvn('VITE_API_BASE_URL')}/comment/get/${props.blogid}`,
    {
      method: 'get',
      credentials: 'include',
    }
  )
  const [commentsState, setCommentsState] = useState([])

  useEffect(() => {
    if (data?.comments) {
      setCommentsState(data.comments)
    }
  }, [data])

  const addNewComment = newComment => {
    setCommentsState(prev => [newComment, ...prev])
  }

  useImperativeHandle(ref, () => ({
    addNewComment,
  }))

  const handleLike = async commentId => {
    try {
      const res = await fetch(
        `${getEvn('VITE_API_BASE_URL')}/comment/like/${commentId}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      const json = await res.json()
      if (res.ok) {
        showToast('success', json.message)
        setCommentsState(prev =>
          prev.map(c =>
            c._id === commentId ? { ...c, likes: json.likes } : c
          )
        )
      } else {
        showToast('error', json.message)
      }
    } catch (error) {
      showToast('error', error.message)
    }
  }

  const handleReplySubmit = async parentId => {
    if (!replyText.trim()) return showToast('error', 'Reply cannot be empty')

    try {
      const res = await fetch(`${getEvn('VITE_API_BASE_URL')}/comment/reply`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blogid: props.blogid,
          user: user.user._id,
          comment: replyText,
          parentId,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        showToast('success', 'Reply added')
        setReplyingTo(null)
        setReplyText('')
        setCommentsState(prev =>
          prev.map(c =>
            c._id === parentId
              ? {
                  ...c,
                  replies: c.replies ? [...c.replies, json.reply] : [json.reply],
                }
              : c
          )
        )
      } else {
        showToast('error', json.message)
      }
    } catch (err) {
      showToast('error', err.message)
    }
  }

  const handleDelete = async commentId => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return

    try {
      const res = await fetch(
        `${getEvn('VITE_API_BASE_URL')}/comment/delete/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      const json = await res.json()
      if (res.ok) {
        showToast('success', json.message)
        setCommentsState(prev =>
          prev
            .filter(c => c._id !== commentId)
            .map(c => ({
              ...c,
              replies: c.replies
                ? c.replies.filter(r => r._id !== commentId)
                : [],
            }))
        )
      } else {
        showToast('error', json.message)
      }
    } catch (error) {
      showToast('error', error.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error loading comments</div>

  const comments = commentsState || []

  return (
    <div>
      <h4 className="text-2xl font-bold mb-6 flex items-center">
        <span className="mr-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
          {comments.length}
        </span>
        Comments
      </h4>

      <div className="space-y-6">
        {comments.map(comment => {
          const isLikedByUser = comment.likes?.includes(user.user._id)

          return (
            <div
              key={comment._id}
              className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment?.user?.avatar || usericon} />
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{comment?.user?.name}</p>
                <p className="text-xs text-gray-500 mb-2">
                  {moment(comment?.createdAt).format('DD-MM-YYYY')}
                </p>
                <p className="text-gray-800">{comment?.comment}</p>

                <div className="flex gap-4 mt-3 items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(comment._id)}
                    className="flex items-center gap-1 text-red-500 border border-gray-300 rounded px-2 py-1"
                    aria-label="Like comment"
                  >
                    {isLikedByUser ? <FaHeart /> : <FaRegHeart />}
                    <span>{comment.likes?.length || 0}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setReplyingTo(replyingTo === comment._id ? null : comment._id)
                    }
                  >
                    Reply
                  </Button>
                  <span
                    onClick={() => handleDelete(comment._id)}
                    className="cursor-pointer text-red-600 text-lg select-none"
                    title="Delete comment"
                    role="button"
                    aria-label="Delete comment"
                  >
                    <FaTrashAlt />
                  </span>
                </div>

                {replyingTo === comment._id && (
                  <div className="mt-3">
                    <Textarea
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="mb-2"
                    />
                    <Button size="sm" onClick={() => handleReplySubmit(comment._id)}>
                      Submit Reply
                    </Button>
                  </div>
                )}

                {comment.replies?.length > 0 && (
                  <div className="mt-4 ml-10 space-y-4 border-l-2 border-gray-300 pl-6 bg-gray-50 rounded">
                    {comment.replies.map(reply => (
                      <div key={reply._id} className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={reply?.user?.avatar || usericon} />
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{reply?.user?.name}</p>
                          <p className="text-xs text-gray-500 mb-1">
                            {moment(reply?.createdAt).format('DD-MM-YYYY')}
                          </p>
                          <div className="flex justify-between items-center text-gray-700">
                            <span>{reply?.comment}</span>
                            <span
                              onClick={() => handleDelete(reply._id)}
                              className="cursor-pointer text-red-500 text-base select-none"
                              title="Delete reply"
                              role="button"
                              aria-label="Delete reply"
                            >
                              <FaTrashAlt />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default CommentList
