import { motion } from 'motion/react';

interface AboutPanelProps {
  language: 'vi' | 'en';
}

export default function AboutPanel({ language }: AboutPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-xl mx-auto py-12 text-center"
      id="about-container"
    >
      <div className="font-sans text-xl sm:text-2xl text-black font-normal leading-relaxed">
        {language === 'vi' ? (
          <p>Tân, 22, thất nghiệp và rảnh rỗi.</p>
        ) : (
          <p>Tân, 22, unemployed and idle.</p>
        )}
      </div>
    </motion.div>
  );
}
