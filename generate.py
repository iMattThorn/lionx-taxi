#!/usr/bin/env python3
"""Lion X — template-based multi-language generator"""
import json, os, re

with open('translations.json', 'r', encoding='utf-8') as f:
    TR = json.load(f)

with open('template.html', 'r', encoding='utf-8') as f:
    TEMPLATE = f.read()

LANGS = {
    'pl': {'dir': '.', 'flag': '🇵🇱 PL', 'prefix': ''},
    'en': {'dir': 'en', 'flag': '🇬🇧 EN', 'prefix': '../'},
    'sv': {'dir': 'sv', 'flag': '🇸🇪 SV', 'prefix': '../'},
    'no': {'dir': 'no', 'flag': '🇳🇴 NO', 'prefix': '../'},
    'da': {'dir': 'da', 'flag': '🇩🇰 DA', 'prefix': '../'},
}

def hreflang_tags():
    return '\n'.join([
        '<link rel="alternate" hreflang="pl" href="https://lionx-taxi.pages.dev/">',
        '<link rel="alternate" hreflang="en" href="https://lionx-taxi.pages.dev/en/">',
        '<link rel="alternate" hreflang="sv" href="https://lionx-taxi.pages.dev/sv/">',
        '<link rel="alternate" hreflang="no" href="https://lionx-taxi.pages.dev/no/">',
        '<link rel="alternate" hreflang="da" href="https://lionx-taxi.pages.dev/da/">',
        '<link rel="alternate" hreflang="x-default" href="https://lionx-taxi.pages.dev/">',
    ])

def lang_nav(current):
    parts = []
    for code, cfg in LANGS.items():
        href = '/' if code == 'pl' else f'/{code}/'
        bold = ' style="color:var(--gold);font-weight:700"' if code == current else ''
        parts.append(f'<a href="{href}"{bold}>{cfg["flag"]}</a>')
    return f'<div style="display:flex;gap:12px;align-items:center;font-size:.78rem">{" ".join(parts)}</div>'

def generate(lang):
    t = TR[lang]
    cfg = LANGS[lang]
    html = TEMPLATE
    
    # Fill all {{placeholders}}
    for key, val in t.items():
        html = html.replace('{{' + key + '}}', val)
    
    # Special placeholders
    html = html.replace('{{hreflang}}', hreflang_tags())
    html = html.replace('{{lang_switcher}}', lang_nav(lang))
    
    # Fix image paths for subdirectories
    if cfg['prefix']:
        html = html.replace('img/', cfg['prefix'] + 'img/')
    
    # Check for remaining placeholders
    remaining = set(re.findall(r'\{\{(\w+)\}\}', html))
    if remaining:
        print(f"  WARNING: {lang} has unfilled placeholders: {remaining}")
    
    return html

for lang, cfg in LANGS.items():
    d = cfg['dir']
    if d != '.':
        os.makedirs(d, exist_ok=True)
    page = generate(lang)
    path = os.path.join(d, 'index.html')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(page)
    print(f"  {cfg['flag']}  {path} ({len(page):,} bytes)")

print("\nDone!")
