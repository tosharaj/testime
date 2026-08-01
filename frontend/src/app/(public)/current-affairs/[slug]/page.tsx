export const dynamic = 'force-static';

export default function CurrentAffairsArticleGone() {
  const err = new Error('This content has been removed.');
  (err as Error & { digest?: string }).digest = 'NEXT_HTTP_ERROR_FALLBACK;410';
  throw err;
}
