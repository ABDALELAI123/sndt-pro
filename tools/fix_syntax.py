import shutil
import datetime
import os
import re

def auto_fix_html_js(filepath):
    if not os.path.exists(filepath):
        print(f"خطأ: الملف {filepath} غير موجود")
        return
    
    # 1. نسخة احتياطية تلقائي قبل أي تعديل
    timestamp = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_path = f"{filepath}.backup_{timestamp}"
    shutil.copy(filepath, backup_path)
    print(f"[OK] تم إنشاء نسخة احتياطية: {backup_path}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    fixed = False
    
    # 2. إصلاح 1: نحذف القوس الزائد قبل </script> مباشرة
    for i in range(len(lines)-1, -1, -1):
        if '</script>' in lines[i]:
            # نشيك السطرين اللي قبل
            if i >= 2:
                # الحالة: } متبوع بـ }; ثم </script>
                if lines[i-1].strip() == '}' and lines[i-2].strip() == '};':
                    print(f"[FIX] حذف قوس زائد '}}' في سطر {i}")
                    lines.pop(i-1)
                    fixed = True
                    break
                # الحالة: }; متبوع بـ } ثم </script>
                if lines[i-1].strip() == '};' and lines[i-2].strip() == '}':
                    print(f"[FIX] حذف قوس زائد '}}' في سطر {i-1}")
                    lines.pop(i-2)
                    fixed = True
                    break
    
    if fixed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("[OK] تم الإصلاح. شغل check_syntax.py عشان تتأكد.")
    else:
        print("[INFO] ما لقيت أخطاء معروفة أقدر أصلحها تلقائي. شغل check_syntax.py يدوي.")
    
    return

if __name__ == "__main__":
    target_file = 'admin-panel.html'
    auto_fix_html_js(target_file)
