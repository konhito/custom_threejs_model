export function chapterList(payload) {
  return Array.isArray(payload) ? payload : payload?.chapters || payload?.data || [];
}

export function chapterNumber(chapter) {
  return Number(chapter.number ?? chapter.chapter_number);
}

export function isPurchased(chapter) {
  return Boolean(chapter.owned ?? chapter.purchased ?? chapter.unlocked ?? chapter.has_access);
}
