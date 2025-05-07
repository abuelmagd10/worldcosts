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
  ratesLastUpdated: string
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
  chartTitleValues: string
  pieChartView: string
  barChartView: string
  itemsChartView: string
  itemCount: string

  // Navigation links
  backToHome: string

  // Privacy Policy
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

  // Terms and Conditions
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
  termsLink: string
  privacyLink: string

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

  // Cookie consent
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

  // File management
  fileManagement: string
  fileStatistics: string
  totalFiles: string
  totalSize: string
  fileTypes: string
  pdfFiles: string
  logoFiles: string
  otherFiles: string
  uploadedFilesManagement: string
  clearAllFiles: string
  uploadNewFile: string
  refresh: string
  noFiles: string
  fileName: string
  fileType: string
  fileSize: string
  uploadDate: string
  downloadFile: string
  viewFile: string
  deleteFile: string
  fileDeleted: string
  fileDeletedDesc: string
  fileUploaded: string
  fileUploadedDesc: string
  fileDownloaded: string
  fileDownloadedDesc: string
  fileViewError: string
  fileViewErrorDesc: string
  refreshed: string
  refreshedDesc: string
  allFilesCleared: string
  allFilesClearedDesc: string
  adminPanel: string
  viewAndManageFiles: string
}

// Arabic translations
export const ar: Translation = {
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

  ratesLastUpdated: "آخر تحديث لأسعار الصرف",
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

  // Navigation links
  backToHome: "العودة إلى الصفحة الرئيسية",

  // Privacy Policy
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

  // Terms and Conditions
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

  // About Us
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
  termsLink: "الشروط والأحكام",
  privacyLink: "سياسة الخصوصية",

  // Theme related
  toggleTheme: "تبديل المظهر",
  lightTheme: "وضع النهار",
  darkTheme: "وضع الليل",

  // Features
  features: "المميزات",
  feature1Description: "احسب تكلفة منتجاتك بدقة بما في ذلك تكلفة الوحدة والتعبئة والشحن والجمارك",
  feature2Description: "تحويل العملات في الوقت الفعلي باستخدام أحدث أسعار الصرف",
  feature3Description: "تصميم التقارير المهنية وتحميلها كملف PDF مع إمكانية إضافة شعار الشركة ومعلوماتها",
  feature4Description: "واجهة سهلة الاستخدام ومتوفرة بلغات متعددة",

  // Cookie consent
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

  // File management
  fileManagement: "إدارة الملفات",
  fileStatistics: "إحصائيات الملفات",
  totalFiles: "إجمالي الملفات",
  totalSize: "الحجم الإجمالي",
  fileTypes: "أنواع الملفات",
  pdfFiles: "PDF",
  logoFiles: "شعارات",
  otherFiles: "أخرى",
  uploadedFilesManagement: "إدارة الملفات المرفوعة",
  clearAllFiles: "مسح جميع الملفات",
  uploadNewFile: "رفع ملف جديد",
  refresh: "تحديث",
  noFiles: "لا توجد ملفات",
  fileName: "الاسم",
  fileType: "النوع",
  fileSize: "الحجم",
  uploadDate: "تاريخ الرفع",
  downloadFile: "تحميل الملف",
  viewFile: "عرض الملف",
  deleteFile: "حذف الملف",
  fileDeleted: "تم الحذف",
  fileDeletedDesc: "تم حذف الملف بنجاح",
  fileUploaded: "تم الرفع",
  fileUploadedDesc: "تم رفع الملف بنجاح",
  fileDownloaded: "تم التحميل",
  fileDownloadedDesc: "تم تحميل الملف بنجاح",
  fileViewError: "خطأ",
  fileViewErrorDesc: "لا يمكن عرض الملف، المحتوى غير متوفر",
  refreshed: "تم التحديث",
  refreshedDesc: "تم تحميل الملفات بنجاح",
  allFilesCleared: "تم المسح",
  allFilesClearedDesc: "تم مسح جميع الملفات بنجاح",
  adminPanel: "لوحة الإدارة",
  viewAndManageFiles: "عرض وإدارة الملفات المرفوعة"
}

