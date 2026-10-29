import BlogCard from '@/components/BlogCard'
import Loading from '@/components/Loading'
import { getEvn } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import React, { useState, useEffect } from 'react'

const Index = () => {
  const [page, setPage] = useState(1)

  // Create URL including page param
  const url = `${getEvn('VITE_API_BASE_URL')}/blog/blogs?page=${page}`

  // Pass url as dependency so useFetch re-fetches on page change
  const { data: blogData, loading, error } = useFetch(url, {
    method: 'get',
    credentials: 'include'
  }, [url])  // <-- Pass url as dependency here

  if (loading) return <Loading />
  if (error) return <div className="text-red-500">Error loading blogs.</div>

  return (
    <>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {blogData && blogData.blog.length > 0
          ? blogData.blog.map(blog => <BlogCard key={blog._id} props={blog} />)
          : <div>Data Not Found.</div>
        }
      </div>

      <div className="flex justify-center items-center mt-8 gap-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="px-4 py-2 font-semibold">{page}</span>

        <button
          onClick={() => {
            if (blogData && blogData.blog.length === 12) {
              setPage(prev => prev + 1)
            }
          }}
          disabled={!(blogData && blogData.blog.length === 12)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </>
  )
}

export default Index
