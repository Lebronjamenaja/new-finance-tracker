import JSZip from 'jszip';

export async function downloadAllProjectCode() {
  const zip = new JSZip();

  // Create README.md
  const readmeContent = `# My-new-Finance-tracker
ระบบจัดการรายรับรายจ่าย พร้อมการสรุปผลรายเดือนและสร้างภาพวิเคราะห์ข้อมูล เชื่อมต่อกับ Firebase Cloud Firestore & Gmail Authentication

## คุณสมบัติเด่น (Features)
1. **บันทึกรายรับ - รายจ่าย**: รองรับหมวดหมู่ที่หลากหลาย วิธีชำระเงิน และการแนบบันทึก
2. **สรุปผลรายเดือน (Monthly Summary)**: แสดงยอดรวมรายรับ รายจ่าย ยอดคงเหลือสุทธิ และติดตามงบประมาณ (Budget Tracker)
3. **สร้างภาพวิเคราะห์ข้อมูล (Visual Analytics & Image Export)**: กราฟแท่ง, โดนัทชาร์ตวิเคราะห์สัดส่วนรายจ่าย และปุ่มสร้างการ์ดภาพสรุปความละเอียดสูงสำหรับบันทึกหรือแชร์
4. **เข้าสู่ระบบด้วย Google (Gmail Login)**: ปลอดภัย สะดวก เข้าถึงข้อมูลของคุณได้จากทุกอุปกรณ์
5. **เก็บบันทึกบน Firebase Firestore Cloud**: ปลอดภัย พร้อม Security Rules คัดกรองสิทธิ์เฉพาะเจ้าของข้อมูล
6. **ดาวน์โหลด Source Code ทั้งหมด**: มีปุ่ม Download Zip ให้นำโค้ดไปรันต่อได้ทันที

## วิธีติดตั้งและเริ่มใช้งานในเครื่อง (Local Setup)
\`\`\`bash
# 1. ติดตั้ง dependencies
npm install

# 2. รันในโหมดพัฒนา
npm run dev

# 3. สร้าง production build
npm run build
\`\`\`

## การเชื่อมต่อ Firebase
สามารถแก้ไขการตั้งค่าในไฟล์ \`firebase-applet-config.json\` หรือ \`.env\` ตามโปรเจกต์ Firebase ของคุณเองได้
`;

  zip.file('README.md', readmeContent);

  // We will dynamically fetch the key local files or load them
  const filesToFetch = [
    '/package.json',
    '/tsconfig.json',
    '/vite.config.ts',
    '/index.html',
    '/metadata.json',
    '/firestore.rules',
    '/firebase-blueprint.json',
    '/.env.example',
    '/src/main.tsx',
    '/src/index.css',
    '/src/App.tsx',
    '/src/types.ts',
    '/src/lib/firebase.ts',
    '/src/constants/categories.ts',
    '/src/services/financeService.ts',
    '/src/components/Navbar.tsx',
    '/src/components/MonthlySummary.tsx',
    '/src/components/VisualAnalytics.tsx',
    '/src/components/TransactionList.tsx',
    '/src/components/TransactionModal.tsx',
    '/src/components/BudgetModal.tsx',
    '/src/components/LandingHero.tsx',
    '/src/components/CodeDownloadModal.tsx',
    '/src/utils/codeDownloader.ts',
  ];

  for (const filePath of filesToFetch) {
    try {
      const res = await fetch(filePath);
      if (res.ok) {
        const text = await res.text();
        const zipPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
        zip.file(zipPath, text);
      }
    } catch {
      console.warn(`Could not fetch ${filePath} for zip`);
    }
  }

  // Generate ZIP file
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `My-new-Finance-tracker-source-${new Date().toISOString().slice(0, 10)}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
