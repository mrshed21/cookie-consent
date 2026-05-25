export const en = {
  bannerTitle: 'We use cookies',
  bannerDescription: (company: string) =>
    `${company} uses cookies to improve your experience on our website.`,
  detailsLink: 'Learn more about our cookies',
  acceptAll: 'Accept all',
  rejectAll: 'Reject all',
  customize: 'Customize',
  detailsTitle: 'Cookie settings',
  detailsIntro: (company: string) =>
    `Here you can read about how ${company} uses cookies and customize your preferences.`,
  whatAreCookiesTitle: 'What are cookies?',
  whatAreCookiesText:
    'Cookies are small text files stored on your device when you visit a website. They help us understand how you use the site and remember your preferences.',
  yourRightsTitle: 'Your rights',
  yourRightsText:
    'Under GDPR, you have the right to withdraw your consent or request deletion of your data at any time. Contact us using the information below.',
  contactTitle: 'Contact us',
  phone: 'Phone',
  email: 'Email',
  saveSettings: 'Save settings',
  required: 'Required',
  categories: {
    necessary: {
      title: 'Necessary cookies',
      description:
        'These cookies are required for the website to function properly. They cannot be disabled.',
    },
    analytics: {
      title: 'Analytics cookies',
      description:
        'Help us understand how visitors use the website so we can improve it.',
    },
    marketing: {
      title: 'Marketing cookies',
      description:
        'Used to show relevant ads and measure the effectiveness of marketing campaigns.',
    },
  } as Record<string, { title: string; description: string }>,
}
