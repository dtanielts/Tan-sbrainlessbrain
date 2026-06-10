import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Languages } from 'lucide-react';
import { BlogPost } from './types';
import { INITIAL_POSTS } from './data';
import AboutPanel from './components/AboutPanel';
import PostDetail from './components/PostDetail';
import WritePostModal from './components/WritePostModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'about'>('home');
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  
  // Loaded Posts (INITIAL_POSTS + user custom posts)
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Modal toggle
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // Sync / Load articles from localStorage
  useEffect(() => {
    const local = localStorage.getItem('tans_blog_custom_posts');
    if (local) {
      try {
        const parsedCustom: BlogPost[] = JSON.parse(local);
        // Exclude custom posts whose title is 'Test' or 'test' (or ID is test)
        const cleanedCustom = parsedCustom.filter(post => {
          const t_vi = (post.title_vi || '').trim().toLowerCase();
          const t_en = (post.title_en || '').trim().toLowerCase();
          const p_id = (post.id || '').trim().toLowerCase();
          return t_vi !== 'test' && t_en !== 'test' && p_id !== 'test';
        });

        if (cleanedCustom.length !== parsedCustom.length) {
          localStorage.setItem('tans_blog_custom_posts', JSON.stringify(cleanedCustom));
        }

        const combined = [...cleanedCustom, ...INITIAL_POSTS];
        // Unique based on ID
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        setPosts(unique);
      } catch (err) {
        setPosts(INITIAL_POSTS);
      }
    } else {
      setPosts(INITIAL_POSTS);
    }
  }, []);

  // Save new post to local storage and update state
  const handleSavePost = (newPost: BlogPost) => {
    const local = localStorage.getItem('tans_blog_custom_posts');
    let customList: BlogPost[] = [];
    if (local) {
      try {
        customList = JSON.parse(local);
      } catch (e) {
        customList = [];
      }
    }
    const updatedCustom = [newPost, ...customList];
    localStorage.setItem('tans_blog_custom_posts', JSON.stringify(updatedCustom));
    
    // Combine with INITIAL_POSTS
    setPosts([newPost, ...posts]);
  };

  const handleBrandClick = () => {
    setActiveTab('home');
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans antialiased selection:bg-black selection:text-white pb-20" id="blog-root-layout">
      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        
        {/* Editorial Brand Header */}
        <header className="border-b border-neutral-100 pb-8 flex flex-row justify-between items-center gap-6 flex-wrap sm:flex-nowrap" id="brand-header">
          <div className="space-y-1">
            <h1 
              onClick={handleBrandClick}
              className="font-sans text-3xl sm:text-4xl font-black tracking-tighter text-black uppercase cursor-pointer hover:opacity-80 transition-opacity select-none"
            >
              Tan's brainless brain
            </h1>
          </div>

          {/* Controls: About toggle and Language settings */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs" id="nav-and-language-controls">
            {/* Nav Tabs */}
            <div className="flex bg-neutral-100 p-0.5 rounded-sm">
              <button
                onClick={() => { setActiveTab('home'); setSelectedPost(null); }}
                className={`px-3 py-1.5 transition-all uppercase tracking-wider ${
                  activeTab === 'home' 
                    ? 'bg-white text-black font-medium shadow-xs' 
                    : 'text-neutral-500 hover:text-black'
                }`}
                id="tab-home-btn"
              >
                {language === 'vi' ? 'Báo đời' : 'Articles'}
              </button>
              <button
                onClick={() => { setActiveTab('about'); setSelectedPost(null); }}
                className={`px-3 py-1.5 transition-all uppercase tracking-wider ${
                  activeTab === 'about' 
                    ? 'bg-white text-black font-medium shadow-xs' 
                    : 'text-neutral-500 hover:text-black'
                }`}
                id="tab-about-btn"
              >
                {language === 'vi' ? 'Tân' : 'Tan'}
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(lang => lang === 'vi' ? 'en' : 'vi')}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-black transition-colors"
              title="Change Language"
              id="lang-toggle-btn"
            >
              <Languages className="w-3.5 h-3.5" />
              <span className="uppercase tracking-widest font-semibold">{language === 'vi' ? 'English' : 'Tiếng Việt'}</span>
            </button>
          </div>
        </header>

        {/* Active View Router */}
        <AnimatePresence mode="wait">
          {activeTab === 'about' ? (
            <div key="about-tab">
              <AboutPanel language={language} />
            </div>
          ) : selectedPost ? (
            <div key="post-detail-view">
              <PostDetail 
                post={selectedPost} 
                language={language} 
                onBack={() => setSelectedPost(null)} 
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
              key="home-tab"
              id="home-feed-root"
            >
              {/* A simple vertical blog roll (Clean, no-serif, black/white listing) */}
              <div className="space-y-8 divide-y divide-neutral-100" id="editorial-posts-index">
                {posts.length > 0 ? (
                  posts.map((post) => {
                    const postTitle = language === 'vi' ? post.title_vi : post.title_en;
                    const postExcerpt = language === 'vi' ? post.content_vi : post.content_en;
                    const postMood = language === 'vi' ? post.mood_vi : post.mood_en;

                    return (
                      <div
                        key={post.id}
                        className="pt-8 first:pt-0 group cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                        id={`blogroll-item-${post.id}`}
                      >
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-neutral-400">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span className="italic">
                              {language === 'vi' ? 'Tâm trạng: ' : 'Mood: '}{postMood}
                            </span>
                            <span>•</span>
                            <span className="text-neutral-500 font-medium">
                              {language === 'vi' ? 'Tác giả: ' : 'Author: '}
                              <span className="text-black font-semibold">
                                {post.id === 'post-0' ? (language === 'vi' ? 'Không phải Tân' : 'Not Tan') : (language === 'vi' ? 'Tân' : 'Tan')}
                              </span>
                            </span>
                          </div>

                          <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-black group-hover:underline">
                            {postTitle}
                          </h3>

                          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl line-clamp-3">
                            {postExcerpt}
                          </p>

                          <div className="flex items-center justify-between w-full pt-1">
                            <div></div>
                            <span className="font-mono text-xs text-black font-semibold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                              {language === 'vi' ? 'Đọc bài →' : 'Read →'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 bg-neutral-50 p-6 space-y-3">
                    <p className="font-mono text-xs text-neutral-500">
                      {language === 'vi' ? 'Không có bài đăng nào.' : 'No thoughts found.'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Footer */}
        <footer className="pt-12 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-6 text-neutral-500 font-mono text-xs mt-20" id="blog-footer">
          <div className="text-black font-medium">
            {language === 'vi' 
              ? 'Gmail: tdtan.work@gmail.com - Liên hệ công việc hoặc rảnh' 
              : 'Gmail: tdtan.work@gmail.com - Contact for work or if you are free'}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsWriteModalOpen(true)}
              className="text-[11px] font-mono font-semibold hover:underline flex items-center gap-1 focus:outline-none px-2 py-1 border border-dashed border-neutral-300 hover:border-black cursor-pointer text-black"
              id="bottom-write-action"
            >
              <Plus className="w-3 h-3" />
              {language === 'vi' ? 'Chỉ Tân làm được' : 'Only Tan can do'}
            </button>
          </div>
        </footer>
      </main>

      {/* Editor Modal */}
      <WritePostModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSave={handleSavePost}
        allPosts={posts}
        language={language}
      />
    </div>
  );
}
