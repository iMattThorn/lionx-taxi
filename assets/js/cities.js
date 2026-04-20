// =============================================================
//  cities.js — Baza miast i odległości dla Lion X Taxi
//  Zawiera:
//    1. DISTANCES — tabela rzeczywistych odległości drogowych (km)
//    2. COORDS     — współrzędne GPS miast (fallback Haversine)
//    3. getTaxiDistance(a, b) — główna funkcja obliczająca dystans
// =============================================================

// ── 1. TABELA RZECZYWISTYCH ODLEGŁOŚCI DROGOWYCH ─────────────
const DISTANCES = {

  // === HUB: GDAŃSK I POMORZE ===
  "Gdańsk": {
    "Sopot": 12, "Gdynia": 25, "Elbląg": 60, "Tczew": 35,
    "Starogard Gdański": 55, "Malbork": 65, "Kwidzyn": 95,
    "Słupsk": 130, "Lębork": 80, "Chojnice": 125, "Kościerzyna": 60,
    "Bytów": 95, "Kartuzy": 35, "Puck": 55, "Władysławowo": 65,
    "Hel": 100, "Wejherowo": 45, "Luzino": 55, "Gniew": 75,
    "Nowy Dwór Gdański": 40, "Sztum": 80, "Człuchów": 135,
    "Pruszcz Gdański": 12, "Reda": 35, "Rumia": 30, "Żukowo": 20,
    "Kolbudy": 15, "Sierakowice": 55, "Gniewino": 70, "Dębki": 75,
    "Karwia": 70, "Jastrzębia Góra": 65, "Stegna": 40, "Sztutowo": 45,
    "Krynica Morska": 80, "Kąty Rybackie": 55, "Lidzbark Warmiński": 140,
    "Bartoszyce": 170, "Kętrzyn": 190, "Pasłęk": 80, "Skarszewy": 45,
    "Pelplin": 55,    "Grudziądz": 110, "Toruń": 170, "Bydgoszcz": 175,
    "Olsztyn": 165, "Warszawa": 340, "Łódź": 390, "Poznań": 310,
    "Szczecin": 340, "Kraków": 590, "Wrocław": 490,
    "Lotnisko Rębiechowo (GDN)": 15,
    // Mazowsze — bezpośrednie trasy przez A1/S7 (bez sumowania przez Warszawę)
    "Sochaczew": 340, "Żyrardów": 350, "Łowicz": 360,
    "Kutno": 375, "Płock": 330, "Włocławek": 255,
    "Radom": 430, "Kielce": 500, "Lublin": 490,
    "Pruszków": 355, "Piaseczno": 365, "Legionowo": 330,
    "Mińsk Mazowiecki": 380, "Siedlce": 410, "Otwock": 370,
    "Ciechanów": 280, "Ostrołęka": 305, "Wyszków": 320,
    "Garwolin": 400, "Skierniewice": 370, "Piotrków Trybunalski": 420,
    "Tomaszów Mazowiecki": 430, "Bełchatów": 440, "Konin": 430,
    "Gniezno": 330, "Inowrocław": 220, "Piła": 270},

  // === HUB: LOTNISKA ===
  "Lotnisko Rębiechowo (GDN)": {
    "Gdańsk": 15, "Gdynia": 25, "Sopot": 20,
    "Elbląg": 75, "Słupsk": 125, "Lębork": 70, "Wejherowo": 35
  },
  "Lotnisko Chopina (WAW)": {
    "Warszawa": 12, "Łódź": 130, "Lublin": 175,
    "Radom": 100, "Białystok": 210, "Płock": 115
  },
  "Lotnisko Modlin (WMI)": {
    "Warszawa": 40, "Płock": 75, "Ciechanów": 65, "Olsztyn": 175
  },
  "Lotnisko Balice (KRK)": {
    "Kraków": 15, "Katowice": 70, "Zakopane": 115,
    "Tarnów": 95, "Oświęcim": 55
  },
  "Lotnisko Pyrzowice (KTW)": {
    "Katowice": 30, "Częstochowa": 50, "Gliwice": 45,
    "Kraków": 100, "Opole": 105
  },
  "Lotnisko Jasionka (RZE)": {
    "Rzeszów": 12, "Lublin": 155, "Stalowa Wola": 65, "Mielec": 55
  },

  // === HUB: WARSZAWA I MAZOWSZE ===
  "Warszawa": {
    "Kraków": 295, "Wrocław": 355, "Łódź": 135, "Poznań": 310,
    "Lublin": 170, "Białystok": 200, "Katowice": 290, "Gdańsk": 340,
    "Radom": 105, "Płock": 110, "Siedlce": 95, "Włocławek": 160,
    "Ostrołęka": 120, "Ciechanów": 100, "Pruszków": 20,
    "Legionowo": 25, "Otwock": 30, "Żyrardów": 55, "Kutno": 130,
    "Łowicz": 85, "Sochaczew": 55, "Mińsk Mazowiecki": 45,
    "Wyszków": 55, "Garwolin": 65, "Piaseczno": 20,
    "Toruń": 210, "Bydgoszcz": 245, "Olsztyn": 215,
    "Lotnisko Chopina (WAW)": 12, "Lotnisko Modlin (WMI)": 40
  },

  // === HUB: ŁÓDŹ I CENTRALNA POLSKA ===
  "Łódź": {
    "Warszawa": 135, "Wrocław": 230, "Poznań": 185, "Kraków": 265,
    "Katowice": 195, "Piotrków Trybunalski": 45, "Kutno": 75,
    "Skierniewice": 55, "Sieradz": 65, "Zduńska Wola": 55,
    "Tomaszów Mazowiecki": 60, "Bełchatów": 55, "Wieluń": 100,
    "Częstochowa": 115, "Kalisz": 100, "Konin": 130, "Płock": 115
  },

  // === HUB: TORUŃ I KUJAWY ===
  "Toruń": {
    "Bydgoszcz": 45, "Grudziądz": 60, "Włocławek": 55,
    "Inowrocław": 35, "Gdańsk": 170, "Warszawa": 210,
    "Poznań": 155, "Łódź": 175, "Brodnica": 65, "Rypin": 55,
    "Lipno": 40, "Chełmno": 30, "Świecie": 50
  },

  // === HUB: BYDGOSZCZ ===
  "Bydgoszcz": {
    "Toruń": 45, "Grudziądz": 75, "Inowrocław": 45,
    "Gdańsk": 175, "Warszawa": 245, "Poznań": 125,
    "Piła": 70, "Nakło nad Notecią": 30, "Świecie": 50,
    "Chojnice": 80, "Tuchola": 50, "Włocławek": 75
  },

  // === HUB: OLSZTYN I WARMIA-MAZURY ===
  "Olsztyn": {
    "Gdańsk": 165, "Warszawa": 215, "Elbląg": 75,
    "Mikołajki": 75, "Giżycko": 100, "Mrągowo": 60,
    "Ostróda": 40, "Iława": 70, "Szczytno": 50,
    "Lidzbark Warmiński": 50, "Bartoszyce": 85,
    "Kętrzyn": 80, "Pisz": 90, "Nidzica": 55
  },

  // === HUB: ŚLĄSK ===
  "Katowice": {
    "Sosnowiec": 10, "Gliwice": 30, "Zabrze": 20, "Bytom": 15,
    "Ruda Śląska": 15, "Tychy": 20, "Dąbrowa Górnicza": 15,
    "Chorzów": 10, "Mysłowice": 15, "Jaworzno": 25,
    "Częstochowa": 75, "Bielsko-Biała": 60, "Pszczyna": 35,
    "Żywiec": 75, "Rybnik": 50, "Racibórz": 75,
    "Jastrzębie-Zdrój": 55, "Zawiercie": 45, "Olkusz": 40,
    "Cieszyn": 75, "Kraków": 80, "Wrocław": 175, "Warszawa": 290
  },

  // === HUB: KRAKÓW I MAŁOPOLSKA ===
  "Kraków": {
    "Wrocław": 270, "Łódź": 265, "Katowice": 80, "Rzeszów": 165,
    "Kielce": 115, "Bielsko-Biała": 90, "Tarnów": 80,
    "Zakopane": 105, "Nowy Sącz": 100, "Wieliczka": 15,
    "Bochnia": 45, "Chrzanów": 45, "Wadowice": 50, "Zator": 55,
    "Krynica-Zdrój": 145, "Rabka-Zdrój": 70, "Oświęcim": 60,
    "Warszawa": 295, "Gdańsk": 590,
    "Lotnisko Balice (KRK)": 15
  },

  // === HUB: WROCŁAW I DOLNY ŚLĄSK ===
  "Wrocław": {
    "Poznań": 185, "Legnica": 75, "Wałbrzych": 80,
    "Jelenia Góra": 115, "Opole": 100, "Lubin": 75,
    "Głogów": 100, "Świdnica": 55, "Bolesławiec": 120,
    "Kłodzko": 85, "Kluczbork": 95, "Zgorzelec": 165,
    "Kraków": 270, "Warszawa": 355, "Katowice": 175
  },

  // === HUB: POZNAŃ I WIELKOPOLSKA ===
  "Poznań": {
    "Szczecin": 240, "Gorzów Wlkp": 110, "Zielona Góra": 150,
    "Kalisz": 120, "Konin": 105, "Piła": 95, "Gniezno": 50,
    "Leszno": 80, "Ostrów Wlkp": 120, "Jarocin": 70,
    "Wrocław": 185, "Warszawa": 310, "Gdańsk": 310,
    "Bydgoszcz": 125, "Toruń": 155
  },

  // === HUB: SZCZECIN I ZACHODNIOPOMORSKIE ===
  "Szczecin": {
    "Świnoujście": 105, "Międzyzdroje": 95, "Stargard": 40,
    "Koszalin": 165, "Kołbaskowo": 15, "Poznań": 240,
    "Gorzów Wlkp": 115, "Słupsk": 205
  },

  // === HUB: ZIELONA GÓRA I LUBUSKIE ===
  "Zielona Góra": {
    "Gorzów Wlkp": 110, "Słubice": 85, "Nowa Sól": 25,
    "Żary": 50, "Świebodzin": 40, "Poznań": 150, "Wrocław": 155
  },

  // === HUB: LUBLIN I WSCHODNIA POLSKA ===
  "Lublin": {
    "Rzeszów": 160, "Zamość": 90, "Chełm": 75, "Puławy": 50,
    "Biała Podlaska": 120, "Sandomierz": 110, "Warszawa": 170,
    "Kraków": 260, "Kielce": 135
  },

  // === HUB: BIAŁYSTOK I PODLASKIE ===
  "Białystok": {
    "Suwałki": 120, "Łomża": 80, "Ełk": 105, "Augustów": 90,
    "Hajnówka": 65, "Warszawa": 200, "Olsztyn": 185
  },

  // === HUB: RZESZÓW I PODKARPACIE ===
  "Rzeszów": {
    "Kraków": 165, "Lublin": 160, "Tarnów": 90, "Krosno": 60,
    "Przemyśl": 80, "Stalowa Wola": 75, "Mielec": 65,
    "Sanok": 95, "Lotnisko Jasionka (RZE)": 12
  },

  // === HUB: KIELCE I ŚWIĘTOKRZYSKIE ===
  "Kielce": {
    "Kraków": 115, "Lublin": 135, "Warszawa": 185,
    "Radom": 80, "Sandomierz": 75, "Ostrowiec Świętokrzyski": 45,
    "Starachowice": 40, "Końskie": 50
  },

  // === WĘZŁY LOKALNE — PÓŁNOC ===
  "Grudziądz": {
    "Kwidzyn": 35, "Brodnica": 60, "Świecie": 25,
    "Toruń": 60, "Bydgoszcz": 75, "Gdańsk": 110
  },
  "Brodnica": {
    "Toruń": 65, "Iława": 45, "Rypin": 30,
    "Nowe Miasto Lubawskie": 20, "Grudziądz": 60
  },
  "Kwidzyn": {
    "Malbork": 40, "Grudziądz": 35, "Gniew": 15,
    "Iława": 50, "Gdańsk": 95
  },
  "Starogard Gdański": {
    "Tczew": 25, "Skarszewy": 25, "Chojnice": 70,
    "Kościerzyna": 50, "Gdańsk": 55
  },
  "Koszalin": {
    "Kołobrzeg": 45, "Mielno": 15, "Darłowo": 40,
    "Ustka": 75, "Słupsk": 70, "Szczecin": 165
  },
  "Słupsk": {
    "Ustka": 20, "Łeba": 60, "Bytów": 55,
    "Darłowo": 55, "Gdańsk": 130, "Koszalin": 70
  },
  "Inowrocław": {
    "Bydgoszcz": 45, "Toruń": 35, "Konin": 75, "Gniezno": 50
  },

  // === PRZEJŚCIA GRANICZNE ===
  "Świecko (Granica PL/DE)": {
    "Poznań": 175, "Słubice": 5, "Zielona Góra": 90
  },
  "Zgorzelec (Granica PL/DE)": {
    "Wrocław": 165, "Jelenia Góra": 50
  },
  "Medyka (Granica PL/UA)": {
    "Przemyśl": 15, "Rzeszów": 110
  },
  "Terespol (Granica PL/BY)": {
    "Biała Podlaska": 40, "Warszawa": 200
  }
};

