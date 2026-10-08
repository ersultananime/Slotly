import ru from './ru';

export type { Locale } from './ru';

/** Current locale. Replace with dynamic resolution when adding kk. */
export function t() {
  return ru;
}
