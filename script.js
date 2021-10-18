'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-09-05T16:33:06.386Z',
    '2021-09-09T14:43:26.374Z',
    '2021-09-10T18:49:59.371Z',
    '2021-09-11T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2021-09-05T16:33:06.386Z',
    '2021-09-09T14:43:26.374Z',
    '2021-09-10T18:49:59.371Z',
    '2021-09-11T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

//formating date
const formatMovementsDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / 1000 / 60 / 60 / 24);

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);

  //if dayspassed more than 7days
  // else {
  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${month}/${year}`;
  // }
};

//formatting currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//Movments: Withdrawls and Deposite
const displayMovements = function (acc, sort = false) {
  //clean exsiting
  containerMovements.innerHTML = '';

  //becasue the sort will mutate the original array,
  //so here need a slice method to copy the original array and display the value base on sort
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementsDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = ` 
    <div class="movements__row">
     <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
    <div class="movements__date">${displayDate}</div>
     <div class="movements__value">${formattedMov}</div>
    </div>`;

    //.insertAdjacentHTML('position','the string contains the htm that we want to insert)
    //afterbegin will add the big index element to the top
    //beforeend will add the first element to the bottom and the next element to above
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Calculate the total movements of one account
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

//summary display function
const calcDisplaySummary = function (acc) {
  //all income
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  //all out
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  //interests
  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interests, acc.locale, acc.currency);
};

//accs = accounts array
const creatUserName = function (accs) {
  //acc =each account object
  accs.forEach(function (acc) {
    //add a new property 'username'
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) //function(name){return name[0]}
      .join('');
  });
};
creatUserName(accounts);
// console.log(accounts); //stw

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc);

  //Display balance
  calcDisplayBalance(acc);

  //Display summary
  calcDisplaySummary(acc);
};

// Auto log out timer
const startLogOutTimer = function () {
  const tick = function () {
    const mins = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call, display the remaining time in UI
    labelTimer.textContent = `${mins}: ${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;

      containerApp.style.opacity = 0;
    }
    //decrease 1s
    time--;
  };

  //log out when time is out

  //set the log out time to 10 mins
  let time = 30;

  //call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

//get the current user
let currentAccount, timer;

///////////text for keeping log in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

//<-------------------------------------------------------------------------->
//event handler
btnLogin.addEventListener('click', function (e) {
  //e stand by event
  //in html, form will auto reload the page
  //so need to prevent form from submiting using below:
  //
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //login
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    //Create the current DATE with API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //'long', //'numeric'= 8910,, 2-digit: 08 09..
      year: 'numeric', //2-digit
      // weekday: 'long',
    };

    //get local from browser
    // const locale = navigator.language;

    //locale ='en-US'
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);

    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    //clear the inputs fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //blur() to lost the focus
    inputLoginPin.blur();

    //log out timer
    //check if timer alreay running
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    //updated UI
    updateUI(currentAccount);
  }
});

///Transfer button
//e=>event
//becasue of 'form' need to prevent the form reload when click the button
//btnTransfer's parent is <form></form>
//so e.preventDefault(preventing the default behaviour) is very common to do when work with forms

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);

  //check the reciver is in database
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    reciverAcc &&
    currentAccount.balance >= amount &&
    //reciverAcc? check if the reciver username is exsist
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());

    //updated UI
    updateUI(currentAccount);

    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

///Loan function

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amountLoan = Math.floor(inputLoanAmount.value);

  if (
    amountLoan > 0 &&
    currentAccount.movements.some(mov => mov >= 0.1 * amountLoan)
  )
    //simulate the waiting approval time of request loans from a bank
    //5s for demo
    setTimeout(function () {
      //Add loan to current account movement
      currentAccount.movements.push(amountLoan);

      //add date
      currentAccount.movementsDates.push(new Date().toISOString());

      //update UI
      updateUI(currentAccount);

      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 5000);

  inputLoanAmount.value = '';
});

///close(delete) the current account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    //delete account
    accounts.splice(index, 1);

    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//sort button

