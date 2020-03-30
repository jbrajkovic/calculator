const calculator = (function() {
    
    const firstNumber  = document.getElementById('first');
    const secondNumber = document.getElementById('second');
    const output       = document.getElementById('result');
    const buttons      = document.querySelectorAll('button');
    const resultLine   = document.querySelector('.result-line');
    const MAX_DIGITS   = 13;
    
    let currentTyping   = output;
    let operatorPressed = false;
    let equalPressed    = false;
    let negativeNumber  = false;
    
    function maxRoundToSix(num) {
        //+ removes trailing zeros
        return +(num).toFixed(6);
    }
    
    function setResultLineVisibility(visibility) {
        resultLine.setAttribute('style', `visibility: ${visibility}`)
    }
    
    function clear() {
        firstNumber.innerHTML  = "";
        secondNumber.innerHTML = "";
        output.innerHTML       = '';
        currentTyping          = output;
        operatorPressed        = false;
        dotAlreadyPressed      = false;
        negativeNumber         = false;
        equalPressed           = false;
        setResultLineVisibility('hidden');
    }
    
    function showError(err) {
        clear();
        output.innerHTML = err;
    }
    
    function equal(result) {
        clear();
        output.innerHTML = result;
        equalPressed     = true;
    }
    
    function backspace() {
        const currentOutput = currentTyping.innerHTML;
        const isSecondRow   = currentTyping.id === 'second';
        const firstRow      = firstNumber.innerHTML;
        const deleted       = currentOutput[currentOutput.length - 1];

        if(currentOutput === 'Error' || currentOutput === 'Out of limit') {
            currentTyping.innerHTML = '';
            return true;
        }
    
        if(deleted === '-') {
            negativeNumber = false;
        }
    
        currentTyping.innerHTML = currentOutput.slice(0, -1);
    
        if (isSecondRow && currentTyping.innerHTML === '') {
            clear();
            output.innerHTML = firstRow;
        }
    }
    
    function checkLimit(limit, result) {
    
        if(result === 'Error') return result;
    
        const output      = maxRoundToSix(result);
        const numOfDigits = output.toString().length;
    
        return (numOfDigits > limit || isNaN(output)) ? 'Out of limit' : output;
    }
    
    function calculate(num1, num2, operation) {
        if (operation === '+') return num1 + num2;
    
        if (operation === '-') return num1 - num2;
    
        if (operation === '×') return num1 * num2;
    
        if (operation === '÷') {
            return num2 === 0 ? 'Error' : num1 / num2;
        };
    }
    
    function storeNumbersAndCalculate(e) {
    
        const enteredSecondNumber = secondNumber.innerHTML !== '';
        const equalPressed        = e.target.dataset.action === 'equal';
        const num1                = parseFloat(firstNumber.innerHTML) || parseFloat(output.innerHTML) || 0;
        let result                = num1;
    
        firstNumber.innerHTML = num1;
        output.innerHTML      = '';
    
        if (enteredSecondNumber) { //
            const operator = secondNumber.innerHTML.substring(0, 1);
            const num2     = parseFloat(secondNumber.innerHTML.substring(1))//
            const calc     = calculate(num1, num2, operator);
            result         = checkLimit(MAX_DIGITS, calc);
    
            if(isNaN(result)) {
                showError(result);
                return false;
            }
    
            firstNumber.innerHTML  = result;
            secondNumber.innerHTML = '';
        }
    
        if (equalPressed) {
            equal(result);
            return true;
        }
    
        currentTyping            = secondNumber;
        currentTyping.innerHTML += e.target.value;
    }
    
    function doCalculatorLogic(e) {
        const button              = e.target;
        const action              = button.dataset.action;
        const isButtonOperator    = action === 'operator' || action === 'equal';
        const isDot               = action === 'dot';
        const clearPressed        = action === 'clear';
        const backspacePressed    = action === 'del' || button.id === 'delete-icon';
        const startedCalculate    = output.innerHTML !== '' || firstNumber.innerHTML !== '';
        const numbersLimitReached = currentTyping.innerHTML.length >= MAX_DIGITS;
        const errorDisplayed      = output.innerHTML === 'Error' || output.innerHTML === 'Out of limit';
        const dotAlreadyPressed   = currentTyping.innerHTML.indexOf('.') > -1;    

        if(equalPressed && !isButtonOperator) {
            clear();
            equalPressed = false;
        }
    
        if (clearPressed) {
            clear();
            return true;
        }
    
        if (backspacePressed) {
            backspace();
            return true;
        }
    
        if(errorDisplayed && !isButtonOperator) {
            clear();
            currentTyping.innerHTML += button.value;
            return true;
        }
    
        if (isButtonOperator && operatorPressed === false && startedCalculate) {
            operatorPressed = true;
            negativeNumber  = false;
            equalPressed    = false;
    
            if(errorDisplayed) return false;
    
            setResultLineVisibility('inherit');
            storeNumbersAndCalculate(e);
    
            return true;
        }
          //if allowed minus before number
        if((!startedCalculate || operatorPressed) && negativeNumber === false && button.value === '-') {
    
            if(errorDisplayed) return false;
    
            currentTyping.innerHTML += button.value;
            negativeNumber           = true;
            operatorPressed          = true;
        }
    
        if(isDot && dotAlreadyPressed) {
            return false;
        }
    
        if (!isButtonOperator && !numbersLimitReached) {
            operatorPressed          = false;
            currentTyping.innerHTML += button.value;
        }
    
    }

    function start() {
        buttons.forEach(button => button.addEventListener('click', doCalculatorLogic));
    }

    return {
        start
    }
    
})()

calculator.start();