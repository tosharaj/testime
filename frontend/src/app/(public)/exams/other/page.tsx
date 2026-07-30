import { getCategoryBySlug } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OtherPage() {
  return <ExamCategoryPage category={getCategoryBySlug('other')!} />;
}
