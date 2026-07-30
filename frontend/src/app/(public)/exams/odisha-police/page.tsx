import { getCategoryBySlug } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OdishaPolicePage() {
  return <ExamCategoryPage category={getCategoryBySlug('odisha-police')!} />;
}
