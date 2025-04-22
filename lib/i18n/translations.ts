// Define the structure of our translations
export type Translation = {
  // App title and description
  appTitle: string
  appDescription: string

  // Form labels
  itemName: string
  itemValue: string
  currency: string
  addItem: string
  reset: string

  // Table headers and content
  addedItems: string
  inputValue: string
  calculatedValue: string

  // Currency names
  usd: string
  egp: string
  aed: string
  eur: string
  gbp: string
  sar: string
  jpy: string
  cny: string
  cad: string
  aud: string
  chf: string
  inr: string
  rub: string
  try: string
  brl: string
  kwd: string
  qar: string
  myr: string

  // Nuevas divisas
  ils: string
  jod: string
  lbp: string
  mad: string
  omr: string
  bhd: string
  dzd: string
  tnd: string

  // Totals section
  totalAmount: string
  inUSD: string
  inEGP: string
  inAED: string
  inEUR: string
  inGBP: string
  inSAR: string
  inJPY: string
  inCNY: string
  inCAD: string
  inAUD: string
  inCHF: string
  inINR: string
  inRUB: string
  inTRY: string
  inBRL: string
  inKWD: string
  inQAR: string
  inMYR: string
  totalCurrency: string
  selectTotalCurrency: string

  // Exchange rates
  lastUpdated: string
  updateRates: string

  // PDF related
  downloadPDF: string
  companyInfo: string
  addCompanyInfo: string
  editCompanyInfo: string
  pdfFileName: string

  // Company info dialog
  companyInfoTitle: string
  companyInfoDescription: string
  companyName: string
  companyAddress: string
  companyPhone: string
  companyLogo: string
  clickToUpload: string
  dragAndDrop: string
  maxFileSize: string
  uploadingLogo: string
  saveInfo: string
  cancel: string

  // Toast messages
  errorUpdatingRates: string
  errorUpdatingRatesDesc: string
  fileDownloadSuccess: string
  fileDownloadSuccessDesc: string
  fileDownloadError: string
  fileDownloadErrorDesc: string
  companyInfoSaved: string
  companyInfoSavedDesc: string

  // PDF content
  reportDate: string
  dollarToEGP: string
  dollarToAED: string
  generatedBy: string
  address: string
  phone: string

  // New keys for edit/delete functionality
  actions: string
  edit: string
  delete: string
  updateItem: string

  // PWA related
  installApp: string
  offlineTitle: string
  offlineDescription: string
  networkStatus: string
  online: string
  offline: string

  // Rates updated
  ratesUpdated: string
  ratesUpdatedDesc: string

  // Empty state
  emptyStateTitle: string
  emptyStateDescription: string

  // Chart related
  chartTitle: string
  chartTitleDistribution: string
  chartTitleCount: string
  chartTitleItems: string
  chartTitleValues: string
  pieChartView: string
  barChartView: string
  itemsChartView: string
  itemCount: string

  // Navigation links
  backToHome: string

  // Privacy Policy
  privacyPolicy: string
  lastUpdated: string
  introductionTitle: string
  privacyIntro: string
  informationCollectionTitle: string
  informationCollection: string
  deviceInfo: string
  usageData: string
  preferences: string
  dataUsageTitle: string
  dataUsage: string
  improveService: string
  userExperience: string
  analytics: string
  dataStorageTitle: string
  dataStorage: string
  thirdPartyServicesTitle: string
  thirdPartyServices: string
  userRightsTitle: string
  userRights: string
  policyChangesTitle: string
  policyChanges: string
  contactTitle: string
  contactInfo: string

  // Terms and Conditions
  termsAndConditions: string
  acceptanceTitle: string
  acceptanceText: string
  useOfServiceTitle: string
  useOfServiceText: string
  useRestriction1: string
  useRestriction2: string
  useRestriction3: string
  intellectualPropertyTitle: string
  intellectualPropertyText: string
  disclaimerTitle: string
  disclaimerText: string
  limitationOfLiabilityTitle: string
  limitationOfLiabilityText: string
  changesTitle: string
  changesText: string
  governingLawTitle: string
  governingLawText: string
  contactInfoTerms: string

  // About Us
  aboutUsSubtitle: string
  ourMissionTitle: string
  ourMissionText: string
  whatWeOfferTitle: string
  whatWeOfferText: string
  feature1: string
  feature2: string
  feature3: string
  feature4: string
  ourStoryTitle: string
  ourStoryText: string
  contactUsTitle: string
  contactUsText: string
  email: string
  website: string
  copyrightText: string
  aboutUs: string

  // Theme related
  toggleTheme: string
  lightTheme: string
  darkTheme: string

  // Features
  features: string
  feature1Description: string
  feature2Description: string
  feature3Description: string
  feature4Description: string

  // Calculation History
  calculationHistory: string
  saveCalculation: string
  noCalculationHistory: string
  load: string
  clearHistory: string
  items: string
  total: string

  // Cookie Consent
  cookieConsentTitle: string
  cookieConsentDescription: string
  necessaryCookies: string
  necessaryCookiesDescription: string
  preferencesCookies: string
  preferencesCookiesDescription: string
  analyticsCookies: string
  analyticsCookiesDescription: string
  marketingCookies: string
  marketingCookiesDescription: string
  acceptAllCookies: string
  rejectAllCookies: string
  showDetails: string
  hideDetails: string
  savePreferences: string
  generatingPDF: string
  pleaseWait: string
  noItemsToExport: string
  pdfGenerationFailed: string
  tryAgainLater: string

  // CSV Export
  exportCSV: string
  csvDownloadSuccessDesc: string
  csvDownloadErrorDesc: string

  // Exchange Rate Fallbacks
  usingFallbackRates: string
  usingFallbackRatesDesc: string
  someRatesUnavailable: string
  someRatesUnavailableDesc: string
}

