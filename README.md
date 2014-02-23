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

Alle parameters:

```
geboortedatum: dateString
inkomen: {
    "aanvrager": number,
    "toeslagpartner": number,
    "medebewoners": number
}
huur: {
    "kaleHuur": number,
    "energie": number,
    "huismeester": number,
    "schoonmaak": number,
    "ruimten": number
}

/* 
Uw klant is een alleenstaande ouder. Uw klant € 42.278
kreeg van 1 juli t/m 31 december 2005 huursubsidie bij een vermogen van meer
dan € 20.300. In 2006 t/m 2012 kreeg uw klant huurtoeslag en in 2013 heeft hij
recht op alleenstaande-ouderkorting.

De volgende boolean slaat op deze hele regeling.
*/

alleenstaandeOuder: boolean

// heeft aanvrager een kind?
kind: boolean
gehandicapt: boolean
grootteHuishouden: number

// true als meer dan 50% van het inkomen wordt verdiend door AOWers
hoofdaandeelAOWers: boolean

// bestaat het huishouden van aanvrager uit één of meer AOWers?
AOWersInHuishouden: boolean