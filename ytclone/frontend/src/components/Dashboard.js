




import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useMessage } from './MessageProvider';

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const { showMessage } = useMessage();
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    axios.get('/videos/?user_only=1', {
      headers: {
        Authorization: `Token ${token}`
      }
    }).then(res => {
      setVideos(res.data);
    }).catch(err => {
      console.error('Error fetching dashboard videos:', err);
    });
  }, [token]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this video?');
    if (!confirm) return;

    try {
      await axios.delete(`/videos/${id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      setVideos(videos.filter(video => video.id !== id));
      showMessage('Video deleted successfully', 'success');
    } catch (err) {
      showMessage('Failed to delete video', 'error');
    }
  };

  const toggleWatchLater = async (videoId) => {
    try {
      await axios.post(`/watch-later/${videoId}/`, null, {
        headers: { Authorization: `Token ${token}` }
      });
      setVideos(prev =>
        prev.map(video =>
          video.id === videoId
            ? { ...video, is_in_watch_later: !video.is_in_watch_later }
            : video
        )
      );
    } catch (err) {
      showMessage('Failed to update watch later', 'error');
    }
  };

  const subscriberCount = videos.length > 0 ? videos[0].user?.subscriber_count : null;

  return (
    <div className="container mt-4">
      <h2 className="mb-2">My Uploaded Videos</h2>

      {subscriberCount !== null && (
        <p className="fw-bold text-primary mb-4">
          Subscribers: {subscriberCount}
        </p>
      )}

      <div className="row">
        {videos.map(video => (
          <div key={video.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                className="card-img-top"
                src={
                  video.thumbnail?.startsWith('http')
                    ? video.thumbnail
                    : `http://localhost:8000${video.thumbnail}`
                }
                alt={video.title}
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{video.title}</h5>

                <p className="card-text text-muted">
                  {video.category_name || 'Uncategorized'}
                  <span> &bull; &#10084; {video.likes_count || 0}</span>
                  <span> &bull; &#128172; {video.comments_count || 0}</span>
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(video.id)}
                  >
                    Delete
                  </button>

                  <button
                    className="btn btn-outline-primary"
                    onClick={() => toggleWatchLater(video.id)}
                  >
                    {video.is_in_watch_later ? 'Remove Watch Later' : ' Watch Later'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {videos.length === 0 && (
          <p className="text-muted text-center w-100 mt-3">
            You haven't uploaded any videos yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;