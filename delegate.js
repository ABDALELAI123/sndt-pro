import { auth, db, storage } from './firebase.js';
import { getCurrentUserData, logout } from './auth.js';
import { formatMoney, formatDate, showSuccess, showError, requireAuth, getTodayDate } from './core.js';
import { generateBondNumber, toArabicNumbers } from './utils.js';
import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

requireAuth();
const userData = await getCurrentUserData();
if (!userData || userData.role !== 'delegate') window.location.href = 'index.html';

const managerId = userData.managerId || userData.projectCode;
let managerData = {};
try {
    const managerSnap = await getDoc(doc(db, 'managers', managerId));
    if (managerSnap.exists()) managerData = managerSnap.data();
} catch (e) { console.warn(e); }
const features = managerData.features || { whatsapp: true, qr: true, electronic: true, print: true };

document.getElementById('delegateInfo').textContent = `${userData.name} | ${managerData.name || managerId}`;
document.getElementById('logoutBtn').onclick = logout;
document.getElementById('bondDate').value = getTodayDate();

if (!features.electronic) {
    const pay = document.getElementById('paymentType');
    [...pay.options].forEach(opt => { if (['شبكة','تحويل'].includes(opt.value)) opt.remove(); });
}

let currentLocation = null;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            currentLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            document.getElementById('locationStatus').textContent = `تم: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
        },
        () => document.getElementById('locationStatus').textContent = 'فشل تحديد الموقع'
    );
}

document.getElementById('amount').oninput = (e) => {
    const num = parseFloat(e.target.value);
    document.getElementById('amountInWords').textContent = num ? `فقط ${toArabicNumbers(num)} ريال سعودي` : '';
};

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('border-purple-600', 'text-purple-600'));
        btn.classList.add('border-purple-600', 'text-purple-600');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.getElementById(btn.dataset.tab + 'Tab').classList.remove('hidden');
        if (btn.dataset.tab === 'bonds') loadBonds();
    };
});

document.getElementById('bondForm').onsubmit = async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; const oldText = btn.textContent; btn.textContent = 'جاري الحفظ...';
    try {
        const todayBonds = await getDocs(query(collection(db, 'bonds'), where('createdBy', '==', userData.uid), where('bondDate', '==', getTodayDate())));
        if (managerData.dailyBondLimit && todayBonds.size >= managerData.dailyBondLimit) throw new Error('تجاوزت الحد اليومي');
        let lastNumber = 0;
        try {
            const lastSnap = await getDocs(query(collection(db, 'bonds'), where('managerId', '==', managerId), orderBy('bondNumberRaw', 'desc'), limit(1)));
            if (!lastSnap.empty) lastNumber = lastSnap.docs[0].data().bondNumberRaw || 0;
        } catch(e){}
        const bondNumberRaw = lastNumber + 1;
        const bondNumber = generateBondNumber(bondNumberRaw, managerData);
        let attachmentUrl = '';
        const file = document.getElementById('attachment').files[0];
        if (file) {
            const storageRef = ref(storage, `bonds/${managerId}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            attachmentUrl = await getDownloadURL(storageRef);
        }
        const bondData = {
            bondNumber, bondNumberRaw,
            amount: parseFloat(document.getElementById('amount').value),
            bondType: document.getElementById('bondType').value,
            paymentType: document.getElementById('paymentType').value,
            fundName: document.getElementById('fundName').value,
            clientName: document.getElementById('clientName').value,
            clientPhone: document.getElementById('clientPhone').value,
            accountantName: document.getElementById('accountantName').value,
            notes: document.getElementById('notes').value,
            bondDate: document.getElementById('bondDate').value,
            attachmentUrl, location: currentLocation,
            managerId, projectCode: managerId,
            createdBy: userData.uid, createdByName: userData.name,
            createdAt: serverTimestamp(),
            status: 'غير مورد',
            accountingEffect: document.getElementById('bondType').value === 'قبض' ? 'إيجابي' : 'سلبي'
        };
        await addDoc(collection(db, 'bonds'), bondData);
        showSuccess('تم حفظ السند: ' + bondNumber);
        e.target.reset(); document.getElementById('bondDate').value = getTodayDate(); loadStats();
    } catch (err) {
        console.error(err); showError('فشل الحفظ: ' + err.message);
    } finally { btn.disabled = false; btn.textContent = oldText; }
};

document.getElementById('resetBtn').onclick = () => document.getElementById('bondForm').reset();

async function loadStats() {
    const q = query(collection(db, 'bonds'), where('createdBy', '==', userData.uid));
    const snap = await getDocs(q); let totalAmount=0, todayAmount=0, todayCount=0; const today=getTodayDate();
    snap.forEach(d=>{ const b=d.data(); totalAmount+=b.amount||0; if(b.bondDate===today){todayAmount+=b.amount||0; todayCount++;}});
    document.getElementById('totalCount').textContent=snap.size;
    document.getElementById('totalAmount').textContent=formatMoney(totalAmount);
    document.getElementById('todayCount').textContent=todayCount;
    document.getElementById('todayAmount').textContent=formatMoney(todayAmount);
}

