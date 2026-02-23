import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


const C = {
  navy:"#0B1D3F", blue:"#113088", blue2:"#00318D", slate:"#4C5564",
  slate2:"#5F6266", slate3:"#2D2F31", gray:"#929FC2", gray2:"#9DA5B2",
  tan:"#C2B194", tan2:"#B8965C", cream:"#F8F4EF", creamy:"#E8DECA",
  bg:"#F0F2F7", white:"#FFFFFF",
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const EBSLogo = ({ white=false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="35" viewBox="0 0 60 56">
    <path fill={white?"#fff":C.blue2} d="M22.97,19.821l2.55-1.761H23.1A5.789,5.789,0,0,0,22.97,19.821ZM38.551,32.653a5.345,5.345,0,0,1,1.9,2.573H36.968l-4.226,2.916h7.919a6.6,6.6,0,0,1-3.2,4.452,12.432,12.432,0,0,1-4.714,1.768V30.085A16.023,16.023,0,0,1,38.551,32.653ZM57.462,22.592a21.109,21.109,0,0,0-9.569-3.333c6.277-.538,11.1-3.723,11.1-7.572,0-4.229-3.515-7.654-12.98-7.654H32.743V0l-2.3,1.586v51.97l2.3-1.584V45.747a20.939,20.939,0,0,0,8.311-2.729,9.8,9.8,0,0,0,4.463-4.954,6.81,6.81,0,0,0,.445-2.839,6.5,6.5,0,0,0-2.789-5.267c-1.842-1.452-4.963-2.746-9.4-3.864l-1.033-.259V11.978a13.771,13.771,0,0,1,4.043.835,17.627,17.627,0,0,1,3.953,2.122l3.408-2.354a57.444,57.444,0,0,0-6.207-1.495,34.925,34.925,0,0,0-5.2-.4V6.489H46.006c5.46,0,7.5,2.59,7.5,5.786s-3.359,5.786-7.5,5.786H36.193l-3.45,2.388H44.176c5.04,0,10.783,1.814,10.783,7.68,0,4.735-3.749,6.71-7.97,7.044A8.355,8.355,0,0,1,47,37.955q6.124-.553,9.481-2.7a7.86,7.86,0,0,0,3.833-7A6.46,6.46,0,0,0,57.462,22.592ZM26.9,11.152a18.177,18.177,0,0,0-6.016,2.186A8.413,8.413,0,0,0,16.79,18.06H6.15V6.489H26.9Zm0,12.9a16.349,16.349,0,0,1-1.55-.684A6.957,6.957,0,0,1,22.3,20.647l-.127-.25a6.144,6.144,0,0,1-.439-2.337,5.441,5.441,0,0,1,2.666-4.4A9.462,9.462,0,0,1,26.9,12.5ZM.31,4.032v34.11H23.146l3.754-2.6H6.15v-15.1H16.527c.13,2.476,1.451,4.411,4.041,5.817A36.888,36.888,0,0,0,26.9,28.537V44.468a14.985,14.985,0,0,1-7.946-3.435L15.43,43.456l.172.069A30.655,30.655,0,0,0,26.9,46V56l2.3-1.586V2.446L26.9,4.032Z"/>
  </svg>
);

const GlobeIcon = ({ white=false }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
    <path fill={white?"#fff":C.blue2} d="M11.667.667a11,11,0,1,0,11,11,11.012,11.012,0,0,0-11-11m8.942,10H16.625a15.419,15.419,0,0,0-2.637-7.686,9.014,9.014,0,0,1,6.62,7.686m-11.906,2h5.927a13.437,13.437,0,0,1-2.963,7.486A13.439,13.439,0,0,1,8.7,12.667m0-2A13.443,13.443,0,0,1,11.667,3.18a13.441,13.441,0,0,1,2.963,7.488Zm.642-7.686a15.419,15.419,0,0,0-2.637,7.686H2.725a9.014,9.014,0,0,1,6.62-7.686m-6.62,9.685H6.707a15.412,15.412,0,0,0,2.636,7.684,9.015,9.015,0,0,1-6.618-7.684M13.99,20.351a15.414,15.414,0,0,0,2.637-7.684h3.981a9.013,9.013,0,0,1-6.618,7.684" transform="translate(0.334 0.334)"/>
  </svg>
);

const RocketIcon = ({ color=C.slate3, size=18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 25 25">
    <path fill={color} d="M6.106,18.05c-1.7,1.427-2.244,5.181-2.3,5.6a.625.625,0,0,0,.62.708.744.744,0,0,0,.083-.005c.423-.057,4.177-.6,5.6-2.3a2.839,2.839,0,0,0-4-4.007m3.048,3.2c-.747.89-2.68,1.452-3.961,1.717.265-1.281.827-3.214,1.717-3.961h0a1.646,1.646,0,0,1,1.064-.389,1.57,1.57,0,0,1,1.18,2.634M25.362,3.425a.625.625,0,0,0-.621-.625h-.09A13.937,13.937,0,0,0,13.043,8.956c-1.066-.286-3.745-.851-5.32.2C6.041,10.28,5.436,13.38,5.372,13.73a.625.625,0,0,0,.615.736h4.949L13.7,17.225v4.949a.626.626,0,0,0,.737.615c.349-.064,3.449-.668,4.575-2.352,1.045-1.568.49-4.23.2-5.305A13.874,13.874,0,0,0,25.362,3.425M8.417,10.195c.933-.622,2.758-.39,3.923-.124a23.533,23.533,0,0,0-1.562,3.145h-4a5.8,5.8,0,0,1,1.643-3.021m9.551,9.549a5.8,5.8,0,0,1-3.022,1.643v-4A23.97,23.97,0,0,0,18.1,15.844c.264,1.166.489,2.973-.128,3.9m.185-5.389a22.69,22.69,0,0,1-3.679,1.881L11.927,13.69a22.4,22.4,0,0,1,1.881-3.632,12.7,12.7,0,0,1,10.29-6,12.673,12.673,0,0,1-5.945,10.294" transform="translate(-1.821 -1.341)"/>
  </svg>
);

const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30">
    <path fill={C.gray} d="M16.177,3.137A13.039,13.039,0,1,0,29.216,16.176,13.039,13.039,0,0,0,16.177,3.137m0,24.521A11.482,11.482,0,1,1,27.659,16.176,11.482,11.482,0,0,1,16.177,27.658m1.73-12.626,0,7.7a1.611,1.611,0,0,1-1.733,1.588,1.613,1.613,0,0,1-1.731-1.573l-.007-7.618a1.631,1.631,0,0,1,1.744-1.649,1.611,1.611,0,0,1,1.724,1.556m.384-4.861a2.114,2.114,0,1,1-2.114-2.114,2.115,2.115,0,0,1,2.114,2.114" transform="translate(-1.177 -1.176)"/>
  </svg>
);

const AddIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 30 30">
    <path fill="#fff" d="M16.527,3.3a1.4,1.4,0,0,1,1.008,1.372l0,10.274H27.879a1.293,1.293,0,1,1,0,2.587H17.533V27.878a1.292,1.292,0,0,1-2.582.071l-.005-10.418-10.274,0A1.4,1.4,0,0,1,3.3,16.526v-.575a1.4,1.4,0,0,1,1.372-1.009l10.276,0-.006-10.2A1.42,1.42,0,0,1,15.952,3.3Z" transform="translate(-1.238 -1.237)"/>
  </svg>
);

const RemoveIcon = ({ color="#fff" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 30 30">
    <path fill={color} d="M27.879,21.93l-23.208,0A1.4,1.4,0,0,0,3.3,22.935v.575a1.4,1.4,0,0,0,1.372,1.009l23.207,0a1.293,1.293,0,1,0,0-2.586" transform="translate(-1.237 -8.223)"/>
  </svg>
);

const CirclesBg = () => (
  <div style={{position:"absolute",inset:0,overflow:"hidden",pointerEvents:"none"}}>
    <svg viewBox="0 0 802.564 795.979"
      style={{position:"absolute",left:"50%",top:"45%",transform:"translate(-50%,-50%)",width:"110%",minWidth:700,opacity:0.5}}>
      <g transform="translate(-226.227 -226.919)">
        {["M988.494,802.364A400.807,400.807,0,1,0,555.358,1022.45","M493.929,513.075a176.352,176.352,0,1,0,209.15-44.215","M512.291,458.941A204.76,204.76,0,1,0,760.146,472.2","M550.421,407.373a233.9,233.9,0,1,0,269.558,87.914","M608.228,368.325A260.592,260.592,0,1,0,872.963,540.663","M752.422,369.3a287.457,287.457,0,1,0,157.852,310.65","M924.106,524.661A314.144,314.144,0,1,0,806.031,886.7","M970.539,602.742A343.969,343.969,0,1,0,743.061,952.181","M994.532,697.915A373.583,373.583,0,1,0,657.661,1000.56"].map((d,i)=>(
          <path key={i} d={d} fill="none" stroke="#00318d" strokeWidth="0.912"/>
        ))}
      </g>
    </svg>
  </div>
);

// ─── Asset logo tiles ─────────────────────────────────────────────────────────
const LOGO_BG = {
  AAPL:"#1c1c1e",AMD:"#e60026",AMZN:"#ff9900",ASML:"#00adef",DIS:"#113088",
  EGR1T:"#4caf50",GOOG:"#4285f4",LHV1T:"#003087",MCD:"#da291c",META:"#0082fb",
  MSFT:"#00a4ef",NFLX:"#e50914",NIO:"#1a1a2e",NKE:"#111",NVO:"#0057a8",
  SAP:"#0070f3",TAL1T:"#e63946",TKM1T:"#2d2f31",TSLA:"#cc0000",UBER:"#000",
  BTC:"#f7931a",XRP:"#1c1c1c",XAU:"#c9a84c",BRENT:"#555",CASH:"#2e7d32",
};
const Logo = ({ id, size=46 }) => (
  <div style={{width:size,height:size,borderRadius:size*0.22,flexShrink:0,
    background:LOGO_BG[id]||C.slate,display:"flex",alignItems:"center",
    justifyContent:"center",fontSize:size*0.21,fontWeight:800,color:"#fff",
    letterSpacing:"-0.02em",fontFamily:"Mulish,sans-serif"}}>
    {id.length>4?id.slice(0,3):id}
  </div>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const CASH0 = 10000;
const STOCKS = [
  {id:"AAPL",name:"Apple Inc.",price:27,ticker:"AAPL",country:"USA",desc:"Apple disainib ja müüb nutitelefone, arvuteid ja kantavaid seadmeid."},
  {id:"AMD",name:"Advanced Micro Devices Inc.",price:2.50,ticker:"AMD",country:"USA",desc:"AMD disainib protsessoreid ning graafikakaarte arvutitele ja andmekeskustele."},
  {id:"AMZN",name:"Amazon.com Inc.",price:15,ticker:"AMZN",country:"USA",desc:"Amazon on e-kaubanduse ja pilveteenuste globaalne liider."},
  {id:"ASML",name:"ASML Holding NV",price:90,ticker:"ASML",country:"Holland",desc:"ASML toodab litograafiasüsteeme pooljuhtide tootmiseks."},
  {id:"CS",name:"Credit Suisse Group",price:21,ticker:"CS",country:"Šveits",desc:"Üks maailma prestiižsemaid panku, mis pakub ülimat Šveitsi stabiilsust ja globaalset varahaldust."},
  {id:"DIS",name:"Walt Disney Company",price:27,ticker:"DIS",country:"USA",desc:"Disney on meelelahutuse, meedia ja teemaparkide maailmaettevõte."},
  {id:"EGR1T",name:"Enefit Green AS",price:2.90,ticker:"EGR1T",country:"Eesti",desc:"Enefit Green toodab taastuvenergiat tuule- ja päikeseenergia abil."},
  {id:"GOOG",name:"Alphabet Inc.",price:26,ticker:"GOOG",country:"USA",desc:"Alphabet on Google'i emaettevõte — otsingumootorite ja pilveplatvormide liider."},
  {id:"LHV1T",name:"LHV Group AS",price:0.70,ticker:"LHV1T",country:"Eesti",desc:"LHV on Eesti suurim kodumainen pank ja finantsgrupp."},
  {id:"MCD",name:"McDonald's Corporation",price:94,ticker:"MCD",country:"USA",desc:"McDonald's on maailma suurim kiirtoidukett üle 40 000 restoraniga."},
  {id:"META",name:"Meta Platforms Inc.",price:78,ticker:"META",country:"USA",desc:"Meta haldab Facebook'i, Instagram'i ja WhatsApp'i."},
  {id:"MSFT",name:"Microsoft Corporation",price:47,ticker:"MSFT",country:"USA",desc:"Microsoft toodab tarkvara, riistvara ja pilveteenuseid."},
  {id:"NFLX",name:"Netflix Inc.",price:49,ticker:"NFLX",country:"USA",desc:"Netflix on videovoogedastuse maailmaliider."},
  {id:"NIO",name:"NIO Inc.",price:6.26,ticker:"NIO",country:"Hiina",desc:"NIO disainib ja toodab premium-elektriautosid Hiinas."},
  {id:"NKE",name:"Nike Inc.",price:46,ticker:"NKE",country:"USA",desc:"Nike on spordirõivaste ja jalatsitootmise maailmaliider."},
  {id:"NOKIA",name:"Nokia Oyj",price:6.80,ticker:"NOKIA",country:"Soome",desc:"Maailma juhtiv 5G võrkude arendaja. Ettevõte on edukalt väljunud mobiiliärist ja keskendub nüüd tuleviku infrastruktuurile."},
  {id:"NVO",name:"Novo Nordisk A/S",price:18,ticker:"NVO",country:"Taani",desc:"Novo Nordisk on diabeedi- ja rasvumisravimite juhtiv tootja."},
  {id:"PTON",name:"Peloton Interactive Inc.",price:25.10,ticker:"PTON",country:"USA",desc:"Revolutsiooniline treeningtehnoloogia, mis toob jõusaali elamuse otse sinu elutuppa läbi tipptasemel riistvara."},
  {id:"SAP",name:"SAP SE",price:58,ticker:"SAP",country:"Saksamaa",desc:"SAP toodab ettevõttetarkvara ja äriprotsessihalduse lahendusi."},
  {id:"TAL1T",name:"Tallink Grupp AS",price:0.90,ticker:"TAL1T",country:"Eesti",desc:"Tallink Grupp pakub laevandus- ja reisiteenuseid Läänemere piirkonnas."},
  {id:"TKM1T",name:"TKM Grupp AS",price:0.77,ticker:"TKM1T",country:"Eesti",desc:"TKM Grupp haldab Kaubamaja ja Selver kette Eestis."},
  {id:"TSLA",name:"Tesla Inc.",price:14,ticker:"TSLA",country:"USA",desc:"Tesla toodab elektriautosid ja energiasalvestussüsteeme."},
  {id:"UBER",name:"Uber Technologies Inc.",price:45,ticker:"UBER",country:"USA",desc:"Uber pakub sõidujagamise ja toidukulleri teenuseid üle maailma."},
  {id:"WDI",name:"Wirecard AG",price:39.80,ticker:"WDI",country:"Saksamaa",desc:"Saksamaa kiireima kasvuga finantstehnoloogia (Fintech) ettevõte, mis muudab digitaalsed maksed globaalseks standardiks."},
];
const CRYPTO = [
  {id:"BTC",name:"Bitcoin",price:320,ticker:"BTC",country:"Krüpto",desc:"Bitcoin on maailma esimene ja suurim krüptoraha, loodud 2009."},
  {id:"XRP",name:"XRP",price:0.02,ticker:"XRP",country:"Krüpto",desc:"XRP on Ripple'i digitaalne valuuta kiireks rahvusvaheliseks maksete töötlemiseks."},
];
const COMMODITIES = [
  {id:"XAU",name:"Kuld",price:1200,ticker:"XAU",country:"Tooraine",desc:"Kuld on väärismetall — sajandeid olnud väärtuse säilitaja ja inflatsioonikaitse."},
  {id:"BRENT",name:"Nafta",price:57,ticker:"BRENT",country:"Tooraine",desc:"Brenti toorõli on peamine rahvusvaheline naftahinna võrdlusalus."},
];
const ALL = [...STOCKS,...CRYPTO,...COMMODITIES];

const MULT = {
  AAPL:7.04,AMD:75,AMZN:7,ASML:12,CS:0.369,DIS:1.3,EGR1T:1.8,GOOG:5,LHV1T:9,
  MCD:2.8,META:4.5,MSFT:8.2,NFLX:3.5,NIO:0.8,NKE:2,NOKIA:0.66,NVO:15,PTON:0.032,SAP:3.2,
  TAL1T:0.9,TKM1T:1.6,TSLA:14,UBER:2,WDI:0.0005,BTC:200,XRP:1.2,XAU:1.7,BRENT:1.1,CASH:0.68,
};
const YEARS = [2015,2016,2017,2018,2019,2020,2021,2022,2023,2024];
const RIVALS = [
  {name:"Hundid",value:23963.90,pct:139.64},
  {name:"Portfolio bros",value:19842.10,pct:98.42},
  {name:"Portfold",value:15320.50,pct:53.21},
];

// ─── Shared ───────────────────────────────────────────────────────────────────
const F = {fontFamily:"Mulish,sans-serif"};

// Load Mulish from Google Fonts
if(typeof document!=="undefined"){
  const l=document.createElement("link");
  l.rel="stylesheet";
  l.href="https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700;800;900&display=swap";
  document.head.appendChild(l);
}

function Navbar({dark=false}){
  return(
    <nav style={{...F,display:"flex",alignItems:"center",justifyContent:"space-between",
      padding:"0 48px",height:72,flexShrink:0,position:"relative",zIndex:10,
      background:dark?"transparent":"#FFFFFF",
      borderBottom:dark?"none":"1px solid #E8EAF0"}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <EBSLogo white={dark}/>
        <span style={{...F,fontSize:15,fontWeight:500,color:dark?"#FFFFFF":"#00318D"}}>Investeerimisklubi</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{...F,fontSize:14,fontWeight:700,color:dark?"#FFFFFF":"#00318D"}}>EST</span>
        <GlobeIcon white={dark}/>
      </div>
    </nav>
  );
}

function Badge({label}){
  return <span style={{background:"#EBEFF2",borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:700,color:"#929FC2",whiteSpace:"nowrap",flexShrink:0}}>{label}</span>;
}

function Btn({onClick,children,disabled=false}){
  const[h,sH]=useState(false);
  return(
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={()=>sH(true)} onMouseLeave={()=>sH(false)}
      style={{...F,display:"flex",alignItems:"center",justifyContent:"center",gap:10,
        padding:"13px 48px",background:h?"#d4c8b2":C.creamy,border:"none",
        borderRadius:12,fontSize:15,fontWeight:700,color:C.slate3,
        cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,transition:"background .15s"}}>
      {children}
    </button>
  );
}

function Donut({holdings}){
  const r=holdings.CASH||0;
  const a=STOCKS.reduce((s,x)=>s+(holdings[x.id]||0)*x.price,0);
  const k=CRYPTO.reduce((s,x)=>s+(holdings[x.id]||0)*x.price,0);
  const v=COMMODITIES.reduce((s,x)=>s+(holdings[x.id]||0)*x.price,0);
  const t=r+a+k+v||1;
  const sl=[{name:"Raha",value:r,color:C.blue},{name:"Aktsiad",value:a,color:C.tan},{name:"Krüpto",value:k,color:C.gray},{name:"Varad",value:v,color:C.slate3}];
  const fi=sl.filter(s=>s.value>0);
  return(
    <div style={{display:"flex",alignItems:"center",gap:24}}>
      <div style={{width:140,height:140,flexShrink:0}}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={fi.length?fi:[{value:1}]} cx="50%" cy="50%" innerRadius={44} outerRadius={62} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
              {fi.length?fi.map((s,i)=><Cell key={i} fill={s.color}/>):<Cell fill="#dde1ec"/>}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:9}}>
        {sl.map(s=>(
          <div key={s.name} style={{display:"flex",alignItems:"center",gap:9,minWidth:120}}>
            <div style={{width:10,height:10,borderRadius:"50%",background:s.color,flexShrink:0}}/>
            <span style={{...F,fontSize:13,color:"#5F6266",flex:1}}>{s.name}</span>
            <span style={{...F,fontSize:13,color:"#9DA5B2"}}>{Math.round(s.value/t*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({name,investors,holdings,finals=null}){
  const cash=holdings.CASH||0;
  const stocks=STOCKS.reduce((s,a)=>s+(holdings[a.id]||0)*a.price,0);
  const crypto=CRYPTO.reduce((s,a)=>s+(holdings[a.id]||0)*a.price,0);
  const varad=COMMODITIES.reduce((s,a)=>s+(holdings[a.id]||0)*a.price,0);
  const f=n=>typeof n==="number"?n.toLocaleString("et-EE",{minimumFractionDigits:2,maximumFractionDigits:2})+" €":n;
  const fp=n=>typeof n==="number"?(n>=0?"+ ":"")+Math.abs(n).toFixed(2)+"%":n;
  const rows=[
    {l:"Algne summa",v:"10 000 €",hi:false},
    {l:"Koguväärtus",v:finals?f(finals.total):"?",hi:!!finals},
    {l:"Kogukasum",v:finals?f(finals.gain):"?",hi:!!finals},
    {l:"Kasum %",v:finals?fp(finals.pct):"?",hi:!!finals},
    {l:"Raha",v:cash.toFixed(0)+" €",hi:false},
    {l:"Aktsiad",v:stocks.toFixed(0)+" €",hi:false},
    {l:"Krüpto",v:crypto.toFixed(0)+" €",hi:false},
    {l:"Varad",v:varad.toFixed(0)+" €",hi:false},
  ];
  return(
    <div style={{background:C.bg,padding:"28px 48px 24px",borderBottom:`1px solid #dde1ec`}}>
      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",maxWidth:1100,margin:"0 auto",gap:24}}>
        <div style={{flex:1}}>
          <h1 style={{...F,margin:"0 0 4px",fontSize:36,fontWeight:800,color:"#113088",letterSpacing:"-0.02em"}}>{name}</h1>
          <p style={{...F,margin:"0 0 20px",color:C.gray2,fontSize:14}}>{investors||"Tiimiliikmed"}</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px 0",maxWidth:500}}>
            {rows.map(({l,v,hi})=>(
              <div key={l}>
                <div style={{...F,fontSize:12,fontWeight:600,color:"#113088",marginBottom:2}}>{l}</div>
                <div style={{...F,fontSize:14,fontWeight:600,color:hi?"#B8965C":"#5F6266"}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{...F,fontSize:13,fontWeight:700,color:"#113088",marginBottom:14}}>Portfelli jaotus</div>
          <Donut holdings={holdings}/>
        </div>
      </div>
    </div>
  );
}

function Modal({asset,onClose}){
  if(!asset)return null;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(75,90,120,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000}}>
      <div onClick={e=>e.stopPropagation()} style={{...F,background:"#FFFFFF",borderRadius:16,padding:"32px 36px 36px",width:640,maxWidth:"92vw",boxShadow:"0 16px 64px rgba(0,0,0,0.18)"}}>
        {/* Header: logo + name/price on left, country+ticker on right */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <Logo id={asset.id} size={64}/>
            <div>
              <div style={{...F,fontSize:20,fontWeight:700,color:"#0B1D3F",lineHeight:1.2}}>{asset.name}</div>
              <div style={{...F,fontSize:15,color:"#5F6266",marginTop:6}}>{asset.price.toFixed(2)} €</div>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,paddingTop:4}}>
            <Badge label={asset.country}/>
            <span style={{...F,fontSize:13,color:"#9DA5B2"}}>{asset.ticker}</span>
          </div>
        </div>
        {/* Description */}
        <p style={{...F,fontSize:15,color:"#929FC2",lineHeight:1.75,margin:"0 0 32px"}}>{asset.desc}</p>
        {/* Sulge button - full width, white with border */}
        <button onClick={onClose} style={{...F,width:"100%",height:50,background:"#FFFFFF",
          border:"1.5px solid #e0e4ef",borderRadius:10,
          fontSize:16,fontWeight:400,color:"#4C5564",cursor:"pointer",
          transition:"background .15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#f5f6f9"}
          onMouseLeave={e=>e.currentTarget.style.background="#FFFFFF"}>
          Sulge
        </button>
      </div>
    </div>
  );
}

function AssetCard({asset,qty,cash,onInfo,onBuy,onSell}){
  const canBuy=cash>=asset.price, canSell=qty>0;
  return(
    <div style={{background:"#FFFFFF",borderRadius:12,padding:"15px 18px",border:`1px solid #e4e8f0`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <Logo id={asset.id}/>
          <div>
            <div style={{...F,fontSize:13,fontWeight:700,color:"#103088",lineHeight:1.2}}>{asset.name}</div>
            <div style={{...F,fontSize:12,color:"#929FC2",marginTop:2}}>{asset.price.toFixed(2)} €</div>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <Badge label={asset.country}/>
          <div style={{...F,fontSize:11,color:"#929FC2",marginTop:3}}>{asset.ticker}</div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <button onClick={()=>onInfo(asset)} style={{...F,display:"flex",alignItems:"center",gap:5,height:32,padding:"0 12px",background:"#FFFFFF",border:"1px solid #929FC2",borderRadius:8,fontSize:12,fontWeight:600,color:"#929FC2",cursor:"pointer"}}>
          Info <InfoIcon/>
        </button>
        <span style={{...F,flex:1,textAlign:"center",fontSize:12,color:"#929FC2"}}>{qty>0?`Portfellis: ${qty} tk`:""}</span>
        <button onClick={()=>onSell(asset)} disabled={!canSell} style={{width:32,height:32,borderRadius:8,border:"none",background:canSell?"#C2B194":"#EBEFF2",cursor:canSell?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <RemoveIcon color={canSell?"#fff":"#9DA5B2"}/>
        </button>
        <button onClick={()=>onBuy(asset)} disabled={!canBuy} style={{width:32,height:32,borderRadius:8,border:"none",background:canBuy?"#113088":"#F0F2F7",cursor:canBuy?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <AddIcon/>
        </button>
      </div>
    </div>
  );
}

// ─── Screen 1: Landing ────────────────────────────────────────────────────────
function Landing({onStart}){
  const[n,sN]=useState(""), [inv,sI]=useState("");
  return(
    <div style={{...F,minHeight:"100vh",background:C.navy,display:"flex",flexDirection:"column"}}>
      {/* White navbar */}
      <div style={{background:C.white,borderBottom:`1px solid #e8eaf0`,flexShrink:0}}>
        <Navbar dark={false}/>
      </div>

      {/* Navy hero — fills rest of page */}
      <div style={{flex:1,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start"}}>

        {/* Circles — left side, vertically centered in hero */}
        <div style={{position:"absolute",left:"-18%",top:"50%",transform:"translateY(-55%)",pointerEvents:"none",zIndex:1}}>
          <svg viewBox="0 0 802.564 795.979" width="750" height="750">
            <g transform="translate(-226.227 -226.919)">
              {["M988.494,802.364A400.807,400.807,0,1,0,555.358,1022.45","M493.929,513.075a176.352,176.352,0,1,0,209.15-44.215","M512.291,458.941A204.76,204.76,0,1,0,760.146,472.2","M550.421,407.373a233.9,233.9,0,1,0,269.558,87.914","M608.228,368.325A260.592,260.592,0,1,0,872.963,540.663","M752.422,369.3a287.457,287.457,0,1,0,157.852,310.65","M924.106,524.661A314.144,314.144,0,1,0,806.031,886.7","M970.539,602.742A343.969,343.969,0,1,0,743.061,952.181","M994.532,697.915A373.583,373.583,0,1,0,657.661,1000.56"].map((d,i)=>(
                <path key={i} d={d} fill="none" stroke="#1e3f8a" strokeWidth="1.2"/>
              ))}
            </g>
          </svg>
        </div>

        {/* Hero text block */}
        <div style={{position:"relative",zIndex:2,textAlign:"center",padding:"80px 24px 52px",width:"100%",maxWidth:960}}>
          <div style={{...F,fontSize:50,fontWeight:300,color:"#9DA5B2",lineHeight:1.25,letterSpacing:"0.005em",margin:"0 0 2px"}}>
            Estonian Business School
          </div>
          <div style={{...F,fontSize:50,fontWeight:500,color:"#B8965C",lineHeight:1.25,letterSpacing:"-0.01em",margin:"0 0 32px"}}>
            Investeerimisklubi Portfellilahing
          </div>
          <div style={{...F,fontSize:16.5,color:"#FFFFFF",lineHeight:1.78,maxWidth:800,margin:"0 auto"}}>
            Aasta on 2015 ja sinu tiimil on 10 000 € algkapitali portfelli loomiseks. Ees ootab 10 aastat pöraseid maailmasündmusi - majanduskriisid, pandeemia, tehisintellekti revolutsioon ja krüptobuum.
            <br/>Kas sinu tiim suudab ehitada portfelli, mis elab üle kriisid ja leiab üles tuleviku võitjad?
          </div>
        </div>

        {/* Floating form card */}
        <div style={{position:"relative",zIndex:2,marginTop:16}}>
          <div style={{
            background:"#F8F4EF",
            borderRadius:12,
            padding:"32px 40px 44px",
            width:448,
            boxShadow:"0 8px 48px rgba(0,0,0,0.22)",
          }}>
            <div style={{...F,textAlign:"center",fontSize:22,fontWeight:700,color:"#1F3C8E",marginBottom:28}}>
              Alusta mängu
            </div>

            <div style={{marginBottom:16}}>
              <div style={{...F,fontSize:13,fontWeight:700,color:"#1F3C8E",marginBottom:7}}>Portfelli nimi *</div>
              <input value={n} onChange={e=>sN(e.target.value)}
                style={{display:"block",width:"100%",height:46,
                  border:`1px solid #E8DECA`,borderRadius:8,
                  padding:"0 14px",fontSize:15,fontFamily:"Mulish,sans-serif",
                  outline:"none",background:"#FFFFFF",color:"#0B1D3F",
                  boxSizing:"border-box"}}/>
            </div>

            <div style={{marginBottom:32}}>
              <div style={{...F,fontSize:13,fontWeight:700,color:"#1F3C8E",marginBottom:7}}>Investorid</div>
              <input value={inv} onChange={e=>sI(e.target.value)}
                style={{display:"block",width:"100%",height:46,
                  border:`1px solid #E8DECA`,borderRadius:8,
                  padding:"0 14px",fontSize:15,fontFamily:"Mulish,sans-serif",
                  outline:"none",background:"#FFFFFF",color:"#0B1D3F",
                  boxSizing:"border-box"}}/>
            </div>

            {/* Button — centered, not full width */}
            <div style={{display:"flex",justifyContent:"center"}}>
              <button
                onClick={()=>onStart({name:n.trim()||"Portfell",investors:inv})}
                style={{...F,
                  width:240,height:50,
                  background:"#E8DECA",border:"none",borderRadius:10,
                  fontSize:16,fontWeight:600,color:"#1F3C8E",
                  cursor:"pointer",
                  opacity:1,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:10,
                }}>
                Ava portfell <RocketIcon color="#1F3C8E" size={18}/>
              </button>
            </div>
          </div>
        </div>

        {/* Spacer below card so navy continues */}
        <div style={{flex:1,minHeight:60}}/>
      </div>
    </div>
  );
}

// ─── Screen 3: Year ───────────────────────────────────────────────────────────
function YearScreen({year,onNext}){
  const HOLD=1800;
  const prevYear=year-1;
  const nextYear=year+1;
  const timerRef=useRef(null);

  useEffect(()=>{
    timerRef.current=setTimeout(onNext, HOLD);
    return ()=>clearTimeout(timerRef.current);
  },[year]);

  return(
    <div style={{...F,minHeight:"100vh",background:"#EDEEF2",display:"flex",flexDirection:"column"}}>
      <Navbar/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>

        {/* Timeline: only between the two small years */}
        <div style={{
          position:"absolute",
          left:"calc(50% - 480px)", right:"calc(50% - 480px)",
          top:"50%", height:1, background:"#C4C9D8",
          width:960,
        }}/>

        {/* Three year labels in a row */}
        <div style={{display:"flex",alignItems:"center",gap:0,position:"relative",zIndex:2}}>

          {/* Prev year */}
          <div style={{width:280,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:1,height:16,background:"#C4C9D8",marginBottom:10}}/>
            <span style={{...F,fontSize:24,fontWeight:700,color:"#B0B8CC",letterSpacing:"-0.01em",userSelect:"none"}}>
              {prevYear}
            </span>
          </div>

          {/* Current year — big */}
          <div style={{width:400,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <span style={{...F,fontSize:180,fontWeight:800,color:"#1F3C8E",
              letterSpacing:"-0.04em",lineHeight:1,userSelect:"none"}}>
              {year}
            </span>
          </div>

          {/* Next year */}
          <div style={{width:280,display:"flex",flexDirection:"column",alignItems:"center"}}>
            <div style={{width:1,height:16,background:"#C4C9D8",marginBottom:10}}/>
            <span style={{...F,fontSize:24,fontWeight:700,color:"#B0B8CC",letterSpacing:"-0.01em",userSelect:"none"}}>
              {nextYear}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
function Build({name,investors,onConfirm}){
  const[h,sH]=useState({CASH:CASH0}), [m,sM]=useState(null);
  const cash=h.CASH||0;
  const buy=a=>{if(cash<a.price)return;sH(p=>({...p,CASH:p.CASH-a.price,[a.id]:(p[a.id]||0)+1}));};
  const sell=a=>{if(!(h[a.id]>0))return;sH(p=>({...p,CASH:p.CASH+a.price,[a.id]:p[a.id]-1}));};
  const sections=[
    {t:"Aktsiad",    l:STOCKS,      bg:"#FFFFFF"},
    {t:"Krüptoraha", l:CRYPTO,      bg:"#F8F4EF"},
    {t:"Toorained",  l:COMMODITIES, bg:"#FFFFFF"},
  ];
  return(
    <div style={{...F,minHeight:"100vh",background:"#FFFFFF"}}>
      <Navbar/>
      <Modal asset={m} onClose={()=>sM(null)}/>
      <Header name={name} investors={investors} holdings={h}/>
      {sections.map(({t,l,bg})=>(
        <div key={t} style={{background:bg,padding:"32px 40px 40px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <h2 style={{...F,fontSize:22,fontWeight:800,color:"#113088",margin:"0 0 16px",letterSpacing:"-0.01em"}}>{t}</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {l.map(a=><AssetCard key={a.id} asset={a} qty={h[a.id]||0} cash={cash} onInfo={sM} onBuy={buy} onSell={sell}/>)}
            </div>
          </div>
        </div>
      ))}
      <div style={{background:"#FFFFFF",padding:"40px 40px 80px",display:"flex",justifyContent:"center"}}>
        <button onClick={()=>onConfirm(h)}
          style={{...F,padding:"13px 52px",background:"#E8DECA",border:"none",borderRadius:10,
            fontSize:15,fontWeight:600,color:"#1F3C8E",cursor:"pointer",
            display:"flex",alignItems:"center",gap:10,transition:"background .15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="#d9cdb8"}
          onMouseLeave={e=>e.currentTarget.style.background="#E8DECA"}>
          Kinnita portfell <RocketIcon color="#1F3C8E"/>
        </button>
      </div>
    </div>
  );
}

// ─── Screen 2: Results ────────────────────────────────────────────────────────
function Results({name,investors,holdings,onReset}){
  const cashAmt=holdings.CASH||0;
  const cashFin=cashAmt*(MULT.CASH||0.68);
  const held=ALL.filter(a=>(holdings[a.id]||0)>0).map(a=>{
    const qty=holdings[a.id],inv=qty*a.price,fin=inv*(MULT[a.id]||1);
    return{...a,qty,inv,fin,gain:fin-inv};
  });
  const totFin=held.reduce((s,h)=>s+h.fin,0)+cashFin;
  const totGain=totFin-CASH0;
  const pct=(totGain/CASH0)*100;
  const fmt=n=>n.toLocaleString("et-EE",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
  const fmtPct=n=>(n>=0?"+ ":"")+Math.abs(n).toFixed(2)+"%";

  const board=[{name,value:totFin,pct},...RIVALS].sort((a,b)=>b.value-a.value);

  // All result cards: held assets + cash
  const resultCards=[
    ...held,
    ...(cashAmt>0?[{id:"CASH",name:"Raha",price:1,ticker:"CASH",country:"Raha",inv:cashAmt,fin:cashFin,gain:cashFin-cashAmt}]:[])
  ];

  return(
    <div style={{...F,minHeight:"100vh",background:"#FFFFFF"}}>
      <Navbar/>
      {/* Header */}
      <Header name={name} investors={investors} holdings={holdings} finals={{total:totFin,gain:totGain,pct}}/>

      {/* Asset result cards */}
      {resultCards.length>0&&(
        <div style={{background:"#FFFFFF",padding:"36px 40px 40px"}}>
          <div style={{maxWidth:1200,margin:"0 auto"}}>
            <h2 style={{...F,fontSize:22,fontWeight:800,color:"#1F3C8E",margin:"0 0 20px"}}>Aktsiad</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              {resultCards.map(h=>(
                <div key={h.id} style={{background:"#FFFFFF",borderRadius:12,border:"1px solid #EBEFF2",overflow:"hidden"}}>
                  {/* Card top */}
                  <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"18px 20px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:14}}>
                      <Logo id={h.id} size={52}/>
                      <div>
                        <div style={{...F,fontSize:15,fontWeight:700,color:"#0B1D3F"}}>{h.name}</div>
                        <div style={{...F,fontSize:13,color:"#5F6266",marginTop:4}}>{h.price.toFixed(2)} €</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                      <Badge label={h.country}/>
                      <span style={{...F,fontSize:12,color:"#929FC2"}}>{h.ticker}</span>
                    </div>
                  </div>
                  {/* Divider */}
                  <div style={{height:1,background:"#F0F2F7",margin:"0 20px"}}/>
                  {/* Rows */}
                  <div style={{padding:"14px 20px 18px",display:"flex",flexDirection:"column",gap:8}}>
                    {[
                      {l:"Investeeritud:",  v:fmt(h.inv),                                      color:"#0B1D3F"},
                      {l:"Väärtus (2025):", v:fmt(h.fin),                                      color:"#0B1D3F"},
                      {l:"Kasum / Kahjum:", v:(h.gain>=0?"+ ":"-")+fmt(Math.abs(h.gain)),      color:h.gain>=0?"#B8965C":"#D64045"},
                    ].map(({l,v,color})=>(
                      <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{...F,fontSize:13,fontWeight:700,color:"#1F3C8E"}}>{l}</span>
                        <span style={{...F,fontSize:13,fontWeight:700,color}}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div style={{background:"#F8F4EF",padding:"36px 40px 40px"}}>
        <div style={{maxWidth:1200,margin:"0 auto"}}>
          <h2 style={{...F,fontSize:22,fontWeight:800,color:"#1F3C8E",margin:"0 0 20px"}}>Edetabel</h2>
          <div style={{background:"#F8F4EF",borderRadius:0,overflow:"hidden"}}>
            {/* Header row */}
            <div style={{display:"grid",gridTemplateColumns:"80px 1fr 200px 140px",
              padding:"0 0 12px",borderBottom:"1px solid #E0D8CC"}}>
              {["Koht","Tiim","Portfelli väärtus","Kasum %"].map(h=>(
                <span key={h} style={{...F,fontSize:13,fontWeight:700,color:"#1F3C8E"}}>{h}</span>
              ))}
            </div>
            {board.map((t,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"80px 1fr 200px 140px",
                padding:"18px 0",borderBottom:"1px solid #E0D8CC"}}>
                <span style={{...F,fontSize:14,color:"#4C5564"}}>{i+1}</span>
                <span style={{...F,fontSize:14,fontWeight:400,color:"#0B1D3F"}}>{t.name}</span>
                <span style={{...F,fontSize:14,color:"#0B1D3F"}}>{t.value.toFixed(2)} €</span>
                <span style={{...F,fontSize:14,fontWeight:700,color:t.pct>=0?"#B8965C":"#D64045"}}>
                  {t.pct>=0?"+ ":"-"}{Math.abs(t.pct).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restart button */}
      <div style={{background:"#FFFFFF",padding:"60px 40px 80px",display:"flex",justifyContent:"center"}}>
        <button onClick={onReset}
          style={{...F,padding:"14px 52px",background:"#E8DECA",border:"none",borderRadius:10,
            fontSize:15,fontWeight:600,color:"#2D2F31",cursor:"pointer",
            display:"flex",alignItems:"center",gap:10}}
          onMouseEnter={e=>e.currentTarget.style.background="#d9cdb8"}
          onMouseLeave={e=>e.currentTarget.style.background="#E8DECA"}>
          Alusta uuesti <RocketIcon color="#1F3C8E"/>
        </button>
      </div>
    </div>
  );
}


// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App(){
  const[sc,setSc]=useState("landing");
  const[game,setGame]=useState({});
  const[yi,setYi]=useState(0);
  const[holdings,setH]=useState({});
  if(sc==="landing") return <Landing onStart={d=>{setGame(d);setYi(0);setSc("build");}}/>;
  if(sc==="build")   return <Build name={game.name} investors={game.investors} onConfirm={h=>{setH(h);setSc("year");}}/>;
  if(sc==="year")    return <YearScreen year={YEARS[yi+1]} onNext={()=>{if(yi>=YEARS.length-2)setSc("results");else setYi(i=>i+1);}}/>;
  if(sc==="results") return <Results name={game.name} investors={game.investors} holdings={holdings} onReset={()=>{setSc("landing");setGame({});setH({});setYi(0);}}/>;
}
