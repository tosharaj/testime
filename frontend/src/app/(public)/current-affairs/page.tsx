import { redirect, RedirectType } from 'next/navigation';

export default function CurrentAffairsRedirect() {
  redirect('/notes', RedirectType.push);
}
