import BlogCard from '@/components/BlogCard';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const SearchList = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const query = (params.get('q') || '').toLowerCase().trim();
    const { blog } = useSelector(store => store.blog)

    const blogList = Array.isArray(blog) ? blog : [];

    const filteredBlogs = blogList.filter((item) => {
        const title = item?.title?.toLowerCase() || '';
        const subtitle = item?.subtitle?.toLowerCase() || '';
        const category = item?.category?.toLowerCase() || '';

        if (!query) return true;

        return (
            title.includes(query) ||
            subtitle.includes(query) ||
            category === query
        );
    });

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className='pt-32'>
            <div className='max-w-6xl mx-auto'>
                <h2 className='mb-5'>Search Results for: "{params.get('q') || ''}"</h2>
                <div className='grid grid-cols-3 gap-7 my-10'>
                    {
                        filteredBlogs.map((item) => {
                            return <BlogCard key={item?._id} blog={item} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default SearchList
