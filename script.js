'use strict';

// Data
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
    '2020-05-08T14:11:59.604Z',
    '2022-12-16T17:01:17.194Z',
    '2022-12-17T23:36:17.929Z',
    '2022-12-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-GB', // de-DE
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
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2022-12-17T18:49:59.371Z',
    '2022-12-19T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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

// -- // 

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; 

const formatMovementDate = function(date, locale){
        const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)); 
        const daysPassed = calcDaysPassed(new Date(), date); 
        console.log(daysPassed);

        if(daysPassed === 0) return 'Today';
        if(daysPassed === 1) return 'Yesterday';
        if(daysPassed <= 7) return `${daysPassed} days ago`;
          // const day = `${date.getDate()}`.padStart(2, 0);
          // const month = `${date.getMonth() + 1}`.padStart(2, 0);
          // const year = date.getFullYear();
          return new Intl.DateTimeFormat(locale).format(date);
}

const formatCur = function(value, locale, currency){
    return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovement = function(acc, sort = false){
    containerMovements.innerHTML = "";

    const movs = sort ? acc.movements.slice().sort((a,b) => a - b) : acc.movements;

    movs.forEach(function(mov, index){

      const type = mov > 0 ? 'deposit' : 'withdrawal';


        const date = new Date(acc.movementsDates[index]);
        const displayDate = formatMovementDate(date, acc.locale);

        const formattedMovement = formatCur(mov, acc.locale, acc.currency)

        const html = `
        <div class="movements__row">
            <div class="movements___type movements__type--${type}">${index + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMovement}</div>
        </div>`;
        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
}

const calcDisplayBalance = function(acc){
    acc.balance = acc.movements.reduce(function(acc, cur){
        return acc + cur;
    }, 0);
    labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency)
}

const calcDisplaySummary = function(acc){
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outgoing = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(outgoing), acc.locale, acc.currency)

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) /100)
  .filter((int, i, arr) => {
    // console.log(arr);
  return int >= 1;
  })
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function(accs){
    accs.forEach(function(acc){
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
}

createUsernames(accounts);

const updateUI = function(acc){
  // display movements
  displayMovement(acc);
  // display balance 
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
}

// Event Handlers

let currentAccount, timer;

const startLogOutTimer = function(){
  
const tick = function(){
  const min = String(Math.trunc(time / 60)).padStart(2, 0);
  const sec = String(time % 60).padStart(2, 0);

  // each call, print remaining time to UI
  labelTimer.textContent = `${min}:${sec}`;
  // when 0 seconds, stop timer and logout user 
  if(time === 0){
    clearInterval(timer);
    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
  // decrease one second
  time--; 
}
  // time to five minutes
  let time = 120;
  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;

}

// // Fake always logged in 

// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;

// console.log(currentAccount.locale);


btnLogin.addEventListener('click', function(event){
  // prevent form from submitting
  event.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(currentAccount?.pin === +(inputLoginPin.value)){
    // console.log("login")

    // display ui & message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Current Date and time

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    };

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // clear input fields 
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
  }
})

const gpbToUSD = 1.22;

const totalDepositsUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
  // console.log(arr);
  return mov * gpbToUSD})
  .reduce((acc, mov) => acc + mov, 0);
  
// console.log(totalDepositsUSD);

const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements)
// console.log(firstWithdrawal)

// console.log(accounts)

const account = accounts.find(acc => acc.owner === 'Jessica Davis')
// console.log(account)

btnTransfer.addEventListener('click', function(event){
  event.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value  = ""

  if(amount > 0 
    && receiverAcc
    && currentAccount.balance >= amount 
    && receiverAcc?.username !== currentAccount.username){
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }
});

btnLoan.addEventListener('click', function(event){
  event.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){
    
    setTimeout(function(){ 
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      clearInterval(timer);
      timer = startLogOutTimer();
      updateUI(currentAccount)
    }, 2500);

    inputLoanAmount.value = "";
  };
});

btnClose.addEventListener('click', function(event){
  event.preventDefault();
  // console.log("Delete");
  if(inputCloseUsername.value === currentAccount.username 
    && +(inputClosePin.value) === currentAccount.pin){
      const index = accounts.findIndex(acc => acc.username = currentAccount.username);
      // console.log(index)
      accounts.splice(index, 1)
      containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value  = ""
})

let sorted = false; 

btnSort.addEventListener('click', function(event){
  event.preventDefault;
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
})


labelBalance.addEventListener('click', function(event){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'))
  // console.log(movementsUI.map(element => +(element.textContent.replace('£', ''))))

  movementsUI2 = [...document.querySelectorAll('.movements__value')];
  // console.log(movementsUI2)
})

// console.log(new Date(account1.movementsDates[0]));

// labelBalance.addEventListener('click', function(row, i){
//   [...document.querySelectorAll('.movements__row')].forEach(function(row, i){
//     if (i % 2 === 0) row.style.backgroundColor = 'orangered';
//     if (i % 3 === 0) row.style.backgroundColor = 'blue';
//   })
// })



// // flat
// const overallBalance = accounts.map(acc => acc.movements).flat().reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance)

// // flatMap -- no depth. only goes one level deep. won't work for array-ception.
// const overallBalance2 = accounts.flatMap(acc => acc.movements).reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2)

// // // Some() method
// // // const anyDeposits = movements.some(mov => mov > 1500)
// // // console.log(anyDeposits)

// // // every() method
// // console.log(movements.every(mov => mov > 0));
// // console.log(account4.movements.every(mov => mov > 0));

// //separate callback

// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// DRY PRINCIPE: DON'T REPEAT YOURSELF!!!!


// 1. Total sum of Bank Deposits:
// const bankDepositSum = accounts.flatMap(acc => acc.movements).filter(mov => mov > 0)
// .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum)

// 2. Number of Deposits greater than 100:
// const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov > 1000)
// .reduce((count, curr) => curr > 1000 ? count + 1 : count, 0);
// console.log(numDeposits1000)

// 3. 
const sums = accounts.flatMap(acc => acc.movements).reduce((sum, cur) => {
  cur > 0 ? (sum.deposits+= cur) : (sum.withdrawals += cur);
  return sum;
}, {deposits: 0, withdrawals: 0})
// console.log(sums)