// English translations
export const en: Translation = {
  appTitle: "WorldCosts",
  appDescription: "Add items with currency selection and calculate totals in different currencies",

  itemName: "Item Name",
  itemValue: "Value (math expressions allowed)",
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

  ratesLastUpdated: "Exchange rates last updated",
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

  // Navigation links
  backToHome: "Back to Home",

  // Privacy Policy
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

  // Terms and Conditions
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

  // About Us
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
  termsLink: "Terms & Conditions",
  privacyLink: "Privacy Policy",

  // Theme related
  toggleTheme: "Toggle Theme",
  lightTheme: "Light Mode",
  darkTheme: "Dark Mode",

  // Features
  features: "Features",
  feature1Description: "Calculate your product costs accurately including unit cost, packaging, shipping, and customs",
  feature2Description: "Real-time currency conversion using the latest exchange rates",
  feature3Description: "Design professional reports and download them as PDF with company logo and information",
  feature4Description: "User-friendly interface available in multiple languages",

  // Cookie consent
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

  // File management
  fileManagement: "File Management",
  fileStatistics: "File Statistics",
  totalFiles: "Total Files",
  totalSize: "Total Size",
  fileTypes: "File Types",
  pdfFiles: "PDF",
  logoFiles: "Logos",
  otherFiles: "Others",
  uploadedFilesManagement: "Uploaded Files Management",
  clearAllFiles: "Clear All Files",
  uploadNewFile: "Upload New File",
  refresh: "Refresh",
  noFiles: "No Files",
  fileName: "Name",
  fileType: "Type",
  fileSize: "Size",
  uploadDate: "Upload Date",
  downloadFile: "Download File",
  viewFile: "View File",
  deleteFile: "Delete File",
  fileDeleted: "Deleted",
  fileDeletedDesc: "File has been successfully deleted",
  fileUploaded: "Uploaded",
  fileUploadedDesc: "File has been successfully uploaded",
  fileDownloaded: "Downloaded",
  fileDownloadedDesc: "File has been successfully downloaded",
  fileViewError: "Error",
  fileViewErrorDesc: "Cannot view file, content not available",
  refreshed: "Refreshed",
  refreshedDesc: "Files have been successfully loaded",
  allFilesCleared: "Cleared",
  allFilesClearedDesc: "All files have been successfully cleared",
  adminPanel: "Admin Panel",
  viewAndManageFiles: "View and manage uploaded files"
}

