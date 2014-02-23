# Bereken huurtoeslag 2013

Zie de [specificatie](http://download.belastingdienst.nl/toeslagen/docs/berekening_huurtoeslag_tg0831z33fd.pdf) van de overheid.

Gebruik als volgt:

```javascript
// voorbeeld voor Fred uit de specificatie
var fred_params = {
  "geboortedatum": "1994-01-01",
  "inkomen": {"aanvrager": 14500},
  "huur": {"kaleHuur": 320, "energie": 12, "huismeester": 11, "schoonmaak": 15, "ruimten": 0},
  };

var fred = new Aanvrager(fred_params)
console.log(fred.huurtoeslag()); // => 132.82

```