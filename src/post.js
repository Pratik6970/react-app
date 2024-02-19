import React, { useState, useEffect } from 'react';
import './posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [zoomImage, setZoomImage] = useState(false);
  const [authorImage, setAuthorImage] = useState(null); // State to store the author's image

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://my-json-server.typicode.com/Codeinwp/front-end-internship-api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const openModal = async (post) => {
    setSelectedPost(post);
    setModalOpen(true);
    if (post.author) {
      // Fetch the author's image
      try {
        const response = await fetch(post.author.avatar);
        const imageData = await response.blob();
        setAuthorImage(URL.createObjectURL(imageData));
      } catch (error) {
        console.error('Error fetching author image:', error);
        setAuthorImage(null); // Clear author image state if there's an error
      }
    } else {
      setAuthorImage(null); // Clear author image state if no author is available
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
    setModalOpen(false);
    setAuthorImage(null); // Clear author image state when closing modal
  };

 const handleLearnMoreClick = (post) => {
  setSelectedPost(post); // Set the selected post
  setModalOpen(true); // Open the modal
  setZoomImage(true); // Zoom the image
  // Load author's image if available
  if (post.author && post.author.avatar) {
    // Fetch the author's image
    try {
      fetchAuthorImage(post.author.avatar);
    } catch (error) {
      console.error('Error fetching author image:', error);
      setAuthorImage(null); // Clear author image state if there's an error
    }
  }
};

const fetchAuthorImage = async (avatarUrl) => {
  try {
    const response = await fetch(avatarUrl);
    const imageData = await response.blob();
    setAuthorImage(URL.createObjectURL(imageData));
  } catch (error) {
    console.error('Error fetching author image:', error);
    setAuthorImage(null); // Clear author image state if there's an error
  }
};

  return (
    <div className="posts-container">
      {posts && posts.map(post => (
        <div key={post.id} className="post-card" onClick={() => openModal(post)}>
          <img
            src={post.thumbnail.small}
            alt="Thumbnail"
            className={`post-thumbnail ${zoomImage ? 'zoomed' : ''}`}
          />
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>
          {/* Display author information */}
          {post.author && (
            <div className="author-info">
              <span className="author-name">{post.author.name}</span>
              {/* Render author's role if available */}
              {post.author.role && <span className="author-role">{post.author.role}</span>}
              {/* Render date if available */}
              {post.date && <span className="post-date">{new Date(post.date * 1000).toDateString()}</span>}
            </div>
          )}
          <button className="learn-more-btn" onClick={(e) => { e.stopPropagation(); handleLearnMoreClick(post); }}>Learn More</button>
        </div>
      ))}
      
      {/* Modal */}
      {modalOpen && selectedPost && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span> {/* Close button */}
            {selectedPost.thumbnail && selectedPost.thumbnail.small && (
              <img src={selectedPost.thumbnail.small} alt="Thumbnail" className="post-thumbnail" />
            )}
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.content}</p>
            {/* Display author information */}
            {selectedPost.author && (
              <div className="author-info">
                {authorImage && <img src={authorImage} alt={selectedPost.author.name} className="author-avatar" />}
                <span className="author-name">{selectedPost.author.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;

