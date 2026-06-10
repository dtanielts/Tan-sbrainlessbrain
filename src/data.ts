import { BlogPost } from './types';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-0',
    title_vi: 'Không phải của Tân',
    title_en: 'Not from Tan',
    content_vi: 'Chào Tân, bài viết này dành riêng cho Tân vì Tân là người không học lập trình. Đừng lo lắng, cách để đăng bài viết mới lên trang blog này siêu dễ và không đòi hỏi cài đặt bất kỳ cơ sở dữ liệu (Database) phức tạp nào cả. Tân chỉ cần làm theo các bước cực kỳ đơn giản sau đây nhé:\n\nBước 1: Tìm nút bấm có chữ "Chỉ Tân làm được" ở góc dưới cùng bên phải của trang này và bấm vào đó để mở bảng soạn thảo.\nBước 2: Điền đầy đủ Tiêu đề, Tâm trạng và Nội dung bài viết bằng cả tiếng Việt và tiếng Anh.\nBước 3: Sau khi điền xong, hãy nhìn sang ô bên phải của bảng viết bài, Tân sẽ thấy có một ô chứa đoạn mã hay chuỗi văn bản tự động cập nhật liên tục.\nBước 4: Hãy bấm nút "Copy" ở góc đó để sao chép toàn bộ đoạn văn bản ấy.\nBước 5: Cuối cùng, Tân hãy mở thư mục mã nguồn của trang web này lên, truy cập vào tệp nguồn có đường dẫn "src/data.ts", rồi dán đè (Paste) toàn bộ đoạn văn bản vừa copy thay thế vào mảng VARIABLE có tên là INITIAL_POSTS. Luôn nhớ lưu lại sau khi dán nhé!\n\nThế là xong! Tất cả các bài viết mới của Tân sẽ được lưu trữ vĩnh viễn và hiển thị cho mọi người ghé thăm blog cá nhân của Tân rồi.',
    content_en: 'Hi Tan, this article is written specifically for you because you are not a programmer. Don\'t worry, posting new articles here is super easy and requires absolutely no complex database setups. Just follow these simple steps:\n\nStep 1: Look for the button labeled "Only Tan can do" in the very bottom-right corner of this page and click it. This will open the writing panel.\n2. Fill in the Title, Mood, and Content fields in both Vietnamese and English.\n3. Once finished, look at the right-side box in the writing panel, you will see a box with auto-generated JSON code (which is just a long text block).\n4. Click the "Copy" button to copy this text block.\n5. Navigate to your website\'s source file "src/data.ts", delete everything inside the INITIAL_POSTS variable, and paste the copied block there. Don\'t forget to save the file!\n\nThat\'s it! Your new articles will be permanently saved and visible to every visitor on your personal blog.',
    date: '2026-06-10',
    mood_vi: 'Vui vẻ một chút',
    mood_en: 'Slightly happy',
    learning_vi: 'Cách vận hành blog cá nhân cực kỳ tối giản không cần cơ sở dữ liệu.',
    learning_en: 'How to maintain a hyper-minimal personal serverless blog.',
    tags: ['guide', 'meta', 'non-tan'],
    category: 'thought'
  }
];
