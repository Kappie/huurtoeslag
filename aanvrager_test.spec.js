var Aanvrager = require("./aanvrager");

describe ("Aanvrager", function() {

  describe("Vrijstellingsgrens", function() {

    it("van iemand jonger dan AOW-leeftijd", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1992-12-18"});
      expect(aanvrager.vrijstellingsgrens()).toEqual(21139);
    });

    it("van iemand jonger dan AOW-leeftijd, met alleenstaande-ouderuitzondering", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1992-12-18", "alleenstaandeOuder": true});
      expect(aanvrager.vrijstellingsgrens()).toEqual(42278);
    });

    it("van een oud iemand met hoog inkomen", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1930-12-18", "inkomen":{ "aanvrager": 100000}});
      expect(aanvrager.vrijstellingsgrens()).toEqual(21139);
    });

    it("van een oud iemand met laag inkomen", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1930-12-18", "inkomen": {"aanvrager": 0}});
      expect(aanvrager.vrijstellingsgrens()).toEqual(49123);
    });

    it("van een oud iemand met middeninkomen", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1930-12-18", "inkomen": {"aanvrager": 15000}});
      expect(aanvrager.vrijstellingsgrens()).toEqual(35131);
    });

  });

  describe("Rekenhuur", function() {

    it("regulier geval", function() {
      var aanvrager = new Aanvrager({"huur": {
        "kaleHuur": 300,
        "energie": 10,
        "huismeester": 10,
        "schoonmaak": 10,
        "ruimten": 10
      }});
      expect(aanvrager.rekenhuur).toEqual(340);
    });

    it("niet alle waarden ingevuld", function() {
      var aanvrager = new Aanvrager({"huur": {
        "kaleHuur": 300,
        "energie": 10,
        "huismeester": 10
      }});
      expect(aanvrager.rekenhuur).toEqual(320);
    });

    it("te hoge waarden - maximaal 12 euro", function() {
      var aanvrager = new Aanvrager({"huur": {
        "kaleHuur": 300,
        "energie": 40,
        "huismeester": 30,
        "schoonmaak": 30,
        "ruimten": 10
      }});
      expect(aanvrager.rekenhuur).toEqual(346);
    });

  }); 

  describe("Maximale huurgrens", function() {

    it("onder de 23 jaar", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1992-12-18"});
      expect(aanvrager.maximaleHuurgrens()).toEqual(374.44);
    });

    it("boven de 23 jaar", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1930-12-18"});
      expect(aanvrager.maximaleHuurgrens()).toEqual(681.02);
    });

    it("onder de 23, maar heeft kind", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1992-12-18", "kind": true});
      expect(aanvrager.maximaleHuurgrens()).toEqual(681.02);
    });

    it("onder de 23, maar is gehandicapt", function() {
      var aanvrager = new Aanvrager({"geboortedatum": "1992-12-18", "gehandicapt": true});
      expect(aanvrager.maximaleHuurgrens()).toEqual(681.02);
    });

  });

  describe("Rekeninkomen", function() {

    it("alleen aanvrager", function() {
      var aanvrager = new Aanvrager({"inkomen": {"aanvrager": 10000}})
      expect(aanvrager.rekeninkomen).toEqual(10000);
    });

    it("aanvrager en toeslagpartner", function() {
      var aanvrager = new Aanvrager({"inkomen": {"aanvrager": 10000, "toeslagpartner": 10000}})
      expect(aanvrager.rekeninkomen).toEqual(20000);
    });

    it("aanvrager, toeslagpartner en medebewoners", function() {
      var aanvrager = new Aanvrager({"inkomen": {"aanvrager": 10000, "toeslagpartner": 10000, "medebewoners": 10000}})
      expect(aanvrager.rekeninkomen).toEqual(30000);
    });

    it("toeslagpartner met enorme schuld", function() {
      var aanvrager = new Aanvrager({"inkomen": {"aanvrager": 10000, "toeslagpartner": -50000, "medebewoners": 10000}})
      expect(aanvrager.rekeninkomen).toEqual(0);
    });

  });

  describe("Soort huishouden", function() {

    it("EP", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 1, "hoofdaandeelAOWers": false});
      expect(aanvrager.soortHuishouden()).toEqual("EP");
    });

    it("MP", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2, "hoofdaandeelAOWers": false});
      expect(aanvrager.soortHuishouden()).toEqual("MP");
    });

    it("EP 65+", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 1, "hoofdaandeelAOWers": true});
      expect(aanvrager.soortHuishouden()).toEqual("EP 65+");
    });

    it("MP 65+", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2, "hoofdaandeelAOWers": true});
      expect(aanvrager.soortHuishouden()).toEqual("MP 65+");
    });
  });

  describe("Basishuur", function() {

    it("EP onder minimuminkomen", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 1, "hoofdaandeelAOWers": false, "inkomen": {"aanvrager": 0}});
      expect(aanvrager.basishuur()).toEqual(222.18);
    });

    it("MP in midden-regime", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2, "hoofdaandeelAOWers": false, "inkomen": {"aanvrager": 25000}});
      expect(aanvrager.basishuur()).toEqual(341.71331855);
    });

    it("MP 65+ onder minimuminkomen", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2, "hoofdaandeelAOWers": true, "inkomen": {"aanvrager": 21000}});
      expect(aanvrager.basishuur()).toEqual(218.55);
    });

    it("EP 65+ boven doelgroepgrens", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 1, "hoofdaandeelAOWers": true, "inkomen": {"aanvrager": 1000000}});
      expect(aanvrager.basishuur()).toEqual(0);
    });

  });

  describe("Aftoppingsgrens", function() {

    it("voor een of twee personen", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2});
      expect(aanvrager.aftoppingsgrens()).toEqual(535.91);
    });

    it("voor meer dan twee personen", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 5});
      expect(aanvrager.aftoppingsgrens()).toEqual(574.35);
    });

  });

  describe("Huurtoeslag", function() {

    it("voor het rekenvoorbeeld van Fred uit de spec", function() {
      var params = {
        "geboortedatum": "1994-01-01",
        "inkomen": {"aanvrager": 14500},
        "huur": {"kaleHuur": 320, "energie": 12, "huismeester": 11, "schoonmaak": 15, "ruimten": 0},
        };
      fred = new Aanvrager(params);
      expect(fred.huurtoeslag()).toEqual(132.82);
    });


    it("voor het rekenvoorbeeld van Jasper en Sophie", function() {
      var params = {
        "geboortedatum": "1984-01-01",
        "inkomen": {"aanvrager": 20000, "toeslagpartner": 5000},
        "huur": {"kaleHuur": 510, "energie": 0, "huismeester": 0, "schoonmaak": 0, "ruimten": 0},
        "kind": true, "grootteHuishouden": 2
        };
      jasper = new Aanvrager(params);
      expect(jasper.huurtoeslag()).toEqual(120.84);
    });

    it("voor het rekenvoorbeeld van Rina", function() {
      var params = {
        "geboortedatum": "1948-01-01",
        "inkomen": {"aanvrager": 15000},
        "huur": {"kaleHuur": 513, "energie": 16, "huismeester": 20, "schoonmaak": 16, "ruimten": 11}
        };
      rina = new Aanvrager(params);
      expect(rina.huurtoeslag()).toEqual(268.67);
    });

    it("voor het rekenvoorbeeld van Alfred, Yasmine en Sem", function() {
      var params = {
        "geboortedatum": "1947-01-01",
        "inkomen": {"aanvrager": 20000, "toeslagpartner": 0, "medebewoners": 5000},
        "huur": {"kaleHuur": 560, "energie": 0, "huismeester": 0, "schoonmaak": 0, "ruimten": 0},
        "kind": true, "hoofdaandeelAOWers": true, "grootteHuishouden": 3
        };
      alfred = new Aanvrager(params);
      expect(alfred.huurtoeslag()).toEqual(196.16);
    });

    it("voor iemand met te veel vermogen", function() {
      var params = {
        "geboortedatum": "1947-01-01",
        "inkomen": {"aanvrager": 20000, "toeslagpartner": 0, "medebewoners": 5000},
        "huur": {"kaleHuur": 560, "energie": 0, "huismeester": 0, "schoonmaak": 0, "ruimten": 0},
        "kind": true, "hoofdaandeelAOWers": true, "grootteHuishouden": 3, 
        "vermogen": 100000
        };
      aanvrager = new Aanvrager(params);
      expect(aanvrager.huurtoeslag()).toEqual(0);
    });

    it("voor iemand met te hoge huur", function() {
      var params = {
        "geboortedatum": "1947-01-01",
        "inkomen": {"aanvrager": 20000, "toeslagpartner": 0, "medebewoners": 5000},
        "huur": {"kaleHuur": 1600, "energie": 0, "huismeester": 0, "schoonmaak": 0, "ruimten": 0},
        "kind": true, "hoofdaandeelAOWers": true, "grootteHuishouden": 3,
        };
      aanvrager = new Aanvrager(params);
      expect(aanvrager.huurtoeslag()).toEqual(0);
    });

  });

});