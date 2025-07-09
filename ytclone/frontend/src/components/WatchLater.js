import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Link } from 'react-router-dom';

function WatchLater() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchWatchLater();
  }, []);

  const fetchWatchLater = () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    axios.get('/watchlater/', {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(res => {
        setVideos(res.data);
      })
      .catch(err => console.error('Fetch error:', err));
  };

  const handleRemove = (videoId) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    axios.post(`/videos/${videoId}/watchlater/`, {}, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(() => {
        setVideos(prev => prev.filter(video => video.id !== videoId));
      })
      .catch(err => {
        console.error('Remove error:', err);
        alert('Failed to remove from Watch Later');
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Watch Later</h2>
      <div className="row">
        {videos.length === 0 && (
          <p className="text-muted text-center">No videos currently in Watch Later.</p>
        )}
        {videos.map(video => (
          <div key={video.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="ratio ratio-16x9">
                <img
                  src={
                    video.thumbnail?.startsWith('http')
                      ? video.thumbnail
                      : `http://localhost:8000${video.thumbnail}`
                  }
                  alt={video.title}
                  className="card-img-top object-fit-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{video.title}</h5>
                <div className="mt-auto d-flex justify-content-between">
                  <Link to={`/video/${video.id}`} className="btn btn-primary btn-sm">
                    Watch
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(video.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WatchLater;