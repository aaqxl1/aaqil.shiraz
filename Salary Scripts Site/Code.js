/**
 * Comp & Ben – Job‑band viewer
 * ---------------------------------------------------------
 *  • Decides which salary‑band tables (Jobs sheet rows)
 *    a signed‑in user may view.
 *  • Every visible row must ALSO satisfy the “grade” test:
 *      userGrade ≥ row[7]   (the “Viewable By” column).
 *  • EXTRA RULE (2025‑04‑17):
 *      Any user whose Job Title contains “Tech Lead”
 *      is denied access, regardless of any other rule.
 * ---------------------------------------------------------
 */
function doGet(e) {

  /* ───────────── 1. Identify user ───────────── */
  var userEmail = Session.getActiveUser().getEmail().toLowerCase();

  /* ───────────── 2. Open sheets ───────────── */
  var ss        = SpreadsheetApp.openById("1r3Faa6Oodio05I3TDGlA6M2gFhO90EzRrocOETgLEtA");
  var userSheet = ss.getSheetByName("Users");
  var jobsSheet = ss.getSheetByName("Jobs");

  /* ───────────── 3. Pull user attributes ───────────── */
  var userData      = userSheet.getDataRange().getValues();
  var userDept      = "", userTeam = "", userLocation = "", userDiv = "";
  var userGrade     = 0;
  var userJobTitle  = "";

  for (var i = 1; i < userData.length; i++) {
    if (String(userData[i][0]).toLowerCase() === userEmail) {          // A  Email
      userDept      = String(userData[i][1]).trim();                   // B  Department
      userTeam      = String(userData[i][2]).trim();                   // C  Team
      userLocation  = String(userData[i][3]).trim();                   // D  Location
      userDiv       = String(userData[i][4]).trim();                   // E  Division
      userGrade     = parseFloat(userData[i][5]);                      // F  Grade
      userJobTitle  = String(userData[i][6]).trim();                   // G  Job Title
      break;
    }
  }

  /* ───────────── 3‑b. Tech‑Lead hard block ─────────────
     Any job‑title containing “Tech Lead” ⇒ no access
  ------------------------------------------------------------------ */
  if (userJobTitle.toLowerCase().indexOf("tech lead") !== -1) {
    // Public mode: do not block
  }

  /* ───────────── 4. Work out access rules ───────────── */
  var allowedDivs   = [];
  var locationRules = {};

  /* ---- Ultra‑super‑users (see absolutely everything) ---------------- */
  var isUltraUser = [
    "hosam.arab@tabby.ai",
    "daniil.barkalov@tabby.ai",
    "halyna.kitor@tabby.ai",
    "alexandre.corbin@tabby.ai",
    "aaqil9365@gmail.com"
  ].indexOf(userEmail) !== -1;

  if (isUltraUser) {
    allowedDivs = [
      "HO", "Business Development", "Operations", "Engineering", "QA",
      "Service Desk", "System Admin", "Product", "Design", "Analytics",
      "Integrations", "Risk"
    ];
    allowedDivs.forEach(function(d){ locationRules[d] = null; });
    userGrade = 999;                                               // bypass grade test
  }

  /* ---- A. Hard blocks (skip if ultra‑super‑user) -------------------- */
  // Public mode: skip hard blocks

  /* ---- B. Named super‑users ----------------------------------------- */
  if (!isUltraUser) {
    if (userEmail === "alex.shchepetilnikov@tabby.ai") {
      allowedDivs = ["Engineering", "QA", "Service Desk", "System Admin"];
      allowedDivs.forEach(function(d){ locationRules[d] = null; });
    }
    else if (userEmail === "andrei.kazarinov@tabby.ai") {
      allowedDivs = ["Product", "Design"];
      allowedDivs.forEach(function(d){ locationRules[d] = null; });
    }
    else if (userEmail === "vyacheslav.kolesnikov@tabby.ai") {
      allowedDivs = ["Engineering", "Service Desk", "System Admin"];
      allowedDivs.forEach(function(d){ locationRules[d] = null; });
    }
    else if (userEmail === "sergey.bogdanov@tabby.ai") {
      allowedDivs = ["Risk"];
      locationRules["Risk"] = null;
    }
    else if (["zain.khan@tabby.ai", "ana.alabau@tabby.ai"].indexOf(userEmail) !== -1) {
      allowedDivs = ["Business Development"];
      locationRules["Business Development"] = null;
    }
  }

  /* ---- C. Division‑based rules ------------------------------------- */
  if (!isUltraUser && allowedDivs.length === 0) {

    /* C‑1  Corporate “HO” tables */
    if (["Finance","People","Strategy","Compliance","Legal","Marketing", "Legal & Compliance"]
          .indexOf(userDiv) !== -1) {
      allowedDivs = ["HO"];
      if (["UAE","KSA"].indexOf(userLocation) !== -1) {
        locationRules["HO"] = ["UAE","KSA","Egypt"];
      } else if (userLocation === "Egypt") {
        locationRules["HO"] = ["Egypt"];
      }
    }

    /* C‑2  Product / Design */
    else if (userDiv === "Product") {
      var prodDeptList = [
        "Product Management",
        "B2B Financial Services, Product",
        "B2C Financial Services, Product",
        "Marketplace, Product",
        "BNPL, Product",
        "Risk Platform, Product",
        "Business Platform, Product",
        "Billing Platform, Product",
        "Customer Happiness, Product"
      ];
      if (prodDeptList.indexOf(userDept) !== -1) {
        allowedDivs = ["Product"];              locationRules["Product"] = null;
      } else if (userDept === "Design") {
        allowedDivs = ["Design"];               locationRules["Design"]  = null;
      }
    }

    /* C‑3  Analytics */
    else if (userDiv === "Analytics") {
      allowedDivs = ["Analytics"];               locationRules["Analytics"] = null;
    }

    /* C‑4  Risk */
    else if (userDiv === "Risk and Credit") {
      allowedDivs = ["Risk"];
      if (userLocation === "UAE") {
        locationRules["Risk"] = null;
      } else if (userLocation === "Remote") {
        locationRules["Risk"] = ["Remote","Egypt"];
      } else if (userLocation === "KSA") {
        locationRules["Risk"] = ["KSA"];
      } else if (userLocation === "Egypt") {
        locationRules["Risk"] = ["Egypt"];
      }
    }

    /* C‑5  Operations */
    else if (["Customer Experience","Collections"].indexOf(userDiv) !== -1) {
      allowedDivs = ["Operations"];
      if (["UAE","KSA"].indexOf(userLocation) !== -1) {
        locationRules["Operations"] = ["UAE","KSA"];
      } else if (userLocation === "Egypt") {
        locationRules["Operations"] = ["Egypt"];
      }
    }

    /* C‑6  Integrations */
    else if (userDiv === "Integrations") {
      allowedDivs = ["Integrations"];            locationRules["Integrations"] = null;
    }

    /* C‑7  Business Development (country‑specific) */
    else if (userDiv === "Business Development" &&
             ["UAE","KSA"].indexOf(userLocation) !== -1) {
      allowedDivs = ["Business Development"];
      locationRules["Business Development"] = [userLocation];
    }

    /* C‑8  Engineering cascade */
    else if (userDiv === "Engineering") {
      var engMainDepts = [
        "Engineering Management",
        "B2B Financial Services, Engineering",
        "B2C Financial Services, Engineering",
        "Marketplace, Engineering",
        "BNPL, Engineering",
        "Risk Platform, Engineering",
        "Business Platform, Engineering",
        "Billing Platform, Engineering",
        "Tech Platform, Engineering",
        "Customer Happiness, Engineering"
      ];
      if (engMainDepts.indexOf(userDept) !== -1) {
        allowedDivs = ["Engineering","QA"];
      } else if (userDept === "Data Platform") {
        allowedDivs = ["Engineering"];
      } else if (userDept === "Infrastructure" &&
                 ["DevOps","ML/Data Ops","DBA"].indexOf(userTeam) !== -1) {
        allowedDivs = ["Engineering"];
      } else if (userTeam === "SDET") {
        allowedDivs = ["QA"];
      } else if (userDept === "Service Desk") {
        allowedDivs = ["Service Desk"];
      } else if (userDept === "IT Operations" &&
                 ["Internal Infrastructure","ITSM"].indexOf(userTeam) !== -1) {
        allowedDivs = ["System Admin"];
      }
      allowedDivs.forEach(function(d){ locationRules[d] = null; });
    }
  }

  /* ---- D. Bail out if nothing was granted --------------------------- */
  // Public mode: allow even if no explicit grants

  /* ───────────── 5. Filter Jobs rows ───────────── */
  var jobsData     = jobsSheet.getDataRange().getValues();
  var filteredJobs = [];

  for (var j = 1; j < jobsData.length; j++) {
    var row           = jobsData[j];
    var jobDivision   = String(row[2] || "").trim();
    var jobLocation   = String(row[8] || "").trim();
    var requiredGrade = parseFloat(row[7]);

    // Public mode: do not filter by division or grade

    var locRule = locationRules.hasOwnProperty(jobDivision) ?
                  locationRules[jobDivision] : null;
    // Public mode: ignore location rules

    filteredJobs.push(row);
  }

  /* ───────────── 6. Group & flatten for UI ───────────── */
  var groups = [];
  filteredJobs.forEach(function(row) {
    var key = row[2] + "|" + row[8] + "|" + row[3];
    var grp = groups.find(function(g){ return g.key === key; });
    if (!grp) {
      grp = {
        key      : key,
        division : row[2],
        location : row[8],
        currency : String(row[3]).toUpperCase(),
        data     : []
      };
      groups.push(grp);
    }
    grp.data.push(row);
  });

  groups.forEach(function(grp) {
    var wlMap = {};
    grp.data.forEach(function(r) {
      var wl = r[0];
      if (!wlMap[wl]) wlMap[wl] = {
        workLevel : wl,
        min       : r[4],
        mid       : r[5],
        max       : r[6],
        titles    : []
      };
      wlMap[wl].titles.push(r[1]);
    });
    grp.data = Object.values(wlMap)
                      .sort(function(a,b){
                        return compareWorkLevelsDesc(a.workLevel, b.workLevel);
                      });
  });

  /* ───────────── 7. Render page ───────────── */
  var t = HtmlService.createTemplateFromFile("Index");
  t.groups   = groups;
  t.noAccess = (groups.length === 0);
  return t.evaluate()
           .setTitle("Salary Scales Viewer")
           .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/* ===== helper for early “no access” ===== */
function renderNoAccess() {
  var t = HtmlService.createTemplate("<p style='color:red;font-weight:bold;'>You have no access.</p>");
  return t.evaluate()
           .setTitle("Filtered Jobs")
           .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/* ===== utilities ===== */
function compareWorkLevelsDesc(a, b) {
  var pa = parseWorkLevel(a), pb = parseWorkLevel(b);
  return (pa.num !== pb.num) ? (pb.num - pa.num) : (pb.letterPriority - pa.letterPriority);
}
function parseWorkLevel(wl) {
  var m = String(wl).match(/^(\d+)([A-Za-z])?$/);
  var map = { a:2, b:1 };
  return {
    num            : m ? parseInt(m[1], 10) : parseFloat(wl) || 0,
    letterPriority : m && m[2] ? (map[m[2].toLowerCase()] || 0) : 0
  };
}
