# Jobs to do:

## Sarah:
- MongoDB - Users (DONE)
- Frontend - Login/Register (DONE)
- SASS/BEM - Buttons (a-tags) (DONE)
- SASS/BEM - Form Checkbox (DONE)
- SASS/BEM - Navigation (DONE)
- API - LEADERBOARD (DONE)


## Nick:
- MongoDB - Transactions (DONE)
- Frontend - New Transaction
- SASS/BEM - Form fields (DONE)
- SASS/BEM - Logo - 2 (DONE)
- SASS/BEM - Transaction List items (DONE)

## TODO:
- Layout op desktop maken
- Deployment to heroku
- Primus toevoegen (inkomende transacties)
- Autocompletion 
- Transaction controle (genoeg coins) - Nick
- Give user feedback to frontend - Sarah


## Extra aandachtspunten bij jobs:
Sarah: Als je bij de authenticatie van gebruikers met passport een webtoken aanmaakt, kan je dan de email van de gebruiker mee in die token zetten, want ik ga die nodig hebben voor het ophalen van de transacties (DONE)

## SASS
Wij gebruiken sass met een script: npm run sass. 
Deze manier wordt gebruikt omdat sass bij iedereen wel kon worden geïsntalleerd maar niet gevonden om het sass commando te runnen.
In de plaats moesten we omslachtig ./node_modules/.bin/sass gebruiken voor we sass naar css konden omzetten.
Met een script is het makkelijker en sneller om sass te vinden en te laten werken bij iedereen.


## Gulp
Ook met Gulp wordt er gebruik gemaakt van een script: npm run gulp.
Zo kan de gulp module bij iedereen gevonden worden en makkelijk gebruikt worden in de commandline.
