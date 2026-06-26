// terms.js - الشروط والأحكام + إدارة الموافقة
import { t } from './lang.js';

// 1. رقم إصدار الشروط. لو غيرت النص، زود الرقم عشان يطلع للكل يوافق مرة ثانية
export const TERMS_VERSION = "1.0.0";

// 2. نص الشروط - عربي
export const TERMS_AR = `
<h3>الشروط والأحكام - السندات الذكية</h3>
<p><strong>آخر تحديث: 26 يونيو 2026</strong></p>
<ol>
<li><strong>الموافقة على الشروط:</strong> باستخدامك للنظام فإنك توافق على جميع الشروط. إذا كنت لا توافق، يرجى عدم استخدام النظام.</li>
<li><strong>حسابات المستخدمين:</strong> أنت مسؤول عن سرية كلمة المرور. أي نشاط من حسابك يقع تحت مسؤوليتك.</li>
<li><strong>صحة البيانات:</strong> تتعهد بإدخال بيانات صحيحة للسندات والعملاء. البيانات الوهمية تعرض حسابك للإيقاف.</li>
<li><strong>الاستخدام المسموح:</strong> يمنع استخدام النظام لأغراض غير قانونية أو إصدار سندات وهمية أو التلاعب بالأرقام التسلسلية.</li>
<li><strong>الملكية الفكرية:</strong> جميع الحقوق محفوظة. لا يجوز نسخ أو إعادة بيع الخدمة بدون إذن خطي.</li>
<li><strong>حدود المسؤولية:</strong> النظام يقدم "كما هو". لسنا مسؤولين عن أي أضرار ناتجة عن الاستخدام أو التوقف.</li>
<li><strong>إيقاف الخدمة:</strong> يحق للإدارة إيقاف أي مشروع أو مستخدم يخالف الشروط دون إشعار مسبق.</li>
<li><strong>تعديل الشروط:</strong> يحق لنا تعديل الشروط. سيطلب منك الموافقة على النسخة الجديدة عند الدخول.</li>
<li><strong>خصوصية البيانات:</strong> نلتزم بحماية بياناتك وبيانات عملائك. لا نشاركها مع طرف ثالث إلا بموافقتك أو بطلب قانوني.</li>
</ol>
`;

// 3. نص الشروط - انجليزي
export const TERMS_EN = `
<h3>Terms & Conditions - Smart Bonds</h3>
<p><strong>Last Updated: June 26, 2026</strong></p>
<ol>
<li><strong>Acceptance:</strong> By using the system, you agree to all terms. If you do not agree, do not use the system.</li>
<li><strong>User Accounts:</strong> You are responsible for your password confidentiality. All activities from your account are your responsibility.</li>
<li><strong>Data Accuracy:</strong> You undertake to enter correct data for bonds and clients. Fake data may lead to suspension.</li>
<li><strong>Permitted Use:</strong> Forbidden to use for illegal purposes, issuing fake bonds, or manipulating serial numbers.</li>
<li><strong>Intellectual Property:</strong> All rights reserved. No copy or resell without written permission.</li>
<li><strong>Liability:</strong> System provided "as is". Not liable for damages from use or downtime.</li>
<li><strong>Termination:</strong> Admin can suspend any project or user violating terms without notice.</li>
<li><strong>Modification:</strong> We can modify terms. You will accept new version upon login.</li>
<li><strong>Data Privacy:</strong> We protect your data and clients' data. No sharing with third party except with consent or legal request.</li>
</ol>
`;

// 4. دالة عرض الشروط في بوب اب SweetAlert2
export function showTermsModal() {
    const lang = localStorage.getItem('language') || 'ar';
    const termsText = lang === 'ar' ? TERMS_AR : TERMS_EN;
    return Swal.fire({
        title: t('termsAndConditions'),
        html: `<div style="text-align:${lang === 'ar' ? 'right' : 'left'}; max-height:400px; overflow-y:auto; padding:10px;">${termsText}</div>`,
        confirmButtonText: t('iAgree'),
        showCancelButton: true,
        cancelButtonText: t('cancel'),
        width: '700px',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.setItem('terms_accepted_version', TERMS_VERSION);
            return true;
        }
        return false;
    });
}

// 5. دالة تشييك هل المستخدم وافق على آخر إصدار
export function hasAcceptedLatestTerms() {
    return localStorage.getItem('terms_accepted_version') === TERMS_VERSION;
}

// 6. دالة إجبار الموافقة قبل الدخول - نستخدمها في core.js بعدين
export async function checkTermsAcceptance() {
    if (!hasAcceptedLatestTerms()) {
        const accepted = await showTermsModal();
        if (!accepted) {
            throw new Error('Terms not accepted');
        }
    }
    return true;
}
