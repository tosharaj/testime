import { examCategories } from '@/lib/examCategories';
import ExamCategoryPage from '@/components/exams/ExamCategoryPage';

export default function OPSCPage() {
  const category = examCategories.find((c) => c.slug === 'opsc')!;
  return <ExamCategoryPage category={category} />;
}
