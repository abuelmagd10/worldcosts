// Define the structure of our translations
export type Translation = {
  // App title and description
  appTitle: string
  appDescription: string

  // Refund policy
  refundPolicyTitle: string
  refundPolicyText: string

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

  // Subscription related
  subscription: string
  subscriptionPlans: string
  proPlan: string
  businessPlan: string
  freePlan: string
  monthlyBilling: string
  yearlyBilling: string
  subscribe: string
  loginToSubscribe: string
  loginRequiredForSubscription: string
  subscriptionSuccess: string
  subscriptionSuccessDesc: string
  subscriptionDetails: string
  plan: string
  billingCycle: string
  whatNext: string
  subscriptionSuccessNextSteps: string
  goToDashboard: string
  upgradeToProVersion: string
  proFeatures: string
  unlimitedItems: string
  advancedReports: string
  customBranding: string
  dataSync: string
  currentPlan: string

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
  sgd: string
  zar: string
  sek: string
  nok: string
  dkk: string
  ils: string
  jod: string
  bhd: string
  omr: string
  mad: string
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
  pdfFileNameHint: string

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
  chartTitleValues: string // جديد
  pieChartView: string
  barChartView: string
  itemsChartView: string
  itemCount: string

  // ترجمات جديدة للصفحات الإضافية
  // روابط التنقل
  backToHome: string

  // سياسة الخصوصية
  privacyPolicyTitle: string
  privacyLastUpdated: string
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

  // الشروط والأحكام
  termsAndConditionsTitle: string
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

  // من نحن
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
  footerTerms: string
  footerPrivacy: string

  // Theme related
  toggleTheme: string
  lightTheme: string
  darkTheme: string

  // ترجمات جديدة للميزات
  features: string
  feature1Description: string
  feature2Description: string
  feature3Description: string
  feature4Description: string

  // ترجمات صفحات الموقع
  pricing: string
  refundPolicy: string
  fileManagement: string

  // ترجمات صفحة الإدارة
  adminDashboard: string
  manageSubscription: string
  viewAndManageFiles: string
  settings: string
  configureAppSettings: string

  // ترجمات صفحة الإعدادات
  appSettings: string
  fileSettings: string
  enableFileTracking: string
  trackAllUploadedFiles: string
  maxFileSizeMB: string
  allowedFileTypes: string
  enterFileExtensions: string
  autoDeleteOldFiles: string
  deleteOldFilesAfterPeriod: string
  deleteFilesAfterDays: string
  saveSettings: string
  settingsSaved: string
  settingsSavedDesc: string
  settingsError: string
  settingsErrorDesc: string
  backToAdmin: string

  // ترجمات معلومات المستخدم
  userInformation: string
  userProfile: string
  fullName: string
  emailAddress: string
  registrationDate: string
  lastLogin: string
  accountStatus: string
  active: string
  inactive: string

  // ترجمات معلومات الاشتراك
  subscriptionInformation: string
  currentPlanDetails: string
  planName: string
  billingPeriod: string
  nextBillingDate: string
  subscriptionStatus: string
  notSubscribed: string
  freeUser: string
  upgradeNow: string

  // ترجمات صفحة إدارة الملفات
  fileStatistics: string
  totalFiles: string
  totalSize: string
  fileTypes: string
  logos: string
  other: string
  manageUploadedFiles: string
  clearAllFiles: string
  uploadNewFile: string
  refresh: string
  name: string
  type: string
  size: string
  uploadDate: string
  downloadFile: string
  viewFile: string
  deleteFile: string
  noFiles: string

  // ترجمات صفحة الاشتراك
  mostPopular: string
  yearlyDiscount: string
  basicCurrencyConversion: string
  upToFiveItems: string
  limitedPDFExports: string
  standardSupport: string
  advancedCurrencyConversion: string
  unlimitedPDFExports: string
  realtimeExchangeRates: string
  dataVisualization: string
  everythingInPro: string
  teamCollaboration: string
  advancedReporting: string
  apiAccess: string
  prioritySupport: string
  frequentlyAskedQuestions: string
  howDoesTrial: string
  trialExplanation: string
  canChangePlans: string
  changePlansExplanation: string
  paymentMethods: string
  paymentMethodsExplanation: string
  refundPolicyExplanation: string
  readFullRefundPolicy: string

  // ترجمات إضافية لصفحة التسعير
  subscriptionPlansDescription: string
  allFeaturesInFreePlan: string
  noAds: string
  limitedFileStorage: string
  oneGBStorage: string
  fiveGBStorage: string
  multipleAccounts: string
  dedicatedSupport: string
  canCancelAnytime: string
  cancelExplanation: string
  forMoreInfo: string
  and: string

  // ترجمات مجموعات العملات
  currencyGroupMENA: string
  currencyGroupAmericasEurope: string
  currencyGroupAsiaPacific: string
  currencyGroupOthers: string

  // رموز العملات
  symbolUSD: string
  symbolEGP: string
  symbolAED: string
  symbolEUR: string
  symbolGBP: string
  symbolSAR: string
  symbolJPY: string
  symbolCNY: string
  symbolCAD: string
  symbolAUD: string
  symbolCHF: string
  symbolINR: string
  symbolRUB: string
  symbolTRY: string
  symbolBRL: string
  symbolKWD: string
  symbolQAR: string
  symbolMYR: string
  symbolSGD: string
  symbolZAR: string
  symbolSEK: string
  symbolNOK: string
  symbolDKK: string
  symbolILS: string
  symbolJOD: string
  symbolBHD: string
  symbolOMR: string
  symbolMAD: string
  symbolTND: string

  // إضافة ترجمات جديدة لمكون موافقة ملفات تعريف الارتباط
  cookieConsentText: string
  accept: string
  decline: string
  privacySettings: string
  storagePreferences: string
  analyticsPreferences: string
  advertisingPreferences: string
  necessaryCookies: string
  analyticsCookies: string
  advertisingCookies: string
  functionalCookies: string
  savePreferences: string
}

