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
      var aanvrager = new Aanvrager({"grootteHuishouden": 1, "geboortedatum": "1992-12-18"});
      expect(aanvrager.soortHuishouden()).toEqual("EP");
    });

    it("MP", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2, "geboortedatum": "1992-12-18"});
      expect(aanvrager.soortHuishouden()).toEqual("MP");
    });

    it("EP 65+", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 1, "geboortedatum": "1930-12-18"});
      expect(aanvrager.soortHuishouden()).toEqual("EP 65+");
    });

    it("MP 65+", function() {
      var aanvrager = new Aanvrager({"grootteHuishouden": 2, "geboortedatum": "1930-12-18"});
      expect(aanvrager.soortHuishouden()).toEqual("MP 65+");
    });
  });

});