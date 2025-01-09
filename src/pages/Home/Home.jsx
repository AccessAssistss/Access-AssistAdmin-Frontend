import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { totalCountAPI } from '../../ApiUrls';
import axios from "axios";

function Home() {
  const [totalValue, setTotalValue] = useState({});
  const [loading, setLoading] = useState(true);

  const totalapi = async () => {
    try {
      const res = await axios.get(totalCountAPI);
      setTotalValue(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    totalapi();
  }, []);

  const cards = [
    { id: 1, name: "Job", link: "job", icon: "person-fill", number: loading ? "loading" : totalValue.totalJobs, },
    { id: 2, name: "Blog", link: "blog", icon: "chat-square-text", number: loading ? "loading" : totalValue.totalBlogs, },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-4">
      {loading ? (
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className='p-2'>
            <Skeleton height={100} className="rounded-lg" />
          </div>
        ))
      ) : (
        cards.map(card => (
          <Link to={card.link} key={card.id} className='p-2'>
            <div className='flex justify-between items-center bg-white p-4 rounded-lg shadow-lg hover:bg-gray-50 transition'>
              <div className='flex items-center space-x-4'>
                <i className={`bi bi-${card.icon} text-3xl text-themeColor`}></i>
                <div>
                  <div className='text-lg font-bold text-gray-800'>{card.name}</div>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-4xl font-bold text-gray-900'>{card.number}</div>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}

export default Home
