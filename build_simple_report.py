import markdown

with open('UNMASK_Simplified_Project_Report.md', 'r', encoding='utf-8') as f:
    md_text = f.read()

html_body = markdown.markdown(md_text, extensions=['tables', 'nl2br', 'sane_lists'])

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UNMASK - NTRO Cyber Threat Platform Simplified Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap');

    @page {{
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }}

    body {{
      font-family: 'Inter', -apple-system, sans-serif;
      line-height: 1.6;
      color: #111827;
      background: #f3f4f6;
      margin: 0;
      padding: 0;
    }}

    .top-bar {{
      position: sticky;
      top: 0;
      background: #111827;
      color: white;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }}

    .btn-print {{
      background: #0284c7;
      color: white;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
    }}

    .btn-print:hover {{
      background: #0369a1;
    }}

    .container {{
      max-width: 860px;
      margin: 24px auto;
      background: white;
      padding: 40px 50px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      border: 1px solid #e5e7eb;
    }}

    h1 {{
      font-size: 22px;
      color: #0369a1;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 1.2em;
    }}

    h2 {{
      font-size: 16px;
      color: #1f2937;
      margin-top: 1.4em;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
    }}

    p, li {{
      font-size: 13.5px;
      color: #374151;
      text-align: justify;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
    }}

    th, td {{
      padding: 8px 12px;
      border: 1px solid #d1d5db;
      text-align: left;
    }}

    th {{
      background: #f3f4f6;
      font-weight: 700;
    }}

    pre {{
      background: #f8fafc;
      color: #0f172a;
      padding: 12px 16px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      overflow-x: auto;
    }}

    @media print {{
      body {{ background: white; }}
      .top-bar {{ display: none !important; }}
      .container {{
        max-width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        box-shadow: none;
      }}
      h1, h2, table, pre {{ page-break-inside: avoid; }}
    }}
  </style>
</head>
<body>
  <div class="top-bar">
    <div><strong>🛡️ UNMASK</strong> // NTRO Cyber Threat Platform Simplified Project Report</div>
    <button class="btn-print" onclick="window.print()">📥 Print / Save PDF (Ctrl + P)</button>
  </div>
  <div class="container">
    {html_body}
  </div>
</body>
</html>
"""

with open('UNMASK_Simplified_Project_Report.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

with open('public/simple-report.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("Generated clean simplified report in UNMASK_Simplified_Project_Report.html and public/simple-report.html")
