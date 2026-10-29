import Comment from '@/components/Comment'
import CommentCount from '@/components/CommentCount'
import LikeCount from '@/components/LikeCount'
import Loading from '@/components/Loading'
import RelatedBlog from '@/components/RelatedBlog'
import { Avatar } from '@/components/ui/avatar'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { AvatarImage } from '@radix-ui/react-avatar'
import { decode } from 'entities'
import moment from 'moment'
import React from 'react'
import { useParams } from 'react-router-dom'

const SingleBlogDetails = () => {
  const { blog, category } = useParams()

  const { data, loading, error } = useFetch(
    `${getEvn('VITE_API_BASE_URL')}/blog/get-blog/${blog}`,
    {
      method: 'get',
      credentials: 'include',
    },
    [blog, category]
  )

  if (loading) return <Loading />
  if (error || !data?.blog) return <div className="text-red-500">Error loading blog</div>

  const blogData = data.blog
  const blogCategory = blogData?.category?.name || category || 'Unknown'

  return (
    <div className="md:flex-nowrap flex-wrap flex justify-between gap-20">
      <div className="border rounded md:w-[70%] w-full p-5">
        <h1 className="text-2xl font-bold mb-5">{blogData.title}</h1>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Avatar>
              <AvatarImage src={blogData.author?.avatar} />
            </Avatar>
            <div>
              <p className="font-bold">{blogData.author?.name}</p>
              <p>
                Category: <span className="text-blue-600 font-medium">{blogCategory}</span>
              </p>
              <p>Date: {moment(blogData.createdAt).format('DD-MM-YYYY')}</p>
            </div>
          </div>

          <div className="flex gap-5">
            <LikeCount props={{ blogid: blogData._id }} />
            <CommentCount props={{ blogid: blogData._id }} />
          </div>
        </div>

        <div className="my-5">
          <img src={blogData.featuredImage} className="rounded w-full" alt="Blog visual" />
        </div>

        <div
          dangerouslySetInnerHTML={{ __html: decode(blogData.blogContent) || '' }}
        />

        <div className="border-t mt-5 pt-5">
          <Comment props={{ blogid: blogData._id }} />
        </div>
      </div>

      <div className="border rounded md:w-[30%] w-full p-5">
        <RelatedBlog props={{ category: blogCategory, currentBlog: blog }} />
      </div>
    </div>
  )
}

export default SingleBlogDetails
