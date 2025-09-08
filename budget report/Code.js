/******************************************************************
 *  Budget Report Web-app – Snapshot engine & Data APIs
 *  (04-Jun-2025) – Adds “Top 4 Off-cycle Drivers” dataset
 ******************************************************************/

/* ═════ 1. CONFIG ═════ */
const ID          = '1VJ56ShP4_iUuQb5zcCcHx-N-8oA1l5uWZkNKfFj9bK4';
const CURRENT_TAB = 'Rolling Data';
const ROLES_TAB   = 'Sheet1';
const LOC_ORDER   = ['KSA','UAE','REMOTE','EGYPT'];

const BLOCKS = [
 ["H1' 25 BUDGET",                        2],
 ['APPROVED OFFCYCLE',                    2],
 ['CANCELLED',                            2],
 ['TOTALS',                               2],
 ['RECRUITMENT ACTIVITY - NEW VACANCIES', 4],
 ['BALANCE BUDGET LEFT',                  2],
 ['REPLACEMENTS',                         2],
 ['RECRUITMENT ACTIVITY - REPLACEMENTS',  5]
];
const BAR  = ['#475569','#6366f1','#dc2626','#71717a',
              '#0284c7','#059669','#0e7490','#7c3aed'];
const CELL = ['#e2e8f0','#e0e7ff','#fee2e2','#e5e7eb',
              '#e0f2fe','#d1fae5','#cffafe','#ede9fe'];

/* ═════ 2. UTILITIES ═════ */
const TZ  = Session.getScriptTimeZone();
const fmt = (d,p)=>Utilities.formatDate(d,TZ,p);
const yyyymm     = d=>fmt(d,'yyyy-MM');
const monthLabel = iso=>{
  const formatted = fmt(new Date(+iso.slice(0,4),+iso.slice(5)-1,1),'MMMM yyyy');
  return formatted.includes('April 2025') ? 'April YTD 2025' : formatted;
};
const normDiv    = v=>/tweeq/i.test(v||'')?'Tweeq':(v||'').toString().trim();

/* ═════ 3. SNAPSHOT ENGINE (unchanged) ═════ */
function copyAsValues(ss,from,to){
  const src=ss.getSheetByName(from);
  if(!src) throw new Error(`Sheet “${from}” not found`);
  const dst=src.copyTo(ss).setName(to);
  dst.getDataRange().copyTo(dst.getDataRange(),{contentsOnly:true});
  dst.setTabColor('#8b5cf6');
}
function makeMonthlySnapshot(){
  const ss=SpreadsheetApp.openById(ID);
  const prev=new Date(new Date().getFullYear(),new Date().getMonth()-1,1);
  const name=yyyymm(prev);
  if(!ss.getSheetByName(name)) copyAsValues(ss,CURRENT_TAB,name);
}
function installSnapshotTrigger(){
  ScriptApp.newTrigger('makeMonthlySnapshot')
           .timeBased().onMonthDay(1).atHour(0).nearMinute(5).create();
}
function createSnapshot(label){ copyAsValues(SpreadsheetApp.openById(ID),CURRENT_TAB,label); }

/* ═════ 4. LIST HELPERS (unchanged) ═════ */
function snapshots(){ return SpreadsheetApp.openById(ID).getSheets()
  .map(s=>s.getName()).filter(n=>/^\d{4}-\d{2}$/.test(n)).sort(); }
function monthsUI(){ return snapshots().map(v=>({v,l:monthLabel(v)})); }

