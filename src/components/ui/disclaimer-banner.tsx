"use client";

import { useI18n } from "@/providers/i18n-provider";
import { motion } from "motion/react";

export function DisclaimerBanner() {
  const { locale } = useI18n();
  const isAr = locale === "ar";

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-300"
    >
      {isAr ? (
        <>
          <strong>تنويه:</strong> إدارة الموقع غير مسؤولة عن أي محتوى يتم نشره من قبل المستخدمين. تحميل أي ملفات أو الدخول إلى أي روابط منشورة يتم على مسؤوليتك الشخصية. الموقع لا يتحمل أي مسؤولية عن أي أضرار قد تنتج عن ذلك.
        </>
      ) : (
        <>
          <strong>Disclaimer:</strong> The site management is not responsible for any user-generated content. Downloading any files or clicking on any links posted by users is done at your own risk. The site assumes no liability for any damages that may result.
        </>
      )}
    </motion.div>
  );
}
