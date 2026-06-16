// ════════════════════════════════════════════════════════════
// APEX CUSTOMS — Vehicle definitions
// Top-down SVG outlines + hotspot zone positions per body type.
// Coordinates are % of the car canvas (viewBox 700 x 467).
// ════════════════════════════════════════════════════════════

// Top-down vehicle outlines (drawn into #carSvg, viewBox 0 0 700 467)
export const vehicleSVGs = {
  sedan: `<g fill="none" stroke="rgba(0,195,255,0.3)" stroke-width="1.5">
    <rect x="220" y="40" width="260" height="387" rx="80" ry="60" fill="rgba(0,195,255,0.03)"/>
    <rect x="250" y="100" width="200" height="100" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <rect x="250" y="230" width="200" height="100" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <line x1="245" y1="90" x2="245" y2="200" stroke="rgba(0,195,255,0.1)"/>
    <line x1="455" y1="90" x2="455" y2="200" stroke="rgba(0,195,255,0.1)"/>
    <ellipse cx="230" cy="110" rx="18" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="470" cy="110" rx="18" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="230" cy="320" rx="18" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="470" cy="320" rx="18" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <rect x="310" y="55" width="80" height="3" rx="1" fill="rgba(0,195,255,0.3)"/>
    <rect x="310" y="410" width="80" height="3" rx="1" fill="rgba(255,50,50,0.3)"/>
    <circle cx="280" cy="70" r="8" fill="rgba(0,195,255,0.06)" stroke="rgba(0,195,255,0.2)"/>
    <circle cx="420" cy="70" r="8" fill="rgba(0,195,255,0.06)" stroke="rgba(0,195,255,0.2)"/>
    <circle cx="280" cy="400" r="6" fill="rgba(255,50,50,0.06)" stroke="rgba(255,50,50,0.2)"/>
    <circle cx="420" cy="400" r="6" fill="rgba(255,50,50,0.06)" stroke="rgba(255,50,50,0.2)"/>
  </g>`,
  hatchback: `<g fill="none" stroke="rgba(0,195,255,0.3)" stroke-width="1.5">
    <rect x="230" y="60" width="240" height="340" rx="70" ry="55" fill="rgba(0,195,255,0.03)"/>
    <rect x="258" y="115" width="184" height="90" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <rect x="258" y="230" width="184" height="80" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <ellipse cx="240" cy="130" rx="16" ry="30" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="460" cy="130" rx="16" ry="30" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="240" cy="300" rx="16" ry="30" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="460" cy="300" rx="16" ry="30" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <rect x="315" y="72" width="70" height="3" rx="1" fill="rgba(0,195,255,0.3)"/>
    <rect x="305" y="378" width="90" height="3" rx="1" fill="rgba(255,50,50,0.3)"/>
  </g>`,
  suv: `<g fill="none" stroke="rgba(0,195,255,0.3)" stroke-width="1.5">
    <rect x="210" y="35" width="280" height="397" rx="70" ry="55" fill="rgba(0,195,255,0.03)"/>
    <rect x="242" y="95" width="216" height="110" rx="12" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <rect x="242" y="235" width="216" height="100" rx="12" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <ellipse cx="222" cy="115" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="478" cy="115" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="222" cy="325" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="478" cy="325" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <rect x="305" y="48" width="90" height="4" rx="2" fill="rgba(0,195,255,0.3)"/>
    <rect x="305" y="414" width="90" height="4" rx="2" fill="rgba(255,50,50,0.3)"/>
  </g>`,
  doublecab: `<g fill="none" stroke="rgba(0,195,255,0.3)" stroke-width="1.5">
    <path d="M240,55 Q240,35 280,35 L420,35 Q460,35 460,55 L460,200 Q460,215 460,220 L460,350 Q460,370 460,380 L460,430 Q460,440 440,440 L260,440 Q240,440 240,430 L240,380 Q240,370 240,350 L240,220 Q240,215 240,200 Z" fill="rgba(0,195,255,0.03)"/>
    <rect x="255" y="90" width="190" height="105" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <rect x="250" y="260" width="200" height="165" rx="5" fill="rgba(0,195,255,0.01)" stroke="rgba(0,195,255,0.1)" stroke-dasharray="4 2"/>
    <line x1="250" y1="220" x2="450" y2="220" stroke="rgba(0,195,255,0.2)"/>
    <text x="350" y="350" text-anchor="middle" fill="rgba(0,195,255,0.15)" font-size="11" font-family="Orbitron" letter-spacing="3">LOAD BED</text>
    <ellipse cx="228" cy="110" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="472" cy="110" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="228" cy="340" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="472" cy="340" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <rect x="305" y="42" width="90" height="4" rx="2" fill="rgba(0,195,255,0.3)"/>
    <rect x="305" y="432" width="90" height="4" rx="2" fill="rgba(255,50,50,0.3)"/>
  </g>`,
  singlecab: `<g fill="none" stroke="rgba(0,195,255,0.3)" stroke-width="1.5">
    <path d="M245,55 Q245,35 280,35 L420,35 Q455,35 455,55 L455,160 Q455,175 455,180 L455,360 Q455,380 455,395 L455,430 Q455,440 440,440 L260,440 Q245,440 245,430 L245,395 Q245,380 245,360 L245,180 Q245,175 245,160 Z" fill="rgba(0,195,255,0.03)"/>
    <rect x="260" y="85" width="180" height="80" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <rect x="253" y="200" width="194" height="225" rx="5" fill="rgba(0,195,255,0.01)" stroke="rgba(0,195,255,0.1)" stroke-dasharray="4 2"/>
    <line x1="253" y1="180" x2="447" y2="180" stroke="rgba(0,195,255,0.2)"/>
    <text x="350" y="320" text-anchor="middle" fill="rgba(0,195,255,0.15)" font-size="11" font-family="Orbitron" letter-spacing="3">LOAD BED</text>
    <ellipse cx="232" cy="110" rx="20" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="468" cy="110" rx="20" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="232" cy="350" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="468" cy="350" rx="20" ry="38" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <rect x="310" y="42" width="80" height="4" rx="2" fill="rgba(0,195,255,0.3)"/>
    <rect x="310" y="432" width="80" height="4" rx="2" fill="rgba(255,50,50,0.3)"/>
  </g>`,
  coupe: `<g fill="none" stroke="rgba(0,195,255,0.3)" stroke-width="1.5">
    <rect x="235" y="50" width="230" height="367" rx="85" ry="60" fill="rgba(0,195,255,0.03)"/>
    <rect x="262" y="110" width="176" height="100" rx="12" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <rect x="262" y="235" width="176" height="70" rx="10" fill="rgba(0,195,255,0.02)" stroke="rgba(0,195,255,0.15)"/>
    <ellipse cx="242" cy="130" rx="16" ry="32" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="458" cy="130" rx="16" ry="32" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="242" cy="305" rx="18" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <ellipse cx="458" cy="305" rx="18" ry="35" fill="rgba(0,195,255,0.04)" stroke="rgba(0,195,255,0.2)"/>
    <rect x="310" y="62" width="80" height="3" rx="1" fill="rgba(0,195,255,0.3)"/>
    <rect x="310" y="398" width="80" height="3" rx="1" fill="rgba(255,50,50,0.3)"/>
  </g>`
};