// ── 2. WSPÓŁRZĘDNE GPS (fallback gdy brak w tabeli) ───────────
const COORDS = {
  "Gdańsk":              { lat: 54.352, lon: 18.647 },
  "Gdynia":              { lat: 54.519, lon: 18.531 },
  "Sopot":               { lat: 54.442, lon: 18.560 },
  "Lotnisko Rębiechowo (GDN)": { lat: 54.378, lon: 18.466 },
  "Wejherowo":           { lat: 54.606, lon: 18.235 },
  "Rumia":               { lat: 54.572, lon: 18.401 },
  "Reda":                { lat: 54.615, lon: 18.356 },
  "Puck":                { lat: 54.720, lon: 18.401 },
  "Władysławowo":        { lat: 54.793, lon: 18.413 },
  "Hel":                 { lat: 54.608, lon: 18.801 },
  "Kartuzy":             { lat: 54.334, lon: 18.195 },
  "Żukowo":              { lat: 54.351, lon: 18.372 },
  "Kolbudy":             { lat: 54.282, lon: 18.572 },
  "Pruszcz Gdański":     { lat: 54.256, lon: 18.634 },
  "Tczew":               { lat: 54.093, lon: 18.797 },
  "Malbork":             { lat: 54.036, lon: 19.028 },
  "Sztum":               { lat: 53.921, lon: 19.031 },
  "Kwidzyn":             { lat: 53.735, lon: 18.929 },
  "Gniew":               { lat: 53.836, lon: 18.827 },
  "Nowy Dwór Gdański":   { lat: 54.215, lon: 19.121 },
  "Sztutowo":            { lat: 54.333, lon: 19.161 },
  "Stegna":              { lat: 54.326, lon: 19.136 },
  "Krynica Morska":      { lat: 54.385, lon: 19.449 },
  "Kąty Rybackie":       { lat: 54.360, lon: 19.274 },
  "Elbląg":              { lat: 54.152, lon: 19.405 },
  "Pasłęk":              { lat: 54.053, lon: 19.659 },
  "Starogard Gdański":   { lat: 53.963, lon: 18.528 },
  "Skarszewy":           { lat: 54.077, lon: 18.447 },
  "Pelplin":             { lat: 53.929, lon: 18.700 },
  "Kościerzyna":         { lat: 54.122, lon: 17.987 },
  "Karwia":              { lat: 54.779, lon: 18.222 },
  "Dębki":               { lat: 54.767, lon: 17.943 },
  "Jastrzębia Góra":     { lat: 54.830, lon: 18.311 },
  "Luzino":              { lat: 54.566, lon: 18.131 },
  "Gniewino":            { lat: 54.671, lon: 18.075 },
  "Sierakowice":         { lat: 54.275, lon: 17.972 },
  "Lębork":              { lat: 54.543, lon: 17.748 },
  "Bytów":               { lat: 54.170, lon: 17.493 },
  "Łeba":                { lat: 54.754, lon: 17.556 },
  "Słupsk":              { lat: 54.464, lon: 17.029 },
  "Ustka":               { lat: 54.581, lon: 16.862 },
  "Darłowo":             { lat: 54.422, lon: 16.381 },
  "Koszalin":            { lat: 54.194, lon: 16.172 },
  "Kołobrzeg":           { lat: 54.176, lon: 15.575 },
  "Mielno":              { lat: 54.264, lon: 16.007 },
  "Chojnice":            { lat: 53.695, lon: 17.556 },
  "Człuchów":            { lat: 53.657, lon: 17.359 },
  "Grudziądz":           { lat: 53.484, lon: 18.754 },
  "Brodnica":            { lat: 53.259, lon: 19.397 },
  "Toruń":               { lat: 53.014, lon: 18.598 },
  "Bydgoszcz":           { lat: 53.124, lon: 18.008 },
  "Inowrocław":          { lat: 52.797, lon: 18.259 },
  "Włocławek":           { lat: 52.649, lon: 19.066 },
  "Świecie":             { lat: 53.411, lon: 18.441 },
  "Tuchola":             { lat: 53.591, lon: 17.862 },
  "Nakło nad Notecią":   { lat: 53.143, lon: 17.597 },
  "Piła":                { lat: 53.151, lon: 16.738 },
  "Chełmno":             { lat: 53.349, lon: 18.424 },
  "Rypin":               { lat: 53.066, lon: 19.543 },
  "Lipno":               { lat: 52.851, lon: 19.168 },
  "Brodnica":            { lat: 53.259, lon: 19.397 },
  "Nowe Miasto Lubawskie": { lat: 53.428, lon: 19.585 },
  "Iława":               { lat: 53.595, lon: 19.569 },
  "Olsztyn":             { lat: 53.778, lon: 20.480 },
  "Ostróda":             { lat: 53.697, lon: 19.960 },
  "Mrągowo":             { lat: 53.864, lon: 21.302 },
  "Mikołajki":           { lat: 53.797, lon: 21.577 },
  "Giżycko":             { lat: 54.038, lon: 21.762 },
  "Pisz":                { lat: 53.631, lon: 21.816 },
  "Szczytno":            { lat: 53.563, lon: 20.990 },
  "Nidzica":             { lat: 53.361, lon: 20.428 },
  "Lidzbark Warmiński":  { lat: 54.131, lon: 20.579 },
  "Bartoszyce":          { lat: 54.255, lon: 20.808 },
  "Kętrzyn":             { lat: 54.076, lon: 21.374 },
  "Suwałki":             { lat: 54.112, lon: 22.931 },
  "Augustów":            { lat: 53.843, lon: 22.980 },
  "Łomża":               { lat: 53.178, lon: 22.059 },
  "Ełk":                 { lat: 53.828, lon: 22.358 },
  "Hajnówka":            { lat: 52.742, lon: 23.589 },
  "Białystok":           { lat: 53.133, lon: 23.169 },
  "Warszawa":            { lat: 52.230, lon: 21.012 },
  "Lotnisko Chopina (WAW)": { lat: 52.166, lon: 20.967 },
  "Lotnisko Modlin (WMI)": { lat: 52.451, lon: 20.652 },
  "Pruszków":            { lat: 52.170, lon: 20.800 },
  "Piaseczno":           { lat: 52.069, lon: 21.022 },
  "Legionowo":           { lat: 52.405, lon: 20.929 },
  "Otwock":              { lat: 52.107, lon: 21.261 },
  "Mińsk Mazowiecki":    { lat: 52.179, lon: 21.567 },
  "Wyszków":             { lat: 52.595, lon: 21.460 },
  "Ostrołęka":           { lat: 53.084, lon: 21.574 },
  "Ciechanów":           { lat: 52.882, lon: 20.620 },
  "Płock":               { lat: 52.546, lon: 19.707 },
  "Sochaczew":           { lat: 52.232, lon: 20.240 },
  "Żyrardów":            { lat: 52.047, lon: 20.444 },
  "Łowicz":              { lat: 52.101, lon: 19.938 },
  "Kutno":               { lat: 52.231, lon: 19.365 },
  "Skierniewice":        { lat: 51.963, lon: 20.159 },
  "Garwolin":            { lat: 51.905, lon: 21.614 },
  "Siedlce":             { lat: 52.168, lon: 22.290 },
  "Biała Podlaska":      { lat: 52.032, lon: 23.118 },
  "Terespol (Granica PL/BY)": { lat: 52.072, lon: 23.614 },
  "Radom":               { lat: 51.403, lon: 21.147 },
  "Kielce":              { lat: 50.866, lon: 20.629 },
  "Ostrowiec Świętokrzyski": { lat: 50.929, lon: 21.389 },
  "Starachowice":        { lat: 51.038, lon: 21.071 },
  "Sandomierz":          { lat: 50.682, lon: 21.749 },
  "Końskie":             { lat: 51.194, lon: 20.410 },
  "Łódź":                { lat: 51.759, lon: 19.456 },
  "Piotrków Trybunalski": { lat: 51.405, lon: 19.703 },
  "Tomaszów Mazowiecki": { lat: 51.527, lon: 20.011 },
  "Bełchatów":           { lat: 51.361, lon: 19.360 },
  "Sieradz":             { lat: 51.595, lon: 18.731 },
  "Zduńska Wola":        { lat: 51.601, lon: 18.938 },
  "Wieluń":              { lat: 51.220, lon: 18.570 },
  "Częstochowa":         { lat: 50.812, lon: 19.120 },
  "Lublin":              { lat: 51.247, lon: 22.568 },
  "Zamość":              { lat: 50.723, lon: 23.252 },
  "Chełm":               { lat: 51.143, lon: 23.472 },
  "Puławy":              { lat: 51.416, lon: 21.969 },
  "Kraśnik":             { lat: 50.924, lon: 22.228 },
  "Rzeszów":             { lat: 50.041, lon: 21.999 },
  "Lotnisko Jasionka (RZE)": { lat: 50.110, lon: 22.019 },
  "Przemyśl":            { lat: 49.784, lon: 22.768 },
  "Medyka (Granica PL/UA)": { lat: 49.788, lon: 22.853 },
  "Krosno":              { lat: 49.689, lon: 21.771 },
  "Sanok":               { lat: 49.559, lon: 22.204 },
  "Stalowa Wola":        { lat: 50.573, lon: 22.053 },
  "Mielec":              { lat: 50.287, lon: 21.421 },
  "Tarnobrzeg":          { lat: 50.573, lon: 21.679 },
  "Kraków":              { lat: 50.065, lon: 19.945 },
  "Lotnisko Balice (KRK)": { lat: 50.078, lon: 19.785 },
  "Wieliczka":           { lat: 49.988, lon: 20.065 },
  "Bochnia":             { lat: 49.969, lon: 20.432 },
  "Tarnów":              { lat: 50.012, lon: 20.986 },
  "Nowy Sącz":           { lat: 49.624, lon: 20.694 },
  "Zakopane":            { lat: 49.299, lon: 19.949 },
  "Rabka-Zdrój":         { lat: 49.611, lon: 19.975 },
  "Krynica-Zdrój":       { lat: 49.421, lon: 20.957 },
  "Wadowice":            { lat: 49.883, lon: 19.497 },
  "Chrzanów":            { lat: 50.136, lon: 19.403 },
  "Zator":               { lat: 49.987, lon: 19.439 },
  "Oświęcim":            { lat: 50.034, lon: 19.211 },
  "Katowice":            { lat: 50.265, lon: 19.024 },
  "Lotnisko Pyrzowice (KTW)": { lat: 50.474, lon: 19.080 },
  "Sosnowiec":           { lat: 50.286, lon: 19.104 },
  "Gliwice":             { lat: 50.295, lon: 18.671 },
  "Zabrze":              { lat: 50.325, lon: 18.786 },
  "Bytom":               { lat: 50.348, lon: 18.912 },
  "Ruda Śląska":         { lat: 50.256, lon: 18.856 },
  "Tychy":               { lat: 50.127, lon: 18.996 },
  "Dąbrowa Górnicza":    { lat: 50.323, lon: 19.184 },
  "Chorzów":             { lat: 50.298, lon: 18.953 },
  "Mysłowice":           { lat: 50.208, lon: 19.166 },
  "Jaworzno":            { lat: 50.204, lon: 19.274 },
  "Pszczyna":            { lat: 49.978, lon: 18.951 },
  "Bielsko-Biała":       { lat: 49.822, lon: 19.059 },
  "Żywiec":              { lat: 49.685, lon: 19.193 },
  "Cieszyn":             { lat: 49.748, lon: 18.634 },
  "Rybnik":              { lat: 50.097, lon: 18.546 },
  "Jastrzębie-Zdrój":    { lat: 49.957, lon: 18.579 },
  "Racibórz":            { lat: 50.091, lon: 18.219 },
  "Zawiercie":           { lat: 50.487, lon: 19.418 },
  "Olkusz":              { lat: 50.278, lon: 19.564 },
  "Wrocław":             { lat: 51.108, lon: 17.039 },
  "Legnica":             { lat: 51.210, lon: 16.162 },
  "Lubin":               { lat: 51.400, lon: 16.203 },
  "Głogów":              { lat: 51.663, lon: 16.085 },
  "Wałbrzych":           { lat: 50.784, lon: 16.284 },
  "Jelenia Góra":        { lat: 50.904, lon: 15.739 },
  "Świdnica":            { lat: 50.845, lon: 16.487 },
  "Kłodzko":             { lat: 50.437, lon: 16.658 },
  "Bolesławiec":         { lat: 51.265, lon: 15.565 },
  "Zgorzelec":           { lat: 51.154, lon: 15.009 },
  "Zgorzelec (Granica PL/DE)": { lat: 51.154, lon: 15.009 },
  "Kluczbork":           { lat: 50.972, lon: 18.213 },
  "Opole":               { lat: 50.675, lon: 17.921 },
  "Poznań":              { lat: 52.406, lon: 16.925 },
  "Gniezno":             { lat: 52.534, lon: 17.600 },
  "Konin":               { lat: 52.223, lon: 18.251 },
  "Kalisz":              { lat: 51.761, lon: 18.091 },
  "Leszno":              { lat: 51.840, lon: 16.576 },
  "Ostrów Wlkp":         { lat: 51.652, lon: 17.808 },
  "Jarocin":             { lat: 51.975, lon: 17.503 },
  "Szczecin":            { lat: 53.429, lon: 14.553 },
  "Świnoujście":         { lat: 53.910, lon: 14.248 },
  "Międzyzdroje":        { lat: 53.930, lon: 14.449 },
  "Stargard":            { lat: 53.337, lon: 15.049 },
  "Kołbaskowo":          { lat: 53.432, lon: 14.418 },
  "Gorzów Wlkp":         { lat: 52.737, lon: 15.229 },
  "Zielona Góra":        { lat: 51.936, lon: 15.506 },
  "Nowa Sól":            { lat: 51.803, lon: 15.717 },
  "Żary":                { lat: 51.642, lon: 15.133 },
  "Świebodzin":          { lat: 52.248, lon: 15.532 },
  "Słubice":             { lat: 52.350, lon: 14.565 },
  "Świecko (Granica PL/DE)": { lat: 52.343, lon: 14.575 }
};