function uniqueDivs(){
  const v=SpreadsheetApp.openById(ID).getSheetByName(CURRENT_TAB)
         .getRange(3,1,SpreadsheetApp.openById(ID).getSheetByName(CURRENT_TAB).getLastRow()-2,1)
         .getDisplayValues().flat();
  return [...new Set(v.map(normDiv).filter(x=>x && !/grand\s*total/i.test(x)))].sort();
}
function uniqueLocs(){
  const v=SpreadsheetApp.openById(ID).getSheetByName(CURRENT_TAB)
         .getRange(3,2,SpreadsheetApp.openById(ID).getSheetByName(CURRENT_TAB).getLastRow()-2,1)
         .getDisplayValues().flat();
  return [...new Set(v.filter(x=>x && !/grand\s*total/i.test(x)))]
         .sort((a,b)=>{
           const ia=LOC_ORDER.indexOf(a.toUpperCase()), ib=LOC_ORDER.indexOf(b.toUpperCase());
           return (ia<0&&ib<0)?a.localeCompare(b):(ia<0?1:ib<0?-1:ia-ib);
         });
}
function uniqueCats(){
  const v=SpreadsheetApp.openById(ID).getSheetByName(ROLES_TAB).getDataRange().getValues();
  return [...new Set(v.slice(1).map(r=>r[6]).filter(c=>c))].sort();
}

/* ═════ 5a. DIVISION SUMMARY (unchanged) ═════ */
function buildDatasetByDivision(locs,sheet){
  const locSet=new Set(locs.map(l=>l.toString().toUpperCase()));
  const raw=SpreadsheetApp.openById(ID).getSheetByName(sheet).getDataRange().getValues();

  const hdrRaw=raw[1].slice(2), seen={}, numeric=[], headers=['Division'];
  let diff=0;
  hdrRaw.forEach(h=>{
    const k=h.trim();
    if(k==='DIFF'){diff++; numeric.push(`DIFF (${diff})`); headers.push(`DIFF (${diff})`);}
    else{
      if(!seen[k]){seen[k]=1; numeric.push(k); headers.push(k);}
      else{numeric.push(`${k}__${++seen[k]}`); headers.push(numeric.at(-1));}
    }
  });

  const divMap={}, grand=Object.fromEntries(numeric.map(k=>[k,0]));
  raw.slice(2)
     .filter(r=>!locs.length||locSet.has(r[1].toString().toUpperCase()))
     .filter(r=>{const d=r[0]; return d && !/grand\s*total/i.test(d);})
     .forEach(r=>{
        const d=normDiv(r[0]);
        if(!divMap[d]) divMap[d]=Object.fromEntries(numeric.map(k=>[k,0]));
        numeric.forEach((h,i)=>{
          divMap[d][h]+=+r[i+2]||0;
          grand[h]+=+r[i+2]||0;
        });
     });

  Object.values(divMap).forEach(o=>numeric.forEach(h=>o[h]=Math.round(o[h])));
  numeric.forEach(h=>grand[h]=Math.round(grand[h]));

  const rows=Object.keys(divMap).sort().map(d=>({Division:d,...divMap[d]}));
  rows.push({Division:'GRAND TOTAL',...grand});

  return{groupLabels:BLOCKS.map(b=>b[0]), groupSpans:BLOCKS.map(b=>b[1]), headers, rows};
}

/* ═════ 5b. ROLES GRID (unchanged) ═════ */
function buildRolesDataset(divs,locs,cats){
  const locSet=new Set(locs.map(l=>l.toString().toUpperCase()));
  const divSet=new Set(divs), catSet=new Set(cats);

  const v=SpreadsheetApp.openById(ID).getSheetByName(ROLES_TAB).getDataRange().getValues();
  const hdr=['Division','Department','Team','Role','Grade','Category',
             'Pay Rate','Actual Pay','Pay DIFF','Status'];

  const rows=v.slice(1).filter(r=>r[1])
      .map(r=>{r[1]=normDiv(r[1]); return r;})
      .filter(r=>!divs.length||divSet.has(r[1]))
      .filter(r=>!locs.length||locSet.has(r[0].toString().toUpperCase()))
      .filter(r=>!cats.length||catSet.has(r[6]))
      .map(r=>{
        const pay=+r[20]||0, act=+r[21]||0;
        return{
          Division:r[1], Department:r[2], Team:r[3], Role:r[4], Grade:r[11],
          Category:r[6],
          'Pay Rate':pay,'Actual Pay':act,'Pay DIFF':act-pay,
          Status:r[16]
        };
      });

  return{headers:hdr, rows};
}