//defining the current sort state(sorted or no?)
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
// LECTURES

/*
console.log(23 === 23.0);

//base 10 0 - 9; 1/10=0.1, 3/10=3.33333...
//JavaScript is base 2
console.log(0.1 + 0.2); //0.30000000000004
//so...
console.log(0.1 + 0.2 === 0.3); // it is right, but javascript will return false

//conversion
//below two will all return number 23
//+ will make javascript to auto converting
console.log(Number(23));
console.log(+'23');

//Parsing
//if start by number, javascript will get rid of the string
//parseInt('30E',10); <=this second parameter means 10 base
// so if its 2 base, parseInt('30E',10)=>parseInt('30E',2)
console.log(Number.parseInt('30x', 10)); //30
//but if start by string, parse will return NaN
console.log(Number.parseInt('e23', 10)); //NaN

//parse float
console.log(Number.parseFloat('2.5rem')); //2.5
console.log(Number.parseInt('2.5rem')); //2

//isNaN
console.log(Number.isNaN(20)); //false, cus we input a real number
console.log(Number.isNaN('20')); //false, just a regular value
console.log(Number.isNaN(+'20s')); //true
console.log(Number.isNaN(23 / 0)); //false, it is infinity

console.log('=============isFinite===========');
//isFinite better for checking if it is number
console.log(Number.isFinite(20)); //true ,it is a number
console.log(Number.isFinite('20')); //string is not a number
console.log(Number.isFinite(+'20x')); //no
console.log(Number.isFinite(23 / 0)); //infinity is not a number

//isInteger
console.log(Number.isInteger(20)); //yes
console.log(Number.isInteger('20')); //no
console.log(Number.isInteger(+'20s')); //no
console.log(Number.isInteger(20 / 0)); //no
*/

/*
///////////////MATH////////////
//sqrt
//squareroot//开方
console.log(Math.sqrt(25)); //5  :5*5=25
console.log(25 ** (1 / 2)); //5:  5*5=25
console.log(8 ** (1 / 3)); //2: 2*2*2=2**3=8

//MAX
//max will do type conversion
//but math wont paresing
console.log(Math.max(5, 18, 23, 11, 2)); //23
console.log(Math.max(5, 18, '23', 11, 2)); //23:  '23' will be convert to number 23
//'23px' cannot be convert to number, and max wond do parsing, so return NaN
console.log(Math.max(5, 18, '23px', 11, 2)); //NaN:

//MIN
console.log(Math.max(5, 18, 23, 11, 2)); //2

//PI
console.log(Math.PI * Number.parseFloat('10px') ** 2);

//random
//math.random()will return a random number between 0 - 1
console.log(Math.random());
//math.trunc will cut all the decimal part
//so if we do math.trunc(math.random()*6)
//cus all the decimal part are cutted, so we can only get number from 1-5
//so simply + 1 at the end, then we could get a random integer from 1-6
console.log(Math.trunc(Math.random() * 6) + 1);

//below is a function to get random integer
//included negitive input
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(1, 10));

//rounding integers

//all of thoses methods doing type conversion
//example: will be same as integer 23.3
console.log(Math.round('23.3')); //23
console.log(Math.ceil('23.3')); //24

//trunc will just cut of the decimal
console.log(Math.trunc(23.7)); //23

//base on math round(>=0.5  =>1, <0.5, =>0)
console.log(Math.round(23.7)); //24
console.log(Math.round(23.3)); //23

//both rounded up to 24
console.log(Math.ceil(23.3)); //round up//24
console.log(Math.ceil(23.7)); //round up//24

//both rounded down to 23
console.log(Math.floor(23.7)); //23
console.log(Math.floor(23.3)); //23

//floor and trunc are the same when dealiing with positive numbers
//with negitive numbers, floor will still rounded down(to smaller number):
console.log(Math.trunc(-23.3)); //-23
console.log(Math.floor(-23.3)); //-24

console.log('============rounding decimals==============');
//rounding decimals

//this method is to round only the decimal place

//toFixed(0) means round the number with 0 decimal
console.log((2.7).toFixed(0)); // base on the math rules, will just be 3

//round the number with 3 decimals
console.log((2.7).toFixed(3)); //2.700

//round the number with 2 decimals
console.log((2.345).toFixed(2)); //2.35

//toFixed will return a string, just use '+' to convert the results to number type
console.log(+(2.345).toFixed(2)); // number 2.35
*/

