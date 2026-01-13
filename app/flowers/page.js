"use client";
import FlowersPageContent from "../../components/page-content/FlowersPageContent";
import { useTranslation } from "../../lib/useTranslation";

export default function FlowersPage() {
  const { t, isLoading } = useTranslation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Build content object from translations
  const content = {
    heroTitle: t('flowers.heroTitle'),
    heroSubtitle: t('flowers.heroSubtitle'),
    introTitle: t('flowers.introTitle'),
    introParagraphs: [
      t('flowers.introParagraph1'),
      t('flowers.introParagraph2'),
      t('flowers.introParagraph3'),
    ],
    criteriaCards: [
      {
        title: t('flowers.criteriaTitle1'),
        text: t('flowers.criteriaText1'),
      },
      {
        title: t('flowers.criteriaTitle2'),
        text: t('flowers.criteriaText2'),
      },
      {
        title: t('flowers.criteriaTitle3'),
        text: t('flowers.criteriaText3'),
      }
    ],
    narrativeTitle: t('flowers.narrativeTitle'),
    narrativeText: t('flowers.narrativeText'),
    selectionTitle: t('flowers.selectionTitle'),
    selectionPoints: [
      t('flowers.selectionPoint1'),
      t('flowers.selectionPoint2'),
      t('flowers.selectionPoint3'),
      t('flowers.selectionPoint4'),
    ],
    closingQuote: {
      before: t('flowers.closingBefore'),
      science: t('flowers.closingScience'),
      middle: t('flowers.closingMiddle'),
      garden: t('flowers.closingGarden'),
      after: t('flowers.closingAfter'),
    }
  };

  return <FlowersPageContent content={content} />;
}
