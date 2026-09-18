import markdown
import re

# Read markdown content
with open('UNMASK_NTRO_Project_Report.md', 'r', encoding='utf-8') as f:
    md_text = f.read()

# Replace \newpage with page-break markers before parsing
md_text = md_text.replace('\\newpage', '<div class="page-break"></div>')

# Convert markdown to static HTML using extensions
html_body = markdown.markdown(
    md_text,
    extensions=['tables', 'fenced_code', 'nl2br', 'sane_lists']
)

# Replace mermaid code blocks with styled pre blocks or visual indicators
html_body = re.sub(
    r'<pre><code class="language-mermaid">([\s\S]*?)</code></pre>',
    r'<div class="mermaid-diagram"><div class="diagram-title">📊 Architectural Process Flow Diagram</div><pre class="mermaid-code">\1</pre></div>',
    html_body
)

# Format alert callouts
html_body = html_body.replace(
    '<blockquote>',
    '<blockquote class="tactical-callout">'
)

full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UNMASK - NTRO Cyber Threat Platform Official Project Report (Team RootX)</title>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @page {{
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
    }}

    * {{
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.65;
      color: #1e293b;
      background-color: #0b1120;
      margin: 0;
      padding: 0;
    }}

    .top-action-bar {{
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #091122 0%, #0f172a 100%);
      color: white;
      padding: 14px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 25px rgba(0,0,0,0.5);
      border-bottom: 1px solid rgba(6, 182, 212, 0.3);
    }}

    .top-action-bar .brand {{
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.5px;
    }}

    .top-action-bar .brand span {{
      color: #38bdf8;
      font-weight: 800;
    }}

    .btn-download {{
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white;
      border: 1px solid #38bdf8;
      padding: 10px 22px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 15px rgba(2, 132, 199, 0.5);
      transition: all 0.2s ease;
    }}

    .btn-download:hover {{
      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(56, 189, 248, 0.6);
    }}

    .container {{
      max-width: 960px;
      margin: 30px auto;
      background: #ffffff;
      padding: 60px 75px;
      border-radius: 12px;
      box-shadow: 0 10px 50px rgba(0,0,0,0.4);
      border: 1px solid #cbd5e1;
    }}

    h1, h2, h3, h4, h5, h6 {{
      color: #0f172a;
      font-weight: 700;
      margin-top: 1.8em;
      margin-bottom: 0.6em;
      line-height: 1.3;
    }}

    h1 {{
      font-size: 24px;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-top: 1.4em;
      color: #0369a1;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }}

    h2 {{
      font-size: 18px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      color: #0284c7;
    }}

    h3 {{
      font-size: 15px;
      color: #1e293b;
    }}

    p, li {{
      font-size: 13.5px;
      color: #334155;
      text-align: justify;
      line-height: 1.7;
    }}

    ul, ol {{
      padding-left: 24px;
      margin: 12px 0;
    }}

    li {{
      margin-bottom: 6px;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 22px 0;
      font-size: 12.5px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }}

    th, td {{
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }}

    th {{
      background: #0f172a;
      color: #f8fafc;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11.5px;
      letter-spacing: 0.5px;
    }}

    tr:nth-child(even) {{
      background: #f8fafc;
    }}

    tr:hover {{
      background: #f1f5f9;
    }}

    code {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      background: #f1f5f9;
      color: #0284c7;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }}

    pre {{
      background: #091122;
      color: #38bdf8;
      padding: 18px 22px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.55;
      border: 1px solid #1e293b;
      margin: 18px 0;
      box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
    }}

    pre code {{
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }}

    blockquote.tactical-callout {{
      border-left: 4px solid #0284c7;
      background: #f0f9ff;
      margin: 18px 0;
      padding: 14px 22px;
      border-radius: 0 8px 8px 0;
      color: #0369a1;
      font-size: 13.5px;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.08);
    }}

    .mermaid-diagram {{
      margin: 24px 0;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      overflow: hidden;
    }}

    .diagram-title {{
      background: #1e293b;
      color: #38bdf8;
      padding: 8px 16px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #334155;
    }}

    .mermaid-code {{
      margin: 0;
      background: transparent;
      border: none;
      color: #e2e8f0;
    }}

    .page-break {{
      page-break-after: always;
      break-after: page;
      height: 1px;
      margin: 35px 0;
      border-bottom: 1px dashed #cbd5e1;
    }}

    hr {{
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 30px 0;
    }}

    @media print {{
      body {{
        background: white;
      }}
      .top-action-bar {{
        display: none !important;
      }}
      .container {{
        max-width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        box-shadow: none;
      }}
      .page-break {{
        border: none;
        margin: 0;
        page-break-after: always;
        break-after: page;
      }}
      h1, h2, h3, table, pre, blockquote {{
        page-break-inside: avoid;
      }}
      a {{
        text-decoration: none;
        color: inherit;
      }}
    }}
  </style>
</head>
<body>

  <div class="top-action-bar">
    <div class="brand">
      <span>🛡️ UNMASK</span> // NTRO 2026 Formal Project Report (Team RootX - 26151)
    </div>
    <div>
      <button class="btn-download" onclick="window.print()">
        📥 Download / Print PDF (Ctrl + P)
      </button>
    </div>
  </div>

  <div class="container" id="report-container">
    {html_body}
  </div>

</body>
</html>
"""

# Write to both output destinations
with open('UNMASK_NTRO_Project_Report.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

with open('public/report.html', 'w', encoding='utf-8') as f:
    f.write(full_html)

print("Pre-rendered static HTML generated in UNMASK_NTRO_Project_Report.html and public/report.html!")