/* ═════ 5c. H I G H L I G H T S (modified Off-Cycle logic) ═════ */
function getHighlightsData(locs){
  /* -------- base division dataset -------- */
  const ds = buildDatasetByDivision(locs, CURRENT_TAB);
  const strip = h => h.replace(/__\d+$/,'').replace(/\s*\(\d+\)$/,'').trim();
  const hdr2grp = {}; let gi = -1, span = 0;
  ds.headers.forEach((h,i)=>{
    if(i>0){
      if(span===0){ gi++; span = ds.groupSpans[gi]; }
      span--;
    }
    hdr2grp[h] = ds.groupLabels[gi] || '';
  });
  const grand = ds.rows.at(-1);
  const pick = (grp,col)=>{
    const h = ds.headers.find(x=> hdr2grp[x]===grp && strip(x)===col );
    return h ? grand[h] : 0;
  };

  /* -------- budget & recruit metrics -------- */
  const rolesPlan = pick("H1' 25 BUDGET","ADD NEW HC");
  const rolesOff  = pick("APPROVED OFFCYCLE","ADD NEW HC");
  const rolesCanc = pick("CANCELLED","HC");
  const rolesTot  = rolesPlan + rolesOff - rolesCanc;
  const rolesRepl = pick("REPLACEMENTS","HC");

  const costPlan = pick("H1' 25 BUDGET","ADD NEW COST");
  const costOff  = pick("APPROVED OFFCYCLE","ADD NEW COST");
  const costCanc = pick("CANCELLED","COST");
  const costTot  = costPlan + costOff - costCanc;
  const costRepl = pick("REPLACEMENTS","COST");

  /* -------- hires / costs per role (modified) -------- */
  const vals = SpreadsheetApp.openById(ID).getSheetByName(ROLES_TAB).getDataRange().getValues();
  const locSet = new Set(locs.map(l=>l.toString().toUpperCase()));

  let hPlan = 0, hOff = 0, hRepl = 0;
  let cPlan = 0, cOff = 0, cRepl = 0;
  let uPlan = 0, uOff = 0, uRepl = 0;

  // Apply new Recruitment Activity rules (July 17) – based on user spec
  // Planned:  (G = "H1 Additional New" or "2024 Carry Forward")  & Q = Hired & T NOT blank
  // Off-cycle: (G = "H1 Off-Cycle"     or "2024 Carry Forward")  & Q = Hired & T blank
  // Replacement: (G = "Replacement") & Q = Hired
  vals.slice(1).forEach(r=>{
    if(locs.length && !locSet.has(r[0].toString().toUpperCase())) return;   // location filter
    if((r[16]||'').toString().trim().toLowerCase() !== 'hired') return;      // status filter (Q)

    const cat = (r[6]||'').toString().trim().toLowerCase();                 // category (G)
    const codeBlank = ((r[19]||'').toString().trim() === '');               // T blank?

    const budget = +r[20] || 0;                                             // planned cost (U)
    const actual = +r[21] || 0;                                             // actual cost  (V)

    // Replacement logic
    if(cat === 'replacement'){
      hRepl++;  cRepl += actual;  uRepl += budget;
      return;
    }

    // Planned logic
    if((cat === 'h1 additional new' || cat === '2024 carry forward') && !codeBlank){
      hPlan++;  cPlan += actual;  uPlan += budget;
      return;
    }

    // Off-cycle logic
    if((cat === 'h1 off-cycle' || cat === '2024 carry forward') && codeBlank){
      hOff++;  cOff += actual;  uOff += budget;
      return;
    }
  });

  const devPlan = cPlan - uPlan;
  const devOff  = cOff  - uOff;
  const devTot  = (cPlan+cOff) - (uPlan+uOff);
  const devRepl = cRepl - uRepl;

  /* -------- Underwriting Specialist insight -------- */
  const uwRows = vals.slice(1).filter(r=>{
    if(locs.length && !locSet.has(r[0].toString().toUpperCase())) return false;
    return /underwriting specialist/i.test(r[4]||'');
  });
  const uwCount = uwRows.length;
  const uwPay   = uwRows.reduce((s,r)=>s + (+r[20]||0), 0);

  /* -------- risk division approved off-cycle HC -------- */
  const hdrOffHC   = ds.headers.find(h => hdr2grp[h]==='APPROVED OFFCYCLE' && strip(h)==='ADD NEW HC');
  const hdrOffCost = ds.headers.find(h => hdr2grp[h]==='APPROVED OFFCYCLE' && strip(h)==='ADD NEW COST');
  const riskRow    = ds.rows.find(r=> r.Division.toLowerCase()==='risk' );
  const riskOffHC  = riskRow && hdrOffHC ? riskRow[hdrOffHC] : 0;

  /* -------- build Top-4 off-cycle drivers -------- */
  const drivers = ds.rows
    .slice(0,-1)
    .map(r=>({
      Division: r.Division,
      hc:       r[hdrOffHC],
      cost:     r[hdrOffCost]
    }))
    .filter(o=>o.hc||o.cost)
    .sort((a,b)=> b.hc!==a.hc ? b.hc-a.hc : b.cost-a.cost)
    .slice(0,4);

  const totalDriversHC   = drivers.reduce((s,o)=>s+o.hc,   0);
  const totalDriversCost = drivers.reduce((s,o)=>s+o.cost, 0);
  const totalOffHC       = grand[hdrOffHC];
  const totalOffCost     = grand[hdrOffCost];

  return {
    budget:   { roles:{plan:rolesPlan,off:rolesOff,canc:rolesCanc,total:rolesTot,repl:rolesRepl},
                cost: {plan:costPlan ,off:costOff ,canc:costCanc ,total:costTot ,repl:costRepl } },
    recruit:  { hires:{plan:hPlan,off:hOff,total:hPlan+hOff,repl:hRepl},
                cost: {plan:cPlan,off:cOff,total:cPlan+cOff,repl:cRepl} },
    dev:      { plan:devPlan, off:devOff, total:devTot, repl:devRepl },
    uw:       { count:uwCount, pay:uwPay },
    riskOffHC:riskOffHC,
    offCycle: { drivers, totalDriversHC, totalDriversCost, totalOffHC, totalOffCost }
  };
}

