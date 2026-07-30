import { examCategories } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OSSCPage() {
  const category = examCategories.find((c) => c.slug === 'ossc')!;
  return <ExamCategoryPage category={category} />;
}
