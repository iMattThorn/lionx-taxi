#!/usr/bin/env python3
"""
Lion X — multi-language page generator
Reads index.html (Polish base) + translations.json
Generates: index.html (PL), en/index.html, sv/index.html, no/index.html, da/index.html
"""
import json, os, re, sys

# Load translations
with open('translations.json', 'r', encoding='utf-8') as f:
    translations = json.load(f)

# Load base HTML
with open('index.html', 'r', encoding='utf-8') as f:
    base_html = f.read()

# Language config
LANGS = {
    'pl': {'dir': '.', 'flag': '🇵🇱 PL', 'img_prefix': ''},
    'en': {'dir': 'en', 'flag': '🇬🇧 EN', 'img_prefix': '../'},
    'sv': {'dir': 'sv', 'flag': '🇸🇪 SV', 'img_prefix': '../'},
    'no': {'dir': 'no', 'flag': '🇳🇴 NO', 'img_prefix': '../'},
    'da': {'dir': 'da', 'flag': '🇩🇰 DA', 'img_prefix': '../'},
}

def build_lang_switcher(current_lang):
    """Build language dropdown HTML"""
    items = []
    for code, cfg in LANGS.items():
        if code == 'pl':
            href = '/' if current_lang != 'pl' else '#'
        else:
            href = f'/{code}/' if current_lang != code else '#'
        active = ' style="color:var(--gold);font-weight:700"' if code == current_lang else ''
        items.append(f'<a href="{href}"{active}>{cfg["flag"]}</a>')
    return ' '.join(items)

def build_hreflang_tags():
    """Build hreflang link tags for SEO"""
    tags = []
    tags.append('<link rel="alternate" hreflang="pl" href="https://lionx-taxi.pages.dev/">')
    tags.append('<link rel="alternate" hreflang="en" href="https://lionx-taxi.pages.dev/en/">')
    tags.append('<link rel="alternate" hreflang="sv" href="https://lionx-taxi.pages.dev/sv/">')
    tags.append('<link rel="alternate" hreflang="no" href="https://lionx-taxi.pages.dev/no/">')
    tags.append('<link rel="alternate" hreflang="da" href="https://lionx-taxi.pages.dev/da/">')
    tags.append('<link rel="alternate" hreflang="x-default" href="https://lionx-taxi.pages.dev/">')
    return '\n'.join(tags)

