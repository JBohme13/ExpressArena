const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('hello express');
});

app.listen( 8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
});

app.get('/pizza/pepperoni', (req, res) => {
    res.send('we have the pepperoni pizza!')
});

app.get('/pizza/pineapple', (req, res) => {
    res.send('Doesnt belong on pizza... unless with bacon, yum!')
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request: 
     Base Url: ${req.baseUrl}
     Host: ${req.hostname}
     Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryviewer', (req, res) => {
    console.log(req.query);
    res.end();
});

app.get('/greetings', (req, res) => {
    const name = req.query.name;
    const race = req.query.race;

    if( !name ) {
        return res.status(400).send('Please provide a name');
    };

    if( !race ) {
        return res.status(400).send('Please provide a race');
    }

    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom!`;

    res.send(greeting);
});

// assignment 1 
app.get('/sum', (req, res) => {

    const { a, b } = req.query;
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if(!a) {
        return(
            res.status(400).send('a is required')
        );
    }

    if( !b ) {
        return(
            res.status(400).send('b is required')
        );
    }
    
    if(Number.isNaN(numA)) {
        return(
            res.status(400).send('a must be a number')
        );
    }

    if(Number.isNaN(numB)) {
        return(
            res.status(400).send('b must be a number')
        );
    }

    const c = numA + numB;

    res.send(`the sum of ${a} and ${b} is ${c}`)
});

// assignment 2
app.get('/cipher', (req, res) => {
    let { text, shift } = req.query;

    if(!text) {
        return res.status(400).send('text is required');
    }

    if(!shift) {
        return res.status(400).send('shift is required');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res.status(400).send('shift must be a number');
    }

    const base = 'A'.charCodeAt(0);

    const cipherText = text
        .toUpperCase()
        .split('')
        .map(character => {
          const code = character.charCodeAt(0)
          if(base > code || code > (base + 26)) {
            return character
          };
          let diff = code - base;
          diff = diff + numShift;
          diff = diff % 26;
          const shiftedChar = String.fromCharCode(base + diff);
          return shiftedChar;
    }).join('');
    res.status(200).send(cipherText);
});

// assignment 3
app.get('/lotto', (req, res) => {
    let { numbers } = req.query;
    console.log(numbers);
    if (!numbers) {
        return res.status(200).send('numbers is required');
    }

    if (!Array.isArray(numbers)) {
        return res.status(200).send('numbers must be an array');
    }

    const guesses = numbers
            .map(n => parseInt(n))
            .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if (guesses.length !== 6){
        return res.status(400).send('numbers must contain 6 integers between 1 and 20');
    }

    const stockNumbers = Array(20).fill(1).map((_,i) => i+1);
    
    const winningNumbers = [];
    
    for ( let i = 0; i < 6; i++ ) {
        const random = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[random]);
        stockNumbers.splice(random, 1);
    }

    let diff = winningNumbers.filter(n => !guesses.includes(n));

    let responseText;

    switch(diff.length) {
        case 0: 
            responseText = 'You Won the JackPot! All 6 Match!';
            break;
        
        case 1:
            responseText = 'You Won! 5 Matches!';
            break;
        
        case 2:
            responseText = 'You Won! but just barely... 4 Matches!';
            break;

        default:
            responseText = 'You have no luck at all.';
    }

    res.json({
        guesses,
        winningNumbers,
        diff,
        responseText
    });

   // res.send(responseText);
    
    
})







/*console.log(numbers);
    let min = Math.ceil(1);
    let max = Math.floor(20);
    let randomNum = Math.floor(Math.random() * (max-min+1)) + min;
    let randomArray = [randomNum, randomNum, randomNum, randomNum, randomNum, randomNum];
    console.log(randomArray);
    let diff = function(arr1, arr2) {
        let matchingArray = [];
      //  arr1.sort();
      //  arr2.sort();
        for (let i = 0; i < arr1.length; i += 1) {
            if(arr2.indexOf(arr1[i] > -1)) {
                matchingArray.push(arr2[i]);
            }
        }
        return matchingArray.length;
    }

    let numberOfMatches = diff(numbers, randomArray);
    if(numberOfMatched < 4){
        return res.status(200).send('sorry you have no luck at all');
    } else if(numberOfMatches === 4) {
        return res.status(200).send('You Won! but just barely... 4 Matches!');
    } else if(numberOfMatches === 5) {
        return res.status(200).send('You Won! 5 Matches');
    } else if(numberOfMatches === 6) {
        return res.status(200).send('You Won the JackPot! All 6 Match!')
    }*/