// Hotspot zone positions per body type (% of canvas), tuned to the
// assets/vehicles/<type>.png blueprints. category links zone → catalog category.
export const vehicleConfigs = {
  sedan:     { label:'Sedan',      zones:{ headunit:{x:50,y:32}, dsp:{x:50,y:56}, tweeterL:{x:31,y:35}, tweeterR:{x:69,y:35}, frontL:{x:28,y:48}, frontR:{x:72,y:48}, rearL:{x:28,y:64}, rearR:{x:72,y:64}, sub:{x:44,y:86}, amp:{x:56,y:86}, camFront:{x:50,y:6}, camRear:{x:50,y:95} }},
  hatchback: { label:'Hatchback',  zones:{ headunit:{x:50,y:31}, dsp:{x:50,y:55}, tweeterL:{x:31,y:33}, tweeterR:{x:69,y:33}, frontL:{x:29,y:47}, frontR:{x:71,y:47}, rearL:{x:29,y:63}, rearR:{x:71,y:63}, sub:{x:44,y:81}, amp:{x:56,y:81}, camFront:{x:50,y:8}, camRear:{x:50,y:92} }},
  suv:       { label:'SUV',        zones:{ headunit:{x:50,y:30}, dsp:{x:50,y:52}, tweeterL:{x:30,y:31}, tweeterR:{x:70,y:31}, frontL:{x:28,y:42}, frontR:{x:72,y:42}, rearL:{x:28,y:60}, rearR:{x:72,y:60}, sub:{x:44,y:86}, amp:{x:56,y:86}, camFront:{x:50,y:5}, camRear:{x:50,y:95} }},
  doublecab: { label:'Double Cab', zones:{ headunit:{x:50,y:27}, dsp:{x:50,y:45}, tweeterL:{x:33,y:28}, tweeterR:{x:67,y:28}, frontL:{x:31,y:38}, frontR:{x:69,y:38}, rearL:{x:31,y:50}, rearR:{x:69,y:50}, sub:{x:44,y:55}, amp:{x:56,y:55}, camFront:{x:50,y:5}, camRear:{x:50,y:95} }},
  singlecab: { label:'Single Cab', zones:{ headunit:{x:50,y:28}, dsp:{x:50,y:43}, tweeterL:{x:33,y:30}, tweeterR:{x:67,y:30}, frontL:{x:31,y:40}, frontR:{x:69,y:40}, sub:{x:44,y:46}, amp:{x:56,y:46}, camFront:{x:50,y:5}, camRear:{x:50,y:95} }},
  coupe:     { label:'Coupé',      zones:{ headunit:{x:50,y:37}, dsp:{x:50,y:60}, tweeterL:{x:33,y:39}, tweeterR:{x:67,y:39}, frontL:{x:30,y:52}, frontR:{x:70,y:52}, sub:{x:44,y:82}, amp:{x:56,y:82}, camFront:{x:50,y:6}, camRear:{x:50,y:95} }}
};

