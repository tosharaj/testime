'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { examMenuCategories, ExamMenuCategory } from '@/lib/examMenuData';
import ExamCategoryList from './ExamCategoryList';
import ExamCardGrid from './ExamCardGrid';

interface ExamsMegaMenuPanelProps {
  id: string;
  activeCategoryId: string;
  onCategoryChange: (slug: string) => void;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement>;
}

export default function ExamsMegaMenuPanel({
  id,
  activeCategoryId,
  onCategoryChange,
  onClose,
  panelRef,
}: ExamsMegaMenuPanelProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const categoryButtonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const selected: ExamMenuCategory =
    examMenuCategories.find((c) => c.slug === activeCategoryId) || examMenuCategories[0];

  useEffect(() => {
    const idx = Math.max(0, examMenuCategories.findIndex((c) => c.slug === activeCategoryId));
    setFocusedIndex(idx);
  }, [activeCategoryId]);

  const registerButton = useCallback((slug: string, el: HTMLButtonElement | null) => {
    if (el) categoryButtonsRef.current.set(slug, el);
    else categoryButtonsRef.current.delete(slug);
  }, []);

  const moveFocus = (next: number) => {
    const clamped = (next + examMenuCategories.length) % examMenuCategories.length;
    setFocusedIndex(clamped);
    const cat = examMenuCategories[clamped];
    onCategoryChange(cat.slug);
    categoryButtonsRef.current.get(cat.slug)?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveFocus(focusedIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveFocus(focusedIndex - 1);
        break;
      case 'Home':
        e.preventDefault();
        moveFocus(0);
        break;
      case 'End':
        e.preventDefault();
        moveFocus(examMenuCategories.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={panelRef}
      id={id}
      role="menu"
      aria-label="Exams mega menu"
      onKeyDown={handleKeyDown}
      className="flex max-h-[560px] overflow-hidden rounded-3xl border border-surface-100 bg-white shadow-elevated"
    >
      <ExamCategoryList
        categories={examMenuCategories}
        activeSlug={activeCategoryId}
        onSelect={onCategoryChange}
        registerButton={registerButton}
      />
      <div className="flex w-[640px] shrink-0 flex-col overflow-hidden">
        <ExamCardGrid key={selected.slug} category={selected} />
      </div>
    </div>
  );
}
