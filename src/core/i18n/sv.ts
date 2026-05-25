export const sv = {
  bannerTitle: 'Vi använder cookies',
  bannerDescription: (company: string) =>
    `${company} använder cookies för att förbättra din upplevelse på webbplatsen.`,
  detailsLink: 'Läs mer om våra cookies',
  acceptAll: 'Acceptera alla',
  rejectAll: 'Avvisa alla',
  customize: 'Anpassa',
  detailsTitle: 'Cookieinställningar',
  detailsIntro: (company: string) =>
    `Här kan du läsa om hur ${company} använder cookies och anpassa dina inställningar.`,
  whatAreCookiesTitle: 'Vad är cookies?',
  whatAreCookiesText:
    'Cookies är små textfiler som sparas på din enhet när du besöker en webbplats. De hjälper oss att förstå hur du använder webbplatsen och komma ihåg dina inställningar.',
  yourRightsTitle: 'Dina rättigheter',
  yourRightsText:
    'Enligt GDPR har du rätt att när som helst återkalla ditt samtycke eller begära att vi raderar dina uppgifter. Kontakta oss via informationen nedan.',
  contactTitle: 'Kontakta oss',
  phone: 'Telefon',
  email: 'E-post',
  saveSettings: 'Spara inställningar',
  required: 'Obligatorisk',
  categories: {
    necessary: {
      title: 'Nödvändiga cookies',
      description:
        'Dessa cookies krävs för att webbplatsen ska fungera korrekt. De kan inte inaktiveras.',
    },
    analytics: {
      title: 'Analytiska cookies',
      description:
        'Hjälper oss att förstå hur besökare använder webbplatsen, så vi kan förbättra den.',
    },
    marketing: {
      title: 'Marknadsföringscookies',
      description:
        'Används för att visa relevanta annonser och mäta effektiviteten av marknadsföringskampanjer.',
    },
  } as Record<string, { title: string; description: string }>,
}
