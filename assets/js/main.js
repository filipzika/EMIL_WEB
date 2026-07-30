/* ============================================================
   Emil 2.0 — interakce
   ============================================================ */
(function () {
  'use strict';

  /* ---------- rok v patičce ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- mobilní navigace ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Otevřít menu' : 'Zavřít menu');
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Otevřít menu');
        nav.classList.remove('is-open');
      }
    });
  }

  /* ---------- stín hlavičky při scrollu ---------- */
  var header = document.querySelector('.site-header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- kontaktní formulář ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (form.querySelector('[name="_honey"]').value) return;

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Odesílám…';
      status.textContent = '';
      status.className = 'form-status';

      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Odeslání se nezdařilo');
          form.reset();
          status.textContent = 'Děkujeme, poptávku jsme přijali. Ozveme se co nejdřív.';
          status.classList.add('is-success');
        })
        .catch(function () {
          status.textContent = 'Něco se nepovedlo. Napište nám prosím přímo na filip.zika@forestbit.cz.';
          status.classList.add('is-error');
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = original;
        });
    });
  }

  /* ---------- reveal při scrollu ---------- */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ============================================================
     Popisy součástek — tři desky
     ============================================================ */
  var NAPAJENI = {
    ref: 'DC1',
    name: 'Napájecí konektor',
    text: 'Souosý DC konektor přivádí do obvodu 5 V z adaptéru, který je součástí balení. Odtud se proud rozděluje do jednotlivých větví desky.',
    node: 'V1 / GND',
    type: 'Napájení'
  };

  var TESTPOINT = {
    name: 'Testovací bod',
    text: 'Pájecí ploška pro hrot multimetru. Napětí se dá změřit, aniž by se obvod musel rozpojovat — třeba úbytek na diodě mezi TP1 a TP2.',
    type: 'Měřicí bod'
  };

  var PARTS = {

    /* ---------- Deska 1/3 — základní obvod ---------- */
    'b1-dc1': NAPAJENI,
    'b1-r1': {
      ref: 'R1', name: 'Rezistor',
      text: 'Omezuje proud tekoucí do diody D1. Výměna za jinou hodnotu přímo mění jas svitu — nejnázornější ukázka Ohmova zákona.',
      node: 'V1 → V2', type: 'Odporový prvek'
    },
    'b1-d1': {
      ref: 'D1', name: 'LED dioda',
      text: 'Svítí hned po připojení napájení. Propouští proud jen jedním směrem, na orientaci vývodů proto záleží.',
      node: 'V2 → GND', type: 'Polovodič'
    },
    'b1-pb1': {
      ref: 'PB1', name: 'Tlačítko',
      text: 'Spíná střední větev obvodu. Dokud je stisknuté, svítí dioda D2 — obvod je uzavřený jen po dobu stisku.',
      node: 'V1', type: 'Spínací prvek'
    },
    'b1-r2': {
      ref: 'R2', name: 'Rezistor',
      text: 'Chrání diodu D2 ve větvi s tlačítkem. Porovnáním s R1 je vidět, jak hodnota odporu ovlivní jas.',
      node: 'V1 → V3', type: 'Odporový prvek'
    },
    'b1-d2': {
      ref: 'D2', name: 'LED dioda',
      text: 'Rozsvítí se jen při stisknutém tlačítku PB1.',
      node: 'V3 → GND', type: 'Polovodič'
    },
    'b1-p1': {
      ref: 'P1', name: 'Potenciometr',
      text: 'Plynule nastavitelný odpor. Otáčením se mění napětí ve větvi V4 — základní ukázka děliče napětí.',
      node: 'V1 → V4', type: 'Nastavitelný odpor'
    },
    'b1-hdr': {
      ref: 'HDR1 · HDR2', name: 'Header konektory',
      text: 'Dvojice konektorů, do kterých se dá připojit vlastní součástka nebo měřicí přístroj přímo do obvodu.',
      node: 'V4 / GND', type: 'Konektor'
    },

    /* ---------- Deska 2/3 — světlo, teplo a čas ---------- */
    'b2-dc1': NAPAJENI,
    'b2-sw1': {
      ref: 'SW1', name: 'Přepínač',
      text: 'Rozhoduje, kterou větví poteče proud — přes teplotní rezistor RT1, nebo přes fotorezistor LDR1. Jedním pohybem se porovnají dvě různá zapojení.',
      node: 'V1', type: 'Spínací prvek'
    },
    'b2-rt1': {
      ref: 'RT1', name: 'Teplotní rezistor',
      text: 'Termistor mění svůj odpor podle teploty. Sevřete ho v prstech a sledujte, jak zareaguje dioda D1.',
      node: 'V1 → V2', type: 'Odporový prvek'
    },
    'b2-d1': {
      ref: 'D1', name: 'LED dioda',
      text: 'Světelná indikace větve s teplotním rezistorem.',
      node: 'V2 → GND', type: 'Polovodič'
    },
    'b2-ldr1': {
      ref: 'LDR1', name: 'Fotorezistor',
      text: 'Odpor řízený světlem. Zakryjte ho dlaní — dioda D2 okamžitě ztlumí. Základ každého soumrakového spínače.',
      node: 'V1 → V3', type: 'Odporový prvek'
    },
    'b2-d2': {
      ref: 'D2', name: 'LED dioda',
      text: 'Světelná indikace větve s fotorezistorem.',
      node: 'V3 → GND', type: 'Polovodič'
    },
    'b2-pb1': {
      ref: 'PB1', name: 'Tlačítko',
      text: 'Krátkým stiskem nabijete kondenzátor C1 a spustíte spodní větev obvodu.',
      node: 'V1', type: 'Spínací prvek'
    },
    'b2-c1': {
      ref: 'C1', name: 'Kondenzátor',
      text: 'Ukládá elektrický náboj. Po uvolnění tlačítka dioda D3 ještě chvíli dosvítí — kondenzátor se vybíjí do obvodu.',
      node: 'V1 / GND', type: 'Kapacita'
    },
    'b2-r1': {
      ref: 'R1', name: 'Rezistor',
      text: 'Určuje, jak rychle se kondenzátor vybije — a tedy jak dlouho bude dioda D3 dosvicovat.',
      node: 'V1 → V4', type: 'Odporový prvek'
    },
    'b2-d3': {
      ref: 'D3', name: 'LED dioda',
      text: 'Na jejím dosvitu je vidět, jak dlouho kondenzátoru trvá vybití.',
      node: 'V4 → GND', type: 'Polovodič'
    },

    /* ---------- Deska 3/3 — měření a cívka ---------- */
    'b3-dc1': NAPAJENI,
    'b3-r1': {
      ref: 'R1', name: 'Rezistor',
      text: 'Pevný odpor v horní větvi. Mezi testovacími body TP1 a TP2 se dá multimetrem změřit úbytek napětí na diodě D1.',
      node: 'V1 → V2', type: 'Odporový prvek'
    },
    'b3-tp1': { ref: 'TP1', name: TESTPOINT.name, text: TESTPOINT.text, node: 'V2', type: TESTPOINT.type },
    'b3-tp2': { ref: 'TP2', name: TESTPOINT.name, text: TESTPOINT.text, node: 'D1', type: TESTPOINT.type },
    'b3-tp3': { ref: 'TP3', name: TESTPOINT.name, text: TESTPOINT.text, node: 'V3', type: TESTPOINT.type },
    'b3-tp4': { ref: 'TP4', name: TESTPOINT.name, text: TESTPOINT.text, node: 'D2', type: TESTPOINT.type },
    'b3-d1': {
      ref: 'D1', name: 'LED dioda',
      text: 'Horní větev za rezistorem R1. Připojuje se přes testovací bod TP2.',
      node: 'V2 → GND', type: 'Polovodič'
    },
    'b3-ldr1': {
      ref: 'LDR1', name: 'Fotorezistor',
      text: 'Odpor řízený světlem ve střední větvi. Změna je vidět na diodě D2 i na multimetru mezi TP3 a TP4.',
      node: 'V1 → V3', type: 'Odporový prvek'
    },
    'b3-d2': {
      ref: 'D2', name: 'LED dioda',
      text: 'Střední větev za fotorezistorem.',
      node: 'V3 → GND', type: 'Polovodič'
    },
    'b3-r2': {
      ref: 'R2', name: 'Rezistor',
      text: 'Omezuje proud ve spodní větvi s cívkou a diodou D3.',
      node: 'V1 → V4', type: 'Odporový prvek'
    },
    'b3-d3': {
      ref: 'D3', name: 'LED dioda',
      text: 'Spodní větev s cívkou L1. Právě na ní je vidět, co indukčnost udělá s proudem.',
      node: 'V4 → GND', type: 'Polovodič'
    },
    'b3-l1': {
      ref: 'L1', name: 'Cívka',
      text: 'Indukčnost se brání změně proudu. Při rozepnutí tlačítka PB1 se v cívce naindukuje napětí a dioda D3 krátce blikne.',
      node: 'V4 / GND', type: 'Indukčnost'
    },
    'b3-pb1': {
      ref: 'PB1', name: 'Tlačítko',
      text: 'Rozpojuje větev s cívkou. Zajímavý okamžik nastává právě při rozepnutí, ne při sepnutí.',
      node: 'GND', type: 'Spínací prvek'
    }
  };

  /* ============================================================
     Přepínání desek + interaktivní body
     ============================================================ */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.board-tabs [role="tab"]'));
  var elRef = document.getElementById('partRef');
  var elName = document.getElementById('partName');
  var elText = document.getElementById('partText');
  var elMeta = document.getElementById('partMeta');
  var elNode = document.getElementById('partNode');
  var elType = document.getElementById('partType');

  if (!tabs.length || !elRef) return;

  var showPart = function (spot) {
    var part = PARTS[spot.dataset.part];
    if (!part) return;

    var stage = spot.closest('.board-stage');
    stage.querySelectorAll('.hs').forEach(function (s) {
      s.classList.toggle('is-active', s === spot);
    });

    elRef.textContent = part.ref;
    elName.textContent = part.name;
    elText.textContent = part.text;
    elNode.textContent = part.node;
    elType.textContent = part.type;
    elMeta.hidden = false;
  };

  var resetPanel = function () {
    elRef.textContent = '—';
    elName.textContent = 'Vyberte součástku';
    elText.textContent = 'Každá ze tří desek pokrývá jiné téma. Klikněte na kterýkoliv bod v obvodu a zjistěte, co daná součástka dělá a proč je zrovna tam.';
    elMeta.hidden = true;
  };

  /* body na všech deskách */
  document.querySelectorAll('.board-stage').forEach(function (stage) {
    var spots = Array.prototype.slice.call(stage.querySelectorAll('.hs'));

    spots.forEach(function (spot, i) {
      var part = PARTS[spot.dataset.part];
      if (part) spot.setAttribute('aria-label', part.ref + ' — ' + part.name);

      spot.addEventListener('click', function () { showPart(spot); });
      spot.addEventListener('mouseenter', function () { showPart(spot); });
      spot.addEventListener('focus', function () { showPart(spot); });

      spot.addEventListener('keydown', function (e) {
        var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = spots[(i + dir + spots.length) % spots.length];
        next.focus();
      });
    });
  });

  /* přepínání desek */
  var selectTab = function (tab, moveFocus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (moveFocus) tab.focus();
    resetPanel();
  };

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });

    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length], true);
    });
  });
})();
