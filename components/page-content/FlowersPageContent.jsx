import Navigation from "../Navigation";

export default function FlowersPageContent({ content }) {
  const criteriaCards = [
    {
      title: content.criteriaCards[0].title,
      text: content.criteriaCards[0].text,
      className:
        "bg-blue-50/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-blue-100 hover:shadow-2xl transition-shadow duration-300",
      titleClass: "text-blue-700",
    },
    {
      title: content.criteriaCards[1].title,
      text: content.criteriaCards[1].text,
      className:
        "bg-purple-50/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-purple-100 hover:shadow-2xl transition-shadow duration-300",
      titleClass: "text-purple-700",
    },
    {
      title: content.criteriaCards[2].title,
      text: content.criteriaCards[2].text,
      className:
        "bg-indigo-50/80 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-xl border border-indigo-100 hover:shadow-2xl transition-shadow duration-300",
      titleClass: "text-indigo-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-2xl"></div>
      </div>

      <Navigation />

      <div className="relative pt-20 px-4 lg:pl-24 lg:pr-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h1 className="text-5xl lg:text-7xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              {content.heroTitle}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {content.heroSubtitle}
            </p>
          </div>

          <div className="space-y-8 mb-20">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
                {content.introTitle}
              </h2>
              <div className="space-y-6">
                {content.introParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg lg:text-xl text-gray-700 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {criteriaCards.map((card, index) => (
                <div key={card.title} className={card.className}>
                  <h3
                    className={`text-2xl lg:text-3xl font-bold mb-6 ${card.titleClass}`}
                  >
                    {card.title}
                  </h3>
                  <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-cyan-50/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-cyan-100 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl lg:text-3xl font-bold text-cyan-700 mb-6">
                {content.narrativeTitle}
              </h3>
              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                {content.narrativeText}
              </p>
            </div>

            <div className="bg-purple-50/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-purple-100 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="text-2xl lg:text-3xl font-bold text-purple-700 mb-8">
                {content.selectionTitle}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {content.selectionPoints.map((point) => (
                  <div key={point} className="flex items-start">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span className="text-lg text-gray-700 leading-relaxed">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-xl border border-white/50 hover:shadow-2xl transition-shadow duration-300">
              <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed italic font-medium">
                &ldquo;
                {content.closingQuote.before}
                <span className="font-bold text-indigo-600">
                  {content.closingQuote.science}
                </span>
                {content.closingQuote.middle}
                <span className="font-bold text-blue-600">
                  {content.closingQuote.garden}
                </span>
                {content.closingQuote.after}
                &rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

