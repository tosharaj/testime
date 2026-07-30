import { examCategories } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OSSSCPage() {
  const category = examCategories.find((c) => c.slug === 'osssc')!;
  return <ExamCategoryPage category={category} />;
}
