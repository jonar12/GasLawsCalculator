// HTML elements
const inputBoxesEls = document.querySelectorAll('.input');
const labelEls = document.querySelectorAll('.label');
const dropDownMenu = document.querySelector('.ddMenu');
const boylesBtn = document.querySelector('.boyle-btn');
const charlesBtn = document.querySelector('.charles-btn');
const optBtn = document.querySelectorAll('.opt-btn');
const lblUnit = document.querySelectorAll('.lbl-unit');

// state variables to keep track of current type of law and current variable to calculate
let currentType = 'boyle';
let currentVar = 1;

// array to store the input values
let values = [];

// arrays with the text of the labels for each type of law
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

// array containing the standard units
const units = ['kpa', 'L', 'moles', 'K'];

// function to return the correct label given the type and an index
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
      return -1;
  }
};

// determine the right units according to the type to every label (index)
const determineUnits = function (type, index) {
  if (type != 'ige') {
    let unit1, unit2;
    switch (type) {
      case 'boyle':
        unit1 = 1;
        unit2 = 0;
        break;
      case 'charles':
        unit1 = 3;
        unit2 = 1;
        break;
      case 'gaylussac':
        unit1 = 1;
        unit2 = 0;
        break;
      case 'avogadro':
        unit1 = 2;
        unit2 = 1;
        break;
    }
    if ((index + 1) % 2 == 0) {
      lblUnit[index].textContent = units[unit1];
    } else {
      lblUnit[index].textContent = units[unit2];
    }
  } else {
    lblUnit[index].textContent = units[index];
  }
};

// get values from user input, given an array of elements and an array of values
const getValues = function (arrEls, arrValues) {
  for (let i = 0; i < arrEls.length; i++) {
    //check if box is the one that will display the result
    if (arrEls[i].classList.contains('result')) {
      continue;
    }
    arrValues[i] = parseFloat(arrEls[i].value);
  }
};

// master function to perform the calculations given an array of values, the variable of to obtain, and the type of law
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
    // charles, gay-lussac's & avogadro's calculations
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

//add event listener to dropDownMenu
dropDownMenu.addEventListener('change', event => {
  for (i = 1; i < inputBoxesEls.length + 1; i++) {
    // clear input fields
    document.getElementById('input-' + i).value = '';
    if (
      `${event.target.value}:` ==
      document.getElementById('label-' + i).textContent
    ) {
      //change the selected variable
      currentVar = i;
      // remove the result class, readonly property to false and clear the input for every input box
      var elems = document.querySelectorAll('.result');
      elems.forEach(function (el) {
        el.classList.remove('result');
        el.readOnly = false;
        el.textContent = '';
      });
      // add the result class and the readonly property to true for the selected
      inputBoxesEls[currentVar - 1].classList.add('result');
      inputBoxesEls[currentVar - 1].readOnly = true;
    }
  }
});

// change text of labels as I click on the btn of each type of law
optBtn.forEach(item => {
  item.addEventListener('click', () => {
    const type = item.className.substring(0, item.className.indexOf('-'));
    currentType = type;
    // Loop through the label elements
    for (let i = 0; i < labelEls.length; i++) {
      // update the text content of the label elements
      labelEls[i].textContent = `${getLabels(type, i)}:`;
      // update the text of options of dropdown menu
      dropDownMenu.options[i].text = getLabels(type, i);
      dropDownMenu.options[i].value = getLabels(type, i);
      // reset the input fields
      document.getElementById(`input-${i + 1}`).value = '';
      //change the units
      determineUnits(type, i);
    }
    // remove the selected class from all btns
    [].forEach.call(document.querySelectorAll('.selected'), function (el) {
      el.classList.remove('selected');
    });
    // add a selected class to the selected btn
    item.classList.add('selected');
  });
});

// add an event listener on change of the input fields to calculate the result
inputBoxesEls.forEach(item => {
  item.oninput = () => {
    getValues(inputBoxesEls, values);
    const result = calcGasLaws(values, currentVar, currentType).toFixed(3);
    if (!isNaN(result)) {
      inputBoxesEls[currentVar - 1].value = result;
    } else {
      inputBoxesEls[currentVar - 1].value = '';
    }
  };
});