/*
//Remainder
//the remainder is after the division, the remaining integer part

console.log(5 % 2); //1
//5%2: 1
//FIRST: 5/2 = 2.5, => trunc the decimal part => 2
//5 - 2= 3 => 3-2 =1; 1<2 => Remainder = 1

console.log(8 % 3);
//8%3: 2
//First: 8/3 =3+3+2, so the remainder = 2

console.log(10 % 4); //10/4= 4+4+2, remainder = 2

//check even or odds

const isEven = n => n % 2 === 0;
console.log(isEven(3));
console.log(isEven(8));
console.log(isEven(514));

//document.querySelectorAll('.movements__row') will return node list(array liked structure)
//distructure to array
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    if (i % 2 === 0) {//every 2 row
      row.style.backgroundColor = 'blue';
    }
    if (i % 3 === 0) row.style.backgroundColor = 'green';//every 3 row
  });
});
*/

/*
/////////BIGINT///////////

//this is the biggest number that javascript can safely represent
//64bits => 64 ones or zeros to repersent any number
// only 53 are used to store the digits themselves
//the rest to store the decimal point and sign
//due to this ,(2 ** 53 - 1)  this is the biggest number that javascript can safely represent
//below 2 are the same thing
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

// n

console.log(12345678907876543213456789); //cannot display properly
console.log(12345678907876543213456789n); //this is the bigInt
console.log(BigInt(123456789078));

//operations
console.log(10000n + 10000n); //20000n
console.log(123456789098765432134n * 100000n); //12345678909876543213400000n

//


//but 'n'(BigInt) cannot work with regular numbers, have to work with other bigints
//example:
const huge = 123456787654323456n;
const num = 23;

//Below will cus error:Cannot mix BigInt and other types, use explicit conversions at script.js:475
// console.log(huge * num);

//correct one
console.log(huge * BigInt(num));

//Exceptions:
//1. IF is comparesing(logical operators), bigint can compare to regular numbers
console.log(20n > 15); //true
console.log(20n === 20); //false, '===' dont do type conversion
console.log(20n == 20); //true
console.log(typeof 20n); //bigInt

//2. String concatenations
console.log(20n == '20'); //true
console.log(huge + ' is really big ....'); //convert huge(BigInt) to string


//Divisions
//big int division will cut all the decimal part
//alwasy return the integer
console.log(10n%3n);//3n
console.log(10/3);//3.333333333

*/

/*
//////////DATES/////////

//Create a date

const now = new Date(); //return time and date now
console.log(now); //Sat Sep 11 2021 18:03:07 GMT-0400 (Eastern Daylight Time)

//will convert to the same format:
//Sat Sep 11 2021 18:03:07 GMT-0400 (Eastern Daylight Time)
console.log(new Date('Sat Sep 11 2021 18:03:07'));

// Thu Dec 17 2020 00:00:00 GMT-0500 (Eastern Standard Time)
console.log(new Date('December 17, 2020'));

console.log(new Date(account1.movementsDates[0]));

console.log(new Date(2037, 10, 19, 15, 23, 5)); //Thu Nov 19 2037 15:23:05 GMT-0500 (Eastern Standard Time)

//javascript will auto correct the date
//for example:
//nov only have 30 days, but we type 32 as below
console.log(new Date(2037, 10, 32, 15, 23, 5));
//but it will return :Wed Dec 02 2037 15:23:05 GMT-0500

console.log(new Date(0)); //0 milisecond after initial unix time:Wed Dec 31 1969 19:00:00 GMT-0500 (Eastern Standard Time)

console.log(new Date(3 * 24 * 60 * 60 * 1000)); //3 days after(count by millisecond)

//(3 * 24 * 60 * 60 * 1000) this is timestamp 259200000

*/

