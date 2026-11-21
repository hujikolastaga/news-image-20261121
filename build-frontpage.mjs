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
    sourceTag: 'Ongoing · AFP, Reuters',
    statusTag: 'OFFICIAL',
    statusColor: '#1B4D89',
    dateline: 'ANTALYA, TÜRKIYE · CLIMATE',
    datelineColor: '#8B4513',
    headline: 'COP31 climate summit runs into Saturday with no deal',
    summary: 'Talks missed Friday’s close after nearly 200 nations split over a draft omitting fossil-fuel phaseout and climate finance; a third text is promised. (AFP, The Guardian)',
    svg: `<svg viewBox="0 0 320 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="96" fill="#DCECE5"/>
      <circle cx="136" cy="56" r="25" fill="#1D6FA5" stroke="#0F3C5F" stroke-width="2"/>
      <path d="M125,40 C133,39 139,45 136,52 C132,57 139,64 135,72 C127,73 120,64 119,54 C118,47 121,42 125,40 Z" fill="#2E9E5B"/>
      <path d="M146,45 C151,47 156,54 153,62 C150,67 145,66 144,59 C143,52 143,47 146,45 Z" fill="#2E9E5B"/>
      <rect x="174" y="20" width="54" height="58" rx="3" fill="#FFFDF9" stroke="#2D3748" stroke-width="1.8"/>
      <text x="201" y="34" font-family="Arial,sans-serif" font-size="7.5" font-weight="800" fill="#B81D1D" text-anchor="middle">DRAFT TEXT 2</text>
      <line x1="181" y1="42" x2="221" y2="42" stroke="#A0AEC0" stroke-width="2"/>
      <line x1="181" y1="49" x2="217" y2="49" stroke="#A0AEC0" stroke-width="2"/>
      <text x="201" y="61" font-family="Arial,sans-serif" font-size="6.8" font-weight="800" fill="#B81D1D" text-anchor="middle">NO FOSSIL FUEL</text>
      <text x="201" y="70" font-family="Arial,sans-serif" font-size="6.8" font-weight="800" fill="#B81D1D" text-anchor="middle">PHASEOUT</text>
      <rect x="241" y="22" width="10" height="44" rx="5" fill="#FFFFFF" stroke="#1A202C" stroke-width="2"/>
      <rect x="243.5" y="36" width="5" height="28" fill="#D92626"/>
      <circle cx="246" cy="68" r="9" fill="#D92626" stroke="#1A202C" stroke-width="2"/>
      <circle cx="286" cy="54" r="21" fill="#FFFFFF" stroke="#1A202C" stroke-width="2.2"/>
      <line x1="286" y1="54" x2="286" y2="39" stroke="#1A202C" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="286" y1="54" x2="298" y2="60" stroke="#B81D1D" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="286" cy="54" r="2" fill="#1A202C"/>
    </svg>`
  },
  {
    num: 2,
    banner: 'SAUDI: 5 MISSILES',
    bannerBg: '#B81D1D',
    subBadge: '3 Riyadh · 2 Jizan',
    sourceTag: 'Coalition · Reuters, AFP',
    statusTag: 'REPORTED',
    statusColor: '#9C4221',
    dateline: 'RIYADH & JIZAN · MIDDLE EAST WAR',
    datelineColor: '#9C4221',
    headline: 'Five Houthi missiles shot down over Saudi Arabia',
    summary: 'Saudi-led coalition air defenses intercepted three ballistic missiles over Riyadh before dawn Saturday and two over Jizan after bombing Hodeidah port; no casualties. (Reuters, AFP)',
    svg: `<svg viewBox="0 0 320 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="96" fill="#0E1C36"/>
      <circle cx="290" cy="20" r="9" fill="#F6E05E" opacity="0.85"/>
      <path d="M18,92 Q95,28 168,36" fill="none" stroke="#F6AD55" stroke-width="2" stroke-dasharray="4,3"/>
      <path d="M40,92 Q130,22 212,28" fill="none" stroke="#F6AD55" stroke-width="2" stroke-dasharray="4,3"/>
      <path d="M72,92 Q175,35 256,42" fill="none" stroke="#F6AD55" stroke-width="2" stroke-dasharray="4,3"/>
      <path d="M295,88 Q230,45 168,36" fill="none" stroke="#63B3ED" stroke-width="1.8" stroke-dasharray="3,2"/>
      <path d="M302,88 Q255,40 212,28" fill="none" stroke="#63B3ED" stroke-width="1.8" stroke-dasharray="3,2"/>
      <g fill="#F6AD55" stroke="#DD6B20" stroke-width="1">
        <polygon points="168,26 171,33 178,33 172,37 175,44 168,40 161,44 164,37 158,33 165,33"/>
        <polygon points="212,18 215,25 222,25 216,29 219,36 212,32 205,36 208,29 202,25 209,25"/>
        <polygon points="256,32 259,39 266,39 260,43 263,50 256,46 249,50 252,43 246,39 253,39"/>
        <circle cx="128" cy="48" r="5" fill="#FBD38D"/>
        <circle cx="190" cy="52" r="4.5" fill="#FBD38D"/>
      </g>
      <rect x="135" y="70" width="18" height="26" fill="#1A365D"/>
      <polygon points="135,70 144,56 153,70" fill="#2A4365"/>
      <rect x="160" y="64" width="22" height="32" fill="#1A365D"/>
      <path d="M164,64 L164,52 L177,52 L177,64 M168,52 A5,5 0 0,0 173,52" fill="#2C5282"/>
      <rect x="190" y="74" width="24" height="22" fill="#1A365D"/>
      <rect x="222" y="68" width="18" height="28" fill="#1A365D"/>
      <g fill="#F6E05E">
        <rect x="165" y="70" width="3" height="3"/><rect x="173" y="70" width="3" height="3"/>
        <rect x="165" y="77" width="3" height="3"/><rect x="173" y="77" width="3" height="3"/>
        <rect x="226" y="74" width="3" height="3"/><rect x="232" y="80" width="3" height="3"/>
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
    dateline: 'JUNÍN & LIMA, PERU · EARTHQUAKE',
    datelineColor: '#5B3E90',
    headline: 'Magnitude 6.7 earthquake shakes central Peru',
    summary: 'The deep Andean quake near Carhuamayo (00:09 UTC Saturday) rattled Lima and prompted Congress evacuation; Peru’s institute reported no deaths or tsunami risk. (USGS, AP)',
    svg: `<svg viewBox="0 0 320 96" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="96" fill="#EFE6D8"/>
      <polygon points="0,84 55,44 98,74 148,32 204,76 245,56 320,84" fill="#C4A484" opacity="0.65"/>
      <line x1="0" y1="80" x2="320" y2="80" stroke="#7B341E" stroke-width="2"/>
      <circle cx="148" cy="78" r="7" fill="none" stroke="#C53030" stroke-width="2"/>
      <circle cx="148" cy="78" r="15" fill="none" stroke="#C53030" stroke-width="1.5" stroke-dasharray="3,2"/>
      <circle cx="148" cy="78" r="24" fill="none" stroke="#C53030" stroke-width="1.2" stroke-dasharray="2,2"/>
      <polyline points="85,62 122,62 132,48 140,74 148,26 156,78 164,38 172,68 180,55 190,62 232,62" fill="none" stroke="#C53030" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="252" y="54" width="38" height="26" fill="#FFFFFF" stroke="#2D3748" stroke-width="1.8"/>
      <polygon points="248,54 271,40 294,54" fill="#B81D1D"/>
      <rect x="266" y="64" width="10" height="16" fill="#4A5568"/>
      <line x1="244" y1="48" x2="240" y2="42" stroke="#C53030" stroke-width="1.8"/>
      <line x1="298" y1="48" x2="302" y2="42" stroke="#C53030" stroke-width="1.8"/>
    </svg>`
  }
];

const MID_STORIES = [
  {
    num: 4,
    banner: 'KYIV: STRIKES',
    sub: 'Interview · NBC, KI',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'KYIV & KRYVYI RIH · WAR',
    color: '#1B4D89',
    headline: 'Russia hits Kyiv; Zelensky warns on Crimea bridge',
    summary: 'Dawn strike hits Kyiv’s Podil (Kryvyi Rih: 2 dead, 42 hurt); Zelensky says Crimea bridge “will not stay”.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="32" fill="#1D5FA7"/>
      <rect y="32" width="185" height="24" fill="#ECC94B"/>
      <path d="M12,48 L52,48 L64,38 L108,38 L120,48 L175,48" fill="none" stroke="#1A202C" stroke-width="2.2"/>
      <path d="M68,38 Q86,20 104,38" fill="none" stroke="#1A202C" stroke-width="2"/>
      <circle cx="142" cy="24" r="6" fill="#E53E3E"/>
      <polygon points="142,13 144,21 152,21 145,25 148,33 142,28 136,33 139,25 132,21 140,21" fill="#F6AD55"/>
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
    headline: 'UN “killer robots” talks end without binding ban',
    summary: 'Countries failed to agree a treaty ban early Saturday, setting a 2028 target for autonomous weapons rules.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="56" fill="#E2E8F0"/>
      <rect x="66" y="24" width="26" height="20" rx="4" fill="#4A5568" stroke="#1A202C" stroke-width="1.5"/>
      <circle cx="74" cy="33" r="2.8" fill="#E53E3E"/>
      <circle cx="84" cy="33" r="2.8" fill="#E53E3E"/>
      <line x1="79" y1="18" x2="79" y2="24" stroke="#1A202C" stroke-width="2"/>
      <rect x="102" y="20" width="74" height="22" rx="3" fill="#FFFFFF" stroke="#2B6CB0" stroke-width="1.8"/>
      <text x="139" y="34" font-family="Arial,sans-serif" font-size="8.2" font-weight="800" fill="#1E4E8C" text-anchor="middle">RULES BY 2028</text>
    </svg>`
  },
  {
    num: 6,
    banner: 'DAVAO: 146 SAFE',
    sub: 'Airline · AP, CAAP',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'DAVAO · AVIATION',
    color: '#B81D1D',
    headline: 'Jet lands safely after engine-fire alert',
    summary: 'Air Niugini Boeing 767 diverted after midnight Saturday; all 146 passengers and crew safe.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="44" fill="#D5ECF8"/>
      <rect y="44" width="185" height="12" fill="#718096"/>
      <path d="M35,34 L125,30 L142,34 L125,38 L35,38 Z" fill="#FFFFFF" stroke="#1A202C" stroke-width="1.5"/>
      <polygon points="40,34 26,20 48,34" fill="#C53030"/>
      <polygon points="75,35 92,43 105,35" fill="#4A5568"/>
      <circle cx="94" cy="40" r="5" fill="#F56565"/>
      <circle cx="91" cy="40" r="2.5" fill="#F6E05E"/>
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
    headline: 'Iran says it downed US drone; uranium stays',
    summary: 'IRGC claimed an MQ-9 shootdown (unconfirmed by US); FM Araqchi said uranium stock stays in Iran.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="38" fill="#E6EEF8"/>
      <rect y="38" width="185" height="18" fill="#1E4E8C"/>
      <line x1="55" y1="22" x2="125" y2="22" stroke="#2D3748" stroke-width="3"/>
      <polygon points="82,22 95,15 102,22" fill="#4A5568"/>
      <circle cx="94" cy="22" r="6" fill="#ED8936" opacity="0.9"/>
      <polygon points="118,38 126,30 156,30 162,38" fill="#2D3748"/>
    </svg>`
  },
  {
    num: 8,
    banner: 'SUDAN & GAZA',
    sub: 'Army claim · AP',
    status: 'REPORTED',
    statusBg: '#2F855A',
    dateline: 'BARA, SUDAN & GAZA · WAR',
    color: '#2F855A',
    headline: 'Sudan army claims Bara; Gaza strikes kill six',
    summary: 'Sudan’s army claimed it retook Bara (CLAIM); Israeli strikes in Gaza killed six including a cameraman (AP).',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="56" fill="#F2E4C9"/>
      <line x1="0" y1="42" x2="185" y2="42" stroke="#8C6D46" stroke-width="2"/>
      <rect x="40" y="30" width="34" height="12" rx="2" fill="#4A5D23"/>
      <circle cx="48" cy="43" r="4" fill="#1A202C"/>
      <circle cx="66" cy="43" r="4" fill="#1A202C"/>
      <rect x="115" y="18" width="54" height="22" rx="3" fill="#FFF5F5" stroke="#C53030" stroke-width="1.5"/>
      <text x="142" y="32" font-family="Arial,sans-serif" font-size="8" font-weight="800" fill="#C53030" text-anchor="middle">BARA / GAZA</text>
    </svg>`
  },
  {
    num: 9,
    banner: 'CHINA–JAPAN–AI',
    sub: 'Ministry · AFP, ABC',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'BEIJING & CANBERRA · ASIA',
    color: '#B81D1D',
    headline: 'China warns Japan on Taiwan; Australia AI pact',
    summary: 'Beijing told Tokyo to “correct” Taiwan words as Australia and China agreed to bilateral AI safety talks.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="105" height="56" fill="#C53030"/>
      <rect x="105" width="80" height="56" fill="#EDF2F7"/>
      <circle cx="152" cy="28" r="11" fill="#C53030"/>
      <circle cx="105" cy="34" r="12" fill="#FFFFFF" stroke="#1A202C" stroke-width="2"/>
      <text x="105" y="38" font-family="Arial,sans-serif" font-size="8.5" font-weight="800" fill="#1A202C" text-anchor="middle">AI</text>
    </svg>`
  },
  {
    num: 10,
    banner: 'TRUMP: AI TAX',
    sub: 'Briefing · ABC, AFP',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'WASHINGTON · TECH & LAW',
    color: '#5B3E90',
    headline: 'Trump vows tax on foreign AI data centres',
    summary: 'Warned of “tremendous” penalties on offshore AI hubs as Missouri judge approved $7.25bn Roundup deal.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="56" fill="#1A2A44"/>
      <rect x="108" y="12" width="38" height="34" rx="3" fill="#2C5282" stroke="#90CDF4" stroke-width="1.5"/>
      <text x="127" y="34" font-family="Arial,sans-serif" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">AI %</text>
      <line x1="22" y1="44" x2="96" y2="44" stroke="#CBD5E0" stroke-width="2"/>
    </svg>`
  },
  {
    num: 11,
    banner: 'BITCOIN: $58,983',
    sub: 'CoinGecko · 02:08 UTC',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'GLOBAL · MARKETS',
    color: '#2D3748',
    headline: 'Bitcoin drops below $59,000 on Saturday',
    summary: 'Down 3.9% in 24h to $58,983 (near two-year low); Ether fell 6.1% to $1,625 in early UTC trading.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="56" fill="#131C2E"/>
      <line x1="12" y1="30" x2="173" y2="30" stroke="#718096" stroke-width="1" stroke-dasharray="3,2"/>
      <polyline points="16,18 44,22 72,27 98,35 126,42 152,45" fill="none" stroke="#F56565" stroke-width="2.6"/>
      <text x="175" y="26" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="#F56565" text-anchor="end">BTC -3.9%</text>
      <text x="175" y="38" font-family="Arial,sans-serif" font-size="8" font-weight="700" fill="#F56565" text-anchor="end">ETH -6.1%</text>
    </svg>`
  },
  {
    num: 12,
    banner: 'VEGAS GP: 1:34.0',
    sub: 'FIA · Formula 1',
    status: 'OFFICIAL',
    statusBg: '#1B4D89',
    dateline: 'LAS VEGAS · FORMULA ONE',
    color: '#5B3E90',
    headline: 'Russell tops Vegas FP3; penalties shift pole',
    summary: 'Russell clocked 1:34.041 in damp practice; Verstappen inherits pole after Antonelli grid penalty.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="56" fill="#2D3748"/>
      <line x1="0" y1="42" x2="185" y2="26" stroke="#A0AEC0" stroke-width="1.5" stroke-dasharray="5,4"/>
      <rect x="78" y="28" width="38" height="10" rx="3" fill="#38B2AC"/>
      <circle cx="86" cy="39" r="4.5" fill="#1A202C" stroke="#E2E8F0" stroke-width="1.2"/>
      <circle cx="108" cy="39" r="4.5" fill="#1A202C" stroke="#E2E8F0" stroke-width="1.2"/>
      <rect x="148" y="8" width="16" height="12" fill="#FFFFFF"/>
      <rect x="148" y="8" width="8" height="6" fill="#1A202C"/>
      <rect x="156" y="14" width="8" height="6" fill="#1A202C"/>
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
    headline: 'KL Rahul hits century against New Zealand',
    summary: 'Unbeaten 124* lifted India to 344/2 at tea on Day 3 in Wellington (486/4 stumps), replying to 368.',
    svg: `<svg viewBox="0 0 185 56" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="56" fill="#52946B"/>
      <line x1="120" y1="22" x2="120" y2="46" stroke="#F6E05E" stroke-width="2.2"/>
      <line x1="126" y1="22" x2="126" y2="46" stroke="#F6E05E" stroke-width="2.2"/>
      <line x1="132" y1="22" x2="132" y2="46" stroke="#F6E05E" stroke-width="2.2"/>
      <rect x="144" y="16" width="8" height="28" rx="2" transform="rotate(18 148 30)" fill="#D69E2E" stroke="#744210" stroke-width="1.2"/>
      <circle cx="96" cy="34" r="5" fill="#C53030" stroke="#FFFFFF" stroke-width="1"/>
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
  { num: 30, loc: 'Port Louis & Nairobi', text: 'African rating agency talks to 15 states; Kenya teacher payroll', src: 'Al Jazeera' },
  { num: 31, loc: 'Los Angeles & Texas', text: 'Jury convicts Palisades fire arsonist; Texas execution 63 min', src: 'ABC' },
  { num: 32, loc: 'Ottawa & Vancouver', text: 'Memo warns AI hubs raise power bills; youth climate trial', src: 'AFP' },
  { num: 33, loc: 'Haiti & Mexico', text: 'El Salvador to build 3 Haiti prisons; migrant caravan in Mexico', src: 'Reuters' },
  { num: 34, loc: 'Melbourne', text: 'Pat Cummins keeps Australian Test captaincy; T20 win vs England', src: 'ABC' },
  { num: 35, loc: 'Mercury Orbit', text: 'ESA–JAXA BepiColombo fires thrusters at 19:24 CET at Mercury', src: 'ESA' }
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
  { n: 35, x: 263, y: 14, c: '#4A5568' }
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
    color: #16181C;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 1024px;
    height: 1024px;
    padding: 10px 14px 8px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .kicker-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    font-weight: 800;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    padding-bottom: 3px;
    border-bottom: 2.2px solid #16181C;
  }
  .kicker-left { color: #B81D1D; }
  .kicker-right { color: #2D3748; }

  .masthead {
    text-align: center;
    padding: 2px 0 3px 0;
    border-bottom: 1px solid #8C857B;
  }
  .masthead h1 {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 56px;
    font-weight: 900;
    letter-spacing: -1.2px;
    line-height: 1.0;
    color: #111317;
  }
  .masthead-sub {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-style: italic;
    font-size: 13px;
    color: #2D3748;
    margin-top: 3px;
  }

  .kpi-bar {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    padding: 5px 0;
  }
  .kpi-item {
    border-left: 3px solid #B81D1D;
    padding-left: 6px;
  }
  .kpi-val {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 19px;
    font-weight: 800;
    line-height: 1.05;
    color: #111317;
  }
  .kpi-lbl {
    font-size: 8.6px;
    line-height: 1.18;
    color: #374151;
    margin-top: 1px;
  }

  .region-bar {
    display: flex;
    width: 100%;
    height: 15px;
    font-size: 8.8px;
    font-weight: 800;
    color: #FFFFFF;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    overflow: hidden;
    border-radius: 2px;
  }
  .reg-seg {
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
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
    border: 1px solid #C8C1B4;
    overflow: hidden;
    background: #EAE4D8;
  }
  .hero-banner {
    position: absolute;
    top: 6px;
    left: 6px;
    background: #B81D1D;
    color: #FFFFFF;
    font-size: 13.5px;
    font-weight: 900;
    padding: 2px 7px;
    letter-spacing: 0.3px;
  }
  .hero-subbadge {
    position: absolute;
    top: 30px;
    left: 6px;
    background: rgba(255,255,255,0.95);
    color: #111317;
    font-size: 10px;
    font-weight: 800;
    padding: 1.5px 6px;
    border: 1px solid #CBD5E0;
  }
  .hero-srctag {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(17,19,23,0.86);
    color: #F7FAFC;
    font-size: 8.4px;
    font-weight: 700;
    padding: 2px 6px;
  }
  .hero-statustag {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 8.2px;
    font-weight: 800;
    padding: 2px 6px;
    letter-spacing: 0.4px;
  }
  .dateline-row {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    font-size: 8.8px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }
  .num-circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    color: #FFFFFF;
    font-size: 8.2px;
    font-weight: 900;
    flex-shrink: 0;
  }
  .hero-headline {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 15.8px;
    font-weight: 800;
    line-height: 1.12;
    color: #111317;
    margin-top: 2px;
  }
  .hero-summary {
    font-size: 9.4px;
    line-height: 1.24;
    color: #2D3748;
    margin-top: 3px;
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
    border: 1px solid #C8C1B4;
    overflow: hidden;
  }
  .mid-banner {
    position: absolute;
    top: 4px;
    left: 4px;
    background: #B81D1D;
    color: #FFFFFF;
    font-size: 10.2px;
    font-weight: 900;
    padding: 1.5px 5px;
    letter-spacing: 0.2px;
  }
  .mid-sub {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(17,19,23,0.84);
    color: #FFFFFF;
    font-size: 7.6px;
    font-weight: 700;
    padding: 1px 5px;
  }
  .mid-status {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #FFFFFF;
    font-size: 7.4px;
    font-weight: 800;
    padding: 1px 4px;
  }
  .mid-headline {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 11.4px;
    font-weight: 800;
    line-height: 1.13;
    color: #111317;
    margin-top: 2px;
  }
  .mid-summary {
    font-size: 8.5px;
    line-height: 1.2;
    color: #374151;
    margin-top: 2px;
  }

  .bottom-split {
    display: grid;
    grid-template-columns: 278px 1fr;
    gap: 10px;
    padding-top: 4px;
    border-top: 1.5px solid #16181C;
  }
  .sec-header {
    font-size: 9.2px;
    font-weight: 900;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #111317;
    margin-bottom: 3px;
  }
  .map-box {
    width: 278px;
    height: 116px;
    background: #0F2342;
    border: 1px solid #2D3748;
    border-radius: 2px;
    overflow: hidden;
  }
  .map-caption {
    font-size: 7.8px;
    color: #4A5568;
    margin-top: 2px;
  }
  .extra-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    border-top: 1px solid #C8C1B4;
    padding-top: 3px;
  }
  .extra-line {
    font-size: 8.35px;
    line-height: 1.24;
    color: #1F2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .extra-num {
    font-weight: 900;
    color: #1B4D89;
  }
  .extra-loc {
    font-weight: 800;
    color: #111317;
  }
  .extra-src {
    color: #6B7280;
  }

  .date-check {
    border: 1.5px solid #B81D1D;
    background: #FCF9F2;
    padding: 4px 8px;
    font-size: 8.2px;
    line-height: 1.24;
    color: #1F2937;
  }
  .date-check strong.dc-title {
    color: #B81D1D;
    font-weight: 900;
    letter-spacing: 0.4px;
  }
  .footer-bar {
    display: flex;
    justify-content: space-between;
    font-size: 7.8px;
    color: #4B5563;
  }
