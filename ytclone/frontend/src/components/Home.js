




import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

function Home() {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('/videos/', {
        params: {
          category: selectedCategory,
          search: search
        },
        headers: token ? { Authorization: `Token ${token}` } : {}
      });
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/categories/');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVideos();
  };

  const toggleWatchLater = async (videoId) => {
    try {
      await axios.post(`/watch-later/${videoId}/`, null, {
        headers: { Authorization: `Token ${token}` }
      });

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId
            ? { ...video, is_in_watch_later: !video.is_in_watch_later }
            : video
        )
      );
    } catch (err) {
      console.error('Error toggling watch later:', err);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">All Videos</h2>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="d-flex flex-wrap gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: '250px' }}
          />

          <button type="submit" className="btn btn-primary">
            Search
          </button>

          <select
            className="form-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>
      </form>

      <div className="row">
        {videos.map(video => (
          <div key={video.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                className="card-img-top"
                src={
                  video.thumbnail?.startsWith('http')
                    ? video.thumbnail
                    : `http://localhost:8000${video.thumbnail}`
                }
                alt={video.title}
              />
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>
                <p className="card-text">
                  <strong>Uploader:</strong> {video.user?.username} <br />
                  <strong>Category:</strong> {video.category_name || 'Uncategorized'} <br />
                  <strong>Likes:</strong> {video.likes_count || 0} &nbsp;|&nbsp;
                  <strong>Comments:</strong> {video.comments_count || 0}
                </p>
                <Link to={`/video/${video.id}`} className="btn btn-primary me-2">Watch</Link>
                {token && (
                  <button
                    className= "btn btn-outline-primary"
                    onClick={() => toggleWatchLater(video.id)}
                  >
                    {video.is_in_watch_later ? 'Remove from Watch Later' : ' Watch Later'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <p className="text-muted text-center">No videos found.</p>
      )}
    </div>
  );
}

export default Home;