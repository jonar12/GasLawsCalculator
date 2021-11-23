// an array of the HTML input objects
let inputBoxesEls = [];
let labelEls = [];

let currentType = 'boyle';
let currentVar = 1;
// an array to store the input values
let values = [];

// arrays with label texts
const boyleLabels = [
  'Initial Pressure',
  'Initial Volume',
  'Final Pressure',
  'Final Volume',
];
const charlesLabels = [
  'Initial Volume',
  'Initial Temperature',
  'Final Volume',
  'Final Temperature',
];
const gaylussacLabels = [
  'Initial Pressure',
  'Initial Temperature',
  'Final Pressure',
  'Final Temperature',
];
const avogadroLabels = [
  'Initial Volume',
  'Initial Number of Moles',
  'Final Volume',
  'Final Number of Moles',
];
const igeLabels = ['Pressure', 'Volume', 'Number of moles', 'Temperature'];

// function to return arrays given an index
const getLabels = function (type, index) {
  switch (type) {
    case 'boyle':
      return boyleLabels[index];
    case 'charles':
      return charlesLabels[index];
    case 'gaylussac':
      return gaylussacLabels[index];
    case 'avogadro':
      return avogadroLabels[index];
    case 'ige':
      return igeLabels[index];
    default:
  }
};

// HTML elements
const calcBtn = document.querySelector('.calc-btn');
const dropDownMenu = document.getElementById('ddMenu');
const inputBox = document.querySelectorAll('.inputs');
const boylesBtn = document.querySelector('.boyle-btn');
const charlesBtn = document.querySelector('.charles-btn');
const optBtn = document.querySelectorAll('.opt-btn');

// Fill an array with the input boxes elements
const fillInput = function (arr, type) {
  for (let i = 1; i < 5; i++) {
    arr[i - 1] = document.getElementById(`${type}-${i}`);
  }
};

const getValues = function (arrObj, arrValues) {
  for (let i = 0; i < arrObj.length; i++) {
    //check if box is read only
    if (arrObj[i].classList.contains('result')) {
      continue;
    }
    arrValues[i] = parseFloat(arrObj[i].value);
  }
};

const calcGasLaws = function (values, resVar, type) {
  if (type == 'boyle') {
    switch (resVar) {
      case 1:
        return (values[2] * values[3]) / values[1];
      case 2:
        return (values[2] * values[3]) / values[0];
      case 3:
        return (values[0] * values[1]) / values[3];
      case 4:
        return (values[0] * values[1]) / values[2];
      default:
        return -1;
    }
  } else if (type == 'ige') {
    const R = 8.31;
    switch (resVar) {
      case 1: //P
        return (values[2] * R * values[3]) / values[1];
      case 2: //V
        return (values[2] * R * values[3]) / values[0];
      case 3: //n
        return (values[0] * values[1]) / (R * values[3]);
      case 4: //T
        return (values[0] * values[1]) / (values[2] * R);
      default:
        return -1;
    }
  } else {
    switch (resVar) {
      case 1: //[0]
        return (values[2] * values[1]) / values[3];
      case 2: //[1]
        return (values[3] * values[0]) / values[2];
      case 3: //[2]
        return (values[3] * values[0]) / values[1];
      case 4: //[3]
        return (values[2] * values[1]) / values[0];
      default:
        return -1;
    }
  }
};

fillInput(inputBoxesEls, 'input');
fillInput(labelEls, 'label');

//add event listener to calcBtn
calcBtn.addEventListener('click', () => {
  getValues(inputBoxesEls, values);
  inputBoxesEls[currentVar - 1].value = calcGasLaws(
    values,
    currentVar,
    currentType
  ).toFixed(3);
});

//add event listener to dropDownMenu
dropDownMenu.addEventListener('change', event => {
  for (i = 1; i < inputBoxesEls.length + 1; i++) {
    // clear input fields
    document.getElementById('input-' + i).value = '';
    if (
      event.target.value + ': ' ==
      document.getElementById('label-' + i).textContent
    ) {
      currentVar = i;
      var elems = document.querySelectorAll('.result');
      elems.forEach(function (elems) {
        elems.classList.remove('result');
        elems.readOnly = false;
        elems.textContent = '';
      });
      inputBoxesEls[i - 1].classList.add('result');
      inputBoxesEls[i - 1].readOnly = true;
    }
  }
});

// change text of labels as I click on the btn
optBtn.forEach(item => {
  item.addEventListener('click', () => {
    for (let i = 0; i < labelEls.length; i++) {
      const type = item.className.substring(0, item.className.indexOf('-'));
      currentType = type;
      // update the text content of the label elements
      labelEls[i].textContent = `${getLabels(type, i)}: `;
      // update the text of options of dropdown menu
      dropDownMenu.options[i].text = getLabels(type, i);
      dropDownMenu.options[i].value = getLabels(type, i);
      // reset the input fields
      document.getElementById(`input-${i + 1}`).value = '';
    }
  });
});