// German translations
export const de: Translation = {
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

  ratesLastUpdated: "Wechselkurse zuletzt aktualisiert",
  updateRates: "Kurse aktualisieren",

  downloadPDF: "PDF herunterladen",
  companyInfo: "Firmeninformationen",
  addCompanyInfo: "Firmeninformationen hinzufügen",
  editCompanyInfo: "Firmeninformationen bearbeiten",
  pdfFileName: "PDF-Dateiname",
  pdfFileNameHint: "Geben Sie einen Namen für die PDF-Datei ein",

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

  // Navigation links
  backToHome: "Zurück zur Startseite",

  // Privacy Policy
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

  // Terms and Conditions
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

  // About Us
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
  termsLink: "Allgemeine Geschäftsbedingungen",
  privacyLink: "Datenschutzrichtlinie",

  // Theme related
  toggleTheme: "Thema umschalten",
  lightTheme: "Heller Modus",
  darkTheme: "Dunkler Modus",

  // Features
  features: "Funktionen",
  feature1Description:
    "Berechnen Sie Ihre Produktkosten genau, einschließlich Stückkosten, Verpackung, Versand und Zoll",
  feature2Description: "Echtzeit-Währungsumrechnung mit den neuesten Wechselkursen",
  feature3Description:
    "Entwerfen Sie professionelle Berichte und laden Sie sie als PDF mit Firmenlogo und Informationen herunter",
  feature4Description: "Benutzerfreundliche Oberfläche in mehreren Sprachen verfügbar",

  // Cookie consent
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

  // File management
  fileManagement: "Dateiverwaltung",
  fileStatistics: "Dateistatistiken",
  totalFiles: "Gesamtanzahl Dateien",
  totalSize: "Gesamtgröße",
  fileTypes: "Dateitypen",
  pdfFiles: "PDF",
  logoFiles: "Logos",
  otherFiles: "Andere",
  uploadedFilesManagement: "Verwaltung hochgeladener Dateien",
  clearAllFiles: "Alle Dateien löschen",
  uploadNewFile: "Neue Datei hochladen",
  refresh: "Aktualisieren",
  noFiles: "Keine Dateien",
  fileName: "Name",
  fileType: "Typ",
  fileSize: "Größe",
  uploadDate: "Hochladedatum",
  downloadFile: "Datei herunterladen",
  viewFile: "Datei anzeigen",
  deleteFile: "Datei löschen",
  fileDeleted: "Gelöscht",
  fileDeletedDesc: "Datei wurde erfolgreich gelöscht",
  fileUploaded: "Hochgeladen",
  fileUploadedDesc: "Datei wurde erfolgreich hochgeladen",
  fileDownloaded: "Heruntergeladen",
  fileDownloadedDesc: "Datei wurde erfolgreich heruntergeladen",
  fileViewError: "Fehler",
  fileViewErrorDesc: "Datei kann nicht angezeigt werden, Inhalt nicht verfügbar",
  refreshed: "Aktualisiert",
  refreshedDesc: "Dateien wurden erfolgreich geladen",
  allFilesCleared: "Gelöscht",
  allFilesClearedDesc: "Alle Dateien wurden erfolgreich gelöscht",
  adminPanel: "Administrationsbereich",
  viewAndManageFiles: "Hochgeladene Dateien anzeigen und verwalten"
}

