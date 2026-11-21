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
    subBadge: 'No deal · day 13',
    sourceTag: 'Ongoing · AFP, Al Jazeera',
    dateline: 'ANTALYA, TÜRKIYE · CLIMATE',
    datelineColor: '#8B4513',
    headline: 'Climate summit runs into Saturday with no deal',
    summary: 'COP31 missed its Friday close. A draft with no mention of fossil fuels split nearly 200 countries; a third text is promised. (AFP, Al Jazeera)',
    svg: `<svg viewBox="0 0 320 116" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="116" fill="#DCEEE6"/>
      <circle cx="176" cy="72" r="30" fill="#1868A0" stroke="#0F3552" stroke-width="2.6"/>
      <path d="M162,52 C173,50 180,58 176,67 C171,74 180,82 175,92 C165,93 155,82 154,70 C153,61 157,54 162,52 Z" fill="#289855"/>
      <path d="M188,58 C195,60 201,69 197,79 C194,86 187,85 186,76 C185,67 185,60 188,58 Z" fill="#289855"/>
      <rect x="230" y="32" width="12" height="52" rx="6" fill="#FFFFFF" stroke="#111317" stroke-width="2.6"/>
      <rect x="233" y="48" width="6" height="34" fill="#D92020"/>
      <circle cx="236" cy="87" r="11" fill="#D92020" stroke="#111317" stroke-width="2.6"/>
      <circle cx="282" cy="70" r="24" fill="#FFFFFF" stroke="#111317" stroke-width="2.8"/>
      <line x1="282" y1="70" x2="282" y2="52" stroke="#111317" stroke-width="2.8" stroke-linecap="round"/>
      <line x1="282" y1="70" x2="296" y2="77" stroke="#111317" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="282" cy="70" r="2.5" fill="#111317"/>
    </svg>`
  },
  {
    num: 2,
    banner: 'SAUDI: MISSILES',
    subBadge: '5 shot down',
    sourceTag: 'Coalition’s count · AFP, Reuters',
    dateline: 'RIYADH · JIZAN · WAR',
    datelineColor: '#9C4221',
    headline: 'Five Houthi missiles shot down over Saudi Arabia',
    summary: 'The Saudi-led coalition said three were destroyed over Riyadh before dawn and two over Jizan, a day after it bombed Hodeidah port. (AFP, Reuters)',
    svg: `<svg viewBox="0 0 320 116" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="116" fill="#0B192E"/>
      <path d="M18,112 Q105,36 184,42" fill="none" stroke="#A0AEC0" stroke-width="1.8" stroke-dasharray="5,4"/>
      <path d="M52,112 Q155,28 242,32" fill="none" stroke="#A0AEC0" stroke-width="1.8" stroke-dasharray="5,4"/>
      <path d="M98,112 Q205,46 278,66" fill="none" stroke="#A0AEC0" stroke-width="1.8" stroke-dasharray="5,4"/>
      <g fill="#F6AD55" stroke="#DD6B20" stroke-width="1.2">
        <polygon points="184,26 188,36 198,36 190,42 193,52 184,46 175,52 178,42 170,36 180,36"/>
        <polygon points="242,16 246,26 256,26 248,32 251,42 242,36 233,42 236,32 228,26 238,26"/>
        <polygon points="278,52 282,62 292,62 284,68 287,78 278,72 269,78 272,68 264,62 274,62"/>
      </g>
      <rect x="138" y="88" width="22" height="28" fill="#1C3557"/>
      <rect x="168" y="80" width="26" height="36" fill="#1C3557"/>
      <rect x="202" y="92" width="24" height="24" fill="#1C3557"/>
      <rect x="234" y="84" width="22" height="32" fill="#1C3557"/>
    </svg>`
  },
  {
    num: 3,
    banner: 'PERU: QUAKE 6.7',
    subBadge: '00:09 UTC · 108 km deep',
    sourceTag: 'USGS · IGP',
    dateline: 'JUNÍN, PERU · EARTHQUAKE',
    datelineColor: '#5B3E90',
    headline: 'Magnitude 6.7 earthquake shakes central Peru',
    summary: 'The deep quake near Carhuamayo was felt in Lima and along the coast. Peru’s institute reported no deaths, damage or tsunami risk. (USGS, Gestión)',
    svg: `<svg viewBox="0 0 320 116" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="116" fill="#EDE4D5"/>
      <polygon points="0,98 62,56 112,86 168,38 225,88 265,64 320,98" fill="#C7A888" opacity="0.6"/>
      <line x1="0" y1="94" x2="320" y2="94" stroke="#6B2C18" stroke-width="2.4"/>
      <circle cx="176" cy="92" r="9" fill="none" stroke="#C52222" stroke-width="2.2"/>
      <circle cx="176" cy="92" r="19" fill="none" stroke="#C52222" stroke-width="1.6" stroke-dasharray="4,3"/>
      <polyline points="92,76 146,76 156,58 166,88 176,32 186,92 196,46 206,82 215,66 226,76 254,76" fill="none" stroke="#C52222" stroke-width="3.2" stroke-linejoin="round"/>
      <rect x="256" y="66" width="42" height="28" fill="#FFFFFF" stroke="#111317" stroke-width="2.2"/>
      <polygon points="252,66 277,50 302,66" fill="#B81D1D"/>
      <rect x="272" y="77" width="10" height="17" fill="#2D3748"/>
    </svg>`
  }
];