def generate_page(lang_code):
    t = translations[lang_code]
    cfg = LANGS[lang_code]
    html = base_html
    
    # Fix image paths for subdirectories
    if cfg['img_prefix']:
        html = html.replace('img/', f'{cfg["img_prefix"]}img/')
    
    # Replace lang attribute
    html = html.replace('lang="pl"', f'lang="{lang_code}"')
    
    # Add hreflang tags after <head>
    hreflang = build_hreflang_tags()
    html = html.replace('</head>', f'{hreflang}\n</head>')
    
    # Build language switcher
    lang_switcher = build_lang_switcher(lang_code)
    
    # Add language switcher before nav-cta in nav-links
    # Find the nav_cta link and add lang switcher before it
    old_nav_cta = f'<a href="#kontakt" class="nav-cta">{translations["pl"]["nav_cta"]}</a>'
    new_nav_cta = f'<div style="display:flex;gap:12px;align-items:center;font-size:.78rem">{lang_switcher}</div><a href="#kontakt" class="nav-cta">{t["nav_cta"]}</a>'
    html = html.replace(old_nav_cta, new_nav_cta)
    
    # Replace all Polish texts with translated versions
    pl = translations['pl']
    
    # Title and meta
    html = html.replace(f'<title>{pl["page_title"]}</title>', f'<title>{t["page_title"]}</title>')
    html = html.replace(f'content="{pl["meta_desc"]}"', f'content="{t["meta_desc"]}"')
    
    # Nav links
    html = html.replace(f'>{pl["nav_about"]}</a>', f'>{t["nav_about"]}</a>')
    html = html.replace(f'>{pl["nav_services"]}</a>', f'>{t["nav_services"]}</a>')
    html = html.replace(f'>{pl["nav_trips"]}</a>', f'>{t["nav_trips"]}</a>')
    html = html.replace(f'>{pl["nav_pricing"]}</a>', f'>{t["nav_pricing"]}</a>')
    html = html.replace(f'>{pl["nav_contact"]}</a>', f'>{t["nav_contact"]}</a>')
    
    # Hero
    html = html.replace(f'>{pl["hero_badge"]}</div>', f'>{t["hero_badge"]}</div>')
    html = html.replace(f'Jedź <span class="hl">komfortowo</span><br>bezpiecznie<br>wszędzie',
                        f'{t["hero_h1_1"]} <span class="hl">{t["hero_h1_2"]}</span><br>{t["hero_h1_3"]}<br>{t["hero_h1_4"]}')
    html = html.replace(pl["hero_sub"], t["hero_sub"])
    html = html.replace(f'>{pl["hero_cta1"]}</a>', f'>{t["hero_cta1"]}</a>')
    html = html.replace(f'>{pl["hero_cta2"]}</a>', f'>{t["hero_cta2"]}</a>')
    html = html.replace(f'<span>{pl["hero_img_alt"]}</span>', f'<span>{t["hero_img_alt"]}</span>')
    
    # Trust bar
    html = html.replace(f'<h4>{pl["trust_1_title"]}</h4>', f'<h4>{t["trust_1_title"]}</h4>')
    html = html.replace(f'<p>{pl["trust_1_sub"]}</p>', f'<p>{t["trust_1_sub"]}</p>')
    html = html.replace(f'<h4>{pl["trust_2_title"]}</h4>', f'<h4>{t["trust_2_title"]}</h4>')
    html = html.replace(f'<p>{pl["trust_2_sub"]}</p>', f'<p>{t["trust_2_sub"]}</p>')
    html = html.replace(f'<h4>{pl["trust_3_title"]}</h4>', f'<h4>{t["trust_3_title"]}</h4>')
    html = html.replace(f'<p>{pl["trust_3_sub"]}</p>', f'<p>{t["trust_3_sub"]}</p>')
    
    # About
    html = html.replace(f'>{pl["about_label"]}</div>', f'>{t["about_label"]}</div>', 1)
    html = html.replace(f'>{pl["about_title"]}</h2>', f'>{t["about_title"]}</h2>')
    html = html.replace(pl["about_desc"], t["about_desc"])
    html = html.replace(pl["about_placeholder"], t["about_placeholder"])
    html = html.replace(f'>{pl["stat_1_label"]}</div>', f'>{t["stat_1_label"]}</div>')
    html = html.replace(f'>{pl["stat_2_label"]}</div>', f'>{t["stat_2_label"]}</div>')
    html = html.replace(f'<span>{pl["about_img_alt"]}</span>', f'<span>{t["about_img_alt"]}</span>')
    
    # Services
    html = html.replace(f'>{pl["srv_label"]}</div>', f'>{t["srv_label"]}</div>', 1)
    html = html.replace(f'>{pl["srv_title"]}</h2>', f'>{t["srv_title"]}</h2>')
    html = html.replace(pl["srv_desc"], t["srv_desc"])
    for i in range(1, 7):
        html = html.replace(f'<h3>{pl[f"srv_{i}_title"]}</h3>', f'<h3>{t[f"srv_{i}_title"]}</h3>')
        html = html.replace(f'<p>{pl[f"srv_{i}_desc"]}</p>', f'<p>{t[f"srv_{i}_desc"]}</p>')
    
    # Trips
    html = html.replace(f'>{pl["trips_label"]}</div>', f'>{t["trips_label"]}</div>', 1)
    html = html.replace(f'>{pl["trips_title"]}</h2>', f'>{t["trips_title"]}</h2>')
    html = html.replace(pl["trips_desc"], t["trips_desc"])
    html = html.replace(f'>{pl["trip_cta"]}</div>', f'>{t["trip_cta"]}</div>')
    
    # Calculator
    html = html.replace(f'>{pl["calc_label"]}</div>', f'>{t["calc_label"]}</div>', 1)
    html = html.replace(f'>{pl["calc_title"]}</h2>', f'>{t["calc_title"]}</h2>')
    html = html.replace(f'<h3>{pl["calc_form_title"]}</h3>', f'<h3>{t["calc_form_title"]}</h3>')
    html = html.replace(f'<label>{pl["calc_from"]}</label>', f'<label>{t["calc_from"]}</label>')
    html = html.replace(f'<label>{pl["calc_to"]}</label>', f'<label>{t["calc_to"]}</label>')
    html = html.replace(f'<label>{pl["calc_date"]}</label>', f'<label>{t["calc_date"]}</label>')
    html = html.replace(f'<label>{pl["calc_time"]}</label>', f'<label>{t["calc_time"]}</label>')
    html = html.replace(f'<label>{pl["calc_passengers"]}</label>', f'<label>{t["calc_passengers"]}</label>')
    html = html.replace(f'<label>{pl["calc_extras"]}</label>', f'<label>{t["calc_extras"]}</label>')
    html = html.replace(f'>{pl["calc_btn"]}</button>', f'>{t["calc_btn"]}</button>')
    html = html.replace(f'<h3>{pl["calc_result_title"]}</h3>', f'<h3>{t["calc_result_title"]}</h3>')
    html = html.replace(f'>{pl["calc_result_empty"]}</div>', f'>{t["calc_result_empty"]}</div>')
    html = html.replace(f'>{pl["calc_book"]}</a>', f'>{t["calc_book"]}</a>')
    
    # Contact
    html = html.replace(f'>{pl["contact_label"]}</div>', f'>{t["contact_label"]}</div>', 1)
    html = html.replace(f'>{pl["contact_title"]}</h2>', f'>{t["contact_title"]}</h2>')
    html = html.replace(pl["contact_desc"], t["contact_desc"])
    html = html.replace(f'<h4>{pl["contact_phone"]}</h4>', f'<h4>{t["contact_phone"]}</h4>')
    html = html.replace(f'<h4>{pl["contact_email"]}</h4>', f'<h4>{t["contact_email"]}</h4>')
    html = html.replace(f'<h4>{pl["contact_address"]}</h4>', f'<h4>{t["contact_address"]}</h4>')
    html = html.replace(pl["contact_tbd"], t["contact_tbd"])
    
    # Form
    html = html.replace(f'<h3>{pl["form_title"]}</h3>', f'<h3>{t["form_title"]}</h3>')
    html = html.replace(f'<label>{pl["form_name"]}</label>', f'<label>{t["form_name"]}</label>')
    html = html.replace(f'<label>{pl["form_contact"]}</label>', f'<label>{t["form_contact"]}</label>')
    html = html.replace(f'<label>{pl["form_service"]}</label>', f'<label>{t["form_service"]}</label>')
    html = html.replace(f'<label>{pl["form_message"]}</label>', f'<label>{t["form_message"]}</label>')
    html = html.replace(f'>{pl["form_btn"]}</button>', f'>{t["form_btn"]}</button>')
    html = html.replace(pl["form_success_1"], t["form_success_1"])
    html = html.replace(pl["form_success_2"], t["form_success_2"])
    
    # Footer
    html = html.replace(pl["footer_copy"], t["footer_copy"])
    # Footer links
    for key in ['nav_about', 'nav_services', 'nav_trips', 'nav_pricing', 'nav_contact']:
        pass  # Already replaced above
    
    return html

# Generate all pages
for lang_code, cfg in LANGS.items():
    output_dir = cfg['dir']
    if output_dir != '.':
        os.makedirs(output_dir, exist_ok=True)
    
    page = generate_page(lang_code)
    output_path = os.path.join(output_dir, 'index.html')
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(page)
    
    print(f"  {cfg['flag']}  {output_path} ({len(page):,} bytes)")

print("\nDone! All pages generated.")