// French translations
export const fr: Translation = {
  appTitle: "WorldCosts",
  appDescription: "Ajoutez des articles avec sélection de devise et calculez les totaux en différentes devises",

  itemName: "Nom de l'article",
  itemValue: "Valeur (expressions mathématiques autorisées)",
  currency: "Devise",
  addItem: "Ajouter un article",
  reset: "Réinitialiser",

  addedItems: "Articles ajoutés",
  inputValue: "Valeur saisie",
  calculatedValue: "Valeur calculée",

  usd: "Dollar américain",
  egp: "Livre égyptienne",
  aed: "Dirham des Émirats",
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
  totalCurrency: "Devise totale",
  selectTotalCurrency: "Sélectionner la devise totale",

  ratesLastUpdated: "Taux de change mis à jour le",
  updateRates: "Mettre à jour les taux",

  downloadPDF: "Télécharger PDF",
  companyInfo: "Infos société",
  addCompanyInfo: "Ajouter infos société",
  editCompanyInfo: "Modifier infos société",
  pdfFileName: "Nom du fichier PDF",
  pdfFileNameHint: "Entrez un nom pour le fichier PDF",

  companyInfoTitle: "Informations de la société",
  companyInfoDescription: "Entrez les informations de la société à afficher dans le fichier PDF",
  companyName: "Nom de la société",
  companyAddress: "Adresse de la société",
  companyPhone: "Numéro de téléphone",
  companyLogo: "Logo de la société",
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
  companyInfoSaved: "Informations de la société enregistrées",
  companyInfoSavedDesc: "Les informations de la société seront ajoutées au fichier PDF lors du téléchargement.",

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
  updateItem: "Mettre à jour l'article",

  // PWA translations
  installApp: "Installer l'application",
  offlineTitle: "Vous êtes hors ligne",
  offlineDescription: "Certaines fonctionnalités peuvent ne pas fonctionner correctement. Veuillez vérifier votre connexion Internet.",
  networkStatus: "État du réseau",
  online: "En ligne",
  offline: "Hors ligne",

  // Rates updated
  ratesUpdated: "Taux mis à jour",
  ratesUpdatedDesc: "Les taux de change ont été mis à jour avec succès",

  // Empty state
  emptyStateTitle: "Calculatrice multi-devises",
  emptyStateDescription: "Ajoutez des articles à l'aide du formulaire ci-dessus pour commencer à calculer les valeurs en plusieurs devises.",

  // Chart related
  chartTitle: "Graphique des articles",
  chartTitleDistribution: "Distribution des valeurs par devise",
  chartTitleCount: "Nombre d'articles par devise",
  chartTitleItems: "Valeurs des articles ajoutés",
  chartTitleValues: "Valeurs totales par devise",
  pieChartView: "Vue graphique circulaire des devises",
  barChartView: "Graphique à barres des valeurs par devise",
  itemsChartView: "Vue des valeurs des articles",
  itemCount: "Nombre d'articles",

  // Navigation links
  backToHome: "Retour à l'accueil",

  // Privacy Policy
  privacyPolicyTitle: "Politique de confidentialité",
  privacyLastUpdated: "Dernière mise à jour",
  introductionTitle: "Introduction",
  privacyIntro:
    "Chez WorldCosts, nous valorisons votre vie privée et nous nous engageons à la protéger. Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre application.",
  informationCollectionTitle: "Informations que nous collectons",
  informationCollection: "Nous pouvons collecter différents types d'informations, notamment :",
  deviceInfo: "Informations sur l'appareil telles que le type d'appareil, le système d'exploitation et le navigateur",
  usageData: "Données d'utilisation telles que la façon dont vous utilisez l'application et les fonctionnalités que vous utilisez",
  preferences: "Vos préférences telles que la langue et la devise préférée",
  dataUsageTitle: "Comment nous utilisons vos données",
  dataUsage: "Nous utilisons les informations que nous collectons aux fins suivantes :",
  improveService: "Pour améliorer et développer nos services",
  userExperience: "Pour personnaliser et améliorer votre expérience utilisateur",
  analytics: "Pour analyser l'utilisation et les performances de l'application",
  dataStorageTitle: "Stockage des données",
  dataStorage:
    "Nous utilisons le stockage local dans votre navigateur pour stocker vos préférences et vos données. Ces données ne sont pas transférées à nos serveurs, sauf si vous choisissez de les partager avec nous.",
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
  contactInfo: "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à info@worldcosts.com.",

  // Terms and Conditions
  termsAndConditionsTitle: "Conditions générales",
  acceptanceTitle: "Acceptation des conditions",
  acceptanceText:
    "En utilisant l'application WorldCosts, vous acceptez d'être lié par ces conditions générales. Si vous n'êtes pas d'accord avec une partie de ces conditions, veuillez ne pas utiliser l'application.",
  useOfServiceTitle: "Utilisation du service",
  useOfServiceText:
    "Vous devez utiliser l'application conformément aux lois applicables et aux conditions énoncées ici. Vous acceptez de ne pas :",
  useRestriction1: "Utiliser l'application à des fins illégales ou interdites",
  useRestriction2: "Tenter d'accéder sans autorisation à nos systèmes ou réseaux",
  useRestriction3: "Publier ou transmettre tout contenu nuisible ou abusif",
  intellectualPropertyTitle: "Propriété intellectuelle",
  intellectualPropertyText:
    "L'application et tout le contenu, les fonctionnalités et les fonctionnalités disponibles par son intermédiaire sont la propriété de WorldCosts ou de ses concédants de licence et sont protégés par les lois sur la propriété intellectuelle.",
  disclaimerTitle: "Avertissement",
  disclaimerText:
    "L'application est fournie 'telle quelle' et 'selon disponibilité' sans aucune garantie d'aucune sorte, expresse ou implicite. Nous ne garantissons pas l'exactitude des taux de change ou d'autres données fournies dans l'application.",
  limitationOfLiabilityTitle: "Limitation de responsabilité",
  limitationOfLiabilityText:
    "WorldCosts ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de votre utilisation de l'application.",
  changesTitle: "Modifications des conditions",
  changesText:
    "Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet immédiatement après leur publication sur cette page.",
  governingLawTitle: "Loi applicable",
  governingLawText:
    "Ces conditions sont régies par et interprétées conformément aux lois du pays dans lequel WorldCosts est établi, sans égard aux principes de conflit de lois.",
  contactInfoTerms: "Si vous avez des questions concernant ces conditions, veuillez nous contacter à info@worldcosts.com.",

  // About Us
  aboutUsSubtitle: "Calculatrice multi-devises facile à utiliser",
  ourMissionTitle: "Notre mission",
  ourMissionText:
    "Chez WorldCosts, notre mission est de simplifier la gestion des coûts en plusieurs devises pour les particuliers et les entreprises. Nous nous efforçons de fournir un outil facile à utiliser et fiable qui aide les utilisateurs à calculer et à suivre les dépenses dans différentes devises avec facilité.",
  whatWeOfferTitle: "Ce que nous offrons",
  whatWeOfferText: "Notre application offre une gamme de fonctionnalités conçues pour répondre aux besoins de gestion multi-devises :",
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
  termsLink: "Conditions générales",
  privacyLink: "Politique de confidentialité",

  // Theme related
  toggleTheme: "Changer de thème",
  lightTheme: "Mode clair",
  darkTheme: "Mode sombre",

  // Features
  features: "Fonctionnalités",
  feature1Description: "Calculez vos coûts de produits avec précision, y compris le coût unitaire, l'emballage, l'expédition et les douanes",
  feature2Description: "Conversion de devises en temps réel utilisant les derniers taux de change",
  feature3Description: "Concevez des rapports professionnels et téléchargez-les au format PDF avec le logo et les informations de l'entreprise",
  feature4Description: "Interface conviviale disponible en plusieurs langues",

  // Cookie consent
  cookieConsentText: "Nous utilisons des cookies pour améliorer votre expérience. Consentez-vous à notre utilisation des cookies ?",
  accept: "Accepter",
  decline: "Refuser",
  privacySettings: "Paramètres de confidentialité",
  storagePreferences: "Préférences de stockage",
  analyticsPreferences: "Préférences d'analyse",
  advertisingPreferences: "Préférences publicitaires",
  necessaryCookies: "Cookies nécessaires",
  analyticsCookies: "Cookies d'analyse",
  advertisingCookies: "Cookies publicitaires",
  functionalCookies: "Cookies fonctionnels",
  savePreferences: "Enregistrer les préférences",

  // File management
  fileManagement: "Gestion des fichiers",
  fileStatistics: "Statistiques des fichiers",
  totalFiles: "Total des fichiers",
  totalSize: "Taille totale",
  fileTypes: "Types de fichiers",
  pdfFiles: "PDF",
  logoFiles: "Logos",
  otherFiles: "Autres",
  uploadedFilesManagement: "Gestion des fichiers téléchargés",
  clearAllFiles: "Effacer tous les fichiers",
  uploadNewFile: "Télécharger un nouveau fichier",
  refresh: "Actualiser",
  noFiles: "Aucun fichier",
  fileName: "Nom",
  fileType: "Type",
  fileSize: "Taille",
  uploadDate: "Date de téléchargement",
  downloadFile: "Télécharger le fichier",
  viewFile: "Voir le fichier",
  deleteFile: "Supprimer le fichier",
  fileDeleted: "Supprimé",
  fileDeletedDesc: "Le fichier a été supprimé avec succès",
  fileUploaded: "Téléchargé",
  fileUploadedDesc: "Le fichier a été téléchargé avec succès",
  fileDownloaded: "Téléchargé",
  fileDownloadedDesc: "Le fichier a été téléchargé avec succès",
  fileViewError: "Erreur",
  fileViewErrorDesc: "Impossible d'afficher le fichier, le contenu n'est pas disponible",
  refreshed: "Actualisé",
  refreshedDesc: "Les fichiers ont été chargés avec succès",
  allFilesCleared: "Effacé",
  allFilesClearedDesc: "Tous les fichiers ont été effacés avec succès",
  adminPanel: "Panneau d'administration",
  viewAndManageFiles: "Afficher et gérer les fichiers téléchargés"
}

// Export all translations
export const translations = {
  ar,
  en,
  de,
  fr,
}