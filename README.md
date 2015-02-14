# PokeScraper
Term Project for CS441

The purpose of this project is to find correlations between data within the Pokemon series.
In particular, we plan to compare a Pokemon's attack/speed ratio to its calculated BMI.

PokeScraper scrapes data from [pokeapi.co](http://pokeapi.co) to get its data.

PokeScraperWeb contains webpages and their scripts. When download, you can open any of the webpages to see a formatted table. There are currently three webages:

1. Calendar [(Preview)](http://htmlpreview.github.io/?https://github.com/agne16/CS441/blob/master/PokeScraperWeb/calendar.html)
  * The included script accesses the system date and time (at the time of loading) and displays it represented by the image of the Pokemon whose Pokedex ID matches the date value. No user input required.  
2. BMI [(Preview)](http://htmlpreview.github.io/?https://github.com/agne16/CS441/blob/master/PokeScraperWeb/bmi.html)
     * A table is made for a range of Pokemon. The table shows a Pokemon, its description, and a representation of its BMI among other things
     * The user is prompted for three things:
  * Start ID - The ID of the first Pokemon that will start the table. (An integer from 1-719)
  * End ID - The ID the the last Pokemon that will end the table. (An integer from 1-719 but less than Start ID)
  * Generation - The generation that will be used for Pokemon descriptions. (An integer from 1-6)
3. Stats [(Preview)](http://htmlpreview.github.io/?https://github.com/agne16/CS441/blob/master/PokeScraperWeb/stats.html)
  * A table is made for a range of Pokemon. The table shows a Pokemon, its stats, and its BMI.
  * The user is only prompted for that Pokedex range to build the table.