/*
//working with dates
const future = new Date(2037, 10, 19, 15, 23);
console.log(future);

console.log(future.getFullYear()); //2037
console.log(future.getMonth()); //10 => Actually is novamber(0 base)
console.log(future.getDate()); //19
console.log(future.getDay()); //4, means Thursday
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getSeconds());

console.log(future.toISOString()); //2037-11-19T20:23:00.000Z (this format)

//the time(miliseconds) from inital unix timee till 2037-11-19T20:23:00 => 2142274980000
console.log(future.getTime());
//2142274980000 put into new date will return the date 2037-11-19T20:23:00.
console.log(new Date(2142274980000));

//current timestamp
console.log(Date.now());

//set
//change the year month, date . times etc
future.setFullYear(2040);
console.log(future);
*/

/*
///caculating date

const future = new Date(2037, 10, 19, 15, 23);
//below will return the miliseonds
//(timestamp: the caculating time from the inital unix time count by milliseconds)
//so we could caculate the date

//below are the same:2142274980000(number)
// console.log(Number(future));
console.log(Number(+future));

//milliseconds to seconds: 1000
//seconds to mins: 60
//mins to hours: 60
//hours to days:24
//so below function will return the days passed between to given dates
const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / 1000 / 60 / 60 / 24;

const day1 = calcDaysPassed(new Date(2037, 3, 14), new Date(2037, 3, 4)); //10 days

console.log(day1);
*/

/*
///////FORMATING NUMBER
const num = 3884764.23;

const options = {
  style: 'currency', //'percent', //'unit',
  unit: 'celsius',
  currency: 'EUR', //CURRENCY is not defined by the locale
  // userGrouping: false,
};

console.log('US:   ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany:   ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria:   ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  'Browser:   ',
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/

/*
//////Timer

//settimeout: schedules a function to run after a certin amout of the time
//only run one time
//recive a callback function as well
//the code did not stop at the below setTimeOut(), it will just continues to excute the code

//example: the below code is excuted, but delayed to 3s later (the callback function delayed)
//the excution continues
setTimeout(() => console.log('here is your pizza 🍕'), 3000);
//immediately Javascript will move on the next line
//below code did not delay, so after the above excuted, the below code will be excuted
console.log('wait 3s..');

const ings = ['olives', 'spinach', 'meat'];

//we could pass value after the times(example: 3000)
// using comma(',') to seperate the argument
//example below:
const pizzaTimer = setTimeout(
  (ing1, ing2, ing3) =>
    console.log(`here is your pizza with ${ing1}, ${ing2} and ${ing3} 🍕`),
  5000,
  // 'olives',
  // 'spinach'
  ...ings //destructure the ings array will automaticlly has ','  so here is the same as above
);

//cancel the timer(setTimeOut)
let str1 = '';

if (ings.includes('spinach')) {
  clearTimeout(pizzaTimer);
  str1 = 'timer canceled';
} else if (ings.includes('meat2')) {
  str1 = 'timer running...';
}
console.log(str1);

//setInterval
//the callback function will be called every certain amount of times
//for example below, it will run again every 2s

// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// }, 2000);

/*
const options2 = {
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};
setInterval(function () {
  const now = new Date();
  console.log(Intl.DateTimeFormat(navigator.language, options2).format(now));
}, 1000);
*/

///////////////Clock challenege////////////
/*
setInterval(function () {
  const now = new Date();
  console.log(
    Intl.DateTimeFormat(navigator.language, { timeStyle: 'long' }).format(now)
  );
}, 1000);

setInterval(() => {
  console.log(
    Intl.DateTimeFormat(navigator.language, { timeStyle: 'medium' }).format(
      new Date()
    )
  ),
    setTimeout(() => console.clear(), 1800);
}, 1000);
*/