// Arabic translations
export const ar: Translation = {
  appTitle: "WorldCosts",
  appDescription: "احسب تكلفة منتجاتك بدقة وبعملات مختلفة مع إمكانية احتساب الشحن والضرائب والجمارك",

  // Refund policy
  refundPolicyTitle: "سياسة الاسترداد",
  refundPolicyText: "نحن نقدم سياسة استرداد عادلة لعملائنا.",

  // Subscription related
  subscription: "الاشتراك",
  subscriptionPlans: "خطط الاشتراك",
  proPlan: "خطة برو",
  businessPlan: "خطة الأعمال",
  freePlan: "خطة مجانية",
  monthlyBilling: "فوترة شهرية",
  yearlyBilling: "فوترة سنوية",
  subscribe: "اشترك الآن",
  loginToSubscribe: "تسجيل الدخول للاشتراك",
  loginRequiredForSubscription: "يجب تسجيل الدخول أولاً للاشتراك في هذه الخطة",
  subscriptionSuccess: "تم الاشتراك بنجاح!",
  subscriptionSuccessDesc: "شكرًا لاشتراكك في WorldCosts. تم تفعيل اشتراكك بنجاح.",
  subscriptionDetails: "تفاصيل الاشتراك",
  plan: "الخطة",
  billingCycle: "دورة الفوترة",
  whatNext: "ماذا بعد؟",
  subscriptionSuccessNextSteps: "يمكنك الآن الاستمتاع بجميع ميزات الاشتراك المدفوع. استكشف الميزات الجديدة المتاحة لك الآن.",
  goToDashboard: "الذهاب إلى لوحة التحكم",
  upgradeToProVersion: "الترقية إلى النسخة الاحترافية",
  proFeatures: "ميزات النسخة الاحترافية",
  unlimitedItems: "عناصر غير محدودة",
  advancedReports: "تقارير متقدمة",
  customBranding: "علامة تجارية مخصصة",
  dataSync: "مزامنة البيانات",
  currentPlan: "الخطة الحالية",

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
  sgd: "دولار سنغافوري",
  zar: "راند جنوب أفريقي",
  sek: "كرونة سويدية",
  nok: "كرونة نرويجية",
  dkk: "كرونة دنماركية",
  ils: "شيكل إسرائيلي",
  jod: "دينار أردني",
  bhd: "دينار بحريني",
  omr: "ريال عماني",
  mad: "درهم مغربي",
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
  pdfFileNameHint: "سيتم استخدام هذا الاسم عند تنزيل ملف PDF. إذا لم تدخل اسمًا، سيتم استخدام اسم افتراضي.",

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
  privacyPolicyTitle: "سياسة الخصوصية",
  privacyLastUpdated: "آخر تحديث",
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
  termsAndConditionsTitle: "الشروط والأحكام",
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
  footerTerms: "الشروط والأحكام",
  footerPrivacy: "سياسة الخصوصية",

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

  // ترجمات صفحات الموقع
  pricing: "الأسعار",
  refundPolicy: "سياسة الاسترداد",
  fileManagement: "إدارة الملفات",

  // ترجمات صفحة الإدارة
  adminDashboard: "لوحة الإدارة",
  manageSubscription: "إدارة اشتراكك والترقية إلى خطط مميزة",
  viewAndManageFiles: "عرض وإدارة الملفات المرفوعة",
  settings: "الإعدادات",
  configureAppSettings: "تكوين إعدادات التطبيق",

  // ترجمات صفحة الإعدادات
  appSettings: "إعدادات التطبيق",
  fileSettings: "إعدادات الملفات",
  enableFileTracking: "تمكين تتبع الملفات",
  trackAllUploadedFiles: "تتبع جميع الملفات المرفوعة",
  maxFileSizeMB: "الحد الأقصى لحجم الملف (ميجابايت)",
  allowedFileTypes: "أنواع الملفات المسموح بها",
  enterFileExtensions: "أدخل امتدادات الملفات مفصولة بفواصل",
  autoDeleteOldFiles: "حذف الملفات القديمة تلقائيًا",
  deleteOldFilesAfterPeriod: "حذف الملفات القديمة بعد فترة محددة",
  deleteFilesAfterDays: "حذف الملفات بعد (أيام)",
  saveSettings: "حفظ الإعدادات",
  settingsSaved: "تم حفظ الإعدادات",
  settingsSavedDesc: "تم حفظ إعدادات التطبيق بنجاح",
  settingsError: "خطأ في حفظ الإعدادات",
  settingsErrorDesc: "حدث خطأ أثناء محاولة حفظ الإعدادات. يرجى المحاولة مرة أخرى.",
  backToAdmin: "العودة إلى لوحة الإدارة",

  // ترجمات معلومات المستخدم
  userInformation: "معلومات المستخدم",
  userProfile: "الملف الشخصي",
  fullName: "الاسم الكامل",
  emailAddress: "البريد الإلكتروني",
  registrationDate: "تاريخ التسجيل",
  lastLogin: "آخر تسجيل دخول",
  accountStatus: "حالة الحساب",
  active: "نشط",
  inactive: "غير نشط",

  // ترجمات معلومات الاشتراك
  subscriptionInformation: "معلومات الاشتراك",
  currentPlanDetails: "تفاصيل الخطة الحالية",
  planName: "اسم الخطة",
  billingPeriod: "فترة الفوترة",
  nextBillingDate: "تاريخ الفوترة القادم",
  subscriptionStatus: "حالة الاشتراك",
  notSubscribed: "غير مشترك",
  freeUser: "مستخدم مجاني",
  upgradeNow: "الترقية الآن",

  // ترجمات صفحة إدارة الملفات
  fileStatistics: "إحصائيات الملفات",
  totalFiles: "إجمالي الملفات",
  totalSize: "الحجم الإجمالي",
  fileTypes: "أنواع الملفات",
  logos: "شعارات",
  other: "أخرى",
  manageUploadedFiles: "إدارة الملفات المرفوعة",
  clearAllFiles: "مسح جميع الملفات",
  uploadNewFile: "رفع ملف جديد",
  refresh: "تحديث",
  name: "الاسم",
  type: "النوع",
  size: "الحجم",
  uploadDate: "تاريخ الرفع",
  downloadFile: "تحميل الملف",
  viewFile: "عرض الملف",
  deleteFile: "حذف الملف",
  noFiles: "لا توجد ملفات",

  // ترجمات صفحة الاشتراك
  mostPopular: "الأكثر شعبية",
  yearlyDiscount: "وفر 20% مع الاشتراك السنوي",
  basicCurrencyConversion: "تحويل العملات الأساسي",
  upToFiveItems: "حتى 5 عناصر لكل حساب",
  limitedPDFExports: "تصدير PDF محدود",
  standardSupport: "دعم قياسي",
  advancedCurrencyConversion: "تحويل العملات المتقدم",
  unlimitedPDFExports: "تصدير PDF غير محدود مع العلامة التجارية",
  realtimeExchangeRates: "تحديثات أسعار الصرف في الوقت الفعلي",
  dataVisualization: "تصور البيانات والرسوم البيانية",
  everythingInPro: "كل ما في خطة برو",
  teamCollaboration: "ميزات التعاون الجماعي",
  advancedReporting: "تقارير وتحليلات متقدمة",
  apiAccess: "وصول API للتكامل",
  prioritySupport: "دعم ذو أولوية",
  frequentlyAskedQuestions: "الأسئلة الشائعة",
  howDoesTrial: "كيف تعمل فترة التجربة المجانية لمدة 14 يومًا؟",
  trialExplanation: "تأتي جميع الخطط المدفوعة مع فترة تجربة مجانية لمدة 14 يومًا. لن يتم محاسبتك حتى تنتهي فترة التجربة، ويمكنك إلغاء الاشتراك في أي وقت قبل ذلك.",
  canChangePlans: "هل يمكنني تغيير الخطة لاحقًا؟",
  changePlansExplanation: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. إذا قمت بالترقية، سيتم محاسبتك على الفرق النسبي. إذا قمت بالتخفيض، سيتم تطبيق السعر الجديد في دورة الفوترة التالية.",
  paymentMethods: "ما هي طرق الدفع المقبولة؟",
  paymentMethodsExplanation: "نقبل جميع بطاقات الائتمان الرئيسية، وPayPal، ومختلف طرق الدفع المحلية من خلال معالج الدفع الخاص بنا، Paddle.",
  refundPolicyExplanation: "نقدم ضمان استرداد الأموال لمدة 14 يومًا لجميع الاشتراكات الجديدة. إذا لم تكن راضيًا عن خدمتنا، يمكنك طلب استرداد كامل خلال 14 يومًا من تاريخ الشراء الأولي.",
  readFullRefundPolicy: "اقرأ سياسة الاسترداد الكاملة",

  // ترجمات إضافية لصفحة التسعير
  subscriptionPlansDescription: "اختر الخطة المناسبة لاحتياجاتك. جميع الخطط تشمل تحديثات مجانية وتحسينات مستمرة.",
  allFeaturesInFreePlan: "كل ميزات الخطة المجانية",
  noAds: "بدون إعلانات",
  limitedFileStorage: "تخزين ملفات محدود",
  oneGBStorage: "تخزين ملفات 1GB",
  fiveGBStorage: "تخزين ملفات 5GB",
  multipleAccounts: "حسابات متعددة",
  dedicatedSupport: "دعم مخصص 24/7",
  canCancelAnytime: "هل يمكنني إلغاء اشتراكي في أي وقت؟",
  cancelExplanation: "نعم، يمكنك إلغاء اشتراكك في أي وقت. ستستمر في الوصول إلى الميزات المدفوعة حتى نهاية فترة الفوترة الحالية.",
  forMoreInfo: "لمزيد من المعلومات، يرجى الاطلاع على",
  and: "و",

  // ترجمات مجموعات العملات
  currencyGroupMENA: "الشرق الأوسط وشمال أفريقيا",
  currencyGroupAmericasEurope: "أمريكا وأوروبا",
  currencyGroupAsiaPacific: "آسيا والمحيط الهادئ",
  currencyGroupOthers: "أخرى",

  // رموز العملات
  symbolUSD: "$",
  symbolEGP: "ج.م",
  symbolAED: "د.إ",
  symbolEUR: "€",
  symbolGBP: "£",
  symbolSAR: "ر.س",
  symbolJPY: "¥",
  symbolCNY: "¥",
  symbolCAD: "C$",
  symbolAUD: "A$",
  symbolCHF: "CHF",
  symbolINR: "₹",
  symbolRUB: "₽",
  symbolTRY: "₺",
  symbolBRL: "R$",
  symbolKWD: "د.ك",
  symbolQAR: "ر.ق",
  symbolMYR: "RM",
  symbolSGD: "S$",
  symbolZAR: "R",
  symbolSEK: "kr",
  symbolNOK: "kr",
  symbolDKK: "kr",
  symbolILS: "₪",
  symbolJOD: "د.أ",
  symbolBHD: "د.ب",
  symbolOMR: "ر.ع",
  symbolMAD: "د.م.",
  symbolTND: "د.ت",

  // ترجمات جديدة لمكون موافقة ملفات تعريف الارتباط
  cookieConsentText: "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. هل توافق على استخدامنا لملفات تعريف الارتباط؟",
  accept: "موافق",
  decline: "رفض",
  privacySettings: "إعدادات الخصوصية",
  storagePreferences: "تفضيلات التخزين",
  analyticsPreferences: "تفضيلات التحليلات",
  advertisingPreferences: "تفضيلات الإعلانات",
  necessaryCookies: "ملفات تعريف الارتباط الضرورية",
  analyticsCookies: "ملفات تعريف الارتباط التحليلية",
  advertisingCookies: "ملفات تعريف الارتباط الإعلانية",
  functionalCookies: "ملفات تعريف الارتباط الوظيفية",
  savePreferences: "حفظ التفضيلات",
}

