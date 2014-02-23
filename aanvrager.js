module.exports = Aanvrager;

function Aanvrager(kenmerken) {
  this.leeftijd = berekenLeeftijd(kenmerken["geboortedatum"]);
  this.rekenhuur = berekenHuur(kenmerken["huur"]);
  this.rekeninkomen = berekenInkomen(kenmerken["inkomen"]);
  this.alleenstaandeOuder = kenmerken["alleenstaandeOuder"];
  this.kind = kenmerken["kind"];
  this.gehandicapt = kenmerken["gehandicapt"];
  this.grootteHuishouden = kenmerken["grootteHuishouden"];
  this.hoofdaandeelInkomen = kenmerken["hoofdaandeelInkomen"];

  function berekenLeeftijd(geboortedatum) {
    var SECONDEN_PER_JAAR = 31557600000;
    var geboortedatum = +new Date(geboortedatum);
    return ~~((Date.now() - geboortedatum) / (SECONDEN_PER_JAAR));
  }

  function berekenHuur(componenten) {
    if (componenten === undefined) { return 0; }

    var soortenHuur = [
      "kaleHuur",
      "energie",
      "huismeester",
      "schoonmaak",
      "ruimten"
    ];

    var totaleHuur = 0;

    for (var i = 0; i != soortenHuur.length; i += 1) {
      componenten[soortenHuur[i]] = componenten[soortenHuur[i]] || 0;
      if (soortenHuur[i] !== "kaleHuur" && componenten[soortenHuur[i]] > 12) {
        componenten[soortenHuur[i]] = 12;
      }
      totaleHuur += componenten[soortenHuur[i]];
    }

    return totaleHuur;
  }

  function berekenInkomen(componenten) {
    if (componenten === undefined) { return 0; }

    var soortenInkomen = [
      "aanvrager",
      "toeslagpartner",
      "medebewoners"
    ]

    var totaalInkomen = 0;

    for (var i = 0; i != soortenInkomen.length; i += 1) {
      componenten[soortenInkomen[i]] = componenten[soortenInkomen[i]] || 0;
      totaalInkomen += componenten[soortenInkomen[i]]
    }

    return (totaalInkomen < 0) ? 0 : totaalInkomen;
  }
}

Aanvrager.prototype.vrijstellingsgrens = function() {
  var AOW_LEEFTIJD = 65;

  if (this.leeftijd < AOW_LEEFTIJD && this.alleenstaandeOuder) {
    return 42278;
  } else if (this.leeftijd < AOW_LEEFTIJD) {
    return 21139;
  } else if (this.rekeninkomen < 14302) {
    return 49123;
  } else if (this.rekeninkomen < 19895) {
    return 35131;
  } else {
    return 21139;
  }
};

Aanvrager.prototype.maximaleHuurgrens = function() {
  var LEEFTIJDSGRENS = 23;

  if (this.leeftijd > LEEFTIJDSGRENS || this.kind || this.gehandicapt) {
    return 681.02;
  } else {
    return 374.44;
  }
};

Aanvrager.prototype.soortHuishouden = function() {
  var AOW_LEEFTIJD = 65;
  var huishouden = ""
  (this.grootteHuishouden > 1) ? huishouden += "MP" : huishouden += "EP";
  if (this.leef)
};

Aanvrager.prototype.basishuur = function() {

};

Aanvrager.prototype.aftoppingsgrens = function() {

};

Aanvrager.prototype.huurtoeslag = function() {

};