const MID_STORIES = [
  {
    num: 4,
    banner: 'KYIV: WARNING',
    sub: 'Interview · NBC',
    dateline: 'KYIV · WAR',
    color: '#1B4D89',
    headline: 'Zelensky: Crimea bridge “will not stay”',
    summary: 'He warns of more double-tap strikes after Kryvyi Rih hit.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="36" fill="#1D62AA"/>
      <rect y="36" width="185" height="30" fill="#ECC94B"/>
      <circle cx="146" cy="34" r="6" fill="#2D3748"/>
      <path d="M135,50 C135,43 157,43 157,50 Z" fill="#2D3748"/>
      <rect x="132" y="48" width="28" height="4" fill="#1A202C"/>
    </svg>`
  },
  {
    num: 5,
    banner: 'HORMUZ: DRONE',
    sub: 'Iran’s claim · IRIB',
    dateline: 'STRAIT OF HORMUZ · WAR',
    color: '#9C4221',
    headline: 'Iran says it shot down a US drone',
    summary: 'IRGC claims an MQ-9 shootdown; no confirmation from US.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="44" fill="#E4EDF8"/>
      <rect y="44" width="185" height="22" fill="#1B4D89"/>
      <line x1="62" y1="28" x2="136" y2="28" stroke="#1F2937" stroke-width="3.5"/>
      <polygon points="90,28 104,20 112,28" fill="#374151"/>
      <circle cx="103" cy="28" r="7" fill="#F97316"/>
      <polygon points="75,44 85,35 128,35 135,44" fill="#1F2937"/>
    </svg>`
  },
  {
    num: 6,
    banner: 'GENEVA: AI ARMS',
    sub: 'UN talks · Reuters',
    dateline: 'GENEVA · DIPLOMACY',
    color: '#1E7045',
    headline: 'UN “killer robots” talks end without a ban',
    summary: 'Envoys set a 2028 target for autonomous weapons rules.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="22" fill="#2F855A"/>
      <rect y="22" width="185" height="22" fill="#FFFFFF"/>
      <rect y="44" width="185" height="22" fill="#C53030"/>
      <circle cx="144" cy="34" r="6" fill="#2D3748"/>
      <path d="M133,49 C133,42 155,42 155,49 Z" fill="#2D3748"/>
    </svg>`
  },
  {
    num: 7,
    banner: 'TRUMP: AI TAX',
    sub: 'Briefing · ABC',
    dateline: 'WASHINGTON · TECHNOLOGY',
    color: '#5B3E90',
    headline: 'Trump vows tax on data centres abroad',
    summary: '“Tremendous” penalty threatened; Missouri $7.25B ruling.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="66" fill="#16253D"/>
      <rect x="122" y="18" width="36" height="34" rx="3" fill="#2B5486" stroke="#90CDF4" stroke-width="1.8"/>
      <text x="140" y="40" font-family="Arial,sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">AI</text>
    </svg>`
  },
  {
    num: 8,
    banner: 'CHINA–JAPAN',
    sub: 'Ministry · AFP',
    dateline: 'BEIJING · DIPLOMACY',
    color: '#B81D1D',
    headline: 'China tells Japan to “correct” Taiwan words',
    summary: 'Tokyo says its Taiwan stance remains unchanged.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="92" height="66" fill="#C52828"/>
      <rect x="92" width="93" height="66" fill="#F7FAFC"/>
      <circle cx="138" cy="33" r="12" fill="#C52828"/>
      <ellipse cx="92" cy="34" rx="14" ry="8" fill="#FFFFFF" stroke="#111317" stroke-width="2.2"/>
      <line x1="88" y1="30" x2="88" y2="38" stroke="#111317" stroke-width="2"/>
      <line x1="92" y1="30" x2="92" y2="38" stroke="#111317" stroke-width="2"/>
      <line x1="96" y1="30" x2="96" y2="38" stroke="#111317" stroke-width="2"/>
    </svg>`
  },
  {
    num: 9,
    banner: 'DAVAO: 146 SAFE',
    sub: 'Airline · AP',
    dateline: 'DAVAO · AVIATION',
    color: '#B81D1D',
    headline: 'Jet lands safely after engine fire alert',
    summary: 'Air Niugini 767 diverts after midnight; all 146 safe.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="52" fill="#D2EBF8"/>
      <rect y="52" width="185" height="14" fill="#64748B"/>
      <path d="M52,38 L142,33 L158,38 L142,42 L52,42 Z" fill="#FFFFFF" stroke="#111317" stroke-width="2"/>
      <polygon points="92,39 108,48 122,39" fill="#334155"/>
      <circle cx="110" cy="45" r="5.5" fill="#EF4444"/>
    </svg>`
  },
  {
    num: 10,
    banner: 'CANBERRA: AI',
    sub: 'Agreed · ABC',
    dateline: 'CANBERRA · DIPLOMACY',
    color: '#146E7A',
    headline: 'Australia and China agree to AI talks',
    summary: 'PM Albanese concludes an 11-day diplomatic trip.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="92" height="66" fill="#1B4D89"/>
      <rect x="92" width="93" height="66" fill="#C52828"/>
      <ellipse cx="92" cy="36" rx="14" ry="8" fill="#FFFFFF" stroke="#111317" stroke-width="2.2"/>
      <line x1="88" y1="32" x2="88" y2="40" stroke="#111317" stroke-width="2"/>
      <line x1="92" y1="32" x2="92" y2="40" stroke="#111317" stroke-width="2"/>
      <line x1="96" y1="32" x2="96" y2="40" stroke="#111317" stroke-width="2"/>
    </svg>`
  },
  {
    num: 11,
    banner: 'BITCOIN: $58,983',
    sub: 'CoinGecko · 02:08 UTC',
    dateline: 'WORLD · MARKETS',
    color: '#1F2937',
    headline: 'Bitcoin trades below $59,000 on Saturday',
    summary: 'Down 3.9% in 24 hours; Ether drops 6.1% to $1,625.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="66" fill="#101827"/>
      <line x1="12" y1="34" x2="173" y2="34" stroke="#64748B" stroke-width="1.2" stroke-dasharray="3,3"/>
      <polyline points="16,22 48,26 78,32 106,41 136,48 162,51" fill="none" stroke="#F87171" stroke-width="3.2"/>
      <text x="176" y="31" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#F87171" text-anchor="end">BTC -3.9%</text>
      <text x="176" y="43" font-family="Arial,sans-serif" font-size="9.5" font-weight="900" fill="#F87171" text-anchor="end">ETH -6.1%</text>
    </svg>`
  },
  {
    num: 12,
    banner: 'RUSSELL: P1',
    sub: 'Timing · Formula 1',
    dateline: 'LAS VEGAS · FORMULA ONE',
    color: '#5B3E90',
    headline: 'Russell fastest in final Las Vegas practice',
    summary: '1:34.041 in damp FP3; grid penalties shift pole.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="66" fill="#263040"/>
      <line x1="0" y1="48" x2="185" y2="30" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="6,4"/>
      <rect x="82" y="32" width="42" height="12" rx="3" fill="#2DD4BF"/>
      <circle cx="90" cy="45" r="5" fill="#0F172A" stroke="#E2E8F0" stroke-width="1.5"/>
      <circle cx="116" cy="45" r="5" fill="#0F172A" stroke="#E2E8F0" stroke-width="1.5"/>
      <rect x="152" y="10" width="16" height="12" fill="#FFFFFF"/>
      <rect x="152" y="10" width="8" height="6" fill="#111317"/>
      <rect x="160" y="16" width="8" height="6" fill="#111317"/>
    </svg>`
  },
  {
    num: 13,
    banner: 'RAHUL: 124*',
    sub: 'Tea, day 3 · AFP',
    dateline: 'WELLINGTON · CRICKET',
    color: '#146E7A',
    headline: 'Rahul hits a century against New Zealand',
    summary: 'India 344 for 2 at tea in Wellington, replying to 368.',
    svg: `<svg viewBox="0 0 185 66" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="185" height="66" fill="#3B8256"/>
      <line x1="120" y1="24" x2="120" y2="50" stroke="#FEF08A" stroke-width="2.6"/>
      <line x1="127" y1="24" x2="127" y2="50" stroke="#FEF08A" stroke-width="2.6"/>
      <line x1="134" y1="24" x2="134" y2="50" stroke="#FEF08A" stroke-width="2.6"/>
      <rect x="146" y="18" width="9" height="30" rx="2" transform="rotate(18 150 33)" fill="#EAB308" stroke="#713F12" stroke-width="1.4"/>
      <circle cx="96" cy="38" r="6" fill="#DC2626" stroke="#FFFFFF" stroke-width="1.3"/>
    </svg>`
  }
];

const EXTRA_STORIES_LEFT = [
  { num: 14, loc: 'Kryvyi Rih', text: 'Double strike kills 2 and injures 42', src: 'Kyiv Indep.' },
  { num: 15, loc: 'Copenhagen', text: 'Russian attaché expelled over a plot', src: 'Al Jazeera' },
  { num: 16, loc: 'Antalya', text: 'EU warns COP31 risks a “fossil summit”', src: 'AFP' },
  { num: 17, loc: 'Antalya', text: 'Panama threatens to block the climate text', src: 'Al Jazeera' },
  { num: 18, loc: 'Antalya', text: 'Indonesia’s PLN signs six clean-power deals', src: 'Antara' },
  { num: 19, loc: 'Yemen', text: 'Houthis threaten Jeddah and Red Sea ports', src: 'Al Jazeera' },
  { num: 20, loc: 'Bara & Gaza', text: 'Sudan army claims Bara; Israeli strikes kill 6', src: 'AP' },
  { num: 21, loc: 'Washington', text: 'Lawmaker threatens SpaceX’s funding', src: 'CNN' },
  { num: 22, loc: 'Texas', text: 'Execution of a man of 70 takes 63 minutes', src: 'ABC' },
  { num: 23, loc: 'Los Angeles', text: 'Jury convicts man of starting Palisades fire', src: 'ABC' },
  { num: 24, loc: 'Missouri', text: 'Judge approves $7.25bn Roundup settlement', src: 'AFP' }
];

const EXTRA_STORIES_RIGHT = [
  { num: 25, loc: 'Vancouver', text: 'Canada rests defence in youth climate trial', src: 'AFP' },
  { num: 26, loc: 'Pyongyang', text: 'Kim tours factories after no Trump meeting', src: 'AFP' },
  { num: 27, loc: 'Sejong', text: 'Freight train derails; no one hurt', src: 'Korea Herald' },
  { num: 28, loc: 'Taipei', text: 'Budget and a cash payout are passed', src: 'Taipei Times' },
  { num: 29, loc: 'Bangkok', text: 'Six-point plan on arsenic in two rivers', src: 'The Nation' },
  { num: 30, loc: 'New Delhi', text: 'Pakistani minister joins SCO forum in India', src: 'Dawn' },
  { num: 31, loc: 'Eastern India', text: 'Rain alerts as Akvan’s remnants move inland', src: 'ETV' },
  { num: 32, loc: 'Myanmar', text: 'Rights groups urge sanctions after court ruling', src: 'AP' },
  { num: 33, loc: 'Port Louis', text: 'African rating agency talks to 15 states', src: 'Al Jazeera' },
  { num: 34, loc: 'Melbourne', text: 'Cummins keeps the Australian captaincy', src: 'ABC' },
  { num: 35, loc: 'Las Vegas', text: 'Verstappen sent to stewards after contact', src: 'Autosport' }
];

const MAP_PINS = [
  { n: 1, x: 151, y: 41, c: '#B81D1D' },
  { n: 2, x: 163, y: 54, c: '#B81D1D' },
  { n: 3, x: 70, y: 82, c: '#593E8E' },
  { n: 4, x: 152, y: 29, c: '#1D4E89' },
  { n: 5, x: 173, y: 50, c: '#9C4221' },
  { n: 6, x: 132, y: 33, c: '#1D4E89' },
  { n: 7, x: 64, y: 39, c: '#593E8E' },
  { n: 8, x: 215, y: 39, c: '#B81D1D' },
  { n: 9, x: 226, y: 65, c: '#B81D1D' },
  { n: 10, x: 242, y: 92, c: '#146E7A' },
  { n: 11, x: 99, y: 36, c: '#2D3748' },
  { n: 12, x: 35, y: 40, c: '#593E8E' },
  { n: 13, x: 256, y: 101, c: '#146E7A' },
  { n: 14, x: 144, y: 28, c: '#1D4E89' },
  { n: 15, x: 134, y: 23, c: '#1D4E89' },
  { n: 16, x: 125, y: 34, c: '#1D4E89' },
  { n: 17, x: 67, y: 61, c: '#593E8E' },
  { n: 18, x: 211, y: 71, c: '#B81D1D' },
  { n: 19, x: 162, y: 63, c: '#9C4221' },
  { n: 20, x: 151, y: 61, c: '#1E7045' },
  { n: 21, x: 58, y: 43, c: '#593E8E' },
  { n: 22, x: 51, y: 48, c: '#593E8E' },
  { n: 23, x: 38, y: 49, c: '#593E8E' },
  { n: 24, x: 54, y: 36, c: '#593E8E' },
  { n: 25, x: 33, y: 30, c: '#593E8E' },
  { n: 26, x: 224, y: 33, c: '#B81D1D' },
  { n: 27, x: 229, y: 40, c: '#B81D1D' },
  { n: 28, x: 223, y: 50, c: '#B81D1D' },
  { n: 29, x: 204, y: 58, c: '#B81D1D' },
  { n: 30, x: 188, y: 49, c: '#B81D1D' },
  { n: 31, x: 195, y: 55, c: '#B81D1D' },
  { n: 32, x: 201, y: 51, c: '#B81D1D' },
  { n: 33, x: 164, y: 80, c: '#1E7045' },
  { n: 34, x: 234, y: 94, c: '#146E7A' },
  { n: 35, x: 44, y: 35, c: '#593E8E' }
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
    padding: 10px 14px 8px 14px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .kicker-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.8px;
    font-weight: 800;
    letter-spacing: 0.7px;
    text-transform: uppercase;
    padding-bottom: 3px;
    border-bottom: 2.2px solid #111317;
  }
  .kicker-left { color: #B81D1D; }
  .kicker-right { color: #1F2937; }

  .masthead {
    text-align: center;
    padding: 2px 0 4px 0;
    border-bottom: 1px solid #8C857B;
  }
  .masthead h1 {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-size: 58px;
    font-weight: 900;
    letter-spacing: -1.3px;
    line-height: 0.98;
    color: #111317;
  }
  .masthead-sub {
    font-family: Georgia, "Times New Roman", Times, serif;
    font-style: italic;
    font-size: 13.5px;
    color: #1F2937;
    margin-top: 4px;
  }

  .kpi-bar {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    padding: 4px 0;
  }
  .kpi-item {
    border-left: 3.2px solid #B81D1D;
    padding-left: 6px;
  }
  .kpi-val {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20px;
    font-weight: 900;
    line-height: 1.02;
    color: #111317;
  }
  .kpi-lbl {
    font-size: 8.8px;
    line-height: 1.15;
    color: #2D3748;
    margin-top: 1px;
  }

  .region-bar {
    display: flex;
    width: 100%;
    height: 16px;
    font-size: 9px;
    font-weight: 800;
    color: #FFFFFF;
    letter-spacing: 0.3px;
    overflow: hidden;
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
    height: 116px;
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
    font-size: 15.5px;
    font-weight: 900;
    padding: 2px 8px;
    letter-spacing: 0.3px;
  }
  .hero-subbadge {
    position: absolute;
    top: 33px;
    left: 6px;
    background: #FFFFFF;
    color: #111317;
    font-size: 11.2px;
    font-weight: 800;
    padding: 2px 7px;
  }
  .hero-srctag {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(17,19,23,0.9);
    color: #FFFFFF;
    font-size: 8.6px;
    font-weight: 700;
    padding: 2px 7px;
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
    font-size: 17.2px;
    font-weight: 900;
    line-height: 1.08;
    color: #111317;
    margin-top: 2px;
  }
  .hero-summary {
    font-size: 9.6px;
    line-height: 1.22;
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
    height: 66px;
    border: 1px solid #C8C1B4;
    overflow: hidden;
  }
  .mid-banner {
    position: absolute;
    top: 4px;
    left: 4px;
    background: #B81D1D;
    color: #FFFFFF;
    font-size: 12px;
    font-weight: 900;
    padding: 2px 6px;
    letter-spacing: 0.25px;
  }
  .mid-sub {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(17,19,23,0.9);
    color: #FFFFFF;
    font-size: 8px;
    font-weight: 700;
    padding: 1.5px 6px;
  }
  .mid-headline {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 13px;
    font-weight: 900;
    line-height: 1.1;
    color: #111317;
    margin-top: 2px;
  }
  .mid-summary {
    font-size: 9.2px;
    line-height: 1.18;
    color: #2D3748;
    margin-top: 2px;
  }

  .bottom-split {
    display: grid;
    grid-template-columns: 278px 1fr;
    gap: 10px;
    padding-top: 4px;
    border-top: 1.6px solid #111317;
  }
  .sec-header {
    font-size: 9.4px;
    font-weight: 900;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #111317;
    margin-bottom: 3px;
  }
  .map-box {
    width: 278px;
    height: 112px;
    background: #0F2342;
    border: 1px solid #1F2937;
    overflow: hidden;
  }
  .map-caption {
    font-size: 7.9px;
    color: #4A5568;
    margin-top: 2px;
  }
  .extra-cols {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 10px;
    border-top: 1px solid #C8C1B4;
    padding-top: 3px;
  }
  .extra-cols > div {
    min-width: 0;
  }
  .extra-line {
    font-size: 8.65px;
    line-height: 1.22;
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
    font-size: 8.35px;
    line-height: 1.22;
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
    <span class="kicker-left">THE WORLD IN ONE DAY</span>
    <span class="kicker-right">35 STORIES · 7 REGIONS · EVERY ONE DATED SATURDAY 21 NOVEMBER 2026</span>
  </div>

  <div class="masthead">
    <h1>Saturday 21 November 2026</h1>
    <div class="masthead-sub">Climate summit runs past its deadline · Five missiles shot down over Saudi Arabia · Strong quake shakes Peru</div>
  </div>

  <div class="kpi-bar">
    <div class="kpi-item">
      <div class="kpi-val">Day 13</div>
      <div class="kpi-lbl">of a COP31 summit planned to close on day 12</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">5</div>
      <div class="kpi-lbl">missiles shot down over Riyadh and Jizan</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">6.7</div>
      <div class="kpi-lbl">magnitude of the quake in Junín, Peru</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">146</div>
      <div class="kpi-lbl">people safe after a jet’s emergency landing</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">$58,983</div>
      <div class="kpi-lbl">bitcoin early Saturday, down 3.9% in a day</div>
    </div>
    <div class="kpi-item">
      <div class="kpi-val">124*</div>
      <div class="kpi-lbl">K L Rahul’s score at tea in Wellington</div>
    </div>
  </div>

  <div class="region-bar">
    <div class="reg-seg" style="flex:5;background:#1B4D89;">Europe 5</div>
    <div class="reg-seg" style="flex:10;background:#B81D1D;">Asia 10</div>
    <div class="reg-seg" style="flex:4;background:#9C4221;">Middle East 4</div>
    <div class="reg-seg" style="flex:2;background:#1E7045;">Africa 2</div>
    <div class="reg-seg" style="flex:9;background:#593E8E;">Americas 9</div>
    <div class="reg-seg" style="flex:3;background:#146E7A;">Oceania 3</div>
    <div class="reg-seg" style="flex:2;background:#4A5568;">Global 2</div>
  </div>

  <div class="hero-grid">
    ${HERO_STORIES.map(s => `
      <div class="hero-card">
        <div class="hero-art">
          ${s.svg}
          <div class="hero-banner">${s.banner}</div>
          <div class="hero-subbadge">${s.subBadge}</div>
          <div class="hero-srctag">${s.sourceTag}</div>
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
      <div class="sec-header">WHERE IT HAPPENED</div>
      <div class="map-box">
        <svg viewBox="0 0 278 112" width="278" height="112" xmlns="http://www.w3.org/2000/svg">
          <rect width="278" height="112" fill="#0F2342"/>
          <path d="M12,18 L52,14 L82,26 L74,48 L56,56 L36,48 L18,32 Z" fill="#CCC0A8"/>
          <path d="M62,62 L86,66 L92,84 L76,106 L66,102 L62,80 Z" fill="#CCC0A8"/>
          <path d="M118,18 L158,16 L166,34 L146,42 L120,38 Z" fill="#CCC0A8"/>
          <path d="M118,46 L154,46 L166,66 L154,96 L136,96 L124,72 L114,58 Z" fill="#CCC0A8"/>
          <path d="M162,18 L244,20 L252,44 L228,66 L194,64 L168,54 L162,36 Z" fill="#CCC0A8"/>
          <path d="M214,78 L246,76 L252,96 L224,98 Z" fill="#CCC0A8"/>
          ${MAP_PINS.map(p => `
            <g>
              <circle cx="${p.x}" cy="${p.y}" r="5.1" fill="${p.c}" stroke="#FFFFFF" stroke-width="1"/>
              <text x="${p.x}" y="${p.y + 2.4}" font-family="Arial,sans-serif" font-size="6.3" font-weight="900" fill="#FFFFFF" text-anchor="middle">${p.n}</text>
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
    <strong class="dc-title">DATE CHECK</strong> Left out as Friday 20 November’s news: Wall Street’s fall into a correction, the Russian barrage that hit Kyiv’s bridges, the missile that landed in Poland, the UK–EU deal and Cyclone Akvan’s landfall. Older still: ICJ Myanmar genocide ruling &amp; Shenzhen summit (19 Nov), Voyager 1’s light-day (18 Nov), and pre-2026 cyber/naval raids. Not confirmed when drawn, so not shown: BepiColombo in Mercury orbit, a final COP31 text.
  </div>

  <div class="footer-bar">
    <span>Every story here happened, or was first reported, on Saturday 21 November 2026. Officials’ counts and claims are attributed.</span>
    <span>Sources named beside each story · original drawings</span>
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