// English translations
export const en: Translation = {
  appTitle: "WorldCosts",
  appDescription: "Add items with currency selection and calculate totals in different currencies",

  // Refund policy
  refundPolicyTitle: "Refund Policy",
  refundPolicyText: "We offer a fair refund policy for our customers.",

  // Subscription related
  subscription: "Subscription",
  subscriptionPlans: "Subscription Plans",
  proPlan: "Pro Plan",
  businessPlan: "Business Plan",
  freePlan: "Free Plan",
  monthlyBilling: "Monthly Billing",
  yearlyBilling: "Yearly Billing",
  subscribe: "Subscribe Now",
  loginToSubscribe: "Login to Subscribe",
  loginRequiredForSubscription: "You need to login first to subscribe to this plan",
  subscriptionSuccess: "Subscription Successful!",
  subscriptionSuccessDesc: "Thank you for subscribing to WorldCosts. Your subscription has been activated successfully.",
  subscriptionDetails: "Subscription Details",
  plan: "Plan",
  billingCycle: "Billing Cycle",
  whatNext: "What's Next?",
  subscriptionSuccessNextSteps: "You can now enjoy all the premium features. Explore the new features available to you now.",
  goToDashboard: "Go to Dashboard",
  upgradeToProVersion: "Upgrade to Pro Version",
  proFeatures: "Pro Features",
  unlimitedItems: "Unlimited Items",
  advancedReports: "Advanced Reports",
  customBranding: "Custom Branding",
  dataSync: "Data Synchronization",
  currentPlan: "Current Plan",

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
  sgd: "Singapore Dollar",
  zar: "South African Rand",
  sek: "Swedish Krona",
  nok: "Norwegian Krone",
  dkk: "Danish Krone",
  ils: "Israeli Shekel",
  jod: "Jordanian Dinar",
  bhd: "Bahraini Dinar",
  omr: "Omani Rial",
  mad: "Moroccan Dirham",
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
  pdfFileNameHint: "This name will be used when downloading the PDF file. If you don't enter a name, a default name will be used.",

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
  privacyPolicyTitle: "Privacy Policy",
  privacyLastUpdated: "Last Updated",
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
  termsAndConditionsTitle: "Terms and Conditions",
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
  footerTerms: "Terms & Conditions",
  footerPrivacy: "Privacy Policy",

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

  // ترجمات صفحات الموقع
  pricing: "Pricing",
  refundPolicy: "Refund Policy",
  fileManagement: "File Management",

  // ترجمات صفحة الإدارة
  adminDashboard: "Admin Dashboard",
  manageSubscription: "Manage your subscription and upgrade to premium plans",
  viewAndManageFiles: "View and manage uploaded files",
  settings: "Settings",
  configureAppSettings: "Configure application settings",

  // ترجمات صفحة الإعدادات
  appSettings: "Application Settings",
  fileSettings: "File Settings",
  enableFileTracking: "Enable File Tracking",
  trackAllUploadedFiles: "Track all uploaded files",
  maxFileSizeMB: "Maximum File Size (MB)",
  allowedFileTypes: "Allowed File Types",
  enterFileExtensions: "Enter file extensions separated by commas",
  autoDeleteOldFiles: "Auto-delete Old Files",
  deleteOldFilesAfterPeriod: "Delete old files after a specified period",
  deleteFilesAfterDays: "Delete Files After (days)",
  saveSettings: "Save Settings",
  settingsSaved: "Settings Saved",
  settingsSavedDesc: "Application settings have been saved successfully",
  settingsError: "Error Saving Settings",
  settingsErrorDesc: "An error occurred while trying to save settings. Please try again.",
  backToAdmin: "Back to Admin",

  // ترجمات معلومات المستخدم
  userInformation: "User Information",
  userProfile: "User Profile",
  fullName: "Full Name",
  emailAddress: "Email Address",
  registrationDate: "Registration Date",
  lastLogin: "Last Login",
  accountStatus: "Account Status",
  active: "Active",
  inactive: "Inactive",

  // ترجمات معلومات الاشتراك
  subscriptionInformation: "Subscription Information",
  currentPlanDetails: "Current Plan Details",
  planName: "Plan Name",
  billingPeriod: "Billing Period",
  nextBillingDate: "Next Billing Date",
  subscriptionStatus: "Subscription Status",
  notSubscribed: "Not Subscribed",
  freeUser: "Free User",
  upgradeNow: "Upgrade Now",

  // ترجمات صفحة إدارة الملفات
  fileStatistics: "File Statistics",
  totalFiles: "Total Files",
  totalSize: "Total Size",
  fileTypes: "File Types",
  logos: "Logos",
  other: "Other",
  manageUploadedFiles: "Manage Uploaded Files",
  clearAllFiles: "Clear All Files",
  uploadNewFile: "Upload New File",
  refresh: "Refresh",
  name: "Name",
  type: "Type",
  size: "Size",
  uploadDate: "Upload Date",
  downloadFile: "Download File",
  viewFile: "View File",
  deleteFile: "Delete File",
  noFiles: "No Files",

  // ترجمات صفحة الاشتراك
  mostPopular: "Most Popular",
  yearlyDiscount: "Save 20% with yearly billing",
  basicCurrencyConversion: "Basic currency conversion",
  upToFiveItems: "Up to 5 items per calculation",
  limitedPDFExports: "Limited PDF exports",
  standardSupport: "Standard support",
  advancedCurrencyConversion: "Advanced currency conversion",
  unlimitedPDFExports: "Unlimited PDF exports with branding",
  realtimeExchangeRates: "Real-time exchange rate updates",
  dataVisualization: "Data visualization and charts",
  everythingInPro: "Everything in Pro plan",
  teamCollaboration: "Team collaboration features",
  advancedReporting: "Advanced reporting and analytics",
  apiAccess: "API access for integration",
  prioritySupport: "Priority support",
  frequentlyAskedQuestions: "Frequently Asked Questions",
  howDoesTrial: "How does the 14-day trial work?",
  trialExplanation: "All paid plans come with a 14-day free trial. You won't be charged until the trial period ends, and you can cancel anytime before then.",
  canChangePlans: "Can I change plans later?",
  changePlansExplanation: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, the new rate will apply at the next billing cycle.",
  paymentMethods: "What payment methods do you accept?",
  paymentMethodsExplanation: "We accept all major credit cards, PayPal, and various local payment methods through our payment processor, Paddle.",
  refundPolicyExplanation: "We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied with our service, you can request a full refund within 14 days of your initial purchase.",
  readFullRefundPolicy: "Read full refund policy",

  // ترجمات جديدة لمكون موافقة ملفات تعريف الارتباط
  cookieConsentText: "We use cookies to enhance your experience. Do you consent to our use of cookies?",
  accept: "Accept",
  decline: "Decline",
  privacySettings: "Privacy Settings",
  storagePreferences: "Storage Preferences",
  analyticsPreferences: "Analytics Preferences",
  advertisingPreferences: "Advertising Preferences",
  necessaryCookies: "Necessary Cookies",
  analyticsCookies: "Analytics Cookies",
  advertisingCookies: "Advertising Cookies",
  functionalCookies: "Functional Cookies",
  savePreferences: "Save Preferences",

  // Additional translations for pricing page
  subscriptionPlansDescription: "Choose the plan that suits your needs. All plans include free updates and continuous improvements.",
  allFeaturesInFreePlan: "All features in Free Plan",
  noAds: "No Ads",
  limitedFileStorage: "Limited File Storage",
  oneGBStorage: "1GB File Storage",
  fiveGBStorage: "5GB File Storage",
  multipleAccounts: "Multiple Accounts",
  dedicatedSupport: "Dedicated 24/7 Support",
  canCancelAnytime: "Can I cancel my subscription at any time?",
  cancelExplanation: "Yes, you can cancel your subscription at any time. You will continue to have access to paid features until the end of your current billing period.",
  forMoreInfo: "For more information, please check our",
  and: "and",

  // Currency group translations
  currencyGroupMENA: "Middle East & North Africa",
  currencyGroupAmericasEurope: "Americas & Europe",
  currencyGroupAsiaPacific: "Asia & Pacific",
  currencyGroupOthers: "Others",

  // Currency symbols
  symbolUSD: "$",
  symbolEGP: "EGP",
  symbolAED: "AED",
  symbolEUR: "€",
  symbolGBP: "£",
  symbolSAR: "SAR",
  symbolJPY: "¥",
  symbolCNY: "¥",
  symbolCAD: "C$",
  symbolAUD: "A$",
  symbolCHF: "CHF",
  symbolINR: "₹",
  symbolRUB: "₽",
  symbolTRY: "₺",
  symbolBRL: "R$",
  symbolKWD: "KWD",
  symbolQAR: "QAR",
  symbolMYR: "RM",
  symbolSGD: "S$",
  symbolZAR: "R",
  symbolSEK: "kr",
  symbolNOK: "kr",
  symbolDKK: "kr",
  symbolILS: "₪",
  symbolJOD: "JOD",
  symbolBHD: "BHD",
  symbolOMR: "OMR",
  symbolMAD: "MAD",
  symbolTND: "TND",
}

