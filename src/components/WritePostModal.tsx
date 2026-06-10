import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { BlogPost } from '../types';

interface WritePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPost: BlogPost) => void;
  allPosts: BlogPost[];
  language: 'vi' | 'en';
}

export default function WritePostModal({ isOpen, onClose, onSave, allPosts, language }: WritePostModalProps) {
  const category = 'thought';
  const [titleVi, setTitleVi] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentVi, setContentVi] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [moodVi, setMoodVi] = useState('');
  const [moodEn, setMoodEn] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  // Generate date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const insertFormat = (field: 'vi' | 'en', prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(`textarea-${field}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selectedText = text.substring(start, end);
    const placeholder = prefix.startsWith('#') ? 'Tiêu đề' : 'văn bản';
    const replacement = prefix + (selectedText || placeholder) + suffix;

    const newValue = text.substring(0, start) + replacement + text.substring(end);

    if (field === 'vi') {
      setContentVi(newValue);
    } else {
      setContentEn(newValue);
    }

    // Focus back and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText || placeholder).length
      );
    }, 10);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleVi.trim() || !contentVi.trim()) {
      alert(language === 'vi' ? 'Vui lòng điền tiêu đề và nội dung Tiếng Việt!' : 'Please fill in the Vietnamese title and content!');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    const newPost: BlogPost = {
      id: `custom-${Date.now()}`,
      title_vi: titleVi,
      title_en: titleEn || titleVi, // fallback
      content_vi: contentVi,
      content_en: contentEn || contentVi, // fallback
      date: todayStr,
      mood_vi: moodVi || (language === 'vi' ? 'Bình thường' : 'Chill'),
      mood_en: moodEn || 'Chill',
      tags: tags.length > 0 ? tags : ['thought'],
      category,
      isCustom: true
    };

    // Calculate seed array directly with the new post at the top
    const updatedSeed = [newPost, ...allPosts];
    const rawJsonStr = JSON.stringify(updatedSeed, null, 2);

    // Try to copy to clipboard
    try {
      navigator.clipboard.writeText(rawJsonStr);
    } catch (err) {
      console.warn('Could not copy to clipboard automatically', err);
    }

    onSave(newPost);
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
      // Reset
      setTitleVi('');
      setTitleEn('');
      setContentVi('');
      setContentEn('');
      setMoodVi('');
      setMoodEn('');
      setTagsInput('');
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
        id="write-modal-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white text-black max-w-xl w-full border border-neutral-200 shadow-xl overflow-hidden my-8"
          id="write-modal-content"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-100">
            <div>
              <h2 className="font-sans text-base font-bold uppercase tracking-tight">
                {language === 'vi' ? 'Không dùng được nếu không phải Tân' : 'Cannot be used unless you are Tan'}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="text-neutral-400 hover:text-black transition-colors p-1"
              id="close-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto">
            {/* Editor Area */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Title Inputs */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-neutral-500 block uppercase tracking-wider">
                    {language === 'vi' ? 'Tiêu đề (Tiếng Việt) *' : 'Title (Vietnamese) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleVi}
                    onChange={(e) => setTitleVi(e.target.value)}
                    placeholder="Ví dụ: Ghi chép vụn vặt chiều thứ Bảy"
                    className="w-full px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none placeholder-neutral-300 font-sans font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-neutral-500 block uppercase tracking-wider">
                    {language === 'vi' ? 'Tiêu đề (Tiếng Anh)' : 'Title (English)'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g., Chaotic Saturday afternoon thought"
                    className="w-full px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none placeholder-neutral-300 font-sans"
                  />
                </div>
              </div>

              {/* Contents Area */}
              <div className="space-y-5">
                {/* VI Content */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="font-mono text-[11px] text-neutral-500 block uppercase tracking-wider">
                      {language === 'vi' ? 'Nội dung (Tiếng Việt) *' : 'Content (Vietnamese) *'}
                    </label>
                  </div>

                  {/* Formatting Toolbar - VI */}
                  <div className="flex flex-wrap gap-1 items-center pb-1 border-b border-neutral-100">
                    <span className="text-[10px] font-mono font-medium text-neutral-400 mr-1.5 uppercase">Định dạng:</span>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '**', '**')} 
                      className="font-bold font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Bôi đậm"
                    >
                      B (Đậm)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '*', '*')} 
                      className="italic font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="In nghiêng"
                    >
                      I (Nghiêng)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '# ')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm font-bold cursor-pointer"
                      title="Tiêu đề lớn"
                    >
                      H1 (To)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '## ')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm font-bold cursor-pointer"
                      title="Tiêu đề vừa"
                    >
                      H2 (Vừa)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '[size=xl]', '[/size]')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Cỡ chữ rất to"
                    >
                      Khổng lồ
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '[size=lg]', '[/size]')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Cỡ chữ vừa"
                    >
                      To
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('vi', '[size=sm]', '[/size]')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Cỡ chữ ghi chú nhỏ"
                    >
                      Nhỏ
                    </button>
                  </div>

                  <textarea
                    required
                    rows={4}
                    id="textarea-vi"
                    value={contentVi}
                    onChange={(e) => setContentVi(e.target.value)}
                    placeholder="Viết những gì lướt qua não bạn lúc này..."
                    className="w-full px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none placeholder-neutral-300 font-sans resize-y"
                  />
                </div>

                {/* EN Content */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <label className="font-mono text-[11px] text-neutral-500 block uppercase tracking-wider">
                      {language === 'vi' ? 'Nội dung (Tiếng Anh)' : 'Content (English)'}
                    </label>
                  </div>

                  {/* Formatting Toolbar - EN */}
                  <div className="flex flex-wrap gap-1 items-center pb-1 border-b border-neutral-100">
                    <span className="text-[10px] font-mono font-medium text-neutral-400 mr-1.5 uppercase">Format:</span>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '**', '**')} 
                      className="font-bold font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Bold text"
                    >
                      B (Bold)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '*', '*')} 
                      className="italic font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Italic text"
                    >
                      I (Italic)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '# ')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm font-bold cursor-pointer"
                      title="Large Title"
                    >
                      H1 (Huge)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '## ')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm font-bold cursor-pointer"
                      title="Medium Title"
                    >
                      H2 (Medium)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '[size=xl]', '[/size]')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Extra Large Text"
                    >
                      XL
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '[size=lg]', '[/size]')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Large Text"
                    >
                      Lg
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat('en', '[size=sm]', '[/size]')} 
                      className="font-mono text-[10px] px-2 py-0.5 border border-neutral-200 hover:border-black hover:bg-neutral-50 rounded-sm cursor-pointer"
                      title="Small Text"
                    >
                      Sm
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    id="textarea-en"
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="Write content in English..."
                    className="w-full px-3 py-2 border border-neutral-200 text-sm focus:border-black focus:outline-none placeholder-neutral-300 font-sans resize-y"
                  />
                </div>
              </div>

              {/* Extras (Mood, Tags) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-neutral-500 block uppercase tracking-wider">
                    {language === 'vi' ? 'Tâm trạng (VI/EN)' : 'Mood (VI/EN)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Chơi vơi"
                      value={moodVi}
                      onChange={(e) => setMoodVi(e.target.value)}
                      className="w-1/2 px-3 py-1.5 border border-neutral-200 text-xs focus:border-black focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Lost"
                      value={moodEn}
                      onChange={(e) => setMoodEn(e.target.value)}
                      className="w-1/2 px-3 py-1.5 border border-neutral-200 text-xs focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[11px] text-neutral-500 block uppercase tracking-wider">
                    {language === 'vi' ? 'Thẻ tags' : 'Tags'}
                  </label>
                  <input
                    type="text"
                    placeholder="nonsense, life"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full px-3 py-1.5 border border-neutral-200 text-xs focus:border-black focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-neutral-200 text-xs font-mono uppercase tracking-wider hover:bg-neutral-55 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Đóng lại' : 'Close'}
                </button>
                <button
                  type="submit"
                  disabled={successMsg}
                  className="px-5 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {successMsg ? (
                    <span className="flex items-center gap-1 text-green-300">
                      <Check className="w-4 h-4 text-green-300 fill-transparent" />
                      {language === 'vi' ? 'ĐÃ COPY JSON & ĐĂNG BÀI!' : 'COPIED JSON & POSTED!'}
                    </span>
                  ) : (
                    <>
                      {language === 'vi' ? 'Sao chép mã JSON & Đăng bài' : 'Copy JSON & Post'}
                      <Copy className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