</style>
</head>
<body>
<div class="page">
  <div class="kicker-row">
    <span class="kicker-left">THE WORLD IN ONE DAY · SATURDAY EDITION</span>
    <span class="kicker-right">35 STORIES · 7 REGIONS · EVERY EVENT DATED SATURDAY 21 NOVEMBER 2026</span>
  </div>

  <div class="masthead">
    <h1>Saturday 21 November 2026</h1>
    <div class="masthead-sub">Climate summit runs past its deadline · Five missiles shot down over Saudi Arabia · Magnitude 6.7 quake shakes Peru</div>
  </div>

  <div class="kpi-bar">
    <div class="kpi-item">
      <div class="kpi-val">Day 13</div>
      <div class="kpi-lbl">of COP31 in Antalya, past Friday’s close with no deal</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">5</div>
      <div class="kpi-lbl">Houthi missiles downed over Riyadh (3) and Jizan (2)</div>
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
      <div class="kpi-lbl">Bitcoin early Saturday UTC, down 3.9% below $59,000</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">124*</div>
      <div class="kpi-lbl">KL Rahul’s unbeaten Test score at tea in Wellington</div>
    </div>
  </div>

  <div class="region-bar">
    <div class="reg-seg" style="flex:6;background:#1B4D89;">Europe 6</div>
    <div class="reg-seg" style="flex:10;background:#B81D1D;">Asia 10</div>
    <div class="reg-seg" style="flex:4;background:#9C4221;">Middle East 4</div>
    <div class="reg-seg" style="flex:3;background:#1E7045;">Africa 3</div>
    <div class="reg-seg" style="flex:7;background:#593E8E;">Americas 7</div>
    <div class="reg-seg" style="flex:3;background:#146E7A;">Oceania 3</div>
    <div class="reg-seg" style="flex:2;background:#4A5568;">Global 2</div>
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
        <svg viewBox="0 0 278 116" width="278" height="116" xmlns="http://www.w3.org/2000/svg">
          <rect width="278" height="116" fill="#0F2342"/>
          <!-- North America -->
          <path d="M12,18 L52,14 L82,26 L74,48 L56,56 L36,48 L18,32 Z" fill="#C8B99E"/>
          <!-- South America -->
          <path d="M62,62 L86,66 L92,84 L76,108 L66,104 L62,80 Z" fill="#C8B99E"/>
          <!-- Europe -->
          <path d="M118,18 L158,16 L166,34 L146,42 L120,38 Z" fill="#C8B99E"/>
          <!-- Africa -->
          <path d="M118,46 L154,46 L166,66 L154,96 L136,96 L124,72 L114,58 Z" fill="#C8B99E"/>
          <!-- Asia -->
          <path d="M162,18 L244,20 L252,44 L228,66 L194,64 L168,54 L162,36 Z" fill="#C8B99E"/>
          <!-- Oceania -->
          <path d="M214,78 L246,76 L252,96 L224,98 Z" fill="#C8B99E"/>
          ${MAP_PINS.map(p => `
            <g>
              <circle cx="${p.x}" cy="${p.y}" r="5.3" fill="${p.c}" stroke="#FFFFFF" stroke-width="1"/>
              <text x="${p.x}" y="${p.y + 2.5}" font-family="Arial,sans-serif" font-size="6.4" font-weight="900" fill="#FFFFFF" text-anchor="middle">${p.n}</text>
            </g>
          `).join('')}
        </svg>
      </div>
      <div class="map-caption">Each numbered pin marks that story’s location on Saturday 21 Nov 2026.</div>
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
    <strong class="dc-title">DATE CHECK ✓</strong> Every story above happened, or was first reported, on <strong>Saturday 21 November 2026</strong> in at least one time zone. <strong>Left out as Friday 20 November’s news:</strong> Wall Street’s 10% correction, the Russian barrage on Kyiv’s bridges, the missile that landed in Poland, the UK–EU reset deal, and Cyclone Akvan’s landfall. <strong>Older still:</strong> ICJ Myanmar Rohingya genocide ruling &amp; Shenzhen summit (19 Nov), Voyager 1’s light-day (18 Nov). Single-party reports are tagged <strong>CLAIM</strong>.
  </div>

  <div class="footer-bar">
    <span>Every story happened or was first reported on Saturday 21 November 2026 · Officials’ counts and claims attributed</span>
    <span>Sources named beside each story (Reuters, AFP, AP, USGS, Al Jazeera, Kyiv Post, FIA, UN, ESA) · Original code drawings</span>
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