// German translations
export const de: Translation = {
  appTitle: "WorldCosts",
  appDescription: "Fügen Sie Artikel mit Währungsauswahl hinzu und berechnen Sie Summen in verschiedenen Währungen",

  // Refund policy
  refundPolicyTitle: "Rückerstattungsrichtlinie",
  refundPolicyText: "Wir bieten eine faire Rückerstattungsrichtlinie für unsere Kunden.",

  // Subscription related
  subscription: "Abonnement",
  subscriptionPlans: "Abonnementpläne",
  proPlan: "Pro-Plan",
  businessPlan: "Business-Plan",
  freePlan: "Kostenloser Plan",
  monthlyBilling: "Monatliche Abrechnung",
  yearlyBilling: "Jährliche Abrechnung",
  subscribe: "Jetzt abonnieren",
  loginToSubscribe: "Anmelden zum Abonnieren",
  loginRequiredForSubscription: "Sie müssen sich zuerst anmelden, um diesen Plan zu abonnieren",
  subscriptionSuccess: "Abonnement erfolgreich!",
  subscriptionSuccessDesc: "Vielen Dank für Ihr Abonnement bei WorldCosts. Ihr Abonnement wurde erfolgreich aktiviert.",
  subscriptionDetails: "Abonnementdetails",
  plan: "Plan",
  billingCycle: "Abrechnungszyklus",
  whatNext: "Was kommt als Nächstes?",
  subscriptionSuccessNextSteps: "Sie können jetzt alle Premium-Funktionen genießen. Entdecken Sie die neuen Funktionen, die Ihnen jetzt zur Verfügung stehen.",
  goToDashboard: "Zum Dashboard",
  upgradeToProVersion: "Upgrade auf Pro-Version",
  proFeatures: "Pro-Funktionen",
  unlimitedItems: "Unbegrenzte Artikel",
  advancedReports: "Erweiterte Berichte",
  customBranding: "Individuelles Branding",
  dataSync: "Datensynchronisierung",
  currentPlan: "Aktueller Plan",

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
  sgd: "Singapur-Dollar",
  zar: "Südafrikanischer Rand",
  sek: "Schwedische Krone",
  nok: "Norwegische Krone",
  dkk: "Dänische Krone",
  ils: "Israelischer Schekel",
  jod: "Jordanischer Dinar",
  bhd: "Bahrain-Dinar",
  omr: "Omanischer Rial",
  mad: "Marokkanischer Dirham",
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
  pdfFileNameHint: "Dieser Name wird beim Herunterladen der PDF-Datei verwendet. Wenn Sie keinen Namen eingeben, wird ein Standardname verwendet.",

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
  privacyPolicyTitle: "Datenschutzrichtlinie",
  privacyLastUpdated: "Zuletzt aktualisiert",
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
  termsAndConditionsTitle: "Allgemeine Geschäftsbedingungen",
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
  footerTerms: "Allgemeine Geschäftsbedingungen",
  footerPrivacy: "Datenschutzrichtlinie",

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

  // ترجمات صفحات الموقع
  pricing: "Preise",
  refundPolicy: "Rückerstattungsrichtlinie",
  fileManagement: "Dateiverwaltung",

  // ترجمات صفحة الإدارة
  adminDashboard: "Admin-Dashboard",
  manageSubscription: "Verwalten Sie Ihr Abonnement und upgraden Sie auf Premium-Pläne",
  viewAndManageFiles: "Hochgeladene Dateien anzeigen und verwalten",
  settings: "Einstellungen",
  configureAppSettings: "Anwendungseinstellungen konfigurieren",

  // ترجمات صفحة الإعدادات
  appSettings: "Anwendungseinstellungen",
  fileSettings: "Dateieinstellungen",
  enableFileTracking: "Dateiverfolgung aktivieren",
  trackAllUploadedFiles: "Alle hochgeladenen Dateien verfolgen",
  maxFileSizeMB: "Maximale Dateigröße (MB)",
  allowedFileTypes: "Erlaubte Dateitypen",
  enterFileExtensions: "Geben Sie Dateierweiterungen durch Kommas getrennt ein",
  autoDeleteOldFiles: "Alte Dateien automatisch löschen",
  deleteOldFilesAfterPeriod: "Alte Dateien nach einem bestimmten Zeitraum löschen",
  deleteFilesAfterDays: "Dateien löschen nach (Tagen)",
  saveSettings: "Einstellungen speichern",
  settingsSaved: "Einstellungen gespeichert",
  settingsSavedDesc: "Anwendungseinstellungen wurden erfolgreich gespeichert",
  settingsError: "Fehler beim Speichern der Einstellungen",
  settingsErrorDesc: "Beim Versuch, die Einstellungen zu speichern, ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  backToAdmin: "Zurück zum Admin-Bereich",

  // ترجمات معلومات المستخدم
  userInformation: "Benutzerinformationen",
  userProfile: "Benutzerprofil",
  fullName: "Vollständiger Name",
  emailAddress: "E-Mail-Adresse",
  registrationDate: "Registrierungsdatum",
  lastLogin: "Letzter Login",
  accountStatus: "Kontostatus",
  active: "Aktiv",
  inactive: "Inaktiv",

  // ترجمات معلومات الاشتراك
  subscriptionInformation: "Abonnementinformationen",
  currentPlanDetails: "Details zum aktuellen Plan",
  planName: "Planname",
  billingPeriod: "Abrechnungszeitraum",
  nextBillingDate: "Nächstes Abrechnungsdatum",
  subscriptionStatus: "Abonnementstatus",
  notSubscribed: "Nicht abonniert",
  freeUser: "Kostenloser Benutzer",
  upgradeNow: "Jetzt upgraden",

  // ترجمات صفحة إدارة الملفات
  fileStatistics: "Dateistatistiken",
  totalFiles: "Gesamtanzahl der Dateien",
  totalSize: "Gesamtgröße",
  fileTypes: "Dateitypen",
  logos: "Logos",
  other: "Andere",
  manageUploadedFiles: "Hochgeladene Dateien verwalten",
  clearAllFiles: "Alle Dateien löschen",
  uploadNewFile: "Neue Datei hochladen",
  refresh: "Aktualisieren",
  name: "Name",
  type: "Typ",
  size: "Größe",
  uploadDate: "Hochladedatum",
  downloadFile: "Datei herunterladen",
  viewFile: "Datei anzeigen",
  deleteFile: "Datei löschen",
  noFiles: "Keine Dateien",

  // ترجمات صفحة الاشتراك
  mostPopular: "Am beliebtesten",
  yearlyDiscount: "Sparen Sie 20% mit jährlicher Abrechnung",
  basicCurrencyConversion: "Grundlegende Währungsumrechnung",
  upToFiveItems: "Bis zu 5 Artikel pro Berechnung",
  limitedPDFExports: "Begrenzte PDF-Exporte",
  standardSupport: "Standard-Support",
  advancedCurrencyConversion: "Erweiterte Währungsumrechnung",
  unlimitedPDFExports: "Unbegrenzte PDF-Exporte mit Branding",
  realtimeExchangeRates: "Echtzeit-Wechselkursaktualisierungen",
  dataVisualization: "Datenvisualisierung und Diagramme",
  everythingInPro: "Alles im Pro-Plan",
  teamCollaboration: "Team-Kollaborationsfunktionen",
  advancedReporting: "Erweiterte Berichterstattung und Analyse",
  apiAccess: "API-Zugriff für Integration",
  prioritySupport: "Prioritäts-Support",
  frequentlyAskedQuestions: "Häufig gestellte Fragen",
  howDoesTrial: "Wie funktioniert die 14-tägige Testphase?",
  trialExplanation: "Alle kostenpflichtigen Pläne kommen mit einer 14-tägigen kostenlosen Testphase. Ihnen wird nichts berechnet, bis die Testphase endet, und Sie können jederzeit vorher kündigen.",
  canChangePlans: "Kann ich später den Plan wechseln?",
  changePlansExplanation: "Ja, Sie können Ihren Plan jederzeit upgraden oder downgraden. Bei einem Upgrade wird Ihnen die anteilige Differenz berechnet. Bei einem Downgrade gilt der neue Tarif im nächsten Abrechnungszyklus.",
  paymentMethods: "Welche Zahlungsmethoden akzeptieren Sie?",
  paymentMethodsExplanation: "Wir akzeptieren alle gängigen Kreditkarten, PayPal und verschiedene lokale Zahlungsmethoden über unseren Zahlungsabwickler Paddle.",
  refundPolicyExplanation: "Wir bieten eine 14-tägige Geld-zurück-Garantie für alle neuen Abonnements. Wenn Sie mit unserem Service nicht zufrieden sind, können Sie innerhalb von 14 Tagen nach Ihrem ersten Kauf eine vollständige Rückerstattung beantragen.",
  readFullRefundPolicy: "Vollständige Rückerstattungsrichtlinie lesen",

  // ترجمات جديدة لمكون موافقة ملفات تعريف الارتباط
  cookieConsentText:
    "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Stimmen Sie der Verwendung von Cookies zu?",
  accept: "Akzeptieren",
  decline: "Ablehnen",
  privacySettings: "Datenschutzeinstellungen",
  storagePreferences: "Speichereinstellungen",
  analyticsPreferences: "Analyse-Einstellungen",
  advertisingPreferences: "Werbe-Einstellungen",
  necessaryCookies: "Notwendige Cookies",
  analyticsCookies: "Analyse-Cookies",
  advertisingCookies: "Werbe-Cookies",
  functionalCookies: "Funktionale Cookies",
  savePreferences: "Einstellungen speichern",

  // Additional translations for pricing page
  subscriptionPlansDescription: "Wählen Sie den Plan, der Ihren Anforderungen entspricht. Alle Pläne beinhalten kostenlose Updates und kontinuierliche Verbesserungen.",
  allFeaturesInFreePlan: "Alle Funktionen des kostenlosen Plans",
  noAds: "Keine Werbung",
  limitedFileStorage: "Begrenzter Dateispeicher",
  oneGBStorage: "1GB Dateispeicher",
  fiveGBStorage: "5GB Dateispeicher",
  multipleAccounts: "Mehrere Konten",
  dedicatedSupport: "Dedizierter 24/7-Support",
  canCancelAnytime: "Kann ich mein Abonnement jederzeit kündigen?",
  cancelExplanation: "Ja, Sie können Ihr Abonnement jederzeit kündigen. Sie haben weiterhin Zugriff auf bezahlte Funktionen bis zum Ende Ihres aktuellen Abrechnungszeitraums.",
  forMoreInfo: "Für weitere Informationen, bitte lesen Sie unsere",
  and: "und",

  // Currency group translations
  currencyGroupMENA: "Naher Osten & Nordafrika",
  currencyGroupAmericasEurope: "Amerika & Europa",
  currencyGroupAsiaPacific: "Asien & Pazifik",
  currencyGroupOthers: "Andere",

  // Währungssymbole
  symbolUSD: "$",
  symbolEGP: "EGP",
  symbolAED: "AED",
  symbolEUR: "€",
  symbolGBP: "£",
  symbolSAR: "SAR",
  symbolJPY: "¥",
  symbolCNY: "¥",
  symbolCAD: "C$",
  symbolAUD: "A$",
  symbolCHF: "CHF",
  symbolINR: "₹",
  symbolRUB: "₽",
  symbolTRY: "₺",
  symbolBRL: "R$",
  symbolKWD: "KWD",
  symbolQAR: "QAR",
  symbolMYR: "RM",
  symbolSGD: "S$",
  symbolZAR: "R",
  symbolSEK: "kr",
  symbolNOK: "kr",
  symbolDKK: "kr",
  symbolILS: "₪",
  symbolJOD: "JOD",
  symbolBHD: "BHD",
  symbolOMR: "OMR",
  symbolMAD: "MAD",
  symbolTND: "TND",
}

