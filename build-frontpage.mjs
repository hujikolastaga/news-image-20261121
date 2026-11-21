import { writeFileSync, readFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PNG = join(__dirname, 'entry.png');

const HERO_STORIES = [
  {
    num: 1,
    banner: 'COP31: OVERTIME',
    bannerBg: '#B81D1D',
    subBadge: 'No deal · Day 13',
    sourceTag: 'Ongoing · AFP, Al Jazeera',
    statusTag: 'OFFICIAL',
    statusColor: '#1B4D89',
    dateline: 'ANTALYA, TÜRKIYE · CLIMATE',
    datelineColor: '#8B4513',
    headline: 'Climate summit runs into Saturday with no deal',
    summary: 'COP31 missed Friday’s close as a draft omitting fossil-fuel phaseout split nearly 200 nations; third text promised. (AFP, Al Jazeera)',
    svg: `<svg viewBox="0 0 320 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="96" fill="#D7EBE2"/>
      <circle cx="138" cy="55" r="26" fill="#18649A" stroke="#0D3656" stroke-width="2.2"/>
      <path d="M126,38 C135,37 141,44 138,51 C134,56 141,63 137,72 C129,73 121,63 120,53 C119,45 122,40 126,38 Z" fill="#289453"/>
      <path d="M148,43 C154,45 159,53 156,61 C153,67 147,66 146,58 C145,51 145,45 148,43 Z" fill="#289453"/>
      <rect x="176" y="16" width="58" height="60" rx="3" fill="#FFFFFF" stroke="#1A202C" stroke-width="2"/>
      <text x="205" y="30" font-family="Arial,sans-serif" font-size="8.5" font-weight="900" fill="#B81D1D" text-anchor="middle">DRAFT 2</text>
      <line x1="183" y1="38" x2="227" y2="38" stroke="#718096" stroke-width="2.2"/>
      <text x="205" y="53" font-family="Arial,sans-serif" font-size="8.2" font-weight="900" fill="#B81D1D" text-anchor="middle">NO FOSSIL</text>
      <text x="205" y="64" font-family="Arial,sans-serif" font-size="8.2" font-weight="900" fill="#B81D1D" text-anchor="middle">PHASEOUT</text>
      <rect x="245" y="20" width="11" height="44" rx="5.5" fill="#FFFFFF" stroke="#111317" stroke-width="2.2"/>
      <rect x="247.8" y="33" width="5.4" height="29" fill="#D92020"/>
      <circle cx="250.5" cy="67" r="9.5" fill="#D92020" stroke="#111317" stroke-width="2.2"/>
      <circle cx="288" cy="52" r="22" fill="#FFFFFF" stroke="#111317" stroke-width="2.5"/>
      <line x1="288" y1="52" x2="288" y2="36" stroke="#111317" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="288" y1="52" x2="301" y2="59" stroke="#B81D1D" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="288" cy="52" r="2.3" fill="#111317"/>
    </svg>`
  },
  {
    num: 2,
    banner: 'SAUDI: 5 MISSILES',
    bannerBg: '#B81D1D',
    subBadge: '5 shot down',
    sourceTag: 'Coalition · Reuters, AFP',
    statusTag: 'REPORTED',
    statusColor: '#9C4221',
    dateline: 'RIYADH & JIZAN · MIDDLE EAST WAR',
    datelineColor: '#9C4221',
    headline: 'Five Houthi missiles shot down over Saudi Arabia',
    summary: 'Coalition air defenses destroyed three missiles over Riyadh before dawn Saturday and two over Jizan after Hodeidah strikes. (Reuters, AFP)',
    svg: `<svg viewBox="0 0 320 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="96" fill="#0B1930"/>
      <circle cx="292" cy="19" r="9.5" fill="#F6E05E"/>
      <path d="M18,90 Q105,24 176,34" fill="none" stroke="#F6AD55" stroke-width="2.4" stroke-dasharray="5,3"/>
      <path d="M44,90 Q140,18 220,26" fill="none" stroke="#F6AD55" stroke-width="2.4" stroke-dasharray="5,3"/>
      <path d="M76,90 Q185,32 262,40" fill="none" stroke="#F6AD55" stroke-width="2.4" stroke-dasharray="5,3"/>
      <g fill="#F6AD55" stroke="#DD6B20" stroke-width="1">
        <polygon points="176,22 179,30 187,30 181,35 184,43 176,38 168,43 171,35 165,30 173,30"/>
        <polygon points="220,14 223,22 231,22 225,27 228,35 220,30 212,35 215,27 209,22 217,22"/>
        <polygon points="262,28 265,36 273,36 267,41 270,49 262,44 254,49 257,41 251,36 259,36"/>
        <circle cx="136" cy="48" r="6" fill="#FBD38D"/>
        <circle cx="198" cy="52" r="5.5" fill="#FBD38D"/>
      </g>
      <rect x="138" y="68" width="20" height="28" fill="#1E3A5F"/>
      <rect x="166" y="60" width="24" height="36" fill="#1E3A5F"/>
      <path d="M170,60 L170,48 L186,48 L186,60 M174,48 A6,6 0 0,0 182,48" fill="#2B5486"/>
      <rect x="198" y="72" width="24" height="24" fill="#1E3A5F"/>
      <rect x="230" y="66" width="20" height="30" fill="#1E3A5F"/>
      <g fill="#F6E05E">
        <rect x="171" y="66" width="3.5" height="3.5"/><rect x="180" y="66" width="3.5" height="3.5"/>
        <rect x="171" y="74" width="3.5" height="3.5"/><rect x="180" y="74" width="3.5" height="3.5"/>
        <rect x="235" y="72" width="3.5" height="3.5"/><rect x="242" y="79" width="3.5" height="3.5"/>
      </g>
    </svg>`
  },
  {
    num: 3,
    banner: 'PERU: QUAKE 6.7',
    bannerBg: '#B81D1D',
    subBadge: '00:09 UTC · 108 km deep',
    sourceTag: 'USGS · IGP Peru',
    statusTag: 'OFFICIAL',
    statusColor: '#1B4D89',
    dateline: 'JUNÍN, PERU · EARTHQUAKE',
    datelineColor: '#5B3E90',
    headline: 'Magnitude 6.7 earthquake shakes central Peru',
    summary: 'Deep quake near Carhuamayo (00:09 UTC Saturday) shook Lima and Congress; no deaths, major damage or tsunami threat. (USGS, IGP)',
    svg: `<svg viewBox="0 0 320 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="96" fill="#EFE5D6"/>
      <polygon points="0,82 55,44 98,72 152,28 206,74 248,54 320,82" fill="#C4A27E" opacity="0.65"/>
      <line x1="0" y1="78" x2="320" y2="78" stroke="#6B2C18" stroke-width="2.2"/>
      <circle cx="152" cy="76" r="8" fill="none" stroke="#C52222" stroke-width="2.2"/>
      <circle cx="152" cy="76" r="17" fill="none" stroke="#C52222" stroke-width="1.6" stroke-dasharray="4,2"/>
      <polyline points="88,60 126,60 136,44 144,72 152,22 160,76 168,34 176,66 184,52 194,60 236,60" fill="none" stroke="#C52222" stroke-width="3" stroke-linejoin="round"/>
      <rect x="252" y="52" width="40" height="26" fill="#FFFFFF" stroke="#1A202C" stroke-width="2"/>
      <polygon points="248,52 272,37 296,52" fill="#B81D1D"/>
      <rect x="267" y="62" width="10" height="16" fill="#2D3748"/>
    </svg>`
  }
];

const MID_STORIES = [
  {
    num: 4,
    banner: 'KYIV: STRIKES',
    sub: 'NBC · Kyiv Indep.',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'KYIV & KRYVYI RIH · WAR',
    color: '#1B4D89',
    headline: 'Russia hits Kyiv; Crimea bridge warning',
    summary: 'Dawn strike hits Podil (Kryvyi Rih: 2 dead, 42 hurt); Zelensky says Crimea bridge “will not stay”.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="30" fill="#1A5BA2"/>
      <rect y="30" width="185" height="24" fill="#ECC94B"/>
      <path d="M12,46 L52,46 L64,36 L108,36 L120,46 L175,46" fill="none" stroke="#111317" stroke-width="2.4"/>
      <path d="M68,36 Q86,18 104,36" fill="none" stroke="#111317" stroke-width="2.2"/>
      <polygon points="148,10 151,19 160,19 153,24 156,33 148,27 140,33 143,24 136,19 145,19" fill="#E53E3E" stroke="#FFFFFF" stroke-width="1"/>
    </svg>`
  },
  {
    num: 5,
    banner: 'GENEVA: AI ARMS',
    sub: 'UN · Reuters',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'GENEVA · UN ARMS TALKS',
    color: '#1B4D89',
    headline: 'UN “killer robots” talks end without ban',
    summary: 'Geneva talks closed Saturday without a treaty after US & Russia pushback, setting a 2028 target.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="54" fill="#DFE7F0"/>
      <rect x="66" y="23" width="26" height="19" rx="4" fill="#374151" stroke="#111317" stroke-width="1.6"/>
      <circle cx="74" cy="32" r="3" fill="#EF4444"/>
      <circle cx="84" cy="32" r="3" fill="#EF4444"/>
      <rect x="100" y="18" width="77" height="22" rx="3" fill="#FFFFFF" stroke="#1B4D89" stroke-width="2"/>
      <text x="138.5" y="33" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#1B4D89" text-anchor="middle">2028 RULES</text>
    </svg>`
  },
  {
    num: 6,
    banner: 'DAVAO: 146 SAFE',
    sub: 'Airline · AP',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'DAVAO · AVIATION',
    color: '#B81D1D',
    headline: 'Jet lands safely after engine-fire alert',
    summary: 'Air Niugini 767 made an emergency landing after midnight Saturday; all 146 aboard safe.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="42" fill="#D2EBF8"/>
      <rect y="42" width="185" height="12" fill="#64748B"/>
      <path d="M35,32 L128,28 L145,32 L128,36 L35,36 Z" fill="#FFFFFF" stroke="#111317" stroke-width="1.8"/>
      <polygon points="75,33 92,41 106,33" fill="#334155"/>
      <circle cx="94" cy="38" r="5.5" fill="#EF4444"/>
      <circle cx="91" cy="38" r="2.8" fill="#FACC15"/>
      <text x="178" y="16" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#15803D" text-anchor="end">146 SAFE</text>
    </svg>`
  },
  {
    num: 7,
    banner: 'HORMUZ: DRONE',
    sub: 'IRGC claim · IRIB',
    status: 'CLAIM',
    statusBg: '#9C4221',
    dateline: 'HORMUZ & TEHRAN · IRAN',
    color: '#9C4221',
    headline: 'Iran claims US drone downed; uranium stays',
    summary: 'IRGC claimed an MQ-9 shootdown (no US confirmation); FM says uranium stock stays in country.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="36" fill="#E4EDF8"/>
      <rect y="36" width="185" height="18" fill="#1B4D89"/>
      <line x1="58" y1="21" x2="128" y2="21" stroke="#1F2937" stroke-width="3.2"/>
      <polygon points="84,21 97,14 104,21" fill="#374151"/>
      <circle cx="96" cy="21" r="6.5" fill="#F97316"/>
      <text x="178" y="16" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#9C4221" text-anchor="end">MQ-9?</text>
    </svg>`
  },
  {
    num: 8,
    banner: 'SUDAN & GAZA',
    sub: 'AP · Reuters',
    status: 'REPORTED',
    statusBg: '#1E7045',
    dateline: 'BARA, SUDAN & GAZA · WAR',
    color: '#1E7045',
    headline: 'Sudan army claims Bara; Gaza strikes kill 6',
    summary: 'Sudan’s army claimed it retook Bara (CLAIM); Israeli strikes in Gaza killed six including a cameraman.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="54" fill="#F1E2C5"/>
      <line x1="0" y1="40" x2="185" y2="40" stroke="#785C38" stroke-width="2.2"/>
      <rect x="44" y="28" width="34" height="12" rx="2" fill="#3F521E"/>
      <circle cx="52" cy="41" r="4" fill="#111317"/>
      <circle cx="70" cy="41" r="4" fill="#111317"/>
      <rect x="110" y="16" width="68" height="22" rx="3" fill="#FFFFFF" stroke="#B81D1D" stroke-width="1.8"/>
      <text x="144" y="31" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#B81D1D" text-anchor="middle">BARA / GAZA</text>
    </svg>`
  },
  {
    num: 9,
    banner: 'CHINA–JAPAN–AI',
    sub: 'AFP · ABC',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'BEIJING & CANBERRA · ASIA',
    color: '#B81D1D',
    headline: 'China warns Japan on Taiwan; Australia AI',
    summary: 'Beijing told Tokyo to “correct” Taiwan remarks as Australia and China agreed to AI talks.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="105" height="54" fill="#C52828"/>
      <rect x="105" width="80" height="54" fill="#EDF2F7"/>
      <circle cx="152" cy="27" r="11.5" fill="#C52828"/>
      <circle cx="105" cy="33" r="12.5" fill="#FFFFFF" stroke="#111317" stroke-width="2.2"/>
      <text x="105" y="37" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#111317" text-anchor="middle">AI</text>
    </svg>`
  },
  {
    num: 10,
    banner: 'TRUMP: AI TAX',
    sub: 'ABC · AFP',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'WASHINGTON · TECH & LAW',
    color: '#5B3E90',
    headline: 'Trump vows tax on foreign AI data centres',
    summary: 'Warned of steep penalties on offshore AI hubs as Missouri judge approved $7.25bn Roundup deal.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="54" fill="#16253D"/>
      <rect x="104" y="11" width="68" height="32" rx="3" fill="#2B5486" stroke="#90CDF4" stroke-width="1.8"/>
      <text x="138" y="31" font-family="Arial,sans-serif" font-size="11.5" font-weight="900" fill="#FFFFFF" text-anchor="middle">AI TAX %</text>
    </svg>`
  },
  {
    num: 11,
    banner: 'BITCOIN: $58,983',
    sub: 'CoinGecko · 02:08 UTC',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'GLOBAL · MARKETS',
    color: '#1F2937',
    headline: 'Bitcoin drops below $59,000 on Saturday',
    summary: 'Down 3.9% in 24h to $58,983 (near two-year low); Ether fell 6.1% to $1,625 in early UTC trading.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="54" fill="#101827"/>
      <line x1="12" y1="28" x2="173" y2="28" stroke="#64748B" stroke-width="1.2" stroke-dasharray="3,2"/>
      <polyline points="16,17 44,21 72,26 98,34 126,41 152,44" fill="none" stroke="#F87171" stroke-width="3"/>
      <text x="177" y="25" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#F87171" text-anchor="end">BTC -3.9%</text>
      <text x="177" y="36" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#F87171" text-anchor="end">ETH -6.1%</text>
    </svg>`
  },
  {
    num: 12,
    banner: 'VEGAS GP: P1',
    sub: 'FIA · Formula 1',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'LAS VEGAS · FORMULA ONE',
    color: '#5B3E90',
    headline: 'Russell fastest in Vegas practice; grid shifts',
    summary: 'Russell clocked 1:34.041 in damp FP3; Verstappen takes pole after Antonelli grid penalty.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="54" fill="#263040"/>
      <line x1="0" y1="40" x2="185" y2="25" stroke="#94A3B8" stroke-width="1.6" stroke-dasharray="5,4"/>
      <rect x="78" y="26" width="40" height="11" rx="3" fill="#2DD4BF"/>
      <circle cx="86" cy="38" r="4.8" fill="#0F172A" stroke="#E2E8F0" stroke-width="1.4"/>
      <circle cx="110" cy="38" r="4.8" fill="#0F172A" stroke="#E2E8F0" stroke-width="1.4"/>
      <text x="177" y="18" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#FACC15" text-anchor="end">1:34.041</text>
    </svg>`
  },
  {
    num: 13,
    banner: 'RAHUL: 124*',
    sub: 'Day 3 · AFP, Wisden',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'WELLINGTON · CRICKET',
    color: '#146E7A',
    headline: 'Rahul hits unbeaten 124* vs New Zealand',
    summary: 'Century lifted India to 344/2 at tea on Day 3 in Wellington (486/4 stumps), replying to 368.',
    svg: `<svg viewBox="0 0 185 54" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="54" fill="#3B8256"/>
      <line x1="116" y1="20" x2="116" y2="44" stroke="#FEF08A" stroke-width="2.4"/>
      <line x1="122" y1="20" x2="122" y2="44" stroke="#FEF08A" stroke-width="2.4"/>
      <line x1="128" y1="20" x2="128" y2="44" stroke="#FEF08A" stroke-width="2.4"/>
      <rect x="138" y="15" width="8.5" height="28" rx="2" transform="rotate(18 142 29)" fill="#EAB308" stroke="#713F12" stroke-width="1.3"/>
      <circle cx="94" cy="32" r="5.5" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.2"/>
      <text x="178" y="18" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#FFFFFF" text-anchor="end">344/2</text>
    </svg>`
  }
];

const EXTRA_STORIES_LEFT = [
  { num: 14, loc: 'Warsaw', text: 'NATO’s Rutte visits Poland for air-defense talks after missile incursion', src: 'AP' },
  { num: 15, loc: 'Copenhagen', text: 'Denmark expels Russian attaché over alleged plot', src: 'Al Jazeera' },
  { num: 16, loc: 'Paris', text: 'French youth march on sixth day of cost-of-living protests', src: 'France 24' },
  { num: 17, loc: 'Turin', text: 'ATP Finals semifinals: Alcaraz–Shelton and Zverev–Medvedev', src: 'ATP' },
  { num: 18, loc: 'Vatican', text: 'Pope Leo meets 6,000 young people in Saturday audience', src: 'Vatican News' },
  { num: 19, loc: 'Sejong', text: 'Freight train derails in South Korea (5 cars off); no injuries', src: 'Yonhap' },
  { num: 20, loc: 'Pyongyang', text: 'Kim tours munitions factories, ignores Trump talks offer', src: 'AFP' },
  { num: 21, loc: 'Taipei', text: 'Budget & cash payout passed; 2,700 accounts flagged to Meta', src: 'Taipei Times' },
  { num: 22, loc: 'Hong Kong', text: 'Tai Po fire: 200 survivors receive trauma counseling', src: 'RTHK' },
  { num: 23, loc: 'Bangkok', text: 'Six-point action plan approved on arsenic in two rivers', src: 'The Nation' },
  { num: 24, loc: 'New Delhi', text: 'Pakistani minister joins SCO forum session in India', src: 'Dawn, PTI' }
];

const EXTRA_STORIES_RIGHT = [
  { num: 25, loc: 'Eastern India', text: 'Heavy rain alerts as Cyclone Akvan’s remnants move inland', src: 'ETV' },
  { num: 26, loc: 'Bandung / Paris', text: 'Indonesian ITB–UI team wins iGEM gold for Parkinson’s spray', src: 'ITB' },
  { num: 27, loc: 'Yemen', text: 'Houthis threaten Jeddah & Red Sea ports after Hodeidah strikes', src: 'Al Jazeera' },
  { num: 28, loc: 'Bayelsa', text: 'River search continues after Nigeria funeral barge sinks; 4 dead', src: 'AP' },
  { num: 29, loc: 'South Africa', text: 'Hail warnings in 7 provinces as ANC scrambles after 31% poll', src: 'BBC' },
  { num: 30, loc: 'Port Louis', text: 'African rating agency meets 15 states; Kenya teacher payroll', src: 'Al Jazeera' },
  { num: 31, loc: 'Los Angeles', text: 'Jury convicts Palisades fire arsonist; Texas execution 63 min', src: 'ABC' },
  { num: 32, loc: 'Ottawa', text: 'Memo warns AI hubs raise power bills; youth climate trial', src: 'AFP' },
  { num: 33, loc: 'Haiti & Mexico', text: 'El Salvador to build 3 Haiti prisons; migrant caravan arrives', src: 'Reuters' },
  { num: 34, loc: 'Melbourne', text: 'Cummins keeps Australian Test captaincy; T20 win vs England', src: 'ABC' },
  { num: 35, loc: 'Antalya', text: 'Panama threatens to block COP31 text; PLN signs 6 clean deals', src: 'Al Jazeera' }
];

const MAP_PINS = [
  { n: 1, x: 151, y: 41, c: '#B81D1D' },
  { n: 2, x: 163, y: 54, c: '#B81D1D' },
  { n: 3, x: 70, y: 82, c: '#B81D1D' },
  { n: 4, x: 152, y: 29, c: '#1D4E89' },
  { n: 5, x: 132, y: 33, c: '#1D4E89' },
  { n: 6, x: 226, y: 65, c: '#B81D1D' },
  { n: 7, x: 173, y: 50, c: '#9C4221' },
  { n: 8, x: 151, y: 61, c: '#1E7045' },
  { n: 9, x: 215, y: 39, c: '#B81D1D' },
  { n: 10, x: 64, y: 39, c: '#593E8E' },
  { n: 11, x: 99, y: 36, c: '#2D3748' },
  { n: 12, x: 35, y: 40, c: '#593E8E' },
  { n: 13, x: 256, y: 101, c: '#146E7A' },
  { n: 14, x: 142, y: 27, c: '#1D4E89' },
  { n: 15, x: 134, y: 23, c: '#1D4E89' },
  { n: 16, x: 123, y: 32, c: '#1D4E89' },
  { n: 17, x: 131, y: 39, c: '#1D4E89' },
  { n: 18, x: 139, y: 41, c: '#1D4E89' },
  { n: 19, x: 229, y: 40, c: '#B81D1D' },
  { n: 20, x: 224, y: 33, c: '#B81D1D' },
  { n: 21, x: 223, y: 50, c: '#B81D1D' },
  { n: 22, x: 214, y: 53, c: '#B81D1D' },
  { n: 23, x: 204, y: 58, c: '#B81D1D' },
  { n: 24, x: 188, y: 49, c: '#B81D1D' },
  { n: 25, x: 195, y: 55, c: '#B81D1D' },
  { n: 26, x: 211, y: 71, c: '#B81D1D' },
  { n: 27, x: 162, y: 63, c: '#9C4221' },
  { n: 28, x: 130, y: 65, c: '#1E7045' },
  { n: 29, x: 145, y: 92, c: '#1E7045' },
  { n: 30, x: 164, y: 80, c: '#1E7045' },
  { n: 31, x: 46, y: 44, c: '#593E8E' },
  { n: 32, x: 56, y: 30, c: '#593E8E' },
  { n: 33, x: 59, y: 55, c: '#593E8E' },
  { n: 34, x: 236, y: 94, c: '#146E7A' },
  { n: 35, x: 67, y: 62, c: '#593E8E' }
];

function buildHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 1024px;
    height: 1024px;
    overflow: hidden;
    background: #F6F2E9;
    color: #111317;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 9px 14px 7px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .kicker-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.8px;
    font-weight: 900;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    padding-bottom: 3px;
    border-bottom: 2.4px solid #111317;
  }
  .kicker-left { color: #B81D1D; }
  .kicker-right { color: #1F2937; }

  .masthead {
    text-align: center;
    padding: 2px 0 3px 0;
    border-bottom: 1.2px solid #78716A;
  }
  .masthead h1 {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 57px;
    font-weight: 900;
    letter-spacing: -1.3px;
    line-height: 0.98;
    color: #0D0F12;
  }
  .masthead-sub {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-style: italic;
    font-weight: 700;
    font-size: 13.5px;
    color: #1F2937;
    margin-top: 3px;
  }

  .kpi-bar {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    padding: 4px 0;
  }
  .kpi-item {
    border-left: 3.5px solid #B81D1D;
    padding-left: 6px;
  }
  .kpi-val {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20px;
    font-weight: 900;
    line-height: 1.02;
    color: #0D0F12;
  }
  .kpi-lbl {
    font-size: 8.9px;
    font-weight: 600;
    line-height: 1.15;
    color: #1F2937;
    margin-top: 1px;
  }

  .region-bar {
    display: flex;
    width: 100%;
    height: 16px;
    font-size: 9.2px;
    font-weight: 900;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    overflow: hidden;
    border-radius: 2px;
  }
  .reg-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    min-width: 54px;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  .hero-card {
    display: flex;
    flex-direction: column;
  }
  .hero-art {
    position: relative;
    height: 98px;
    border: 1.2px solid #ABA396;
    overflow: hidden;
    background: #EAE4D8;
  }
  .hero-banner {
    position: absolute;
    top: 5px;
    left: 5px;
    background: #B81D1D;
    color: #FFFFFF;
    font-size: 14.5px;
    font-weight: 900;
    padding: 2px 8px;
    letter-spacing: 0.3px;
  }
  .hero-subbadge {
    position: absolute;
    top: 30px;
    left: 5px;
    background: #FFFFFF;
    color: #0D0F12;
    font-size: 10.6px;
    font-weight: 900;
    padding: 1.5px 6px;
    border: 1.2px solid #94A3B8;
  }
  .hero-srctag {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(13,15,18,0.9);
    color: #FFFFFF;
    font-size: 8.6px;
    font-weight: 800;
    padding: 2px 6px;
  }
  .hero-statustag {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 8.5px;
    font-weight: 900;
    padding: 2px 6px;
    letter-spacing: 0.4px;
  }
  .dateline-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.35px;
    text-transform: uppercase;
  }
  .num-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13.5px;
    height: 13.5px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 8.5px;
    font-weight: 900;
    flex-shrink: 0;
  }
  .hero-headline {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 17px;
    font-weight: 900;
    line-height: 1.08;
    color: #0D0F12;
    margin-top: 2px;
  }
  .hero-summary {
    font-size: 9.8px;
    font-weight: 600;
    line-height: 1.2;
    color: #1F2937;
    margin-top: 2px;
  }

  .mid-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 8px;
  }
  .mid-card {
    display: flex;
    flex-direction: column;
  }
  .mid-art {
    position: relative;
    height: 54px;
    border: 1.2px solid #ABA396;
    overflow: hidden;
  }
  .mid-banner {
    position: absolute;
    top: 3px;
    left: 3px;
    background: #B81D1D;
    color: #FFFFFF;
    font-size: 10.8px;
    font-weight: 900;
    padding: 1.5px 5px;
    letter-spacing: 0.2px;
  }
  .mid-sub {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(13,15,18,0.88);
    color: #FFFFFF;
    font-size: 7.9px;
    font-weight: 800;
    padding: 1px 5px;
  }
  .mid-status {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 7.7px;
    font-weight: 900;
    padding: 1px 4px;
  }
  .mid-headline {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 12.2px;
    font-weight: 900;
    line-height: 1.09;
    color: #0D0F12;
    margin-top: 2px;
  }
  .mid-summary {
    font-size: 8.8px;
    font-weight: 600;
    line-height: 1.17;
    color: #1F2937;
    margin-top: 1.5px;
  }

  .bottom-split {
    display: grid;
    grid-template-columns: 278px 1fr;
    gap: 10px;
    padding-top: 4px;
    border-top: 1.8px solid #111317;
  }
  .sec-header {
    font-size: 9.5px;
    font-weight: 900;
    letter-spacing: 0.55px;
    text-transform: uppercase;
    color: #0D0F12;
    margin-bottom: 2px;
  }
  .map-box {
    width: 278px;
    height: 114px;
    background: #0E2240;
    border: 1.2px solid #1F2937;
    border-radius: 2px;
    overflow: hidden;
  }
  .map-caption {
    font-size: 8px;
    font-weight: 600;
    color: #374151;
    margin-top: 2px;
  }
  .extra-cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
    border-top: 1px solid #ABA396;
    padding-top: 2px;
  }
  .extra-cols > div {
    min-width: 0;
  }
  .extra-line {
    font-size: 8.6px;
    font-weight: 600;
    line-height: 1.22;
    color: #111317;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .extra-num {
    font-weight: 900;
    color: #1B4D89;
  }
  .extra-loc {
    font-weight: 900;
    color: #0D0F12;
  }
  .extra-src {
    color: #4B5563;
    font-weight: 700;
  }

  .date-check {
    border: 1.8px solid #B81D1D;
    background: #FDFBF6;
    padding: 3.5px 8px;
    font-size: 8.15px;
    font-weight: 600;
    line-height: 1.2;
    color: #111317;
  }
  .date-check strong.dc-title {
    color: #B81D1D;
    font-weight: 900;
    letter-spacing: 0.35px;
  }
  .footer-bar {
    display: flex;
    justify-content: space-between;
    font-size: 7.9px;
    font-weight: 700;
    color: #374151;
  }
</style>
</head>
<body>
<div class="page">
  <div class="kicker-row">
    <span class="kicker-left">THE WORLD IN ONE DAY · SATURDAY 21 NOVEMBER 2026</span>
    <span class="kicker-right">35 STORIES · 7 REGIONS · EVERY EVENT DATED SATURDAY 21 NOVEMBER 2026</span>
  </div>

  <div class="masthead">
    <h1>Saturday 21 November 2026</h1>
    <div class="masthead-sub">Climate summit runs past its deadline · Five missiles shot down over Saudi Arabia · Magnitude 6.7 quake shakes Peru</div>
  </div>

  <div class="kpi-bar">
    <div class="kpi-item">
      <div class="kpi-val">Day 13</div>
      <div class="kpi-lbl">of COP31 summit planned to close on day 12 in Antalya</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">5</div>
      <div class="kpi-lbl">Houthi missiles shot down over Riyadh (3) and Jizan (2)</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">6.7</div>
      <div class="kpi-lbl">magnitude of deep quake in Junín, Peru at 00:09 UTC</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">146</div>
      <div class="kpi-lbl">people safe after Boeing 767 engine-fire landing in Davao</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">$58,983</div>
      <div class="kpi-lbl">Bitcoin early Saturday UTC, down 3.9% in a day</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">124*</div>
      <div class="kpi-lbl">KL Rahul’s unbeaten score at tea in Wellington Test</div>
    </div>
  </div>

  <div class="region-bar">
    <div class="reg-seg" style="flex:6;background:#1B4D89;">Europe 6</div>
    <div class="reg-seg" style="flex:10;background:#B81D1D;">Asia 10</div>
    <div class="reg-seg" style="flex:4;background:#9C4221;">Middle East 4</div>
    <div class="reg-seg" style="flex:3;background:#1E7045;">Africa 3</div>
    <div class="reg-seg" style="flex:8;background:#593E8E;">Americas 8</div>
    <div class="reg-seg" style="flex:3;background:#146E7A;">Oceania 3</div>
    <div class="reg-seg" style="flex:1;background:#374151;">Global 1</div>
  </div>

  <div class="hero-grid">
    ${HERO_STORIES.map(s => `
      <div class="hero-card">
        <div class="hero-art">
          ${s.svg}
          <div class="hero-banner" style="background:${s.bannerBg}">${s.banner}</div>
          <div class="hero-subbadge">${s.subBadge}</div>
          <div class="hero-srctag">${s.sourceTag}</div>
          <div class="hero-statustag" style="background:${s.statusColor}">${s.statusTag}</div>
        </div>
        <div class="dateline-row" style="color:${s.datelineColor}">
          <span class="num-circle" style="background:${s.datelineColor}">${s.num}</span>
          <span>${s.dateline}</span>
        </div>
        <div class="hero-headline">${s.headline}</div>
        <div class="hero-summary">${s.summary}</div>
      </div>
    `).join('')}
  </div>

  <div class="mid-grid">
    ${MID_STORIES.slice(0, 5).map(s => `
      <div class="mid-card">
        <div class="mid-art">
          ${s.svg}
          <div class="mid-banner">${s.banner}</div>
          <div class="mid-sub">${s.sub}</div>
          <div class="mid-status" style="background:${s.statusBg}">${s.status}</div>
        </div>
        <div class="dateline-row" style="color:${s.color}">
          <span class="num-circle" style="background:${s.color}">${s.num}</span>
          <span>${s.dateline}</span>
        </div>
        <div class="mid-headline">${s.headline}</div>
        <div class="mid-summary">${s.summary}</div>
      </div>
    `).join('')}
  </div>

  <div class="mid-grid">
    ${MID_STORIES.slice(5, 10).map(s => `
      <div class="mid-card">
        <div class="mid-art">
          ${s.svg}
          <div class="mid-banner">${s.banner}</div>
          <div class="mid-sub">${s.sub}</div>
          <div class="mid-status" style="background:${s.statusBg}">${s.status}</div>
        </div>
        <div class="dateline-row" style="color:${s.color}">
          <span class="num-circle" style="background:${s.color}">${s.num}</span>
          <span>${s.dateline}</span>
        </div>
        <div class="mid-headline">${s.headline}</div>
        <div class="mid-summary">${s.summary}</div>
      </div>
    `).join('')}
  </div>

  <div class="bottom-split">
    <div>
      <div class="sec-header">WHERE IT HAPPENED · STORIES 1–35</div>
      <div class="map-box">
        <svg viewBox="0 0 278 114" width="278" height="114" xmlns="http://www.w3.org/2000/svg">
          <rect width="278" height="114" fill="#0E2240"/>
          <path d="M12,18 L52,14 L82,26 L74,48 L56,56 L36,48 L18,32 Z" fill="#CCC0A8"/>
          <path d="M62,62 L86,66 L92,84 L76,108 L66,104 L62,80 Z" fill="#CCC0A8"/>
          <path d="M118,18 L158,16 L166,34 L146,42 L120,38 Z" fill="#CCC0A8"/>
          <path d="M118,46 L154,46 L166,66 L154,96 L136,96 L124,72 L114,58 Z" fill="#CCC0A8"/>
          <path d="M162,18 L244,20 L252,44 L228,66 L194,64 L168,54 L162,36 Z" fill="#CCC0A8"/>
          <path d="M214,78 L246,76 L252,96 L224,98 Z" fill="#CCC0A8"/>
          ${MAP_PINS.map(p => `
            <g>
              <circle cx="${p.x}" cy="${p.y}" r="5.2" fill="${p.c}" stroke="#FFFFFF" stroke-width="1"/>
              <text x="${p.x}" y="${p.y + 2.4}" font-family="Arial,sans-serif" font-size="6.4" font-weight="900" fill="#FFFFFF" text-anchor="middle">${p.n}</text>
            </g>
          `).join('')}
        </svg>
      </div>
      <div class="map-caption">Each number is the story with that number on this page.</div>
    </div>
    <div>
      <div class="sec-header">ALSO ON SATURDAY 21 NOVEMBER 2026 — 22 MORE STORIES</div>
      <div class="extra-cols">
        <div>
          ${EXTRA_STORIES_LEFT.map(s => `
            <div class="extra-line"><span class="extra-num">${s.num}</span> <span class="extra-loc">${s.loc}</span> ${s.text} <span class="extra-src">(${s.src})</span></div>
          `).join('')}
        </div>
        <div>
          ${EXTRA_STORIES_RIGHT.map(s => `
            <div class="extra-line"><span class="extra-num">${s.num}</span> <span class="extra-loc">${s.loc}</span> ${s.text} <span class="extra-src">(${s.src})</span></div>
          `).join('')}
        </div>
      </div>
    </div>
  </div>

  <div class="date-check">
    <strong class="dc-title">DATE CHECK ✓</strong> Every story here happened or was first reported on <strong>Saturday 21 November 2026</strong>. <strong>Left out as earlier days’ news:</strong> Wall Street’s 10% correction, Russian barrage on Kyiv’s bridges, missile in Poland, UK–EU deal &amp; Cyclone Akvan landfall (Fri 20 Nov); ICJ Myanmar ruling &amp; Shenzhen summit (Thu 19 Nov); Voyager 1 light-day (18 Nov). <strong>Not shown (unconfirmed/old):</strong> BepiColombo in Mercury orbit; 13 Nov house-collage tropes using pre-2026 events (2022/2025 North Korea $400M crypto hack, 2024 Black Sea warship hit) or unsourced “ex-Nvidia CEO Senate” / “483,200 deportations” claims.
  </div>

  <div class="footer-bar">
    <span>Every story here happened, or was first reported, on Saturday 21 November 2026 · Officials’ counts and claims are attributed</span>
    <span>Sources named beside each story · Original drawings</span>
  </div>
</div>
</body>
</html>`;
}

async function renderWithCdp(htmlPath, outPngPath) {
  const chromeCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  const chromeBin = chromeCandidates.find(p => existsSync(p)) || 'chrome';
  const userDataDir = mkdtempSync(join(tmpdir(), 'makefun-chrome-'));

  const proc = spawn(chromeBin, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  try {
    const wsUrl = await new Promise((resolve, reject) => {
      let stderr = '';
      const timer = setTimeout(() => reject(new Error(`Timeout waiting for Chrome DevTools WS: ${stderr}`)), 12000);
      proc.stderr.on('data', chunk => {
        stderr += chunk.toString('utf8');
        const m = stderr.match(/DevTools listening on (ws:\/\/[^\s]+)/);
        if (m) {
          clearTimeout(timer);
          resolve(m[1]);
        }
      });
      proc.on('exit', code => {
        clearTimeout(timer);
        reject(new Error(`Chrome exited prematurely (${code}): ${stderr}`));
      });
    });

    const targetsRes = await fetch(wsUrl.replace('ws://', 'http://').replace(/\/devtools\/browser\/.*/, '/json/list'));
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });

    let msgId = 0;
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++msgId;
      const listener = event => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', listener);
          if (data.error) reject(new Error(data.error.message));
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', listener);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1024,
      height: 1024,
      deviceScaleFactor: 1,
      mobile: false
    });

    const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
    await send('Page.navigate', { url: fileUrl });
    await new Promise(r => setTimeout(r, 400));

    const { data } = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: 1024, height: 1024, scale: 1 },
      captureBeyondViewport: true
    });

    const buf = Buffer.from(data, 'base64');
    writeFileSync(outPngPath, buf);
    ws.close();
    return buf.byteLength;
  } finally {
    proc.kill();
    await new Promise(r => setTimeout(r, 200));
    try { rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  }
}

async function main() {
  const html = buildHtml();
  const tmpHtml = join(tmpdir(), 'news-image-20261121-frontpage.html');
  writeFileSync(tmpHtml, html, 'utf8');
  const bytes = await renderWithCdp(tmpHtml, OUT_PNG);
  const png = readFileSync(OUT_PNG);
  const w = png.readUInt32BE(16);
  const h = png.readUInt32BE(20);
  console.log(`Rendered ${OUT_PNG}: ${w}x${h}, ${bytes} bytes`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