// Zone metadata. category must match a key in catalog.js → categories.
export const zoneInfo = {
  headunit:  { label:'Head Unit',   category:'source',    icon:'📱' },
  dsp:       { label:'DSP',         category:'processor', icon:'🧠' },
  tweeterL:  { label:'Tweeter L',   category:'speaker',   icon:'🔊' },
  tweeterR:  { label:'Tweeter R',   category:'speaker',   icon:'🔊' },
  frontL:    { label:'Front Left',  category:'speaker',   icon:'🔊' },
  frontR:    { label:'Front Right', category:'speaker',   icon:'🔊' },
  rearL:     { label:'Rear Left',   category:'speaker',   icon:'🔊' },
  rearR:     { label:'Rear Right',  category:'speaker',   icon:'🔊' },
  sub:       { label:'Subwoofer',   category:'sub',       icon:'💥' },
  amp:       { label:'Amplifier',   category:'amp',       icon:'⚡' },
  camFront:  { label:'Front Cam',   category:'camera',    icon:'📷' },
  camRear:   { label:'Rear Cam',    category:'camera',    icon:'📷' }
};

// Small icon SVGs for the vehicle picker buttons.
export function vehicleIcon(type) {
  const icons = {
    sedan: '<rect x="8" y="5" width="24" height="50" rx="10" ry="8"/>',
    hatchback: '<rect x="10" y="8" width="20" height="44" rx="8" ry="7"/>',
    suv: '<rect x="7" y="4" width="26" height="52" rx="9" ry="7"/>',
    doublecab: '<path d="M10,8 Q10,4 14,4 L26,4 Q30,4 30,8 L30,25 L30,55 Q30,58 26,58 L14,58 Q10,58 10,55 Z"/><line x1="10" y1="28" x2="30" y2="28"/>',
    singlecab: '<path d="M11,8 Q11,4 15,4 L25,4 Q29,4 29,8 L29,20 L29,55 Q29,58 25,58 L15,58 Q11,58 11,55 Z"/><line x1="11" y1="22" x2="29" y2="22"/>',
    coupe: '<rect x="10" y="6" width="20" height="48" rx="10" ry="8"/>'
  };
  return `<svg viewBox="0 0 40 62" fill="none" stroke="currentColor" stroke-width="1.2">${icons[type]}</svg>`;
}