// Arabic translations
const ar: Translation = {
  // Cookie Consent
  cookieConsentTitle: "إعدادات الخصوصية وملفات تعريف الارتباط",
  cookieConsentDescription:
    "نستخدم ملفات تعريف الارتباط وتقنيات التخزين المماثلة لتحسين تجربتك على موقعنا. يمكنك تخصيص تفضيلاتك أو قبول جميع ملفات تعريف الارتباط.",
  necessaryCookies: "ملفات تعريف الارتباط الضرورية",
  necessaryCookiesDescription: "ضرورية لتشغيل الموقع ولا يمكن تعطيلها.",
  preferencesCookies: "ملفات تعريف ارتباط التفضيلات",
  preferencesCookiesDescription: "تسمح للموقع بتذكر المعلومات التي تغير طريقة عمل الموقع أو مظهره.",
  analyticsCookies: "ملفات تعريف ارتباط التحليلات",
  analyticsCookiesDescription: "تساعدنا على فهم كيفية تفاعل الزوار مع الموقع.",
  marketingCookies: "ملفات تعريف ارتباط التسويق",
  marketingCookiesDescription: "تستخدم لتتبع الزوار عبر مواقع الويب وعرض إعلانات ذات صلة.",
  acceptAllCookies: "قبول الكل",
  rejectAllCookies: "رفض غير الضرورية",
  showDetails: "عرض التفاصيل",
  hideDetails: "إخفاء التفاصيل",
  savePreferences: "حفظ التفضيلات",
  appTitle: "WorldCosts",
  appDescription: "احسب تكلفة منتجاتك بدقة وبعملات مختلفة مع إمكانية احتساب الشحن والضرائب والجمارك",

  itemName: "اسم العنصر",
  itemValue: "القيمة (يمكن إجراء عمليات حسابية)",
  currency: "العملة",
  addItem: "إضافة العنصر",
  reset: "إعادة تعيين",

  addedItems: "العناصر المضافة",
  inputValue: "القيمة المدخلة",
  calculatedValue: "القيمة المحسوبة",

  usd: "دولار أمريكي",
  egp: "جنيه مصري",
  aed: "درهم إماراتي",
  eur: "يورو",
  gbp: "جنيه إسترليني",
  sar: "ريال سعودي",
  jpy: "ين ياباني",
  cny: "يوان صيني",
  cad: "دولار كندي",
  aud: "دولار أسترالي",
  chf: "فرنك سويسري",
  inr: "روبية هندية",
  rub: "روبل روسي",
  try: "ليرة تركية",
  brl: "ريال برازيلي",
  kwd: "دينار كويتي",
  qar: "ريال قطري",
  myr: "رينجيت ماليزي",

  // Nuevas divisas
  ils: "شيكل إسرائيلي",
  jod: "دينار أردني",
  lbp: "ليرة لبنانية",
  mad: "درهم مغربي",
  omr: "ريال عماني",
  bhd: "دينار بحريني",
  dzd: "دينار جزائري",
  tnd: "دينار تونسي",

  totalAmount: "المجموع الكلي",
  inUSD: "بالدولار الأمريكي",
  inEGP: "بالجنيه المصري",
  inAED: "بالدرهم الإماراتي",
  inEUR: "باليورو",
  inGBP: "بالجنيه الإسترليني",
  inSAR: "بالريال السعودي",
  inJPY: "بالين الياباني",
  inCNY: "باليوان الصيني",
  inCAD: "بالدولار الكندي",
  inAUD: "بالدولار الأسترالي",
  inCHF: "بالفرنك السويسري",
  inINR: "بالروبية الهندية",
  inRUB: "بالروبل الروسي",
  inTRY: "بالليرة التركية",
  inBRL: "بالريال البرازيلي",
  inKWD: "بالدينار الكويتي",
  inQAR: "بالريال القطري",
  inMYR: "بالرينجيت الماليزي",
  totalCurrency: "عملة المجموع",
  selectTotalCurrency: "اختر عملة المجموع",

  lastUpdated: "آخر تحديث لأسعار الصرف",
  updateRates: "تحديث الأسعار",

  downloadPDF: "تحميل PDF",
  companyInfo: "معلومات الشركة",
  addCompanyInfo: "إضافة معلومات الشركة",
  editCompanyInfo: "تعديل معلومات الشركة",
  pdfFileName: "اسم ملف PDF",

  companyInfoTitle: "معلومات الشركة",
  companyInfoDescription: "أدخل معلومات الشركة التي ستظهر في ملف PDF",
  companyName: "اسم الشركة",
  companyAddress: "عنوان الشركة",
  companyPhone: "رقم الهاتف",
  companyLogo: "شعار الشركة",
  clickToUpload: "اضغط للتحميل",
  dragAndDrop: "أو اسحب وأفلت",
  maxFileSize: "PNG, JPG (الحد الأقصى: 2MB)",
  uploadingLogo: "جاري تحميل الشعار...",
  saveInfo: "حفظ المعلومات",
  cancel: "إلغاء",

  errorUpdatingRates: "خطأ في تحديث أسعار الصرف",
  errorUpdatingRatesDesc: "تعذر تحديث أسعار الصرف. سيتم استخدام الأسعار الافتراضية.",
  fileDownloadSuccess: "تم تحميل الملف بنجاح",
  fileDownloadSuccessDesc: "تم إنشاء ملف PDF وتحميله بنجاح.",
  fileDownloadError: "خطأ في إنشاء الملف",
  fileDownloadErrorDesc: "حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.",
  companyInfoSaved: "تم حفظ معلومات الشركة",
  companyInfoSavedDesc: "سيتم إضافة معلومات الشركة إلى ملف PDF عند التحميل.",

  reportDate: "تاريخ التقرير",
  dollarToEGP: "سعر الدولار مقابل الجنيه المصري",
  dollarToAED: "سعر الدولار مقابل الدرهم الإماراتي",
  generatedBy: "تم إنشاء هذا التقرير بواسطة WorldCosts",
  address: "العنوان",
  phone: "الهاتف",

  // New translations
  actions: "الإجراءات",
  edit: "تعديل",
  delete: "حذف",
  updateItem: "تحديث العنصر",

  // PWA translations
  installApp: "تثبيت التطبيق",
  offlineTitle: "أنت غير متصل بالإنترنت",
  offlineDescription: "بعض الميزات قد لا تعمل بشكل صحيح. يرجى التحقق من اتصالك بالإنترنت.",
  networkStatus: "حالة الاتصال",
  online: "متصل",
  offline: "غير متصل",

  // Rates updated
  ratesUpdated: "تم تحديث الأسعار",
  ratesUpdatedDesc: "تم تحديث أسعار الصرف بنجاح",

  // Empty state
  emptyStateTitle: "حاسبة العملات المتعددة",
  emptyStateDescription: "أضف عناصر باستخدام النموذج أعلاه لبدء حساب تكاليف منتجاتك بعملات متعددة.",

  // Chart related
  chartTitle: "الرسم البياني للعناصر",
  chartTitleDistribution: "توزيع القيم حسب العملة",
  chartTitleCount: "عدد العناصر حسب العملة",
  chartTitleItems: "قيم العناصر المضافة",
  chartTitleValues: "القيم الإجمالية حسب العملة",
  pieChartView: "عرض مخطط دائري للعملات",
  barChartView: "عرض مخطط شريطي للقيم حسب العملة",
  itemsChartView: "عرض قيم العناصر",
  itemCount: "عدد العناصر",

  // ترجمات جديدة للصفحات الإضافية
  // روابط التنقل
  backToHome: "العودة إلى الصفحة الرئيسية",

  // سياسة الخصوصية
  privacyPolicy: "سياسة الخصوصية",
  lastUpdated: "آخر تحديث",
  introductionTitle: "مقدمة",
  privacyIntro:
    "نحن في WorldCosts نقدر خصوصيتك ونلتزم بحمايتها. تشرح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدام تطبيقنا.",
  informationCollectionTitle: "المعلومات التي نجمعها",
  informationCollection: "قد نجمع أنواعًا مختلفة من المعلومات، بما في ذلك:",
  deviceInfo: "معلومات الجهاز مثل نوع الجهاز ونظام التشغيل والمتصفح",
  usageData: "بيانات الاستخدام مثل كيفية استخدامك للتطبيق والميزات التي تستخدمها",
  preferences: "تفضيلاتك مثل اللغة والعملة المفضلة",
  dataUsageTitle: "كيف نستخدم بياناتك",
  dataUsage: "نستخدم المعلومات التي نجمعها للأغراض التالية:",
  improveService: "تحسين خدماتنا وتطويرها",
  userExperience: "تخصيص تجربة المستخدم وتحسينها",
  analytics: "تحليل استخدام التطبيق وأدائه",
  dataStorageTitle: "تخزين البيانات",
  dataStorage:
    "نحن نستخدم التخزين المحلي في متصفحك لتخزين تفضيلاتك وبياناتك. لا يتم نقل هذه البيانات إلى خوادمنا ما لم تختر مشاركتها معنا.",
  thirdPartyServicesTitle: "خدمات الطرف الثالث",
  thirdPartyServices:
    "قد نستخدم خدمات الطرف الثالث مثل Google AdSense لعرض الإعلانات. تخضع هذه الخدمات لسياسات الخصوصية الخاصة بها.",
  userRightsTitle: "حقوقك",
  userRights:
    "لديك الحق في الوصول إلى بياناتك وتصحيحها وحذفها. يمكنك أيضًا اختيار عدم استخدام التطبيق إذا كنت لا توافق على سياسة الخصوصية هذه.",
  policyChangesTitle: "التغييرات في السياسة",
  policyChanges:
    "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات من خلال نشر السياسة الجديدة على هذه الصفحة.",
  contactTitle: "اتصل بنا",
  contactInfo: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على info@worldcosts.com.",

  // الشروط والأحكام
  termsAndConditions: "الشروط والأحكام",
  acceptanceTitle: "قبول الشروط",
  acceptanceText:
    "باستخدام تطبيق WorldCosts، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام التطبيق.",
  useOfServiceTitle: "استخدام الخدمة",
  useOfServiceText: "يجب عليك استخدام التطبيق وفقًا للقوانين المعمول بها والشروط المنصوص عليها هنا. أنت توافق على عدم:",
  useRestriction1: "استخدام التطبيق لأي غرض غير قانوني أو محظور",
  useRestriction2: "محاولة الوصول غير المصرح به إلى أنظمتنا أو شبكاتنا",
  useRestriction3: "نشر أو نقل أي محتوى ضار أو مسيء",
  intellectualPropertyTitle: "الملكية الفكرية",
  intellectualPropertyText:
    "التطبيق وجميع المحتويات والميزات والوظائف المتوفرة من خلاله هي ملك لـ WorldCosts أو مرخصيها ومحمية بموجب قوانين الملكية الفكرية.",
  disclaimerTitle: "إخلاء المسؤولية",
  disclaimerText:
    "يتم توفير التطبيق 'كما هو' و'كما هو متاح' دون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نضمن دقة أسعار الصرف أو البيانات الأخرى المقدمة في التطبيق.",
  limitationOfLiabilityTitle: "حدود المسؤولية",
  limitationOfLiabilityText:
    "لن تكون WorldCosts مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية ناتجة عن استخدامك للتطبيق.",
  changesTitle: "التغييرات في الشروط",
  changesText: "نحتفظ بالحق في تعديل هذه الشروط في أي وقت. ستكون التغييرات سارية فور نشرها على هذه الصفحة.",
  governingLawTitle: "القانون الحاكم",
  governingLawText:
    "تخضع هذه الشروط وتفسر وفقًا لقوانين البلد الذي تم تأسيس WorldCosts فيه، دون اعتبار لتعارض مبادئ القانون.",
  contactInfoTerms: "إذا كان لديك أي أسئلة حول هذه الشروط، يرجى الاتصال بنا على info@worldcosts.com.",

  // من نحن
  aboutUsSubtitle: "حاسبة العملات المتعددة السهلة الاستخدام",
  ourMissionTitle: "مهمتنا",
  ourMissionText:
    "في WorldCosts، مهمتنا هي تبسيط إدارة التكاليف متعددة العملات للمصنعين والتجار والمستوردين. نحن نسعى جاهدين لتوفير أداة سهلة الاستخدام وموثوقة تساعد المستخدمين على حساب وتتبع تكاليف المنتجات بعملات مختلفة بسهولة.",
  whatWeOfferTitle: "ما نقدمه",
  whatWeOfferText: "تطبيقنا يوفر مجموعة من الميزات المصممة لتلبية احتياجات إدارة التكاليف متعددة العملات:",
  feature1: "حساب التكاليف التفصيلية بما في ذلك تكلفة الوحدة والتعبئة والشحن والجمارك",
  feature2: "دعم متعدد العملات مع تحويل العملات في الوقت الفعلي باستخدام أحدث أسعار الصرف",
  feature3: "تصميم التقارير المهنية وتحميلها كملف PDF مع إمكانية إضافة شعار الشركة ومعلوماتها",
  feature4: "واجهة سهلة وسريعة متوفرة بلغات متعددة",
  ourStoryTitle: "قصتنا",
  ourStoryText:
    "بدأت WorldCosts كمشروع صغير لحل مشكلة شائعة: كيفية إدارة النفقات بعملات مختلفة بكفاءة. مع مرور الوقت، تطور التطبيق استجابة لتعليقات المستخدمين واحتياجاتهم المتغيرة. اليوم، نفخر بتقديم حل شامل يستخدمه الآلاف من الأشخاص حول العالم.",
  contactUsTitle: "اتصل بنا",
  contactUsText: "نحن نقدر ملاحظاتك واقتراحاتك. إذا كان لديك أي أسئلة أو تعليقات، فلا تتردد في التواصل معنا:",
  email: "البريد الإلكتروني",
  website: "الموقع الإلكتروني",
  copyrightText: "جميع الحقوق محفوظة",
  aboutUs: "من نحن",

  // Theme related
  toggleTheme: "تبديل المظهر",
  lightTheme: "وضع النهار",
  darkTheme: "وضع الليل",

  // ترجمات جديدة للميزات
  features: "المميزات",
  feature1Description: "احسب تكلفة منتجاتك بدقة بما في ذلك تكلفة الوحدة والتعبئة والشحن والجمارك",
  feature2Description: "تحويل العملات في الوقت الفعلي باستخدام أحدث أسعار الصرف",
  feature3Description: "تصميم التقارير المهنية وتحميلها كملف PDF مع إمكانية إضافة شعار الشركة ومعلوماتها",
  feature4Description: "واجهة سهلة الاستخدام ومتوفرة بلغات متعددة",

  // Historial de cálculos
  calculationHistory: "سجل الحسابات",
  saveCalculation: "حفظ الحساب الحالي",
  noCalculationHistory: "لا يوجد سجل حسابات حتى الآن",
  load: "تحميل",
  clearHistory: "مسح السجل",
  items: "العناصر",
  total: "المجموع",
  generatingPDF: "جاري إنشاء ملف PDF",
  pleaseWait: "يرجى الانتظار...",
  noItemsToExport: "لا توجد عناصر لتصديرها. يرجى إضافة عناصر أولاً.",
  pdfGenerationFailed: "فشل إنشاء ملف PDF",
  tryAgainLater: "يرجى المحاولة مرة أخرى لاحقاً",

  // CSV Export
  exportCSV: "تصدير CSV",
  csvDownloadSuccessDesc: "تم تنزيل ملف CSV بنجاح.",
  csvDownloadErrorDesc: "حدث خطأ أثناء تصدير البيانات. يرجى المحاولة مرة أخرى.",

  // Exchange Rate Fallbacks
  usingFallbackRates: "استخدام أسعار صرف افتراضية",
  usingFallbackRatesDesc: "تعذر الحصول على أسعار الصرف المحدثة. يتم استخدام الأسعار الافتراضية.",
  someRatesUnavailable: "بعض أسعار الصرف غير متوفرة",
  someRatesUnavailableDesc: "بعض العملات تستخدم أسعار صرف افتراضية. قد لا تكون دقيقة تمامًا.",
}

