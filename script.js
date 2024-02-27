const amountInput = document.querySelector('.amount');
const percentageInput = document.querySelector('.percentage');
const btnCalc = document.querySelector('.btnCalc');
const result = document.querySelector('.result');
const hamberger = document.querySelector('.hamberger');
const container = document.querySelector('.container')
const extractedHamberger = document.querySelector(".extractedHamberger");
const listItem = document.querySelector('.listItem');
const deleteBtn = document.querySelector('.deleteBtn');
const historyContent = document.querySelector('.historyContent');
const wrapperContent = document.querySelector('.wrapperContent');

let storedData;
btnCalc.disabled = true;
deleteBtn.disabled = true;

function toggleCalcButton() {
    const amount = Number(amountInput.value);
    const percentage = Number(percentageInput.value);

    btnCalc.disabled = !(amount !== 0 || percentage !== 0);
}

amountInput.addEventListener('input', toggleCalcButton);
percentageInput.addEventListener('input', toggleCalcButton);

window.addEventListener('DOMContentLoaded', () => {
    storedData = JSON.parse(localStorage.getItem('History')) || [];
    displayStoredResults();
    toggleCalcButton();
});

document.body.addEventListener('click', (event) => {
    if (!extractedHamberger.contains(event.target) && !hamberger.contains(event.target)) {
        container.classList.remove('blur-background');
        container.classList.remove('active');
        extractedHamberger.style.left = '-100%';
    }
});

function calcPercentage() {
    let amount = Number(amountInput.value);
    let percentage = Number(percentageInput.value);
    let calResult = amount * (percentage / 100);
    let roundedResult = calResult.toFixed(2);
    result.textContent = `Result: ${roundedResult} /-`;

    let historyData = {
        amount: amount, tax: percentage,
        time: new Date().toLocaleString(),
        result: roundedResult,
    };

    let duplicateIndex = storedData.findIndex(item => item.amount === amount && item.tax === percentage);
    if (duplicateIndex !== -1) {
        storedData.splice(duplicateIndex, 1);
    }
    storedData.unshift(historyData);
    localStorage.setItem('History', JSON.stringify(storedData));

    if (amount == 0 && percentage == 0) {
        console.log('its empty');
        btnCalc.disable = true;
    }
    btnCalc.disabled = true;
}

btnCalc.addEventListener('click', () => {
    calcPercentage();
    amountInput.value = '';
    percentageInput.value = '';
});

deleteBtn.addEventListener('click', () => {
    localStorage.clear();
    historyContent.innerHTML = '';
    storedData = [];
    if (historyContent.innerHTML == '') {
        deleteBtn.disabled = true;
    }
});

hamberger.addEventListener('click', () => {
    console.log('Hamburger clicked');
    container.classList.add('blur-background');
    extractedHamberger.style.left = '0';
    container.classList.toggle('active');
    displayStoredResults();
});

extractedHamberger.querySelector('.closeButton').addEventListener('click', () => {
    console.log('Close button clicked');
    container.classList.remove('blur-background');
    container.classList.toggle('active');
    extractedHamberger.style.left = '-100%';
});

function displayStoredResults() {
    historyContent.innerHTML = '';

    storedData.forEach((item, index) => {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.amount}</td>
            <td>${item.tax}</td>
            <td>${item.result}</td>
            <td>${item.time}</td>
            <td>
                <button class="deleteList"><i class="ri-delete-bin-6-line"></i></button>
            </td>
        `;

        newRow.addEventListener('click', () => {
            amountInput.value = item.amount;
            percentageInput.value = item.tax;
            extractedHamberger.style.left = '-100%';
            result.textContent = `Result: ${item.result}`;
        });

        newRow.querySelector('.deleteList').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteItem(index);
        });

        historyContent.appendChild(newRow);
    });
    deleteBtn.disabled = storedData.length === 0;
}


function deleteItem(index) {
    storedData.splice(index, 1);
    localStorage.setItem('History', JSON.stringify(storedData));
    displayStoredResults();
}
