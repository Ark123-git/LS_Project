

import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import { useMessage } from './MessageProvider'; 
function Upload() {
  const [title, setTitle] = useState('');
  const [video, setVideo] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [videoPreviewURL, setVideoPreviewURL] = useState(null);
  const [thumbnailPreviewURL, setThumbnailPreviewURL] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const { showMessage } = useMessage();


  useEffect(() => {
    axios.get('/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
    if (file) {
      setVideoPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnail(file);
    if (file) {
      setThumbnailPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('user'))?.token;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('video', video);
    formData.append('thumbnail', thumbnail);
    formData.append('category_id', categoryId);

    try {
      await axios.post('/videos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      showMessage('Uploaded successfully','success')
      setTitle('');
      setVideo(null);
      setThumbnail(null);
      setVideoPreviewURL(null);
      setThumbnailPreviewURL(null);
      setCategoryId('');
    } catch (err) {
      console.error(err.response?.data || err);
      if (err.response?.data) {
        alert('Upload failed: ' + JSON.stringify(err.response.data));
      } else {
        showMessage('Upload failed','error');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>

        <label className="form-label fw-bold">Video Title</label>
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Enter title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <label className="form-label fw-bold">Select Video File</label>
        <input
          className="form-control mb-2"
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          required
        />

        {videoPreviewURL && (
          <video controls width="100%" className="mb-3">
            <source src={videoPreviewURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        <label className="form-label fw-bold">Select Thumbnail Image</label>
        <input
          className="form-control mb-2"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          required
        />

        {thumbnailPreviewURL && (
          <img src={thumbnailPreviewURL} alt="Thumbnail Preview" className="img-fluid mb-3" />
        )}

        <label className="form-label fw-bold">Category</label>
        <select
          className="form-control mb-3"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <button className="btn btn-success" type="submit">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