// تحديث الترجمات الفرنسية
export const fr: Translation = {
  appTitle: "WorldCosts",
  appDescription: "Ajoutez des articles avec sélection de devise et calculez les totaux en différentes devises",

  // Refund policy
  refundPolicyTitle: "Politique de Remboursement",
  refundPolicyText: "Nous offrons une politique de remboursement équitable pour nos clients.",

  // Subscription related
  subscription: "Abonnement",
  subscriptionPlans: "Plans d'abonnement",
  proPlan: "Plan Pro",
  businessPlan: "Plan Business",
  freePlan: "Plan Gratuit",
  monthlyBilling: "Facturation mensuelle",
  yearlyBilling: "Facturation annuelle",
  subscribe: "S'abonner maintenant",
  loginToSubscribe: "Connectez-vous pour vous abonner",
  loginRequiredForSubscription: "Vous devez vous connecter d'abord pour vous abonner à ce plan",
  subscriptionSuccess: "Abonnement réussi !",
  subscriptionSuccessDesc: "Merci de vous être abonné à WorldCosts. Votre abonnement a été activé avec succès.",
  subscriptionDetails: "Détails de l'abonnement",
  plan: "Plan",
  billingCycle: "Cycle de facturation",
  whatNext: "Et maintenant ?",
  subscriptionSuccessNextSteps: "Vous pouvez maintenant profiter de toutes les fonctionnalités premium. Explorez les nouvelles fonctionnalités qui vous sont désormais accessibles.",
  goToDashboard: "Aller au tableau de bord",
  upgradeToProVersion: "Passer à la version Pro",
  proFeatures: "Fonctionnalités Pro",
  unlimitedItems: "Articles illimités",
  advancedReports: "Rapports avancés",
  customBranding: "Personnalisation de la marque",
  dataSync: "Synchronisation des données",
  currentPlan: "Plan actuel",

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
  aed: "Dirham des Émirats arabes unis",
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
  sgd: "Dollar singapourien",
  zar: "Rand sud-africain",
  sek: "Couronne suédoise",
  nok: "Couronne norvégienne",
  dkk: "Couronne danoise",
  ils: "Shekel israélien",
  jod: "Dinar jordanien",
  bhd: "Dinar bahreïni",
  omr: "Riyal omanais",
  mad: "Dirham marocain",
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
  pdfFileNameHint: "Ce nom sera utilisé lors du téléchargement du fichier PDF. Si vous n'entrez pas de nom, un nom par défaut sera utilisé.",

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
  privacyPolicyTitle: "Politique de confidentialité",
  privacyLastUpdated: "Dernière mise à jour",
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
  termsAndConditionsTitle: "Conditions générales",
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
  footerTerms: "Conditions générales",
  footerPrivacy: "Politique de confidentialité",

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

  // ترجمات صفحات الموقع
  pricing: "Tarifs",
  refundPolicy: "Politique de remboursement",
  fileManagement: "Gestion des fichiers",

  // ترجمات صفحة الإدارة
  adminDashboard: "Tableau de bord d'administration",
  manageSubscription: "Gérez votre abonnement et passez aux forfaits premium",
  viewAndManageFiles: "Afficher et gérer les fichiers téléchargés",
  settings: "Paramètres",
  configureAppSettings: "Configurer les paramètres de l'application",

  // ترجمات صفحة الإعدادات
  appSettings: "Paramètres de l'application",
  fileSettings: "Paramètres des fichiers",
  enableFileTracking: "Activer le suivi des fichiers",
  trackAllUploadedFiles: "Suivre tous les fichiers téléchargés",
  maxFileSizeMB: "Taille maximale de fichier (MB)",
  allowedFileTypes: "Types de fichiers autorisés",
  enterFileExtensions: "Entrez les extensions de fichiers séparées par des virgules",
  autoDeleteOldFiles: "Supprimer automatiquement les anciens fichiers",
  deleteOldFilesAfterPeriod: "Supprimer les anciens fichiers après une période spécifiée",
  deleteFilesAfterDays: "Supprimer les fichiers après (jours)",
  saveSettings: "Enregistrer les paramètres",
  settingsSaved: "Paramètres enregistrés",
  settingsSavedDesc: "Les paramètres de l'application ont été enregistrés avec succès",
  settingsError: "Erreur lors de l'enregistrement des paramètres",
  settingsErrorDesc: "Une erreur s'est produite lors de la tentative d'enregistrement des paramètres. Veuillez réessayer.",
  backToAdmin: "Retour à l'administration",

  // ترجمات معلومات المستخدم
  userInformation: "Informations utilisateur",
  userProfile: "Profil utilisateur",
  fullName: "Nom complet",
  emailAddress: "Adresse e-mail",
  registrationDate: "Date d'inscription",
  lastLogin: "Dernière connexion",
  accountStatus: "Statut du compte",
  active: "Actif",
  inactive: "Inactif",

  // ترجمات معلومات الاشتراك
  subscriptionInformation: "Informations d'abonnement",
  currentPlanDetails: "Détails du forfait actuel",
  planName: "Nom du forfait",
  billingPeriod: "Période de facturation",
  nextBillingDate: "Prochaine date de facturation",
  subscriptionStatus: "Statut de l'abonnement",
  notSubscribed: "Non abonné",
  freeUser: "Utilisateur gratuit",
  upgradeNow: "Mettre à niveau maintenant",

  // ترجمات صفحة إدارة الملفات
  fileStatistics: "Statistiques des fichiers",
  totalFiles: "Total des fichiers",
  totalSize: "Taille totale",
  fileTypes: "Types de fichiers",
  logos: "Logos",
  other: "Autres",
  manageUploadedFiles: "Gérer les fichiers téléchargés",
  clearAllFiles: "Effacer tous les fichiers",
  uploadNewFile: "Télécharger un nouveau fichier",
  refresh: "Actualiser",
  name: "Nom",
  type: "Type",
  size: "Taille",
  uploadDate: "Date de téléchargement",
  downloadFile: "Télécharger le fichier",
  viewFile: "Voir le fichier",
  deleteFile: "Supprimer le fichier",
  noFiles: "Aucun fichier",

  // ترجمات صفحة الاشتراك
  mostPopular: "Le plus populaire",
  yearlyDiscount: "Économisez 20% avec la facturation annuelle",
  basicCurrencyConversion: "Conversion de devises de base",
  upToFiveItems: "Jusqu'à 5 articles par calcul",
  limitedPDFExports: "Exportations PDF limitées",
  standardSupport: "Support standard",
  advancedCurrencyConversion: "Conversion de devises avancée",
  unlimitedPDFExports: "Exportations PDF illimitées avec branding",
  realtimeExchangeRates: "Mises à jour des taux de change en temps réel",
  dataVisualization: "Visualisation des données et graphiques",
  everythingInPro: "Tout ce qui est dans le plan Pro",
  teamCollaboration: "Fonctionnalités de collaboration d'équipe",
  advancedReporting: "Rapports et analyses avancés",
  apiAccess: "Accès API pour l'intégration",
  prioritySupport: "Support prioritaire",
  frequentlyAskedQuestions: "Questions fréquemment posées",
  howDoesTrial: "Comment fonctionne l'essai gratuit de 14 jours?",
  trialExplanation: "Tous les plans payants sont accompagnés d'un essai gratuit de 14 jours. Vous ne serez pas facturé avant la fin de la période d'essai, et vous pouvez annuler à tout moment avant cela.",
  canChangePlans: "Puis-je changer de plan plus tard?",
  changePlansExplanation: "Oui, vous pouvez mettre à niveau ou rétrograder votre plan à tout moment. Si vous effectuez une mise à niveau, la différence proportionnelle vous sera facturée. Si vous rétrogradez, le nouveau tarif s'appliquera au prochain cycle de facturation.",
  paymentMethods: "Quels modes de paiement acceptez-vous?",
  paymentMethodsExplanation: "Nous acceptons toutes les principales cartes de crédit, PayPal et diverses méthodes de paiement locales via notre processeur de paiement, Paddle.",
  refundPolicyExplanation: "Nous offrons une garantie de remboursement de 14 jours pour tous les nouveaux abonnements. Si vous n'êtes pas satisfait de notre service, vous pouvez demander un remboursement complet dans les 14 jours suivant votre achat initial.",
  readFullRefundPolicy: "Lire la politique de remboursement complète",

  // ترجمات جديدة لمكون موافقة ملفات تعريف الارتباط
  cookieConsentText:
    "Nous utilisons des cookies pour améliorer votre expérience. Acceptez-vous notre utilisation des cookies ?",
  accept: "Accepter",
  decline: "Refuser",
  privacySettings: "Paramètres de confidentialité",
  storagePreferences: "Préférences de stockage",
  analyticsPreferences: "Préférences d'analyse",
  advertisingPreferences: "Préférences de publicité",
  necessaryCookies: "Cookies nécessaires",
  analyticsCookies: "Cookies analytiques",
  advertisingCookies: "Cookies publicitaires",
  functionalCookies: "Cookies fonctionnels",
  savePreferences: "Enregistrer les préférences",



  // Additional translations for pricing page
  subscriptionPlansDescription: "Choisissez le plan qui convient à vos besoins. Tous les plans comprennent des mises à jour gratuites et des améliorations continues.",
  allFeaturesInFreePlan: "Toutes les fonctionnalités du plan gratuit",
  noAds: "Sans publicité",
  limitedFileStorage: "Stockage de fichiers limité",
  oneGBStorage: "Stockage de fichiers 1GB",
  fiveGBStorage: "Stockage de fichiers 5GB",
  multipleAccounts: "Comptes multiples",
  dedicatedSupport: "Support dédié 24/7",
  canCancelAnytime: "Puis-je annuler mon abonnement à tout moment ?",
  cancelExplanation: "Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités payantes jusqu'à la fin de votre période de facturation en cours.",
  forMoreInfo: "Pour plus d'informations, veuillez consulter notre",
  and: "et",

  // Currency group translations
  currencyGroupMENA: "Moyen-Orient et Afrique du Nord",
  currencyGroupAmericasEurope: "Amériques et Europe",
  currencyGroupAsiaPacific: "Asie et Pacifique",
  currencyGroupOthers: "Autres",

  // Symboles de devises
  symbolUSD: "$",
  symbolEGP: "EGP",
  symbolAED: "AED",
  symbolEUR: "€",
  symbolGBP: "£",
  symbolSAR: "SAR",
  symbolJPY: "¥",
  symbolCNY: "¥",
  symbolCAD: "C$",
  symbolAUD: "A$",
  symbolCHF: "CHF",
  symbolINR: "₹",
  symbolRUB: "₽",
  symbolTRY: "₺",
  symbolBRL: "R$",
  symbolKWD: "KWD",
  symbolQAR: "QAR",
  symbolMYR: "RM",
  symbolSGD: "S$",
  symbolZAR: "R",
  symbolSEK: "kr",
  symbolNOK: "kr",
  symbolDKK: "kr",
  symbolILS: "₪",
  symbolJOD: "JOD",
  symbolBHD: "BHD",
  symbolOMR: "OMR",
  symbolMAD: "MAD",
  symbolTND: "TND",
}

// Export all translations
export const translations = {
  ar,
  en,
  de,
  fr,
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
