// BlogPostDetail.js - Full page view with hero image
import React, { useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './BlogPostDetail.css';

// Import local images
import img1 from '../images/local-image-1.jpg';
import img2 from '../images/local-image-2.jpg';
import img3 from '../images/local-image-3.jpg';
import img4 from '../images/local-image-4.jpg';
import img5 from '../images/local-image-5.jpg';
import img6 from '../images/local-image-6.jpg';

// Complete blog posts data with local images
const blogPostsData = [
  {
    id: 1,
    title: "The Story Behind Gaunle Mart",
    date: "May 15, 2026",
    author: "KISMAT DAHAL",
    authorRole: "Founder & CEO",
    category: "Company News",
    readTime: "5 min read",
    imageUrl: img1,
    fullContent: `
      <p>Gaunle Mart was born from a simple idea - to bring authentic, high-quality products from Nepal's local communities to every home. What started as a small village initiative has now grown into your trusted online marketplace.</p>
      
      <h2>Our Humble Beginnings</h2>
      <p>The journey began in a small village called Gaunle, where local artisans and farmers struggled to find fair prices for their exceptional products. We realized that these amazing products deserved a wider audience and fair recognition.</p>
      
      <p>In 2020, we started with just 5 products - handmade crafts, organic honey, and traditional spices. The response was overwhelming! People loved the authenticity and quality of our products.</p>
      
      <h2>Our Mission</h2>
      <p>Today, Gaunle Mart works with over 100+ local farmers, artisans, and small businesses across Nepal. Our mission is to:</p>
      <ul>
        <li>Provide authentic, high-quality Nepali products</li>
        <li>Ensure fair prices for local producers</li>
        <li>Promote sustainable and eco-friendly practices</li>
        <li>Deliver the best shopping experience to our customers</li>
      </ul>
      
      <p>Thank you for being part of our journey. Together, we're building a brighter future for Nepal's local communities.</p>
    `,
    tags: ["Community", "Sustainability", "Local Business"]
  },
  {
    id: 2,
    title: "Benefits of Organic Chaki Atta",
    date: "May 12, 2026",
    author: "KIRTAN BHANDARI",
    authorRole: "Certified Nutritionist",
    category: "Health & Wellness",
    readTime: "4 min read",
    imageUrl: img2,
    fullContent: `
      <p>In recent years, there's been a significant shift back to traditional food preparation methods. One such rediscovery is Chaki Atta - stone-ground flour that's revolutionizing how we think about our daily bread.</p>
      
      <h2>What is Chaki Atta?</h2>
      <p>Chaki Atta is flour ground using traditional stone mills (chakki) rather than modern steel roller mills. This ancient method preserves the natural goodness of wheat in ways modern processing cannot.</p>
      
      <h2>Top 5 Health Benefits</h2>
      <h3>1. Preserves Natural Nutrients</h3>
      <p>Stone grinding generates less heat, preserving heat-sensitive vitamins like B-complex and E.</p>
      
      <h3>2. Higher Fiber Content</h3>
      <p>Chaki Atta retains more bran, providing higher dietary fiber that aids digestion.</p>
      
      <h3>3. No Chemical Additives</h3>
      <p>Commercial flour often contains bleaching agents and preservatives.</p>
      
      <h3>4. Better Taste and Texture</h3>
      <p>The slow grinding process creates a distinct, nutty flavor.</p>
      
      <h3>5. Lower Glycemic Index</h3>
      <p>The coarser texture means your body digests it more slowly.</p>
    `,
    tags: ["Healthy Eating", "Nutrition", "Organic Food"]
  },
  {
    id: 3,
    title: "Why Himalayan Salt is Special",
    date: "May 10, 2026",
    author: "MAHENDRA BIKRAM DHAMI",
    authorRole: "Holistic Health Expert",
    category: "Health & Wellness",
    readTime: "6 min read",
    imageUrl: img3,
    fullContent: `
      <p>Himalayan pink salt has taken the wellness world by storm, but what makes it truly special? Let's explore the science and tradition behind this magnificent mineral.</p>
      
      <h2>The Origin Story</h2>
      <p>Mined from the ancient Khewra Salt Mine in Pakistan, this salt is believed to be over 250 million years old.</p>
      
      <h2>Rich Mineral Composition</h2>
      <p>Unlike regular table salt, Himalayan salt contains 84 trace minerals and elements.</p>
      
      <h2>Health Benefits</h2>
      <p>The minerals in Himalayan salt help maintain proper pH balance in your body.</p>
    `,
    tags: ["Wellness", "Minerals", "Natural Health"]
  },
  {
    id: 4,
    title: "Supporting Local Farmers",
    date: "May 8, 2026",
    author: "KUSMA DAHAL",
    authorRole: "Social Impact Director",
    category: "Social Impact",
    readTime: "3 min read",
    imageUrl: img4,
    fullContent: `
      <p>At Gaunle Mart, we believe that business should be a force for good. Our commitment to supporting local farmers and artisans is at the heart of everything we do.</p>
      
      <h2>Our Direct Sourcing Model</h2>
      <p>We work directly with over 100+ small-scale farmers across Nepal, eliminating middlemen and ensuring fair prices.</p>
      
      <h2>Building Sustainable Communities</h2>
      <p>Fair prices alone aren't enough. We also invest in training programs, women's empowerment, and environmental stewardship.</p>
    `,
    tags: ["Community", "Sustainability", "Fair Trade"]
  },
  {
    id: 5,
    title: "5 Healthy Cooking Tips",
    date: "May 5, 2026",
    author: "NUMA RAI",
    authorRole: "Executive Chef",
    category: "Cooking Tips",
    readTime: "7 min read",
    imageUrl: img5,
    fullContent: `
      <p>Cooking healthy doesn't mean sacrificing flavor. With the right ingredients and techniques, you can create delicious, nutritious meals.</p>
      
      <h2>1. Use Healthy Cooking Oils</h2>
      <p>Swap refined oils for cold-pressed alternatives.</p>
      
      <h2>2. Embrace Traditional Cooking Methods</h2>
      <p>Slow cooking, steaming, and using a clay pot can preserve more nutrients.</p>
      
      <h2>3. Add Spices Strategically</h2>
      <p>Spices like turmeric, cumin, and coriander are packed with antioxidants.</p>
    `,
    tags: ["Cooking", "Healthy Recipes", "Tips & Tricks"]
  },
  {
    id: 6,
    title: "Festival Special Offers",
    date: "May 1, 2026",
    author: "KISMAT DAHAL",
    authorRole: "Marketing Specialist",
    category: "Offers",
    readTime: "4 min read",
    imageUrl: img6,
    fullContent: `
      <p>The festival season is here, and Gaunle Mart has prepared something special for you! From traditional sweets to gift hampers, we have everything you need to celebrate.</p>
      
      <h2>Exclusive Festival Combos</h2>
      <p>We've curated special product bundles that make perfect gifts.</p>
      
      <h2>Festival Discounts</h2>
      <p>Enjoy up to 25% off on all products! Plus, free delivery on orders above Rs. 1500.</p>
    `,
    tags: ["Offers", "Festival", "Discounts"]
  }
];

const BlogPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const params = new URLSearchParams(location.search);
  const returnCategory = params.get('category') || 'All Posts';
  
  const post = blogPostsData.find(p => p.id === parseInt(id));
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const handleBackToBlog = useCallback(() => {
    let blogUrl = '/blog';
    if (returnCategory && returnCategory !== 'All Posts') {
      blogUrl = `/blog?category=${encodeURIComponent(returnCategory)}`;
    }
    navigate(blogUrl);
  }, [navigate, returnCategory]);
  
  if (!post) {
    return (
      <div className="blog-post-not-found">
        <h2>Post Not Found</h2>
        <p>Sorry, the blog post you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/blog')} className="back-to-blog-btn">
          ← Back to Blog
        </button>
      </div>
    );
  }
  
  return (
    <div className="blog-post-detail">
      {/* Back Button */}
      <div className="post-back-button-container">
        <button onClick={handleBackToBlog} className="post-back-btn">
          ← Back to Blog
        </button>
      </div>
      
      {/* Hero Image - Full width with object-fit cover */}
      <div className="post-hero">
        <img src={post.imageUrl} alt={post.title} className="post-hero-image" />
        <div className="post-hero-overlay"></div>
        <div className="post-hero-content">
          <span className="post-category">{post.category}</span>
          <h1 className="post-title">{post.title}</h1>
        </div>
      </div>
      
      {/* Post Content */}
      <div className="post-container">
        <div className="post-meta-bar">
          <div className="post-author-info">
            <div className="author-avatar">
              <span>{post.author.charAt(0)}</span>
            </div>
            <div>
              <div className="post-author">{post.author}</div>
              <div className="post-author-role">{post.authorRole}</div>
            </div>
          </div>
          <div className="post-stats">
            <span className="post-date">📅 {post.date}</span>
            <span className="post-read-time">⏱️ {post.readTime}</span>
          </div>
        </div>
        
        <div 
          className="post-full-content"
          dangerouslySetInnerHTML={{ __html: post.fullContent }}
        />
        
        {/* Tags Section */}
        <div className="post-tags">
          <span className="tags-label">Tags:</span>
          {post.tags.map((tag, index) => (
            <span key={index} className="post-tag">{tag}</span>
          ))}
        </div>
        
        {/* Share Section */}
        <div className="post-share">
          <span className="share-label">Share this post:</span>
          <div className="share-buttons">
            <button className="share-btn facebook">📘</button>
            <button className="share-btn twitter">🐦</button>
            <button className="share-btn whatsapp">💬</button>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="post-navigation">
          <button onClick={handleBackToBlog} className="nav-blog-btn">
            📖 View All Posts
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-top-btn">
            ↑ Back to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;