// ── 3. LISTA NAZW MIAST (do autouzupełniania) ─────────────────
const CITY_NAMES = Object.keys(COORDS).sort((a, b) => a.localeCompare(b, 'pl'));

// ── 4. GŁÓWNA FUNKCJA OBLICZANIA DYSTANSU ────────────────────
const MAJOR_HUBS = [
  "Gdańsk", "Warszawa", "Wrocław", "Kraków",
  "Poznań", "Łódź", "Katowice", "Bydgoszcz",
  "Toruń", "Olsztyn", "Lublin", "Rzeszów",
  "Białystok", "Szczecin"
];

function getTaxiDistance(cityA, cityB) {
  if (cityA === cityB) return 0;

  // Warstwa 1 — bezpośrednie połączenie w tabeli
  if (DISTANCES[cityA] && DISTANCES[cityA][cityB] !== undefined)
    return DISTANCES[cityA][cityB];
  if (DISTANCES[cityB] && DISTANCES[cityB][cityA] !== undefined)
    return DISTANCES[cityB][cityA];

  // Warstwa 2 — routing przez hub (A→Hub + Hub→B)
  let bestViaHub = null;
  for (const hub of MAJOR_HUBS) {
    if (hub === cityA || hub === cityB) continue;
    const d1 = (DISTANCES[cityA] && DISTANCES[cityA][hub]) ||
               (DISTANCES[hub]  && DISTANCES[hub][cityA]);
    const d2 = (DISTANCES[cityB] && DISTANCES[cityB][hub]) ||
               (DISTANCES[hub]  && DISTANCES[hub][cityB]);
    if (d1 && d2) {
      const total = d1 + d2;
      if (bestViaHub === null || total < bestViaHub) bestViaHub = total;
    }
  }
  if (bestViaHub !== null) return bestViaHub;

  // Warstwa 3 — fallback: linia prosta × współczynnik drogowy
  if (COORDS[cityA] && COORDS[cityB]) {
    return haversineRoad(COORDS[cityA], COORDS[cityB]);
  }

  return null; // miasto nieznane
}

