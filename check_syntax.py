import re
import sys
import os

def check_html_js(filepath):
    if not os.path.exists(filepath):
        return f"خطأ: الملف {filepath} غير موجود"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # نطلع كل بلوكات الجافاسكربت
    js_blocks = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    if not js_blocks:
        return "ما لقيت أي كود جافاسكربت"
    
    total_errors = 0
    for block_num, js_code in enumerate(js_blocks, 1):
        stack = []
        pairs = {'(': ')', '{': '}', '[': ']'}
        in_string = None
        line_offset = content[:content.find(js_code)].count('\n')
        
        for i, line in enumerate(js_code.split('\n')):
            real_line = line_offset + i + 1
            col = 0
            while col < len(line):
                char = line[col]
                
                # تجاهل التعليقات
                if not in_string and line[col:col+2] == '//':
                    break
                if not in_string and line[col:col+2] == '/*':
                    # نتخطى التعليق
                    end = line.find('*/', col+2)
                    if end!= -1:
                        col = end + 2
                        continue
                
                # التعامل مع النصوص
                if in_string:
                    if char == in_string and line[col-1:col]!= '\\':
                        in_string = None
                elif char in ['"', "'", '`']:
                    in_string = char
                elif char in pairs:
                    stack.append((char, real_line, col + 1, line.strip()))
                elif char in pairs.values():
                    if not stack:
                        print(f"[ERROR] قوس زائد '{char}' في سطر {real_line}")
                        print(f"السطر: {line.strip()}")
                        total_errors += 1
                        return
                    open_char, open_line, _, open_text = stack.pop()
                    if pairs[open_char]!= char:
                        print(f"[ERROR] القوس '{open_char}' في سطر {open_line} اتقفل غلط بـ '{char}' في سطر {real_line}")
                        print(f"الفتح: {open_text}")
                        print(f"القفل: {line.strip()}")
                        total_errors += 1
                        return
                col += 1
        
        if stack:
            char, line_num, col, text = stack[-1]
            print(f"[ERROR] القوس '{char}' مفتوح في سطر {line_num} عمود {col} وما تقفل")
            print(f"السطر: {text}")
            total_errors += 1
    
    if total_errors == 0:
        print("[OK] ممتاز: كل الأقواس مقفلة صح. مافي أخطاء.")
    return

if __name__ == "__main__":
    file_to_check = '../admin-panel.html'
    if len(sys.argv) > 1:
        file_to_check = sys.argv[1]
    check_html_js(file_to_check)
