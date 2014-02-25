module.exports = Aanvrager;

function Aanvrager(kenmerken) {
  var parametersBasishuur =
    {
      "EP": { "MINIMUMINKOMENSGRENS": 14875.0,
              "DOELGROEPGRENS": 21025.0,
              "TAAKSTELLINGSBEDRAG": 27.44,
              "MINIMUMBASISHUUR": 222.18,
              "A": 0.000000748531,
              "B": 0.001957364475 },
      "MP": { "MINIMUMINKOMENSGRENS": 19200.0,
              "DOELGROEPGRENS": 28550.0,
              "TAAKSTELLINGSBEDRAG": 27.44,
              "MINIMUMBASISHUUR": 222.18,
              "A": 0.000000418659,
              "B": 0.002104457742  },
      "EP 65+": { "MINIMUMINKOMENSGRENS": 16250.0,
                  "DOELGROEPGRENS": 21100.0,
                  "TAAKSTELLINGSBEDRAG": 27.44,
                  "MINIMUMBASISHUUR": 220.36,
                  "A": 0.000001114939,
                  "B": -0.006236885032 },
      "MP 65+": { "MINIMUMINKOMENSGRENS": 21775.0,
                  "DOELGROEPGRENS": 28725.0,
                  "TAAKSTELLINGSBEDRAG": 27.44,
                  "MINIMUMBASISHUUR": 218.55,
                  "A": 0.000000645458,
                  "B": -0.005278279964 }
    };

  this.KWALITEITSKORTINGSGRENS = 374.44;

  this.leeftijd = berekenLeeftijd(kenmerken["geboortedatum"]);
  this.rekenhuur = berekenHuur(kenmerken["huur"]);
  this.rekeninkomen = berekenInkomen(kenmerken["inkomen"]);
  this.alleenstaandeOuder = kenmerken["alleenstaandeOuder"];
  this.kind = kenmerken["kind"];
  this.gehandicapt = kenmerken["gehandicapt"];
  this.grootteHuishouden = kenmerken["grootteHuishouden"] || 1;
  this.hoofdaandeelAOWers = kenmerken["hoofdaandeelAOWers"];
  this.AOWerInHuishouden = kenmerken["AOWerInHuishouden"];
  this.vermogen = kenmerken["vermogen"] || 0;
  this.verworvenRecht = kenmerken["verworvenRecht"];

  var that = this;

  this.huurtoeslag = function() {
    if (this.vermogen > this.vrijstellingsgrens()) { return 0; }
    if (this.rekenhuur > this.maximaleHuurgrens() && !this.handicap && !this.alleenstaandeOuder && !this.verworvenRecht ) {
      return 0;
    }
    return Math.round(100 * (huurToeslagA() + huurToeslagB() + huurToeslagC()) ) / 100;
  };

  function huurToeslagA() {
    debugger;
    var toeslag = Math.min(that.rekenhuur, that.KWALITEITSKORTINGSGRENS) - that.basishuur();
    return (toeslag < 0) ? 0 : toeslag;
  }

  function huurToeslagB() {
    var OVERALL_FACTOR = 0.65;
    if (that.rekenhuur > that.KWALITEITSKORTINGSGRENS) {
      var toeslag = Math.min(that.rekenhuur, that.aftoppingsgrens()) - Math.max(that.basishuur(), that.KWALITEITSKORTINGSGRENS);
      return (toeslag < 0) ? 0 : toeslag * OVERALL_FACTOR;
    } else {
      return 0;
    }
  }

  function huurToeslagC() {
    var OVERALL_FACTOR = 0.4;
    if (that.grootteHuishouden === 1 || that.AOWerInHuishouden || that.gehandicapt) {
      var toeslag = that.rekenhuur - Math.max(that.basishuur(), that.aftoppingsgrens());
      return (toeslag < 0) ? 0 : toeslag * OVERALL_FACTOR;
    } else {
      return 0;
    }
  }

  this.basishuur = function() {
    var parameters = parametersBasishuur[this.soortHuishouden()];
    if (this.rekeninkomen < parameters["MINIMUMINKOMENSGRENS"] ) {
      return parameters["MINIMUMBASISHUUR"];
    } else if (this.rekeninkomen < parameters["DOELGROEPGRENS"]) {
      return formuleBasishuur(parameters);
    } else {
      return 0;
    }
  };

  function formuleBasishuur(parameters) {
    // Bonusvraag: vind de nulpunten van dit polynoom
    return parameters["A"] * that.rekeninkomen * that.rekeninkomen + parameters["B"] * that.rekeninkomen + parameters["TAAKSTELLINGSBEDRAG"];
  }

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
    return this.KWALITEITSKORTINGSGRENS;
  }
};

Aanvrager.prototype.soortHuishouden = function() {
  var AOW_LEEFTIJD = 65;
  var huishouden = "";
  (this.grootteHuishouden > 1) ? huishouden += "MP" : huishouden += "EP";
  if (this.hoofdaandeelAOWers || (this.grootteHuishouden === 1 && this.leeftijd >= AOW_LEEFTIJD)) {
    huishouden += " 65+";
  }
  return huishouden;
};

Aanvrager.prototype.aftoppingsgrens = function() {
  // Vraag: waarom mag een ambtenaar 's morgens niet uit het raam kijken?
  // Dan heeft ie 's middags niks meer te doen.
  var GRENS_MEER_DAN_TWEE = 574.35, GRENS_MINDER_DAN_TWEE = 535.91;
  return (this.grootteHuishouden > 2) ? GRENS_MEER_DAN_TWEE : GRENS_MINDER_DAN_TWEE;
};

      var params = {
        "geboortedatum": "1947-01-01",
        "inkomen": {"aanvrager": 20000, "toeslagpartner": 0, "medebewoners": 5000},
        "huur": {"kaleHuur": 560, "energie": 0, "huismeester": 0, "schoonmaak": 0, "ruimten": 0},
        "kind": true, "hoofdaandeelAOWers": true
        };
      alfred = new Aanvrager(params);
      console.log(alfred.huurtoeslag());