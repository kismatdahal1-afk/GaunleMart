// Blog.js - Blog page with instant filtering and local images
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Blog.css';

// Import local images
import img1 from '../images/local-image-1.jpg';
import img2 from '../images/local-image-2.jpg';
import img3 from '../images/local-image-3.jpg';
import img4 from '../images/local-image-4.jpg';
import img5 from '../images/local-image-5.jpg';
import img6 from '../images/local-image-6.jpg';

// Blog posts data with local image imports (constant outside component)
const ALL_POSTS = [
  {
    id: 1,
    title: "The Story Behind Gaunle Mart",
    date: "May 15, 2026",
    author: "Team Gaunle",
    category: "Company News",
    description: "Discover how Gaunle Mart started with a mission to bring authentic Nepali products to every home. From humble beginnings to your trusted mart...",
    imageUrl: img1,
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Benefits of Organic Chaki Atta",
    date: "May 12, 2026",
    author: "Nutrition Expert",
    category: "Health & Wellness",
    description: "Learn why traditional stone-ground flour is making a comeback and how it benefits your family's health compared to commercially milled flour...",
    imageUrl: img2,
    readTime: "4 min read"
  },
  {
    id: 3,
    title: "Why Himalayan Salt is Special",
    date: "May 10, 2026",
    author: "Wellness Coach",
    category: "Health & Wellness",
    description: "Explore the unique mineral composition of pink Himalayan salt and why it's considered one of the purest salts available in the world...",
    imageUrl: img3,
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Supporting Local Farmers",
    date: "May 8, 2026",
    author: "Community Team",
    category: "Social Impact",
    description: "Gaunle Mart's commitment to working directly with local farmers and artisans to ensure fair prices and sustainable practices...",
    imageUrl: img4,
    readTime: "3 min read"
  },
  {
    id: 5,
    title: "5 Healthy Cooking Tips",
    date: "May 5, 2026",
    author: "Chef Ramesh",
    category: "Cooking Tips",
    description: "Simple yet effective tips to make your daily cooking healthier without compromising on taste using Gaunle Mart products...",
    imageUrl: img5,
    readTime: "7 min read"
  },
  {
    id: 6,
    title: "Festival Special Offers",
    date: "May 1, 2026",
    author: "Marketing Team",
    category: "Offers",
    description: "Get ready for the upcoming festival season with exclusive discounts and special combos only at Gaunle Mart...",
    imageUrl: img6,
    readTime: "4 min read"
  }
];

// Available categories (constant outside component)
const CATEGORIES = [
  'All Posts',
  'Company News',
  'Health & Wellness',
  'Cooking Tips',
  'Social Impact',
  'Offers'
];

const Blog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All Posts');

  // Read category from URL query parameter on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    
    if (categoryFromUrl && CATEGORIES.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('All Posts');
    }
  }, [location.search]); // Removed CATEGORIES dependency - it's constant

  // Memoized filtered posts - only recalculates when selectedCategory changes
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All Posts') {
      return ALL_POSTS;
    }
    return ALL_POSTS.filter(post => post.category === selectedCategory);
  }, [selectedCategory]);

  // Handle category click - instant update with URL sync
  const handleCategoryClick = useCallback((category) => {
    setSelectedCategory(category);
    
    // Update URL without page reload
    const params = new URLSearchParams();
    if (category !== 'All Posts') {
      params.set('category', category);
    }
    const newUrl = `/blog${params.toString() ? `?${params.toString()}` : ''}`;
    navigate(newUrl, { replace: true, state: { noScroll: true } });
  }, [navigate]);

  // Handle card click - navigates to blog post detail with category
  const handleCardClick = useCallback((postId) => {
    let detailUrl = `/blog/${postId}`;
    if (selectedCategory !== 'All Posts') {
      detailUrl += `?category=${encodeURIComponent(selectedCategory)}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(detailUrl);
  }, [navigate, selectedCategory]);

  // Add scroll animation observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="blog-page">
      {/* Blog Header */}
      <div className="blog-header animate-on-scroll">
        <h1 className="blog-title">Our Blog</h1>
        <p className="blog-subtitle">Stories, tips, and updates from Gaunle Mart</p>
        <div className="blog-header-line"></div>
      </div>

      {/* Blog Categories Filter Bar */}
      <div className="blog-categories-container animate-on-scroll">
        <div className="blog-categories">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="blog-results-count">
        Showing {filteredPosts.length} of {ALL_POSTS.length} posts
        {selectedCategory !== 'All Posts' && (
          <span className="active-category-badge">Category: {selectedCategory}</span>
        )}
      </div>

      {/* Blog Posts Grid - 2 columns on desktop, 1 on mobile */}
      <div className="blog-grid">
        {filteredPosts.length === 0 ? (
          <div className="no-blog-posts">
            <p>No posts found in this category.</p>
            <button 
              onClick={() => handleCategoryClick('All Posts')}
              className="reset-filter-btn"
            >
              View All Posts
            </button>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="blog-card animate-on-scroll"
              onClick={() => handleCardClick(post.id)}
              style={{ 
                cursor: 'pointer',
                animationDelay: `${index * 0.1}s` 
              }}
            >
              <div className="blog-card-image">
                {/* Uniform image container - fixed height, object-fit cover */}
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="blog-post-image"
                />
                <span className="blog-category-tag">{post.category}</span>
              </div>
              <div className="blog-card-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-dot">•</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                <h3 className="blog-post-title">{post.title}</h3>
                <p className="blog-excerpt">{post.description}</p>
                <div className="blog-footer">
                  <span className="blog-author">By {post.author}</span>
                  <button 
                    className="read-more-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(post.id);
                    }}
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Newsletter Section */}
      <div className="newsletter-section animate-on-scroll">
        <div className="newsletter-content">
          <h3 className="newsletter-title">Subscribe to Our Newsletter</h3>
          <p className="newsletter-text">
            Get the latest updates, offers, and healthy tips directly in your inbox.
          </p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
          <p className="newsletter-note">No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default Blog;