// Haversine z dynamicznym współczynnikiem drogowym
// Krótkie trasy (drogi lokalne) mają wyższy współczynnik niż długie (autostrady)
function haversineRoad(a, b) {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const l1 = a.lat * Math.PI / 180;
  const l2 = b.lat * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(l1) * Math.cos(l2);
  const straight = R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  // Współczynnik: długie trasy (autostrady) bliżej linii prostej niż krótkie
  let factor;
  if (straight < 30)       factor = 1.45; // miasto/gmina — kręte drogi
  else if (straight < 80)  factor = 1.35; // trasy regionalne
  else if (straight < 200) factor = 1.25; // trasy krajowe
  else                     factor = 1.18; // trasy autostradowe (A1, S7, A2...)
  return Math.round(straight * factor);
}

// Czy dystans pochodzi z tabeli (dokładny) czy z Haversine (przybliżony)?
function isDistanceApproximate(cityA, cityB) {
  if (cityA === cityB) return false;
  if (DISTANCES[cityA] && DISTANCES[cityA][cityB] !== undefined) return false;
  if (DISTANCES[cityB] && DISTANCES[cityB][cityA] !== undefined) return false;
  for (const hub of MAJOR_HUBS) {
    const d1 = (DISTANCES[cityA] && DISTANCES[cityA][hub]) || (DISTANCES[hub] && DISTANCES[hub][cityA]);
    const d2 = (DISTANCES[cityB] && DISTANCES[cityB][hub]) || (DISTANCES[hub] && DISTANCES[hub][cityB]);
    if (d1 && d2) return false;
  }
  return true; // tylko Haversine
}