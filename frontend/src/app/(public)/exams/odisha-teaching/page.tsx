import { getCategoryBySlug } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OdishaTeachingPage() {
  return <ExamCategoryPage category={getCategoryBySlug('odisha-teaching')!} />;
}
