/* heur-live.js - the heuristic review bench, the severity matrix and the
   data-contract validator, for learn-data-heuristics-with-phoebe.

   Honesty rail, stated on every widget that uses it: the DASHBOARD under review
   is a real thing rendered into the page, and every detector reads the rendered
   DOM rather than a list of answers. Nothing about the catch count is scripted.
   What IS modelled is the review-effort estimate in minutes, which is a
   straight-line cost model, not a measurement of anybody's real review.

   Offline, deterministic, no dependencies. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * 1. Tideline - the product under review
   * ------------------------------------------------------------------ */

  /* Tideline is a subscription-analytics screen. It is rendered with twenty
     real defects: a genuinely truncated axis whose bars really do lie, a real
     gauge element, real four-decimal precision, real email addresses in the
     clear. The detectors below find them by querying this DOM. */

  var CHURN = [
    { m: "Mar", v: 47.1 }, { m: "Apr", v: 48.0 }, { m: "May", v: 48.6 },
    { m: "Jun", v: 49.2 }, { m: "Jul", v: 51.4 }, { m: "Aug", v: 52.0 }
  ];
  var AXIS_MIN = 40;   /* the defect: a bar chart that does not start at zero */
  var AXIS_MAX = 54;

  function svgChurn() {
    var w = 300, h = 130, pad = 26, bw = 30, gap = 14;
    var span = AXIS_MAX - AXIS_MIN;
    var bars = CHURN.map(function (d, i) {
      var frac = (d.v - AXIS_MIN) / span;
      var bh = Math.max(1, Math.round(frac * (h - pad - 14)));
      var x = pad + i * (bw + gap);
      var y = h - 14 - bh;
      /* data-val carries the true number so the lie factor can be computed
         from rendered geometry against it - the detector does the maths. */
      return '<rect class="tlB" x="' + x + '" y="' + y + '" width="' + bw +
             '" height="' + bh + '" data-val="' + d.v + '"></rect>' +
             '<text class="tlL" x="' + (x + bw / 2) + '" y="' + (h - 3) + '">' + d.m + "</text>";
    }).join("");
    return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Retention by month">' +
      "<style>" +
      ".tlB{fill:#0891B2}.tlL{fill:#566A72;font:10px system-ui;text-anchor:middle}" +
      ".tlA{fill:#566A72;font:9px system-ui}.tlG{stroke:#DCE7EB;stroke-width:1}" +
      "</style>" +
      '<line class="tlG" x1="' + pad + '" y1="' + (h - 14) + '" x2="' + (w - 6) + '" y2="' + (h - 14) + '"></line>' +
      '<text class="tlA" x="2" y="' + (h - 16) + '">' + AXIS_MIN + "</text>" +
      '<text class="tlA" x="2" y="14">' + AXIS_MAX + "</text>" +
      bars + "</svg>";
  }

  function svgGauge() {
    /* a gauge for a single number - Few's pitfall 5 and 7, rendered for real */
    return '<svg viewBox="0 0 150 90" role="img" aria-label="Health gauge" data-media="gauge">' +
      "<style>.gA{fill:none;stroke:#DCE7EB;stroke-width:12}.gB{fill:none;stroke:#166534;stroke-width:12}" +
      ".gT{fill:#0F1E24;font:700 17px system-ui;text-anchor:middle}</style>" +
      '<path class="gA" d="M20 76 A 55 55 0 0 1 130 76"></path>' +
      '<path class="gB" d="M20 76 A 55 55 0 0 1 112 34"></path>' +
      '<text class="gT" x="75" y="72">78</text></svg>';
  }

  function svgSignups() {
    /* raw counts where a rate is the decision-relevant measure */
    var pts = [8, 11, 9, 14, 13, 17], w = 250, h = 78;
    var d = pts.map(function (v, i) {
      return (i ? "L" : "M") + (18 + i * 44) + " " + (h - 10 - v * 3.2);
    }).join(" ");
    return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Signups by month">' +
      "<style>.sL{fill:none;stroke:#E11D48;stroke-width:2.5}.sD{fill:#E11D48}</style>" +
      '<path class="sL" d="' + d + '"></path>' +
      pts.map(function (v, i) {
        return '<circle class="sD" cx="' + (18 + i * 44) + '" cy="' + (h - 10 - v * 3.2) + '" r="3"></circle>';
      }).join("") + "</svg>";
  }

  /* Eleven plan slices, each with its own colour and no legend - Few's
     "meaningless variety" and colour overuse, actually rendered. */
  var PLANS = [
    ["Starter", 9, "#0891B2"], ["Starter+", 7, "#E11D48"], ["Team", 14, "#166534"],
    ["Team+", 6, "#9F1239"], ["Business", 12, "#164E63"], ["Business+", 5, "#B91C1C"],
    ["Scale", 11, "#0E7490"], ["Scale+", 4, "#6B0F26"], ["Enterprise", 16, "#7F1D1D"],
    ["Legacy", 8, "#A5F3FC"], ["Trial", 8, "#566A72"]
  ];

  function svgPlanMix() {
    var w = 300, h = 96, bw = 24, gap = 3;
    var bars = PLANS.map(function (p, i) {
      var bh = p[1] * 4.6;
      return '<rect x="' + (6 + i * (bw + gap)) + '" y="' + (h - 12 - bh) +
             '" width="' + bw + '" height="' + bh + '" fill="' + p[2] + '"></rect>';
    }).join("");
    return '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Revenue share by plan">' +
      bars + "</svg>";
  }

  /* A red/green pair carrying meaning with no second cue - real, and detected. */
  function svgStatus() {
    var cols = ["#166534", "#991B1B", "#166534", "#991B1B", "#166534"];
    return '<svg viewBox="0 0 150 24" role="img" aria-label="Account status row">' +
      cols.map(function (c, i) {
        return '<rect x="' + (i * 30) + '" y="6" width="20" height="12" rx="3" fill="' + c + '"></rect>';
      }).join("") + "</svg>";
  }

  function stageHTML() {
    return '' +
      '<div class="hb-stage-h">' +
        "<b>Tideline &middot; Revenue and retention</b>" +
        "<span>the product under review</span>" +
      "</div>" +
      '<div class="hb-panels hb-scroll">' +
        '<div class="hb-panel" data-p="mrr">' +
          '<div class="hb-pt">MRR</div>' +
          '<div class="hb-pn">48231.4472</div>' +
          '<div class="hb-ps">up on last month</div>' +
        "</div>" +
        '<div class="hb-panel" data-p="churn">' +
          '<div class="hb-pt">Retention rate</div>' + svgChurn() +
        "</div>" +
        '<div class="hb-panel" data-p="health">' +
          '<div class="hb-pt">Account health</div>' + svgGauge() +
        "</div>" +
        '<div class="hb-panel" data-p="signups">' +
          '<div class="hb-pt">Signups</div>' +
          '<div data-indirect="count-for-rate">' + svgSignups() + "</div>" +
          '<div class="hb-ps">17 signups in August</div>' +
        "</div>" +
        '<div class="hb-panel" data-p="planmix">' +
          '<div class="hb-pt">Revenue share by plan</div>' + svgPlanMix() +
        "</div>" +
        '<div class="hb-panel" data-p="forecast">' +
          '<div class="hb-pt">Q4 forecast</div>' +
          '<div class="hb-pn">61400</div>' +
          '<div class="hb-ps">model v3</div>' +
        "</div>" +
        '<div class="hb-panel" data-p="ai">' +
          '<div class="hb-pt">AI insight</div>' +
          '<div class="hb-ps">Enterprise churn is being driven by seat under-use.</div>' +
        "</div>" +
        '<div class="hb-panel" data-p="accounts">' +
          '<div class="hb-pt">At-risk accounts</div>' +
          '<table class="hb-tbl"><tbody>' +
            "<tr><td>Northwind</td><td>dana.okafor@northwind.example</td></tr>" +
            "<tr><td>Harbourline</td><td>s.petrov@harbourline.example</td></tr>" +
          "</tbody></table>" + svgStatus() +
        "</div>" +
      "</div>";
  }

  /* ------------------------------------------------------------------ *
   * 2. The detectors - each one reads the DOM, none reads an answer key
   * ------------------------------------------------------------------ */

  function txt(el) { return el ? (el.textContent || "") : ""; }
  function has(root, sel) { return root.querySelector(sel) !== null; }

  /* An absent attribute and an empty attribute are different things, and
     getAttribute returns "" for the second - so test against null explicitly
     rather than leaning on truthiness. */
  function attrMissing(el, name) {
    return el === null || el.getAttribute(name) === null;
  }

  var DEFECTS = [
    {
      id: "D1", label: "No freshness stamp anywhere on the screen",
      why: "A reader cannot tell whether this is this morning or last quarter.",
      test: function (st) { return attrMissing(st.querySelector("[data-fresh]"), "data-fresh"); }
    },
    {
      id: "D2", label: "MRR shown to four decimal places",
      why: "Precision beyond the decision is noise that costs reading time.",
      test: function (st) { return /\d+\.\d{3,}/.test(txt(st)); }
    },
    {
      id: "D3", label: "Measures carry no unit or currency",
      why: "48231 of what, and per what period, is left to the reader.",
      test: function (st) {
        var ns = st.querySelectorAll(".hb-pn");
        for (var i = 0; i < ns.length; i++) {
          if (attrMissing(ns[i], "data-unit")) return true;
        }
        return ns.length === 0;
      }
    },
    {
      id: "D4", label: "Retention bars start at 40, not zero",
      why: "The bars overstate the real change by several times.",
      test: function (st) {
        var bars = st.querySelectorAll("rect[data-val]");
        if (bars.length < 2) return false;
        var lo = null, hi = null;
        for (var i = 0; i < bars.length; i++) {
          var v = parseFloat(bars[i].getAttribute("data-val"));
          var px = parseFloat(bars[i].getAttribute("height"));
          if (lo === null || v < lo.v) lo = { v: v, px: px };
          if (hi === null || v > hi.v) hi = { v: v, px: px };
        }
        /* Tufte's lie factor: the size of the effect shown, over the size of
           the effect in the data. Computed from the rendered rectangles. */
        var shown = (hi.px - lo.px) / lo.px;
        var real = (hi.v - lo.v) / lo.v;
        var lie = real === 0 ? 1 : shown / real;
        this.detail = "lie factor " + lie.toFixed(1) + " to 1";
        return lie > 1.5;
      }
    },
    {
      id: "D5", label: "A gauge used to show one number",
      why: "It spends a quarter of the panel to encode a single value badly.",
      test: function (st) { return has(st, '[data-media="gauge"]'); }
    },
    {
      id: "D6", label: "Signups given as a count where the rate is the measure",
      why: "17 signups means nothing without the traffic it came from.",
      test: function (st) { return has(st, "[data-indirect]"); }
    },
    {
      id: "D7", label: "Eleven distinct fill colours on one screen",
      why: "Colour stops meaning anything once everything has its own.",
      test: function (st) {
        /* Resolve the colour actually painted, so a fill set in a stylesheet
           counts the same as one set on the element. */
        var fills = {}, n = 0;
        var els = st.querySelectorAll("rect, path, circle, text, polygon");
        for (var i = 0; i < els.length; i++) {
          var f = window.getComputedStyle(els[i]).fill;
          if (f && f !== "none" && f !== "rgba(0, 0, 0, 0)" && !fills[f]) {
            fills[f] = 1; n++;
          }
        }
        this.detail = n + " distinct fills";
        return n > 8;
      }
    },
    {
      id: "D8", label: "Status carried by red and green alone",
      why: "About one man in twelve cannot read that row at all.",
      test: function (st) {
        var els = st.querySelectorAll('[fill="#166534"], [fill="#991B1B"]');
        if (els.length === 0) return false;
        var row = els[0].parentNode;
        return row.querySelectorAll("text").length === 0;
      }
    },
    {
      id: "D9", label: "Every panel has identical visual weight",
      why: "Nothing is highlighted, so the eye has no entry point.",
      test: function (st) {
        var ps = st.querySelectorAll(".hb-panel");
        for (var i = 0; i < ps.length; i++) {
          if (ps[i].getAttribute("data-lead") !== null) return false;
        }
        return ps.length > 1;
      }
    },
    {
      id: "D10", label: "The screen does not fit its own frame",
      why: "Anything below the fold is read by almost nobody.",
      test: function (st) {
        var sc = st.querySelector(".hb-panels");
        if (sc === null) return false;
        var hidden = sc.scrollHeight - sc.clientHeight;
        this.detail = hidden + "px below the fold";
        return hidden > 8;
      }
    },
    {
      id: "D11", label: "The AI panel never says what it can do",
      why: "Readers guess the scope, and guess generously.",
      test: function (st) { return attrMissing(st.querySelector('[data-p="ai"]'), "data-can"); }
    },
    {
      id: "D12", label: "The AI panel never says how well it does it",
      why: "A claim with no accuracy attached is read as certainty.",
      test: function (st) { return attrMissing(st.querySelector('[data-p="ai"]'), "data-howwell"); }
    },
    {
      id: "D13", label: "No explanation of why the AI said that",
      why: "An unexplained claim cannot be checked, only believed.",
      test: function (st) { return attrMissing(st.querySelector('[data-p="ai"]'), "data-why"); }
    },
    {
      id: "D14", label: "No way to correct or dismiss the AI claim",
      why: "The reader who knows it is wrong has nowhere to put that.",
      test: function (st) {
        var ai = st.querySelector('[data-p="ai"]');
        return ai === null ? false : !has(ai, "button, [data-correct]");
      }
    },
    {
      id: "D15", label: "No owner named for the screen or its data",
      why: "A number nobody owns is a number nobody fixes.",
      test: function (st) { return attrMissing(st, "data-owner"); }
    },
    {
      id: "D16", label: "No lineage or provenance for any measure",
      why: "When two screens disagree there is no way to find out why.",
      test: function (st) { return attrMissing(st, "data-lineage"); }
    },
    {
      id: "D17", label: "Customer email addresses shown in the clear",
      why: "Personal data on a screen that anyone with the link can open.",
      test: function (st) { return /[\w.\-]+@[\w.\-]+\.\w+/.test(txt(st)); }
    },
    {
      id: "D18", label: "No decision this screen exists to support",
      why: "Without a named decision there is no test for whether it works.",
      test: function (st) { return attrMissing(st, "data-decision"); }
    },
    {
      id: "D19", label: "No freshness promise, so no way to be late",
      why: "A pipeline with no stated deadline cannot miss one.",
      test: function (st) { return attrMissing(st, "data-slo"); }
    },
    {
      id: "D20", label: "No evidence the data was tested before it landed",
      why: "The first person to notice bad data is the reader.",
      test: function (st) { return attrMissing(st, "data-tested"); }
    }
  ];

  /* Twelve things that are TRUE of this DOM and are not defects. They exist so
     the exhaustive pass has something real to be wrong about. */
  var FALSE_POSITIVES = [
    { id: "F1", label: "Uses more than one font weight", test: function (st) { return has(st, "b, .hb-pt"); } },
    { id: "F2", label: "Panels have rounded corners", test: function (st) { return has(st, ".hb-panel"); } },
    { id: "F3", label: "More than three panels on screen", test: function (st) { return st.querySelectorAll(".hb-panel").length > 3; } },
    { id: "F4", label: "A number is set in bold", test: function (st) { return has(st, ".hb-pn"); } },
    { id: "F5", label: "Uses a table rather than a chart", test: function (st) { return has(st, "table"); } },
    { id: "F6", label: "A chart has a baseline rule", test: function (st) { return has(st, "line"); } },
    { id: "F7", label: "Month labels are abbreviated", test: function (st) { return st.querySelectorAll(".tlL").length > 0; } },
    { id: "F8", label: "Panel titles are in sentence case", test: function (st) { return /Account health/.test(txt(st)); } },
    { id: "F9", label: "A chart uses circular marks", test: function (st) { return has(st, "circle"); } },
    { id: "F10", label: "Two charts use different mark types", test: function (st) { return has(st, "rect") && has(st, "path"); } },
    { id: "F11", label: "An axis label sits outside the plot", test: function (st) { return has(st, ".tlA"); } },
    { id: "F12", label: "Supporting text is smaller than the number", test: function (st) { return has(st, ".hb-ps"); } }
  ];

  /* ------------------------------------------------------------------ *
   * 3. The lenses - which named set catches which defect
   * ------------------------------------------------------------------ */

  var LENSES = [
    { key: "nng", name: "NN/g 10 usability heuristics", meta: "Nielsen 1994, rev. 2020",
      catches: ["D1", "D7", "D8", "D9", "D14"] },
    { key: "few", name: "Few's 13 dashboard pitfalls", meta: "Few 2006",
      catches: ["D2", "D3", "D5", "D6", "D7", "D9", "D10"] },
    { key: "tufte", name: "Tufte on graphical integrity", meta: "Tufte 1983",
      catches: ["D4", "D7"] },
    { key: "ibcs", name: "IBCS SUCCESS rules", meta: "IBCS 1.2",
      catches: ["D3", "D4", "D9"] },
    { key: "msft", name: "Microsoft's 18 human-AI guidelines", meta: "Amershi et al. 2019",
      catches: ["D11", "D12", "D13", "D14"] },
    { key: "pair", name: "Google PAIR guidebook", meta: "PAIR 2019",
      catches: ["D11", "D13", "D14"] },
    { key: "dprod", name: "Data-as-a-product attributes, FAIR, DAMA", meta: "Dehghani 2022, FAIR 2016",
      catches: ["D3", "D15", "D16", "D17"] },
    { key: "ops", name: "DataOps manifesto and the golden signals", meta: "DataOps, Google SRE",
      catches: ["D1", "D16", "D19", "D20"] },
    { key: "gqm", name: "GQM and HEART", meta: "Basili 1994, Rodden 2010",
      catches: ["D9", "D18"] }
  ];

  var MIN_PER_LENS = 4;      /* modelled review cost */
  var MIN_PER_FINDING = 1.5;
  var MIN_EXHAUSTIVE = 60;

  /* ------------------------------------------------------------------ *
   * 4. The bench
   * ------------------------------------------------------------------ */

  function buildBench(host) {
    var on = {}, exhaustive = false;
    LENSES.forEach(function (l) { on[l.key] = false; });
    on.nng = true;

    host.innerHTML = '' +
      '<div class="hb-honesty"><b>Measured, not scripted.</b> Tideline is rendered into this ' +
      "page and every check below reads that rendered screen. The lie factor is computed from " +
      "the drawn bar heights. Only the review-time estimate is a model.</div>" +
      '<div class="hb-board">' +
        '<div class="hb-tile"><span class="hb-k">Caught</span><span class="hb-v" id="hbCaught">0</span><span class="hb-note">of 20 real defects</span></div>' +
        '<div class="hb-tile" id="hbFPTile"><span class="hb-k">False flags</span><span class="hb-v" id="hbFP">0</span><span class="hb-note">things that are fine</span></div>' +
        '<div class="hb-tile"><span class="hb-k">Precision</span><span class="hb-v" id="hbPrec">100%</span><span class="hb-note">findings that are real</span></div>' +
        '<div class="hb-tile"><span class="hb-k">Review cost</span><span class="hb-v" id="hbMin">0</span><span class="hb-note">modelled minutes</span></div>' +
      "</div>" +
      '<div class="hb-lenses" id="hbLenses"></div>' +
      '<div class="hb-ctl">' +
        '<button class="hb-btn hb-primary" id="hbAll">Turn on all nine lenses</button>' +
        '<button class="hb-btn" id="hbNone">Back to NN/g only</button>' +
      "</div>" +
      '<div class="hb-stage" id="hbStage"></div>' +
      '<div id="hbReport"></div>';

    var stage = host.querySelector("#hbStage");
    stage.innerHTML = stageHTML();

    var lensWrap = host.querySelector("#hbLenses");
    LENSES.forEach(function (l) {
      var lab = document.createElement("label");
      lab.className = "hb-lens";
      lab.setAttribute("data-on", on[l.key] ? "1" : "0");
      lab.innerHTML = '<input type="checkbox"' + (on[l.key] ? " checked" : "") + '>' +
        '<span class="hb-ln">' + l.name + "<em>" + l.meta + "</em></span>" +
        '<span class="hb-lc">' + l.catches.length + " checks</span>";
      lab.querySelector("input").addEventListener("change", function () {
        on[l.key] = this.checked;
        lab.setAttribute("data-on", this.checked ? "1" : "0");
        run();
      });
      lensWrap.appendChild(lab);
    });

    var anti = document.createElement("label");
    anti.className = "hb-lens hb-anti";
    anti.setAttribute("data-on", "0");
    anti.innerHTML = '<input type="checkbox">' +
      '<span class="hb-ln">Check all 215 principles<em>every set in the canon, nothing left out</em></span>' +
      '<span class="hb-badge">watch this</span>';
    anti.querySelector("input").addEventListener("change", function () {
      exhaustive = this.checked;
      anti.setAttribute("data-on", this.checked ? "1" : "0");
      run();
    });
    lensWrap.appendChild(anti);

    host.querySelector("#hbAll").addEventListener("click", function () {
      LENSES.forEach(function (l) { on[l.key] = true; });
      syncBoxes(); run();
    });
    host.querySelector("#hbNone").addEventListener("click", function () {
      LENSES.forEach(function (l) { on[l.key] = (l.key === "nng"); });
      exhaustive = false;
      anti.querySelector("input").checked = false;
      anti.setAttribute("data-on", "0");
      syncBoxes(); run();
    });

    function syncBoxes() {
      var labs = lensWrap.querySelectorAll(".hb-lens:not(.hb-anti)");
      LENSES.forEach(function (l, i) {
        labs[i].querySelector("input").checked = on[l.key];
        labs[i].setAttribute("data-on", on[l.key] ? "1" : "0");
      });
    }

    function activeIds() {
      var set = {};
      LENSES.forEach(function (l) {
        if (on[l.key]) l.catches.forEach(function (d) { set[d] = 1; });
      });
      return set;
    }

    function run() {
      var wanted = activeIds();
      var found = [], fps = [];

      DEFECTS.forEach(function (d) {
        if (!exhaustive && !wanted[d.id]) return;
        d.detail = null;
        var hit = false;
        try { hit = d.test(stage); } catch (e) { hit = false; }
        if (hit) {
          found.push({
            id: d.id, label: d.label, why: d.why, detail: d.detail,
            by: LENSES.filter(function (l) {
              return (exhaustive || on[l.key]) && l.catches.indexOf(d.id) >= 0;
            }).map(function (l) { return l.key; })
          });
        }
      });

      if (exhaustive) {
        FALSE_POSITIVES.forEach(function (f) {
          var hit = false;
          try { hit = f.test(stage); } catch (e) { hit = false; }
          if (hit) fps.push(f);
        });
      }

      var lensCount = LENSES.filter(function (l) { return on[l.key]; }).length;
      var mins = lensCount * MIN_PER_LENS +
                 (found.length + fps.length) * MIN_PER_FINDING +
                 (exhaustive ? MIN_EXHAUSTIVE : 0);
      var total = found.length + fps.length;
      var prec = total === 0 ? 100 : Math.round((found.length / total) * 100);

      host.querySelector("#hbCaught").textContent = found.length;
      host.querySelector("#hbFP").textContent = fps.length;
      host.querySelector("#hbPrec").textContent = prec + "%";
      host.querySelector("#hbMin").textContent = Math.round(mins);
      host.querySelector("#hbFPTile").className = "hb-tile" + (fps.length > 0 ? " hb-bad" : "");

      /* mark the panels the review has something to say about */
      var panels = stage.querySelectorAll(".hb-panel");
      for (var i = 0; i < panels.length; i++) {
        panels[i].className = "hb-panel";
        var pill = panels[i].querySelector(".hb-pill");
        if (pill) pill.parentNode.removeChild(pill);
      }
      var PANEL_OF = {
        D2: "mrr", D3: "mrr", D4: "churn", D5: "health", D6: "signups",
        D11: "ai", D12: "ai", D13: "ai", D14: "ai", D17: "accounts", D8: "accounts"
      };
      var perPanel = {};
      found.forEach(function (f) {
        var p = PANEL_OF[f.id];
        if (p) perPanel[p] = (perPanel[p] || 0) + 1;
      });
      Object.keys(perPanel).forEach(function (p) {
        var el = stage.querySelector('[data-p="' + p + '"]');
        if (el) {
          el.className = "hb-panel hb-flagged";
          var s = document.createElement("span");
          s.className = "hb-pill";
          s.textContent = perPanel[p];
          el.appendChild(s);
        }
      });

      renderReport(host.querySelector("#hbReport"), found, fps, lensCount, prec);
    }

    function renderReport(box, found, fps, lensCount, prec) {
      var lensNames = {};
      LENSES.forEach(function (l) { lensNames[l.key] = l.name.split(" ")[0]; });

      var head = "<p class=\"mono\">" + lensCount + " of 9 lenses on" +
        (fps.length ? ", plus the exhaustive pass" : "") + " &middot; " +
        found.length + " real, " + fps.length + " false, " + prec + "% precision</p>";

      if (found.length === 0 && fps.length === 0) {
        box.innerHTML = head + '<p class="hb-empty">No lens is on, so nothing is being looked for.</p>';
        return;
      }
      var rows = found.map(function (f) {
        var src = f.by.map(function (k) { return lensNames[k]; }).join(", ");
        return "<li><span class=\"hb-sev hb-s3\">" + f.id + "</span>" +
          "<span><b>" + f.label + "</b>" + (f.detail ? " <span class=\"mono\">(" + f.detail + ")</span>" : "") +
          "<br><span class=\"hb-ps\">" + f.why + "</span></span>" +
          "<span class=\"hb-src\">" + (src || "exhaustive") + "</span></li>";
      }).join("");
      var fprows = fps.map(function (f) {
        return "<li class=\"hb-fp\"><span class=\"hb-sev hb-s1\">" + f.id + "</span>" +
          "<span>" + f.label + "<br><span class=\"hb-ps\">True of the screen. Not a defect.</span></span>" +
          "<span class=\"hb-src\">false flag</span></li>";
      }).join("");
      box.innerHTML = head + '<ul class="hb-findings">' + rows + fprows + "</ul>";
    }

    run();
  }

  /* ------------------------------------------------------------------ *
   * 5. The severity matrix - Nielsen's three factors, computed
   * ------------------------------------------------------------------ */

  var SEV_ITEMS = [
    { id: "D17", label: "Emails in the clear", f: 3, i: 4, p: 4 },
    { id: "D4", label: "Truncated retention axis", f: 4, i: 4, p: 3 },
    { id: "D2", label: "Four decimal places on MRR", f: 4, i: 1, p: 1 },
    { id: "D5", label: "Gauge for one number", f: 2, i: 2, p: 3 }
  ];

  function buildSeverity(host) {
    var state = SEV_ITEMS.map(function (s) { return { id: s.id, label: s.label, f: s.f, i: s.i, p: s.p }; });

    var head = '<div class="hb-honesty">Nielsen rates a problem on how often it hits, how badly ' +
      "it hits, and whether people learn to work around it. Move the three and watch the fix " +
      "order change.</div>";
    var grid = '<div class="sv-grid">' +
      '<span class="sv-h">Finding</span><span class="sv-h">Frequency</span>' +
      '<span class="sv-h">Impact</span><span class="sv-h">Persistence</span><span class="sv-h">Severity</span>';
    state.forEach(function (s, n) {
      grid += "<span>" + s.label + "</span>";
      ["f", "i", "p"].forEach(function (k) {
        grid += '<input type="range" min="0" max="4" step="1" value="' + s[k] +
                '" data-n="' + n + '" data-k="' + k + '">';
      });
      grid += '<span class="sv-out" data-out="' + n + '">0.0</span>';
    });
    grid += "</div>";
    host.innerHTML = head + grid + '<div class="sv-order" id="svOrder"></div>';

    function paint() {
      state.forEach(function (s, n) {
        s.sev = (s.f + s.i + s.p) / 3;
        host.querySelector('[data-out="' + n + '"]').textContent = s.sev.toFixed(1);
      });
      var ranked = state.slice().sort(function (a, b) { return b.sev - a.sev; });
      host.querySelector("#svOrder").innerHTML =
        "<b>Fix in this order</b><ol>" + ranked.map(function (s) {
          return "<li>" + s.label + " <span class=\"mono\">" + s.sev.toFixed(1) + "</span></li>";
        }).join("") + "</ol>";
    }

    var rs = host.querySelectorAll('input[type="range"]');
    for (var i = 0; i < rs.length; i++) {
      rs[i].addEventListener("input", function () {
        state[+this.getAttribute("data-n")][this.getAttribute("data-k")] = +this.value;
        paint();
      });
    }
    paint();
  }

  /* ------------------------------------------------------------------ *
   * 6. The contract validator - real parsing, real checks
   * ------------------------------------------------------------------ */

  var SAMPLE = [
    "name: tideline_retention_monthly",
    "description: monthly retention rate by plan",
    "owner: retention-analytics@tideline.example",
    "url: https://data.tideline.example/products/retention_monthly",
    "schema: plan:string, month:date, retained:int, base:int",
    "license: internal-only",
    "refresh: daily 06:00 UTC"
  ].join("\n");

  var CONTRACT_CHECKS = [
    { g: "FAIR", k: "F1 persistent identifier", need: ["id", "urn", "identifier"] },
    { g: "FAIR", k: "F2 rich metadata", need: ["description"] },
    { g: "FAIR", k: "F4 indexed in a catalog", need: ["catalog", "registry"] },
    { g: "FAIR", k: "A1 access protocol stated", need: ["url", "endpoint", "protocol"] },
    { g: "FAIR", k: "A1.2 authentication where needed", need: ["auth", "access_policy"] },
    { g: "FAIR", k: "I1 formal schema", need: ["schema"] },
    { g: "FAIR", k: "I3 qualified references out", need: ["upstream", "references", "links"] },
    { g: "FAIR", k: "R1.1 usage licence", need: ["license", "licence"] },
    { g: "FAIR", k: "R1.2 detailed provenance", need: ["lineage", "provenance"] },
    { g: "DAMA", k: "Accuracy test declared", need: ["accuracy"] },
    { g: "DAMA", k: "Completeness test declared", need: ["completeness", "not_null"] },
    { g: "DAMA", k: "Consistency test declared", need: ["consistency"] },
    { g: "DAMA", k: "Timeliness test declared", need: ["timeliness", "freshness", "slo"] },
    { g: "DAMA", k: "Validity test declared", need: ["validity", "range"] },
    { g: "DAMA", k: "Uniqueness test declared", need: ["uniqueness", "unique_key"] },
    { g: "Data product", k: "Discoverable", need: ["catalog", "registry", "tags"] },
    { g: "Data product", k: "Addressable", need: ["url", "endpoint"] },
    { g: "Data product", k: "Understandable", need: ["description", "schema"] },
    { g: "Data product", k: "Trustworthy", need: ["slo", "freshness", "accuracy"] },
    { g: "Data product", k: "Interoperable", need: ["schema"] },
    { g: "Data product", k: "Valuable on its own", need: ["decision", "consumer", "use"] },
    { g: "Data product", k: "Secure", need: ["classification", "pii", "access_policy"] }
  ];

  function buildContract(host) {
    host.innerHTML = '' +
      '<div class="hb-honesty"><b>This really parses what you type.</b> Add a line and the ' +
      "verdict changes. Try adding <span class=\"mono\">lineage:</span>, " +
      "<span class=\"mono\">slo:</span> and <span class=\"mono\">classification:</span>.</div>" +
      '<div class="ct-wrap">' +
        "<textarea spellcheck=\"false\" id=\"ctIn\">" + SAMPLE + "</textarea>" +
        '<div class="ct-out" id="ctOut"></div>' +
      "</div>";

    var input = host.querySelector("#ctIn");
    var out = host.querySelector("#ctOut");

    function paint() {
      var keys = {};
      input.value.split("\n").forEach(function (line) {
        var ix = line.indexOf(":");
        if (ix > 0) keys[line.slice(0, ix).trim().toLowerCase()] = line.slice(ix + 1).trim();
      });
      var blob = input.value.toLowerCase();

      var groups = {}, pass = 0;
      CONTRACT_CHECKS.forEach(function (c) {
        var ok = c.need.some(function (n) {
          return Object.prototype.hasOwnProperty.call(keys, n) || blob.indexOf(n + ":") >= 0;
        });
        if (ok) pass++;
        (groups[c.g] = groups[c.g] || []).push({ k: c.k, ok: ok, need: c.need });
      });

      var html = '<div class="ct-tally">' + pass + " of " + CONTRACT_CHECKS.length +
        " checks met</div>";
      Object.keys(groups).forEach(function (g) {
        html += '<div class="ct-group"><b>' + g + "</b>";
        groups[g].forEach(function (r) {
          html += '<div class="ct-row ' + (r.ok ? "ct-pass" : "ct-fail") + '">' +
            '<span class="ct-m">' + (r.ok ? "✓" : "✕") + "</span>" +
            "<span>" + r.k + (r.ok ? "" : ' <span class="mono">add ' + r.need[0] + ":</span>") +
            "</span></div>";
        });
        html += "</div>";
      });
      out.innerHTML = html;
    }

    input.addEventListener("input", paint);
    paint();
  }

  /* ------------------------------------------------------------------ *
   * 7. Boot
   * ------------------------------------------------------------------ */

  function boot() {
    var b = document.getElementById("heur-bench");
    if (b) buildBench(b);
    var s = document.getElementById("heur-severity");
    if (s) buildSeverity(s);
    var c = document.getElementById("heur-contract");
    if (c) buildContract(c);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  /* exposed so the ladder can be checked from a console or a test harness */
  window.HEUR = { DEFECTS: DEFECTS, LENSES: LENSES, FALSE_POSITIVES: FALSE_POSITIVES, stageHTML: stageHTML };
})();