// English translations
const en: Translation = {
  // Cookie Consent
  cookieConsentTitle: "Privacy and Cookie Settings",
  cookieConsentDescription:
    "We use cookies and similar storage technologies to enhance your experience on our site. You can customize your preferences or accept all cookies.",
  necessaryCookies: "Necessary Cookies",
  necessaryCookiesDescription: "Essential for the website to function and cannot be disabled.",
  preferencesCookies: "Preference Cookies",
  preferencesCookiesDescription:
    "Allow the website to remember information that changes how the website behaves or looks.",
  analyticsCookies: "Analytics Cookies",
  analyticsCookiesDescription: "Help us understand how visitors interact with the website.",
  marketingCookies: "Marketing Cookies",
  marketingCookiesDescription: "Used to track visitors across websites and display relevant advertisements.",
  acceptAllCookies: "Accept All",
  rejectAllCookies: "Reject Non-Essential",
  showDetails: "Show Details",
  hideDetails: "Hide Details",
  savePreferences: "Save Preferences",
  appTitle: "WorldCosts",
  appDescription: "Add items with currency selection and calculate totals in different currencies",

  itemName: "Item Name",
  itemValue: "Value (mathematical expressions allowed)",
  currency: "Currency",
  addItem: "Add Item",
  reset: "Reset",

  addedItems: "Added Items",
  inputValue: "Input Value",
  calculatedValue: "Calculated Value",

  usd: "US Dollar",
  egp: "Egyptian Pound",
  aed: "UAE Dirham",
  eur: "Euro",
  gbp: "British Pound",
  sar: "Saudi Riyal",
  jpy: "Japanese Yen",
  cny: "Chinese Yuan",
  cad: "Canadian Dollar",
  aud: "Australian Dollar",
  chf: "Swiss Franc",
  inr: "Indian Rupee",
  rub: "Russian Ruble",
  try: "Turkish Lira",
  brl: "Brazilian Real",
  kwd: "Kuwaiti Dinar",
  qar: "Qatari Riyal",
  myr: "Malaysian Ringgit",

  // Nuevas divisas
  ils: "Israeli Shekel",
  jod: "Jordanian Dinar",
  lbp: "Lebanese Pound",
  mad: "Moroccan Dirham",
  omr: "Omani Rial",
  bhd: "Bahraini Dinar",
  dzd: "Algerian Dinar",
  tnd: "Tunisian Dinar",

  totalAmount: "Total Amount",
  inUSD: "In USD",
  inEGP: "In EGP",
  inAED: "In AED",
  inEUR: "In EUR",
  inGBP: "In GBP",
  inSAR: "In SAR",
  inJPY: "In JPY",
  inCNY: "In CNY",
  inCAD: "In CAD",
  inAUD: "In AUD",
  inCHF: "In CHF",
  inINR: "In INR",
  inRUB: "In RUB",
  inTRY: "In TRY",
  inBRL: "In BRL",
  inKWD: "In KWD",
  inQAR: "In QAR",
  inMYR: "In MYR",
  totalCurrency: "Total Currency",
  selectTotalCurrency: "Select Total Currency",

  lastUpdated: "Exchange rates last updated",
  updateRates: "Update Rates",

  downloadPDF: "Download PDF",
  companyInfo: "Company Info",
  addCompanyInfo: "Add Company Info",
  editCompanyInfo: "Edit Company Info",
  pdfFileName: "PDF File Name",

  companyInfoTitle: "Company Information",
  companyInfoDescription: "Enter company information to be displayed in the PDF file",
  companyName: "Company Name",
  companyAddress: "Company Address",
  companyPhone: "Phone Number",
  companyLogo: "Company Logo",
  clickToUpload: "Click to upload",
  dragAndDrop: "or drag and drop",
  maxFileSize: "PNG, JPG (Max: 2MB)",
  uploadingLogo: "Uploading logo...",
  saveInfo: "Save Information",
  cancel: "Cancel",

  errorUpdatingRates: "Error Updating Exchange Rates",
  errorUpdatingRatesDesc: "Failed to update exchange rates. Default rates will be used.",
  fileDownloadSuccess: "File Downloaded Successfully",
  fileDownloadSuccessDesc: "PDF file has been created and downloaded successfully.",
  fileDownloadError: "Error Creating File",
  fileDownloadErrorDesc: "An error occurred while creating the PDF file. Please try again.",
  companyInfoSaved: "Company Information Saved",
  companyInfoSavedDesc: "Company information will be added to the PDF file when downloaded.",

  reportDate: "Report Date",
  dollarToEGP: "USD to EGP Exchange Rate",
  dollarToAED: "USD to AED Exchange Rate",
  generatedBy: "This report was generated by WorldCosts",
  address: "Address",
  phone: "Phone",

  // New translations
  actions: "Actions",
  edit: "Edit",
  delete: "Delete",
  updateItem: "Update Item",

  // PWA translations
  installApp: "Install App",
  offlineTitle: "You are offline",
  offlineDescription: "Some features may not work properly. Please check your internet connection.",
  networkStatus: "Network Status",
  online: "Online",
  offline: "Offline",

  // Rates updated
  ratesUpdated: "Rates Updated",
  ratesUpdatedDesc: "Exchange rates have been successfully updated",

  // Empty state
  emptyStateTitle: "Multi-Currency Calculator",
  emptyStateDescription: "Add items using the form above to start calculating values in multiple currencies.",

  // Chart related
  chartTitle: "Items Chart",
  chartTitleDistribution: "Value Distribution by Currency",
  chartTitleCount: "Item Count by Currency",
  chartTitleItems: "Added Items Values",
  chartTitleValues: "Total Values by Currency",
  pieChartView: "Currency Pie Chart View",
  barChartView: "Currency Values Bar Chart",
  itemsChartView: "Items Values View",
  itemCount: "Item Count",

  // ترجمات جديدة للصفحات الإضافية
  // روابط التنقل
  backToHome: "Back to Home",

  // سياسة الخصوصية
  privacyPolicy: "Privacy Policy",
  lastUpdated: "Last Updated",
  introductionTitle: "Introduction",
  privacyIntro:
    "At WorldCosts, we value your privacy and are committed to protecting it. This Privacy Policy explains how we collect, use, and safeguard your information when you use our application.",
  informationCollectionTitle: "Information We Collect",
  informationCollection: "We may collect various types of information, including:",
  deviceInfo: "Device information such as device type, operating system, and browser",
  usageData: "Usage data such as how you use the application and which features you use",
  preferences: "Your preferences such as language and preferred currency",
  dataUsageTitle: "How We Use Your Data",
  dataUsage: "We use the information we collect for the following purposes:",
  improveService: "To improve and develop our services",
  userExperience: "To personalize and enhance your user experience",
  analytics: "To analyze application usage and performance",
  dataStorageTitle: "Data Storage",
  dataStorage:
    "We use local storage in your browser to store your preferences and data. This data is not transferred to our servers unless you choose to share it with us.",
  thirdPartyServicesTitle: "Third-Party Services",
  thirdPartyServices:
    "We may use third-party services such as Google AdSense to display advertisements. These services are subject to their own privacy policies.",
  userRightsTitle: "Your Rights",
  userRights:
    "You have the right to access, correct, and delete your data. You can also choose not to use the application if you do not agree with this Privacy Policy.",
  policyChangesTitle: "Changes to Policy",
  policyChanges:
    "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.",
  contactTitle: "Contact Us",
  contactInfo: "If you have any questions about this Privacy Policy, please contact us at info@worldcosts.com.",

  // الشروط والأحكام
  termsAndConditions: "Terms and Conditions",
  acceptanceTitle: "Acceptance of Terms",
  acceptanceText:
    "By using the WorldCosts application, you agree to be bound by these Terms and Conditions. If you do not agree to any part of these terms, please do not use the application.",
  useOfServiceTitle: "Use of Service",
  useOfServiceText:
    "You must use the application in accordance with applicable laws and the terms set forth here. You agree not to:",
  useRestriction1: "Use the application for any illegal or prohibited purpose",
  useRestriction2: "Attempt unauthorized access to our systems or networks",
  useRestriction3: "Post or transmit any harmful or abusive content",
  intellectualPropertyTitle: "Intellectual Property",
  intellectualPropertyText:
    "The application and all content, features, and functionality available through it are owned by WorldCosts or its licensors and are protected by intellectual property laws.",
  disclaimerTitle: "Disclaimer",
  disclaimerText:
    "The application is provided 'as is' and 'as available' without any warranties of any kind, express or implied. We do not guarantee the accuracy of exchange rates or other data provided in the application.",
  limitationOfLiabilityTitle: "Limitation of Liability",
  limitationOfLiabilityText:
    "WorldCosts will not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of the application.",
  changesTitle: "Changes to Terms",
  changesText:
    "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.",
  governingLawTitle: "Governing Law",
  governingLawText:
    "These terms shall be governed by and construed in accordance with the laws of the country in which WorldCosts is established, without regard to conflict of law principles.",
  contactInfoTerms: "If you have any questions about these Terms, please contact us at info@worldcosts.com.",

  // من نحن
  aboutUsSubtitle: "Easy-to-use Multi-Currency Calculator",
  ourMissionTitle: "Our Mission",
  ourMissionText:
    "At WorldCosts, our mission is to simplify multi-currency cost management for individuals and businesses. We strive to provide an easy-to-use and reliable tool that helps users calculate and track expenses in different currencies with ease.",
  whatWeOfferTitle: "What We Offer",
  whatWeOfferText: "Our application provides a range of features designed to meet multi-currency management needs:",
  feature1: "Quick and accurate calculation of values in multiple currencies",
  feature2: "Real-time currency conversion using the latest exchange rates",
  feature3: "Ability to export data to PDF files for sharing and printing",
  feature4: "User-friendly interface available in multiple languages",
  ourStoryTitle: "Our Story",
  ourStoryText:
    "WorldCosts started as a small project to solve a common problem: how to efficiently manage expenses in different currencies. Over time, the application evolved in response to user feedback and changing needs. Today, we are proud to offer a comprehensive solution used by thousands of people around the world.",
  contactUsTitle: "Contact Us",
  contactUsText:
    "We value your feedback and suggestions. If you have any questions or comments, feel free to reach out to us:",
  email: "Email",
  website: "Website",
  copyrightText: "All rights reserved",
  aboutUs: "About Us",

  // Theme related
  toggleTheme: "Toggle Theme",
  lightTheme: "Light Mode",
  darkTheme: "Dark Mode",

  // ترجمات جديدة للميزات
  features: "Features",
  feature1Description: "Calculate your product costs accurately including unit cost, packaging, shipping, and customs",
  feature2Description: "Real-time currency conversion using the latest exchange rates",
  feature3Description: "Design professional reports and download them as PDF with company logo and information",
  feature4Description: "User-friendly interface available in multiple languages",

  // Historial de cálculos
  calculationHistory: "Calculation History",
  saveCalculation: "Save Current Calculation",
  noCalculationHistory: "No calculation history yet",
  load: "Load",
  clearHistory: "Clear History",
  items: "Items",
  total: "Total",
  generatingPDF: "Generating PDF",
  pleaseWait: "Please wait...",
  noItemsToExport: "No items to export. Please add items first.",
  pdfGenerationFailed: "PDF generation failed",
  tryAgainLater: "Please try again later",

  // CSV Export
  exportCSV: "Export CSV",
  csvDownloadSuccessDesc: "CSV file has been downloaded successfully.",
  csvDownloadErrorDesc: "An error occurred while exporting data. Please try again.",

  // Exchange Rate Fallbacks
  usingFallbackRates: "Using Fallback Exchange Rates",
  usingFallbackRatesDesc: "Could not retrieve updated exchange rates. Using default rates instead.",
  someRatesUnavailable: "Some Exchange Rates Unavailable",
  someRatesUnavailableDesc: "Some currencies are using fallback exchange rates. They may not be completely accurate.",
}