/* ═════ 6. ENDPOINTS ═════ */
function getDivisionAggregatedData(month,locs){
  const sheet = month==='current' ? CURRENT_TAB : month;
  return buildDatasetByDivision(locs, sheet);
}
function getRolesData(divs,locs,cats){
  return buildRolesDataset(divs.map(normDiv), locs, cats);
}
function getHighlights(locs){
  return getHighlightsData(locs);
}

// Logo endpoint
function doGetLogo() {
  const fileId = '1Ok8YgX0K4O9kWCJ8l_iZ_2iWWBluBl4m';  // your Drive logo file
  const file   = DriveApp.getFileById(fileId);
  return ContentService
    .createOutput(file.getBlob())
    .setMimeType(file.getBlob().getContentType());
}

/* ═════ 7. SERVE PAGE ═════ */
function doGet(e) {
  // If URL has ?logo=1 then return logo blob
  if (e && e.parameter && e.parameter.logo) {
    return doGetLogo();
  }

  // Otherwise serve main page
  const t = HtmlService.createTemplateFromFile('Index');
  t.initialDataDiv   = JSON.stringify(buildDatasetByDivision([], CURRENT_TAB));
  t.initialDataRoles = JSON.stringify(buildRolesDataset([], [], []));
  t.initialHL        = JSON.stringify(getHighlightsData([]));
  t.divisionsJSON  = JSON.stringify(uniqueDivs());
  t.locationsJSON  = JSON.stringify(uniqueLocs());
  t.categoriesJSON = JSON.stringify(uniqueCats());
  t.monthsJSON     = JSON.stringify(monthsUI());
  t.barsJSON  = JSON.stringify(BAR);
  t.cellsJSON = JSON.stringify(CELL);
  t.spansJSON = JSON.stringify(BLOCKS.map(b=>b[1]));
  
  return t.evaluate()
          .setTitle('Budget Report H1 2025')
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}



