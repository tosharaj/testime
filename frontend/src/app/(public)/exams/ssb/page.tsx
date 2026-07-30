import { examCategories } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function SSBPage() {
  const category = examCategories.find((c) => c.slug === 'ssb')!;
  return <ExamCategoryPage category={category} />;
}
