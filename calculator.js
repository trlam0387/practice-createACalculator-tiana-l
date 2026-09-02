const readline = require('readline/promises');

function absoluteValue(number) {
  return Math.abs(number);
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(number) {
  return Math.sqrt(number);
}

function findMaximum(numbers) {
  if (numbers.length === 0) {
    throw new Error('At least one number is required.');
  }
  return Math.max(...numbers);
}

function findMinimum(numbers) {
  if (numbers.length === 0) {
    throw new Error('At least one number is required.');
  }
  return Math.min(...numbers);
}

function randomInteger(minimum, maximum) {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum > maximum) {
    throw new Error('The range must contain whole numbers, with minimum first.');
  }
  return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
}

function customRound(number, decimalPlaces) {
  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new Error('Decimal places must be a non-negative whole number.');
  }
  const factor = Math.pow(10, decimalPlaces);
  return Math.round((number + Number.EPSILON) * factor) / factor;
}

function parseNumbers(input) {
  const numbers = input.split(',').map((value) => Number(value.trim()));
  if (numbers.some((number) => Number.isNaN(number))) {
    throw new Error('Enter numbers separated by commas.');
  }
  return numbers;
}

async function runCalculator() {
  const inputLines = process.stdin.isTTY
    ? null
    : (await new Promise((resolve) => {
        let input = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => { input += chunk; });
        process.stdin.on('end', () => resolve(input.split(/\r?\n/)));
      }));
  const interfaceInstance = inputLines ? null : readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = async (question) => inputLines
    ? inputLines.shift()
    : interfaceInstance.question(question);

  console.log('\nMath Game Calculator');
  console.log('1. Absolute value');
  console.log('2. Power');
  console.log('3. Square root');
  console.log('4. Maximum and minimum');
  console.log('5. Random integer');
  console.log('6. Custom rounding');

  try {
    const choice = (await ask('Choose an operation (1-6): ')).trim();
    let result;

    switch (choice) {
      case '1':
        result = absoluteValue(Number(await ask('Enter a number: ')));
        break;
      case '2':
        result = power(
          Number(await ask('Enter the base: ')),
          Number(await ask('Enter the exponent: ')),
        );
        break;
      case '3':
        result = squareRoot(Number(await ask('Enter a number: ')));
        break;
      case '4': {
        const numbers = parseNumbers(await ask('Enter numbers separated by commas: '));
        result = `Maximum: ${findMaximum(numbers)}\nMinimum: ${findMinimum(numbers)}`;
        break;
      }
      case '5':
        result = randomInteger(
          Number(await ask('Enter the minimum integer: ')),
          Number(await ask('Enter the maximum integer: ')),
        );
        break;
      case '6':
        result = customRound(
          Number(await ask('Enter a number: ')),
          Number(await ask('Enter decimal places: ')),
        );
        break;
      default:
        throw new Error('Choose a number from 1 to 6.');
    }

    console.log(`Result: ${result}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  } finally {
    interfaceInstance?.close();
  }
}

if (require.main === module) {
  runCalculator();
}

module.exports = {
  absoluteValue,
  power,
  squareRoot,
  findMaximum,
  findMinimum,
  randomInteger,
  customRound,
};