// German translations
const de: Translation = {
  // Cookie Consent
  cookieConsentTitle: "Datenschutz- und Cookie-Einstellungen",
  cookieConsentDescription:
    "Wir verwenden Cookies und ähnliche Speichertechnologien, um Ihre Erfahrung auf unserer Website zu verbessern. Sie können Ihre Präferenzen anpassen oder alle Cookies akzeptieren.",
  necessaryCookies: "Notwendige Cookies",
  necessaryCookiesDescription: "Wesentlich für die Funktionalität der Website und können nicht deaktiviert werden.",
  preferencesCookies: "Präferenz-Cookies",
  preferencesCookiesDescription:
    "Ermöglichen der Website, sich an Informationen zu erinnern, die das Verhalten oder Aussehen der Website ändern.",
  analyticsCookies: "Analyse-Cookies",
  analyticsCookiesDescription: "Helfen uns zu verstehen, wie Besucher mit der Website interagieren.",
  marketingCookies: "Marketing-Cookies",
  marketingCookiesDescription:
    "Werden verwendet, um Besucher über Websites hinweg zu verfolgen und relevante Werbung anzuzeigen.",
  acceptAllCookies: "Alle akzeptieren",
  rejectAllCookies: "Nicht wesentliche ablehnen",
  showDetails: "Details anzeigen",
  hideDetails: "Details ausblenden",
  savePreferences: "Präferenzen speichern",
  appTitle: "WorldCosts",
  appDescription: "Fügen Sie Artikel mit Währungsauswahl hinzu und berechnen Sie Summen in verschiedenen Währungen",

  itemName: "Artikelname",
  itemValue: "Wert (mathematische Ausdrücke erlaubt)",
  currency: "Währung",
  addItem: "Artikel hinzufügen",
  reset: "Zurücksetzen",

  addedItems: "Hinzugefügte Artikel",
  inputValue: "Eingegebener Wert",
  calculatedValue: "Berechneter Wert",

  usd: "US-Dollar",
  egp: "Ägyptisches Pfund",
  aed: "VAE-Dirham",
  eur: "Euro",
  gbp: "Britisches Pfund",
  sar: "Saudi-Riyal",
  jpy: "Japanischer Yen",
  cny: "Chinesischer Yuan",
  cad: "Kanadischer Dollar",
  aud: "Australischer Dollar",
  chf: "Schweizer Franken",
  inr: "Indische Rupie",
  rub: "Russischer Rubel",
  try: "Türkische Lira",
  brl: "Brasilianischer Real",
  kwd: "Kuwaitischer Dinar",
  qar: "Katar-Riyal",
  myr: "Malaysischer Ringgit",

  // Nuevas divisas
  ils: "Israelischer Schekel",
  jod: "Jordanischer Dinar",
  lbp: "Libanesisches Pfund",
  mad: "Marokkanischer Dirham",
  omr: "Omanischer Rial",
  bhd: "Bahrain-Dinar",
  dzd: "Algerischer Dinar",
  tnd: "Tunesischer Dinar",

  totalAmount: "Gesamtbetrag",
  inUSD: "In USD",
  inEGP: "In EGP",
  inAED: "In AED",
  inEUR: "In EUR",
  inGBP: "In GBP",
  inSAR: "In SAR",
  inJPY: "In JPY",
  inCNY: "In CNY",
  inCAD: "In CAD",
  inAUD: "In AUD",
  inCHF: "In CHF",
  inINR: "In INR",
  inRUB: "In RUB",
  inTRY: "In TRY",
  inBRL: "In BRL",
  inKWD: "In KWD",
  inQAR: "In QAR",
  inMYR: "In MYR",
  totalCurrency: "Gesamtwährung",
  selectTotalCurrency: "Gesamtwährung auswählen",

  lastUpdated: "Wechselkurse zuletzt aktualisiert",
  updateRates: "Kurse aktualisieren",

  downloadPDF: "PDF herunterladen",
  companyInfo: "Firmeninformationen",
  addCompanyInfo: "Firmeninformationen hinzufügen",
  editCompanyInfo: "Firmeninformationen bearbeiten",
  pdfFileName: "PDF-Dateiname",

  companyInfoTitle: "Firmeninformationen",
  companyInfoDescription: "Geben Sie Firmeninformationen ein, die in der PDF-Datei angezeigt werden sollen",
  companyName: "Firmenname",
  companyAddress: "Firmenadresse",
  companyPhone: "Telefonnummer",
  companyLogo: "Firmenlogo",
  clickToUpload: "Zum Hochladen klicken",
  dragAndDrop: "oder per Drag & Drop",
  maxFileSize: "PNG, JPG (Max: 2MB)",
  uploadingLogo: "Logo wird hochgeladen...",
  saveInfo: "Informationen speichern",
  cancel: "Abbrechen",

  errorUpdatingRates: "Fehler beim Aktualisieren der Wechselkurse",
  errorUpdatingRatesDesc: "Wechselkurse konnten nicht aktualisiert werden. Standardkurse werden verwendet.",
  fileDownloadSuccess: "Datei erfolgreich heruntergeladen",
  fileDownloadSuccessDesc: "PDF-Datei wurde erstellt und erfolgreich heruntergeladen.",
  fileDownloadError: "Fehler beim Erstellen der Datei",
  fileDownloadErrorDesc: "Beim Erstellen der PDF-Datei ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  companyInfoSaved: "Firmeninformationen gespeichert",
  companyInfoSavedDesc: "Firmeninformationen werden beim Herunterladen zur PDF-Datei hinzugefügt.",

  reportDate: "Berichtsdatum",
  dollarToEGP: "USD zu EGP Wechselkurs",
  dollarToAED: "USD zu AED Wechselkurs",
  generatedBy: "Dieser Bericht wurde von WorldCosts erstellt",
  address: "Adresse",
  phone: "Telefon",

  // New translations
  actions: "Aktionen",
  edit: "Bearbeiten",
  delete: "Löschen",
  updateItem: "Artikel aktualisieren",

  // PWA translations
  installApp: "App installieren",
  offlineTitle: "Sie sind offline",
  offlineDescription:
    "Einige Funktionen funktionieren möglicherweise nicht richtig. Bitte überprüfen Sie Ihre Internetverbindung.",
  networkStatus: "Netzwerkstatus",
  online: "Online",
  offline: "Offline",

  // Rates updated
  ratesUpdated: "Kurse aktualisiert",
  ratesUpdatedDesc: "Wechselkurse wurden erfolgreich aktualisiert",

  // Empty state
  emptyStateTitle: "Mehrwährungs-Rechner",
  emptyStateDescription:
    "Fügen Sie Elemente über das obige Formular hinzu, um Werte in mehreren Währungen zu berechnen.",

  // Chart related
  chartTitle: "Artikeldiagramm",
  chartTitleDistribution: "Wertverteilung nach Währung",
  chartTitleCount: "Artikelanzahl nach Währung",
  chartTitleItems: "Werte der hinzugefügten Artikel",
  chartTitleValues: "Gesamtwerte nach Währung",
  pieChartView: "Kreisdiagramm nach Währung",
  barChartView: "Balkendiagramm der Werte nach Währung",
  itemsChartView: "Artikelwerte anzeigen",
  itemCount: "Artikelanzahl",

  // ترجمات جديدة للصفحات الإضافية
  // روابط التنقل
  backToHome: "Zurück zur Startseite",

  // سياسة الخصوصية
  privacyPolicy: "Datenschutzrichtlinie",
  lastUpdated: "Zuletzt aktualisiert",
  introductionTitle: "Einführung",
  privacyIntro:
    "Bei WorldCosts schätzen wir Ihre Privatsphäre und sind bestrebt, sie zu schützen. Diese Datenschutzrichtlinie erklärt, wie wir Ihre Informationen sammeln, verwenden und schützen, wenn Sie unsere Anwendung nutzen.",
  informationCollectionTitle: "Informationen, die wir sammeln",
  informationCollection: "Wir können verschiedene Arten von Informationen sammeln, darunter:",
  deviceInfo: "Geräteinformationen wie Gerätetyp, Betriebssystem und Browser",
  usageData: "Nutzungsdaten wie die Art und Weise, wie Sie die Anwendung nutzen und welche Funktionen Sie verwenden",
  preferences: "Ihre Präferenzen wie Sprache und bevorzugte Währung",
  dataUsageTitle: "Wie wir Ihre Daten verwenden",
  dataUsage: "Wir verwenden die gesammelten Informationen für folgende Zwecke:",
  improveService: "Um unsere Dienste zu verbessern und weiterzuentwickeln",
  userExperience: "Um Ihr Benutzererlebnis zu personalisieren und zu verbessern",
  analytics: "Um die Anwendungsnutzung und -leistung zu analysieren",
  dataStorageTitle: "Datenspeicherung",
  dataStorage:
    "Wir verwenden den lokalen Speicher in Ihrem Browser, um Ihre Präferenzen und Daten zu speichern. Diese Daten werden nicht an unsere Server übertragen, es sei denn, Sie entscheiden sich dafür, sie mit uns zu teilen.",
  thirdPartyServicesTitle: "Dienste von Drittanbietern",
  thirdPartyServices:
    "Wir können Dienste von Drittanbietern wie Google AdSense verwenden, um Werbung anzuzeigen. Diese Dienste unterliegen ihren eigenen Datenschutzrichtlinien.",
  userRightsTitle: "Ihre Rechte",
  userRights:
    "Sie haben das Recht, auf Ihre Daten zuzugreifen, sie zu korrigieren und zu löschen. Sie können sich auch dafür entscheiden, die Anwendung nicht zu nutzen, wenn Sie mit dieser Datenschutzrichtlinie nicht einverstanden sind.",
  policyChangesTitle: "Änderungen der Richtlinie",
  policyChanges:
    "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Wir werden Sie über Änderungen informieren, indem wir die neue Richtlinie auf dieser Seite veröffentlichen.",
  contactTitle: "Kontaktieren Sie uns",
  contactInfo:
    "Wenn Sie Fragen zu dieser Datenschutzrichtlinie haben, kontaktieren Sie uns bitte unter info@worldcosts.com.",

  // الشروط والأحكام
  termsAndConditions: "Allgemeine Geschäftsbedingungen",
  acceptanceTitle: "Annahme der Bedingungen",
  acceptanceText:
    "Durch die Nutzung der WorldCosts-Anwendung erklären Sie sich mit diesen Allgemeinen Geschäftsbedingungen einverstanden. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, nutzen Sie bitte die Anwendung nicht.",
  useOfServiceTitle: "Nutzung des Dienstes",
  useOfServiceText:
    "Sie müssen die Anwendung in Übereinstimmung mit den geltenden Gesetzen und den hier festgelegten Bedingungen nutzen. Sie stimmen zu, nicht:",
  useRestriction1: "Die Anwendung für illegale oder verbotene Zwecke zu nutzen",
  useRestriction2: "Unbefugten Zugriff auf unsere Systeme oder Netzwerke zu versuchen",
  useRestriction3: "Schädliche oder missbräuchliche Inhalte zu posten oder zu übertragen",
  intellectualPropertyTitle: "Geistiges Eigentum",
  intellectualPropertyText:
    "Die Anwendung und alle Inhalte, Funktionen und Funktionalitäten, die über sie verfügbar sind, sind Eigentum von WorldCosts oder seinen Lizenzgebern und durch Gesetze zum geistigen Eigentum geschützt.",
  disclaimerTitle: "Haftungsausschluss",
  disclaimerText:
    "Die Anwendung wird 'wie sie ist' und 'wie verfügbar' ohne jegliche Garantien jeglicher Art, ausdrücklich oder implizit, bereitgestellt. Wir garantieren nicht die Genauigkeit von Wechselkursen oder anderen in der Anwendung bereitgestellten Daten.",
  limitationOfLiabilityTitle: "Haftungsbeschränkung",
  limitationOfLiabilityText:
    "WorldCosts haftet nicht für direkte, indirekte, zufällige, besondere oder Folgeschäden, die aus Ihrer Nutzung der Anwendung resultieren.",
  changesTitle: "Änderungen der Bedingungen",
  changesText:
    "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen treten sofort nach der Veröffentlichung auf dieser Seite in Kraft.",
  governingLawTitle: "Geltendes Recht",
  governingLawText:
    "Diese Bedingungen unterliegen den Gesetzen des Landes, in dem WorldCosts gegründet wurde, und werden in Übereinstimmung mit diesen ausgelegt, ohne Rücksicht auf Grundsätze des Kollisionsrechts.",
  contactInfoTerms:
    "Wenn Sie Fragen zu diesen Bedingungen haben, kontaktieren Sie uns bitte unter info@worldcosts.com.",

  // من نحن
  aboutUsSubtitle: "Benutzerfreundlicher Mehrwährungsrechner",
  ourMissionTitle: "Unsere Mission",
  ourMissionText:
    "Bei WorldCosts ist es unsere Mission, die Verwaltung von Kosten in mehreren Währungen für Einzelpersonen und Unternehmen zu vereinfachen. Wir bemühen uns, ein benutzerfreundliches und zuverlässiges Tool anzubieten, das Benutzern hilft, Ausgaben in verschiedenen Währungen einfach zu berechnen und zu verfolgen.",
  whatWeOfferTitle: "Was wir anbieten",
  whatWeOfferText:
    "Unsere Anwendung bietet eine Reihe von Funktionen, die auf die Bedürfnisse der Mehrwährungsverwaltung zugeschnitten sind:",
  feature1: "Schnelle und genaue Berechnung von Werten in mehreren Währungen",
  feature2: "Echtzeit-Währungsumrechnung mit den neuesten Wechselkursen",
  feature3: "Möglichkeit, Daten in PDF-Dateien zum Teilen und Drucken zu exportieren",
  feature4: "Benutzerfreundliche Oberfläche in mehreren Sprachen verfügbar",
  ourStoryTitle: "Unsere Geschichte",
  ourStoryText:
    "WorldCosts begann als kleines Projekt, um ein häufiges Problem zu lösen: wie man Ausgaben in verschiedenen Währungen effizient verwaltet. Im Laufe der Zeit entwickelte sich die Anwendung als Reaktion auf Benutzerfeedback und sich ändernde Bedürfnisse weiter. Heute sind wir stolz darauf, eine umfassende Lösung anzubieten, die von Tausenden von Menschen weltweit genutzt wird.",
  contactUsTitle: "Kontaktieren Sie uns",
  contactUsText:
    "Wir schätzen Ihr Feedback und Ihre Vorschläge. Wenn Sie Fragen oder Kommentare haben, zögern Sie nicht, uns zu kontaktieren:",
  email: "E-Mail",
  website: "Website",
  copyrightText: "Alle Rechte vorbehalten",
  aboutUs: "Über uns",

  // Theme related
  toggleTheme: "Thema umschalten",
  lightTheme: "Heller Modus",
  darkTheme: "Dunkler Modus",

  // ترجمات جديدة للميزات
  features: "Funktionen",
  feature1Description:
    "Berechnen Sie Ihre Produktkosten genau, einschließlich Stückkosten, Verpackung, Versand und Zoll",
  feature2Description: "Echtzeit-Währungsumrechnung mit den neuesten Wechselkursen",
  feature3Description:
    "Entwerfen Sie professionelle Berichte und laden Sie sie als PDF mit Firmenlogo und Informationen herunter",
  feature4Description: "Benutzerfreundliche Oberfläche in mehreren Sprachen verfügbar",

  // Historial de cálculos
  calculationHistory: "Berechnungsverlauf",
  saveCalculation: "Aktuelle Berechnung speichern",
  noCalculationHistory: "Noch kein Berechnungsverlauf",
  load: "Laden",
  clearHistory: "Verlauf löschen",
  items: "Elemente",
  total: "Gesamt",
  generatingPDF: "PDF wird generiert",
  pleaseWait: "Bitte warten...",
  noItemsToExport: "Keine Elemente zum Exportieren. Bitte fügen Sie zuerst Elemente hinzu.",
  pdfGenerationFailed: "PDF-Generierung fehlgeschlagen",
  tryAgainLater: "Bitte versuchen Sie es später erneut",

  // CSV Export
  exportCSV: "CSV exportieren",
  csvDownloadSuccessDesc: "CSV-Datei wurde erfolgreich heruntergeladen.",
  csvDownloadErrorDesc: "Beim Exportieren der Daten ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",

  // Exchange Rate Fallbacks
  usingFallbackRates: "Verwendung von Fallback-Wechselkursen",
  usingFallbackRatesDesc: "Aktualisierte Wechselkurse konnten nicht abgerufen werden. Standardkurse werden verwendet.",
  someRatesUnavailable: "Einige Wechselkurse nicht verfügbar",
  someRatesUnavailableDesc:
    "Einige Währungen verwenden Fallback-Wechselkurse. Diese sind möglicherweise nicht vollständig genau.",
}

