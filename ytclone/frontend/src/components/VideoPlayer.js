



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import { useMessage } from './MessageProvider';

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [inWatchLater, setInWatchLater] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const { showMessage } = useMessage();

  const fetchVideo = async () => {
    const res = await axios.get(`/videos/${id}/`, {
      headers: { Authorization: `Token ${token}` }
    });
    setVideo(res.data);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const username = currentUser?.username;
    const liked = res.data.likes.some(user => user.username === username);
    const watchLater = res.data.watch_later.some(user => user.username === username);
    const isSubscribed = res.data.is_subscribed;
    setIsLiked(liked);
    setInWatchLater(watchLater);
    setSubscribed(isSubscribed);
  };

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const toggleLike = async () => {
    await axios.post(`/videos/${id}/like/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
    fetchVideo();
  };

  const toggleWatchLater = async () => {
    await axios.post(`/videos/${id}/watchlater/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
    fetchVideo();
  };

  const toggleSubscribe = async () => {
    await axios.post(`/videos/${id}/subscribe/`, {}, {
      headers: { Authorization: `Token ${token}` }
    });
    fetchVideo();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    await axios.post(`/videos/${id}/comment/`, { text: commentText }, {
      headers: { Authorization: `Token ${token}` }
    });
    setCommentText('');
    fetchVideo();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    showMessage('Link copied to clipboard!', 'success');
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <video controls width="100%">
        <source src={video.video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <h3 className="mt-3">{video.title}</h3>
      <p>Category: {video.category?.name}</p>
      <p>Uploaded by: {video.user?.username}</p>

      <div className="d-flex flex-wrap gap-2 mt-2">
        <button onClick={toggleLike} className="btn btn-outline-danger">
          {isLiked ? (<span>&#x2764;</span>) : (<span>&#9825;</span>)} {video.likes.length}
        </button>

        <button onClick={toggleWatchLater} className="btn btn-outline-primary">
          {inWatchLater ? 'Remove from Watch Later' : ' Watch Later'}
        </button>

        <button onClick={toggleSubscribe} className="btn btn-outline-danger">
          {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
      </div>

      <div className="mt-3">
        <h6>Share this video:</h6>
        <div className="d-flex flex-wrap gap-2">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success"
          >
            WhatsApp
          </a>

          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(video.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-info"
          >
            Twitter
          </a>

          <button className="btn btn-secondary" onClick={handleCopy}>
            Copy Link
          </button>
        </div>
      </div>

      <hr />
      <h5>Comments ({video.comments.length})</h5>
      <form onSubmit={handleComment} className="mb-3">
        <textarea
          className="form-control"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          required
        />
        <button className="btn btn-success mt-2" type="submit">
          Post Comment
        </button>
      </form>
      <ul className="list-group">
        {video.comments.map((comment, index) => (
          <li key={index} className="list-group-item">
            <strong>{comment.user.username}:</strong> {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoPlayer;