import { getCategoryBySlug } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OdishaUniversitiesPage() {
  return <ExamCategoryPage category={getCategoryBySlug('odisha-universities')!} />;
}
