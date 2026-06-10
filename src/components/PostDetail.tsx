import { motion } from 'motion/react';
import { BlogPost } from '../types';
import { ArrowLeft, Calendar } from 'lucide-react';

interface PostDetailProps {
  post: BlogPost;
  language: 'vi' | 'en';
  onBack: () => void;
}

function formatContentToHtml(text: string): string {
  if (!text) return '';
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = escaped.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      const inner = trimmed.slice(2);
      return `<h2 class="font-sans text-2xl font-black text-black mt-6 mb-3 uppercase tracking-tight">${inner}</h2>`;
    }
    if (trimmed.startsWith('## ')) {
      const inner = trimmed.slice(3);
      return `<h3 class="font-sans text-lg font-bold text-black mt-5 mb-2 uppercase tracking-tight">${inner}</h3>`;
    }
    if (trimmed === '') {
      return '<div class="h-3"></div>';
    }
    return `<p class="font-sans text-neutral-800 text-[15px] leading-relaxed my-1.5">${line}</p>`;
  });

  let joined = processedLines.join('\n');

  joined = joined.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-black">$1</strong>');
  joined = joined.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
  joined = joined.replace(/\[size=lg\](.*?)\[\/size\]/gi, '<span class="text-lg font-bold text-black my-2 block">$1</span>');
  joined = joined.replace(/\[size=xl\](.*?)\[\/size\]/gi, '<span class="text-xl font-black text-black my-3 block uppercase tracking-tight">$1</span>');
  joined = joined.replace(/\[size=sm\](.*?)\[\/size\]/gi, '<span class="text-xs text-neutral-500 my-1 block font-mono">$1</span>');

  return joined;
}

export default function PostDetail({ post, language, onBack }: PostDetailProps) {
  const title = language === 'vi' ? post.title_vi : post.title_en;
  const content = language === 'vi' ? post.content_vi : post.content_en;
  const mood = language === 'vi' ? post.mood_vi : post.mood_en;

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-2xl mx-auto space-y-8"
      id="post-detail-container"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="group flex items-center gap-2 text-neutral-400 hover:text-black transition-colors font-mono text-xs uppercase tracking-wider focus:outline-none"
        id="detail-back-button"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        {language === 'vi' ? 'Quay lại danh sách' : 'Back to thoughts'}
      </button>

      {/* Hero Meta */}
      <div className="space-y-4 pt-4 border-t border-neutral-100" id="detail-header">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-neutral-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {post.date}
          </span>
          <span>//</span>
          <span className="italic">
            {language === 'vi' ? 'Tâm trạng: ' : 'Mood: '}
            <span className="text-neutral-600 font-medium">{mood}</span>
          </span>
          <span>//</span>
          <span className="text-neutral-500 font-medium">
            {language === 'vi' ? 'Tác giả: ' : 'Author: '}
            <span className="text-black font-semibold">
              {post.id === 'post-0' ? (language === 'vi' ? 'Không phải Tân' : 'Not Tan') : (language === 'vi' ? 'Tân' : 'Tan')}
            </span>
          </span>
        </div>

        <h1 className="font-sans text-3xl sm:text-4xl text-black font-bold leading-tight tracking-tight">
          {title}
        </h1>
      </div>

      {/* Main Body */}
      <div className="border-b border-neutral-100 pb-10" id="detail-body">
        <div 
          className="space-y-1"
          dangerouslySetInnerHTML={{ __html: formatContentToHtml(content) }}
        />
      </div>
    </motion.article>
  );
}