// تحديث الترجمات الفرنسية
const fr: Translation = {
  // Cookie Consent
  cookieConsentTitle: "Paramètres de confidentialité et de cookies",
  cookieConsentDescription:
    "Nous utilisons des cookies et des technologies de stockage similaires pour améliorer votre expérience sur notre site. Vous pouvez personnaliser vos préférences ou accepter tous les cookies.",
  necessaryCookies: "Cookies nécessaires",
  necessaryCookiesDescription: "Essentiels au fonctionnement du site et ne peuvent pas être désactivés.",
  preferencesCookies: "Cookies de préférences",
  preferencesCookiesDescription:
    "Permettent au site de mémoriser des informations qui modifient le comportement ou l'apparence du site.",
  analyticsCookies: "Cookies d'analyse",
  analyticsCookiesDescription: "Nous aident à comprendre comment les visiteurs interagissent avec le site.",
  marketingCookies: "Cookies marketing",
  marketingCookiesDescription:
    "Utilisés pour suivre les visiteurs sur les sites web et afficher des publicités pertinentes.",
  acceptAllCookies: "Tout accepter",
  rejectAllCookies: "Rejeter non essentiels",
  showDetails: "Afficher les détails",
  hideDetails: "Masquer les détails",
  savePreferences: "Enregistrer les préférences",
  appTitle: "WorldCosts",
  appDescription: "Ajoutez des articles avec sélection de devise et calculez les totaux en différentes devises",

  itemName: "Nom de l'article",
  itemValue: "Valeur (expressions mathématiques autorisées)",
  currency: "Devise",
  addItem: "Ajouter l'article",
  reset: "Réinitialiser",

  addedItems: "Articles ajoutés",
  inputValue: "Valeur saisie",
  calculatedValue: "Valeur calculée",

  usd: "Dollar américain",
  egp: "Livre égyptienne",
  aed: "Dirham des EAU",
  eur: "Euro",
  gbp: "Livre sterling",
  sar: "Riyal saoudien",
  jpy: "Yen japonais",
  cny: "Yuan chinois",
  cad: "Dollar canadien",
  aud: "Dollar australien",
  chf: "Franc suisse",
  inr: "Roupie indienne",
  rub: "Rouble russe",
  try: "Lire turque",
  brl: "Réal brésilien",
  kwd: "Dinar koweïtien",
  qar: "Riyal qatari",
  myr: "Ringgit malaisien",

  // Nuevas divisas
  ils: "Shekel israélien",
  jod: "Dinar jordanien",
  lbp: "Livre libanaise",
  mad: "Dirham marocain",
  omr: "Rial omanais",
  bhd: "Dinar bahreïni",
  dzd: "Dinar algérien",
  tnd: "Dinar tunisien",

  totalAmount: "Montant total",
  inUSD: "En USD",
  inEGP: "En EGP",
  inAED: "En AED",
  inEUR: "En EUR",
  inGBP: "En GBP",
  inSAR: "En SAR",
  inJPY: "En JPY",
  inCNY: "En CNY",
  inCAD: "En CAD",
  inAUD: "En AUD",
  inCHF: "En CHF",
  inINR: "En INR",
  inRUB: "En RUB",
  inTRY: "En TRY",
  inBRL: "En BRL",
  inKWD: "En KWD",
  inQAR: "En QAR",
  inMYR: "En MYR",
  totalCurrency: "Devise du total",
  selectTotalCurrency: "Sélectionner la devise du total",

  lastUpdated: "Taux de change mis à jour le",
  updateRates: "Mettre à jour les taux",

  downloadPDF: "Télécharger PDF",
  companyInfo: "Infos de l'entreprise",
  addCompanyInfo: "Ajouter infos de l'entreprise",
  editCompanyInfo: "Modifier infos de l'entreprise",
  pdfFileName: "Nom du fichier PDF",

  companyInfoTitle: "Informations de l'entreprise",
  companyInfoDescription: "Entrez les informations de l'entreprise à afficher dans le fichier PDF",
  companyName: "Nom de l'entreprise",
  companyAddress: "Adresse de l'entreprise",
  companyPhone: "Numéro de téléphone",
  companyLogo: "Logo de l'entreprise",
  clickToUpload: "Cliquez pour télécharger",
  dragAndDrop: "ou glissez-déposez",
  maxFileSize: "PNG, JPG (Max: 2MB)",
  uploadingLogo: "Téléchargement du logo...",
  saveInfo: "Enregistrer les informations",
  cancel: "Annuler",

  errorUpdatingRates: "Erreur de mise à jour des taux de change",
  errorUpdatingRatesDesc: "Impossible de mettre à jour les taux de change. Les taux par défaut seront utilisés.",
  fileDownloadSuccess: "Fichier téléchargé avec succès",
  fileDownloadSuccessDesc: "Le fichier PDF a été créé et téléchargé avec succès.",
  fileDownloadError: "Erreur lors de la création du fichier",
  fileDownloadErrorDesc: "Une erreur s'est produite lors de la création du fichier PDF. Veuillez réessayer.",
  companyInfoSaved: "Informations de l'entreprise enregistrées",
  companyInfoSavedDesc: "Les informations de l'entreprise seront ajoutées au fichier PDF lors du téléchargement.",

  reportDate: "Date du rapport",
  dollarToEGP: "Taux de change USD vers EGP",
  dollarToAED: "Taux de change USD vers AED",
  generatedBy: "Ce rapport a été généré par WorldCosts",
  address: "Adresse",
  phone: "Téléphone",

  // New translations
  actions: "Actions",
  edit: "Modifier",
  delete: "Supprimer",
  updateItem: "Mettre à jour",

  // PWA translations
  installApp: "Installer l'application",
  offlineTitle: "Vous êtes hors ligne",
  offlineDescription:
    "Certaines fonctionnalités peuvent ne pas fonctionner correctement. Veuillez vérifier votre connexion Internet.",
  networkStatus: "État du réseau",
  online: "En ligne",
  offline: "Hors ligne",

  // Rates updated
  ratesUpdated: "Taux mis à jour",
  ratesUpdatedDesc: "Les taux de change ont été mis à jour avec succès",

  // Empty state
  emptyStateTitle: "Calculatrice Multi-Devises",
  emptyStateDescription:
    "Ajoutez des éléments à l'aide du formulaire ci-dessus pour commencer à calculer des valeurs en plusieurs devises.",

  // Chart related
  chartTitle: "Graphique des articles",
  chartTitleDistribution: "Distribution des valeurs par devise",
  chartTitleCount: "Nombre d'articles par devise",
  chartTitleItems: "Valeurs des articles ajoutés",
  chartTitleValues: "Valeurs totales par devise",
  pieChartView: "Vue en graphique circulaire par devise",
  barChartView: "Vue en graphique à barres des valeurs par devise",
  itemsChartView: "Vue des valeurs des articles",
  itemCount: "Nombre d'articles",

  // ترجمات جديدة للصفحات الإضافية
  // روابط التنقل
  backToHome: "Retour à l'accueil",

  // سياسة الخصوصية
  privacyPolicy: "Politique de confidentialité",
  lastUpdated: "Dernière mise à jour",
  introductionTitle: "Introduction",
  privacyIntro:
    "Chez WorldCosts, nous valorisons votre vie privée et nous nous engageons à la protéger. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre application.",
  informationCollectionTitle: "Informations que nous collectons",
  informationCollection: "Nous pouvons collecter différents types d'informations, notamment :",
  deviceInfo: "Informations sur l'appareil telles que le type d'appareil, le système d'exploitation et le navigateur",
  usageData:
    "Données d'utilisation telles que la façon dont vous utilisez l'application et les fonctionnalités que vous utilisez",
  preferences: "Vos préférences telles que la langue et la devise préférée",
  dataUsageTitle: "Comment nous utilisons vos données",
  dataUsage: "Nous utilisons les informations que nous collectons aux fins suivantes :",
  improveService: "Pour améliorer et développer nos services",
  userExperience: "Pour personnaliser et améliorer votre expérience utilisateur",
  analytics: "Pour analyser l'utilisation et les performances de l'application",
  dataStorageTitle: "Stockage des données",
  dataStorage:
    "Nous utilisons le stockage local dans votre navigateur pour stocker vos préférences et données. Ces données ne sont pas transférées à nos serveurs sauf si vous choisissez de les partager avec nous.",
  thirdPartyServicesTitle: "Services tiers",
  thirdPartyServices:
    "Nous pouvons utiliser des services tiers tels que Google AdSense pour afficher des publicités. Ces services sont soumis à leurs propres politiques de confidentialité.",
  userRightsTitle: "Vos droits",
  userRights:
    "Vous avez le droit d'accéder à vos données, de les corriger et de les supprimer. Vous pouvez également choisir de ne pas utiliser l'application si vous n'êtes pas d'accord avec cette politique de confidentialité.",
  policyChangesTitle: "Modifications de la politique",
  policyChanges:
    "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle politique sur cette page.",
  contactTitle: "Contactez-nous",
  contactInfo:
    "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à info@worldcosts.com.",

  // الشروط والأحكام
  termsAndConditions: "Conditions générales",
  acceptanceTitle: "Acceptation des conditions",
  acceptanceText:
    "En utilisant l'application WorldCosts, vous acceptez d'être lié par ces conditions générales. Si vous n'acceptez pas une partie de ces conditions, veuillez ne pas utiliser l'application.",
  useOfServiceTitle: "Utilisation du service",
  useOfServiceText:
    "Vous devez utiliser l'application conformément aux lois applicables et aux conditions énoncées ici. Vous acceptez de ne pas :",
  useRestriction1: "Utiliser l'application à des fins illégales ou interdites",
  useRestriction2: "Tenter d'accéder sans autorisation à nos systèmes ou réseaux",
  useRestriction3: "Publier ou transmettre du contenu nuisible ou abusif",
  intellectualPropertyTitle: "Propriété intellectuelle",
  intellectualPropertyText:
    "L'application et tout le contenu, les fonctionnalités et les fonctionnalités disponibles par son intermédiaire sont la propriété de WorldCosts ou de ses concédants de licence et sont protégés par les lois sur la propriété intellectuelle.",
  disclaimerTitle: "Avis de non-responsabilité",
  disclaimerText:
    "L'application est fournie 'telle quelle' et 'selon disponibilité' sans garantie d'aucune sorte, expresse ou implicite. Nous ne garantissons pas l'exactitude des taux de change ou d'autres données fournies dans l'application.",
  limitationOfLiabilityTitle: "Limitation de responsabilité",
  limitationOfLiabilityText:
    "WorldCosts ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de votre utilisation de l'application.",
  changesTitle: "Modifications des conditions",
  changesText:
    "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication sur cette page.",
  governingLawTitle: "Loi applicable",
  governingLawText:
    "Ces conditions sont régies et interprétées conformément aux lois du pays dans lequel WorldCosts est établi, sans égard aux principes de conflit de lois.",
  contactInfoTerms:
    "Si vous avez des questions concernant ces conditions, veuillez nous contacter à info@worldcosts.com.",

  // من نحن
  aboutUsSubtitle: "Calculateur multi-devises facile à utiliser",
  ourMissionTitle: "Notre mission",
  ourMissionText:
    "Chez WorldCosts, notre mission est de simplifier la gestion des coûts multi-devises pour les particuliers et les entreprises. Nous nous efforçons de fournir un outil facile à utiliser et fiable qui aide les utilisateurs à calculer et à suivre les dépenses dans différentes devises avec facilité.",
  whatWeOfferTitle: "Ce que nous offrons",
  whatWeOfferText:
    "Notre application offre une gamme de fonctionnalités conçues pour répondre aux besoins de gestion multi-devises :",
  feature1: "Calcul rapide et précis des valeurs en plusieurs devises",
  feature2: "Conversion de devises en temps réel utilisant les derniers taux de change",
  feature3: "Possibilité d'exporter des données vers des fichiers PDF pour le partage et l'impression",
  feature4: "Interface conviviale disponible en plusieurs langues",
  ourStoryTitle: "Notre histoire",
  ourStoryText:
    "WorldCosts a commencé comme un petit projet pour résoudre un problème courant : comment gérer efficacement les dépenses dans différentes devises. Au fil du temps, l'application a évolué en réponse aux commentaires des utilisateurs et aux besoins changeants. Aujourd'hui, nous sommes fiers d'offrir une solution complète utilisée par des milliers de personnes dans le monde entier.",
  contactUsTitle: "Contactez-nous",
  contactUsText:
    "Nous apprécions vos commentaires et suggestions. Si vous avez des questions ou des commentaires, n'hésitez pas à nous contacter :",
  email: "Email",
  website: "Site web",
  copyrightText: "Tous droits réservés",
  aboutUs: "À propos de nous",

  // Theme related
  toggleTheme: "Changer de thème",
  lightTheme: "Mode clair",
  darkTheme: "Mode sombre",

  // ترجمات جديدة للميزات
  features: "Fonctionnalités",
  feature1Description:
    "Calculez avec précision les coûts de vos produits, y compris le coût unitaire, l'emballage, l'expédition et les douanes",
  feature2Description: "Conversion de devises en temps réel utilisant les derniers taux de change",
  feature3Description:
    "Concevez des rapports professionnels et téléchargez-les au format PDF avec le logo et les informations de l'entreprise",
  feature4Description: "Interface conviviale disponible en plusieurs langues",

  // Historial de cálculos
  calculationHistory: "Historique des calculs",
  saveCalculation: "Enregistrer le calcul actuel",
  noCalculationHistory: "Pas encore d'historique de calcul",
  load: "Charger",
  clearHistory: "Effacer l'historique",
  items: "Éléments",
  total: "Total",
  generatingPDF: "Génération du PDF",
  pleaseWait: "Veuillez patienter...",
  noItemsToExport: "Aucun élément à exporter. Veuillez d'abord ajouter des éléments.",
  pdfGenerationFailed: "Échec de la génération du PDF",
  tryAgainLater: "Veuillez réessayer plus tard",

  // CSV Export
  exportCSV: "Exporter CSV",
  csvDownloadSuccessDesc: "Le fichier CSV a été téléchargé avec succès.",
  csvDownloadErrorDesc: "Une erreur s'est produite lors de l'exportation des données. Veuillez réessayer.",

  // Exchange Rate Fallbacks
  usingFallbackRates: "Utilisation des taux de change par défaut",
  usingFallbackRatesDesc: "Impossible de récupérer les taux de change mis à jour. Utilisation des taux par défaut.",
  someRatesUnavailable: "Certains taux de change indisponibles",
  someRatesUnavailableDesc:
    "Certaines devises utilisent des taux de change par défaut. Ils peuvent ne pas être totalement précis.",
}

// Export language metadata
export const languages = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
]

// Export language codes type
export type LanguageCode = keyof typeof translations

// Export all translations
export const translations = {
  ar,
  en,
  de,
  fr,
}
