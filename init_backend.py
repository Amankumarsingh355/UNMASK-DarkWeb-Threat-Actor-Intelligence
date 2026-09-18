import os
import json

# Ensure directories
os.makedirs("backend/routes", exist_ok=True)
os.makedirs("backend/data", exist_ok=True)

# 1. backend/__init__.py
with open("backend/__init__.py", "w", encoding="utf-8") as f:
    f.write('"""UNMASK Backend Package"""\n__version__ = "1.0.0"\n')

with open("backend/routes/__init__.py", "w", encoding="utf-8") as f:
    f.write('"""UNMASK API Routes"""\n')

with open("backend/data/__init__.py", "w", encoding="utf-8") as f:
    f.write('"""UNMASK Data Assets"""\n')

print("Init files created.")
