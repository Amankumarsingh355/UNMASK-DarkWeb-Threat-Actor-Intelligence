import json
import re

# Read markdown content
with open('UNMASK_NTRO_Project_Report.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# Prepare escaped JSON string for embedding
md_json = json.dumps(md_content)

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UNMASK - NTRO Cyber Threat Platform Project Report (Team RootX)</title>
  
  <!-- Marked.js for markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <!-- Mermaid for diagrams -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <!-- KaTeX for math rendering -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    @page {{
      size: A4;
      margin: 18mm 15mm 18mm 15mm;
      @bottom-right {{
        content: counter(page);
      }}
    }}

    * {{
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.65;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }}

    .top-action-bar {{
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
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
    }}

    .btn-download {{
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: white;
      border: 1px solid #38bdf8;
      padding: 9px 20px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 10px rgba(2, 132, 199, 0.4);
      transition: all 0.2s ease;
    }}

    .btn-download:hover {{
      background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
      transform: translateY(-1px);
    }}

    .container {{
      max-width: 900px;
      margin: 30px auto;
      background: white;
      padding: 60px 70px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.06);
      border: 1px solid #e2e8f0;
    }}

    h1, h2, h3, h4, h5, h6 {{
      color: #0f172a;
      font-weight: 700;
      margin-top: 1.8em;
      margin-bottom: 0.6em;
      line-height: 1.3;
    }}

    h1 {{
      font-size: 26px;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-top: 1.2em;
    }}

    h2 {{
      font-size: 20px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      color: #0369a1;
    }}

    h3 {{
      font-size: 16px;
      color: #1e293b;
    }}

    p, li {{
      font-size: 14px;
      color: #334155;
      text-align: justify;
    }}

    ul, ol {{
      padding-left: 24px;
      margin: 10px 0;
    }}

    li {{
      margin-bottom: 6px;
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 13px;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }}

    th, td {{
      padding: 10px 14px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }}

    th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
    }}

    tr:nth-child(even) {{
      background: #f8fafc;
    }}

    code {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 12.5px;
      background: #f1f5f9;
      color: #0369a1;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }}

    pre {{
      background: #0f172a;
      color: #e2e8f0;
      padding: 18px;
      border-radius: 8px;
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      line-height: 1.5;
      border: 1px solid #334155;
      margin: 16px 0;
    }}

    pre code {{
      background: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }}

    blockquote {{
      border-left: 4px solid #0284c7;
      background: #f0f9ff;
      margin: 16px 0;
      padding: 12px 20px;
      border-radius: 0 8px 8px 0;
      color: #0369a1;
      font-size: 13.5px;
    }}

    .mermaid {{
      margin: 24px 0;
      text-align: center;
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }}

    .page-break {{
      page-break-after: always;
      break-after: page;
      height: 1px;
      margin: 30px 0;
      border-bottom: 1px dashed #cbd5e1;
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
      <span>🛡️ UNMASK</span> // NTRO 2026 Project Report (Team RootX - 26151)
    </div>
    <div>
      <button class="btn-download" onclick="window.print()">
        📥 Download / Print PDF (Ctrl + P)
      </button>
    </div>
  </div>

  <div class="container" id="report-container">
    <div id="content">Loading report...</div>
  </div>

  <script>
    const markdownText = {md_json};

    marked.setOptions({{
      gfm: true,
      breaks: false
    }});

    // Replace \newpage with clean page break divs
    let processed = markdownText.replace(/\\newpage/g, '<div class="page-break"></div>');

    document.getElementById('content').innerHTML = marked.parse(processed);

    mermaid.initialize({{ startOnLoad: false, theme: 'default' }});
    mermaid.run({{ nodes: document.querySelectorAll('.mermaid, pre code.language-mermaid') }});
  </script>
</body>
</html>
"""

with open('UNMASK_NTRO_Project_Report.html', 'w', encoding='utf-8') as f:
    f.write(html_template)

print("Generated UNMASK_NTRO_Project_Report.html successfully!")