async function loadBonds() {
    let q = query(collection(db, 'bonds'), where('createdBy','==',userData.uid), orderBy('createdAt','desc'));
    const limitVal=document.getElementById('filterLimit').value; if(limitVal!=='all') q=query(q,limit(parseInt(limitVal)));
    const snap=await getDocs(q); let bonds=snap.docs.map(d=>({id:d.id,...d.data()}));
    const search=document.getElementById('filterSearch').value.toLowerCase();
    const dateFrom=document.getElementById('filterDateFrom').value;
    const dateTo=document.getElementById('filterDateTo').value;
    if(search) bonds=bonds.filter(b=>(b.bondNumber||'').toLowerCase().includes(search)||(b.clientName||'').toLowerCase().includes(search)||(b.clientPhone||'').includes(search));
    if(dateFrom) bonds=bonds.filter(b=>b.bondDate>=dateFrom); if(dateTo) bonds=bonds.filter(b=>b.bondDate<=dateTo);
    const container=document.getElementById('bondsTableContainer');
    if(bonds.length===0){container.innerHTML='<p class="text-center text-gray-500 p-8">لا توجد سندات</p>';return;}
    container.innerHTML=`<table class="w-full"><thead class="bg-gray-50"><tr><th class="p-3 text-right">رقم السند</th><th class="p-3 text-right">المبلغ</th><th class="p-3 text-right">العميل</th><th class="p-3 text-right">التاريخ</th><th class="p-3 text-right">الحالة</th><th class="p-3 text-right">إجراءات</th></tr></thead><tbody>${bonds.map(b=>`<tr class="border-b hover:bg-gray-50"><td class="p-3 font-bold">${b.bondNumber}</td><td class="p-3">${formatMoney(b.amount)}</td><td class="p-3">${b.clientName||'-'}</td><td class="p-3">${formatDate(b.createdAt)}</td><td class="p-3"><span class="px-2 py-1 rounded text-xs ${b.status==='مورد'?'bg-green-100 text-green-800':'bg-yellow-100 text-yellow-800'}">${b.status}</span></td><td class="p-3"><button onclick="viewBond('${b.id}')" class="text-blue-600 hover:underline text-sm">عرض</button></td></tr>`).join('')}</tbody></table>`;
    window.allBonds=bonds;
}

window.viewBond=async(id)=>{ const bondDoc=await getDoc(doc(db,'bonds',id)); const b=bondDoc.data(); const qrUrl=`${window.location.origin}/view-receipt.html?id=${id}`;
document.getElementById('bondPrintArea').innerHTML=`<div class="bond-preview p-6"><div class="text-center mb-6"><h2 class="text-2xl font-bold">${managerData.name||''}</h2><p class="text-gray-600">سند ${b.bondType}</p></div><div class="grid grid-cols-2 gap-4 mb-6"><div><strong>رقم السند:</strong> ${b.bondNumber}</div><div><strong>التاريخ:</strong> ${b.bondDate}</div><div><strong>المبلغ:</strong> ${formatMoney(b.amount)}</div><div><strong>نوع الدفع:</strong> ${b.paymentType}</div><div><strong>العميل:</strong> ${b.clientName||'-'}</div><div><strong>الصندوق:</strong> ${b.fundName||'-'}</div></div><div class="mb-6"><strong>المبلغ كتابة:</strong> ${toArabicNumbers(b.amount)} ريال سعودي فقط</div><div class="mb-6"><strong>الحالة:</strong> <span class="font-bold ${b.status==='مورد'?'text-green-600':'text-yellow-600'}">${b.status}</span></div>${b.notes?`<div class="mb-6"><strong>ملاحظات:</strong> ${b.notes}</div>`:''}<div class="flex justify-between items-center mt-8"><div><strong>المحاسب:</strong> ${b.accountantName||'-'}</div><div id="qrcode"></div></div></div>`;
setTimeout(()=>{new QRCode(document.getElementById('qrcode'),{text:qrUrl,width:90,height:90});},100);
document.getElementById('bondModal').classList.remove('hidden');
document.getElementById('printBond').style.display=features.print?'block':'none';
document.getElementById('shareWhatsApp').style.display=features.whatsapp?'block':'none';
document.getElementById('shareQR').style.display=features.qr?'block':'none';
document.getElementById('printBond').onclick=()=>html2pdf().from(document.getElementById('bondPrintArea')).save(`سند-${b.bondNumber}.pdf`);
document.getElementById('shareWhatsApp').onclick=()=>window.open(`https://wa.me/?text=${encodeURIComponent(`*سند ${b.bondType}*\nرقم: ${b.bondNumber}\nالمبلغ: ${formatMoney(b.amount)}\n${qrUrl}`)}`);
document.getElementById('shareQR').onclick=()=>{navigator.clipboard.writeText(qrUrl);showSuccess('تم نسخ الرابط');}; };

document.getElementById('exportExcel').onclick=()=>{ const ws=XLSX.utils.json_to_sheet((window.allBonds||[]).map(b=>({'رقم السند':b.bondNumber,'المبلغ':b.amount,'النوع':b.bondType,'العميل':b.clientName,'التاريخ':b.bondDate,'الحالة':b.status}))); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'السندات'); XLSX.writeFile(wb,'السندات.xlsx'); };
document.getElementById('exportPDF').onclick=()=>html2pdf().from(document.getElementById('bondsTableContainer')).save('السندات.pdf');
['filterLimit','filterDateFrom','filterDateTo'].forEach(id=>document.getElementById(id).onchange=loadBonds);
document.getElementById('filterSearch').oninput=loadBonds;
loadStats();
