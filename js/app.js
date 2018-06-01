/*
* Project name:         Interactive Form
* Student name:         Alex Khant (http://github.com/grashupfer99)
* Updated:              2018-06-01
*
* The project is implemented using the JS Module Pattern approach. It consists of 3 stand-alone modules
* 1. Validator Controller - contains functions, objects to perform main validation operations   
* 2. User Interface Controller - creates, appends elements to the DOM, filters data 
* 3. Main Controller - initializes the app, uses data from both modules to perform validation
*/

///////////// Validator Controller Module //////////////
const validatorController = (function () {

    // Email validation check using a regular expression
    const isValidEmail = (email) => /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);

    // Show/hide email prompt message
    const renderTip = (show, element) => {
        show ? element.style.display = "block" : element.style.display = "none";
    }

    // Show/hide error messages for in inputs in the "Basic Info" section
    const basicInfoAlert = (element) => {
        const input = document.getElementById(element);
        // Case for empty input fields
        if (input.value == '') {
            input.classList.add('input-error');
            input.previousElementSibling.children[0].style.display = 'inline-block';
        } else {
            input.classList.remove('input-error');
            input.previousElementSibling.children[0].style.display = 'none';
        }   
        // Case for email validation
        if (input.id == 'mail' && !isValidEmail(input.value)){
                input.classList.add('input-error');
        } else {
            input.classList.remove('input-error');
        }
    }

    // Show/hide alert messages for the "Other" option in the "Job Role" section
    const jobRoleAlert = (element) => {
        const input = document.getElementById(element);
        if(input.value == ''){
            input.classList.add('input-error');
            input.previousElementSibling.style.display = 'inline-block';
        } else {
            input.classList.remove('input-error');
            input.previousElementSibling.style.display = 'none';
        }
    }

    // Credit Card input fields validation 
    const ccInputAlert = (element) => {
        const input = document.getElementById(element);
        let isValid = false;
        let message;
        // Get an alert message for each input field / check their input values (true/false)
        if (element == 'cc-num'){
            message = '13-16 digits';
            const ccNum = (input) => /^\d{13,16}$/.test(input);
            const cc = ccNum(parseInt(input.value));
            cc ? isValid = true : isValid = false;
        } else if (element == 'zip'){
            message = '5 digits';
            const zipCode = (input) => /^\d{5}$/.test(input);
            const zip = zipCode(parseInt(input.value));
            zip ? isValid = true : isValid = false;
        } else if(element == 'cvv') {
            message = '3 digits';
            const cvvCode = (input) => /^\d{3}$/.test(input);
            const cvv = cvvCode(parseInt(input.value));
            cvv ? isValid = true : isValid = false;
        }     
        // show/hide error messages depending on the input
        if (input.value == '' || !isValid) {
            input.classList.add('input-error');
            input.previousElementSibling.children[0].style.display = 'inline-block';
        } else {
            input.classList.remove('input-error');
            input.previousElementSibling.children[0].style.display = 'none';
            document.querySelector('.cc-alert').style.display = 'none';
        }
    }

    return {
        // Email validation
        createListener: function (validator) {
            const ePrompt = document.querySelector('.email-prompt');
            return e => {
                const text = e.target.value;
                const valid = validator(text);
                const showTip = text !== "" && !valid;
                renderTip(showTip, ePrompt);
            };
        },

        // Allow using the email validation check in the other modules
        getMailValidation: (text) =>{
            return isValidEmail(text);
        },

        // Validation for all input fields, highlights and shows error messages for all empty fields
        inputValidation: (inputList) => {
            // Do for all input fields
            for (let input of inputList) {
                // filter those whose types are 'text' and 'email'
                if (input.type.includes('text') || input.type.includes('email')) {
                    // if input is empty and is being displayed
                    if (input.value == '' && input.style.display !== 'none') {
                        // for inputs with ids: name, mail
                        if(input.id == 'name' || input.id == 'mail'){
                            // Show error messages and highlight
                            input.previousElementSibling.children[0].style.display = 'inline-block';
                            input.classList.add('input-error');
                        }
                        // for inputs with ids: cc-num, zip, cvv
                        if (input.id == 'cc-num' || input.id == 'zip' || input.id == 'cvv'){
                            // Show error messages and highlight
                            document.querySelector('.cc-alert').style.display = 'block';
                            input.previousElementSibling.children[0].style.display = 'inline-block';
                            input.classList.add('input-error');
                        }
                        // 'Other' option in the Job Role Section 
                        if(input.id == 'other-title' && input.style.display !== 'none'){
                            // Show an error message
                            input.classList.add('input-error');
                            document.getElementById('other-title').previousElementSibling.style.display = 'inline-block';
                        }
                    }
                }
            }
        },

        // Validation for the input fields in the "Basic Info" section
        bInfoValidation: (inputList) => {
            let isValid = true;
            // Do for all input fields
            for (let input of inputList) {
                // filter those whose types are 'text' and 'email'
                if (input.type.includes('text') || input.type.includes('email')) {
                    // if input is empty and is being displayed
                    if (input.value == '' && input.style.display !== 'none') {
                        // for ids: name, mail, other-title
                        if (input.id == 'name' || input.id == 'mail' || input.id == 'other-title') {
                            // set to false if at least one of them doesn't satisfy any given conditions 
                            isValid = false;
                        }
                    }
                }
            }
            // return the bool value
            return isValid;
        },

        // Check if a user selected at least activities or not, return true or false
        activitiesValid: (boxes) => {
            let isValid = true;
            let count = 0;
            boxes.forEach((box) => {
                box.checked !== true ? isValid = false : count++;
            });
            count > 0 ? isValid = true : isValid = false;
            return isValid;
        },

        // Check if all Credit Card fields are valid
        ccValidation: (ccInput, zipInput, cvvInput) => {
            const ccInt = parseInt(ccInput);
            const zipInt = parseInt(zipInput);
            const cvvInt = parseInt(cvvInput);
            let isValid = false;
            const ccNum = (ccInt) => /^\d{13,16}$/.test(ccInt);
            const zipCode = (zipInt) => /^\d{5}$/.test(zipInt);
            const cvvCode = (cvvInt) => /^\d{3}$/.test(cvvInt);
            const cc = ccNum(ccInt);
            const zip = zipCode(zipInt);
            const cvv = cvvCode(cvvInt);
            if (cc && zip && cvv){
                isValid = true;
            }
            return isValid;
        },

        // Error alert messages for the "Basic Info" section
        errorAlert: (element) => basicInfoAlert(element),          
        // Credit Card error alert messages
        ccAlert: (element) => ccInputAlert(element),
        // error messages for the "Other" option
        jobAlert: (element) => jobRoleAlert(element)
    }

})();
////////////////////////////////////////////////////////


/////////// User Interface Controller Module ///////////
const UIController = (function () {

    // DOM strings
    const DOMStrings = {
        inputStr: 'input',
        titleStr: 'title',
        colorStr: 'color',
        designStr: 'design',
        mailStr: 'mail',
        formStr: 'form',
        paymentStr: 'payment',
        jsFrameworkStr: 'js-frameworks',
        colJsPunsStr: 'colors-js-puns',
        otherTitleStr: 'other-title',
        nameStr: 'name',
        ccNumStr: 'cc-num',
        zipStr: 'zip',
        cvvStr: 'cvv',
        expressStr: 'express',
        jsLibsStr: 'js-libs',
        nodeStr: 'node',
        otherTitleId: '#other-title',
        designId: '#design',
        selectColorClass: '.select-color',
        activitiesClass: '.activities',
        totalFeeClass: '.total-fee',
        creditCardClass: '.credit-card',
        errAlClass: '.error-alert',
        emailPromptClass: '.email-prompt',
        chooseActClass: '.select-activity',
        col6col: '.col-6.col',
        ccAlClass: '.cc-alert',
        paypalClass: '.paypal',
        bitcoinClass: '.bitcoin',
    }

    // Alert strings
    const alertStrings = {
        emptyAlert: 'This field should not be empty.',
        emptyAlert2: 'Please fill the field(s) below.',
        mailAlert: 'Must be a valid email address. E.g. example@example.com',
        selectActivity: 'Please select at least one activity',
        ccAlert: '13-16 digits',
        zipAlert: '5 digits',
        cvvAlert: '3 digits'
    }
    
    // Depending on each theme, update boxes in the 'Color' list   
    const setOptionBoxPos = (optionBox, str) => {
        if (optionBox.value === str) {
            optionBox.selected = true;
        }
    }

    // Create custom CSS classes with rules 
    const dynamicCSS = (className, styles) => {
        // if <style> tag already exists, update it
        if (document.getElementsByTagName('head')[0].getElementsByTagName('style')[0] !== undefined) {
            const newStyle = document.getElementsByTagName('head')[0].getElementsByTagName('style')[0];
            newStyle.textContent += `
                .${className} { 
                    ${styles}
                }
            `;
            // if <style> tag doesn't exist, create one
        } else {
            const cssStyle = document.createElement('style');
            cssStyle.type = 'text/css';
            cssStyle.innerHTML = `
                .${className} { 
                    ${styles}
                }
            `;
            document.getElementsByTagName('head')[0].appendChild(cssStyle);
        }
    }

    // Array to store the participant's fee 
    const fee = {
        total: [],
    }
    
    // Dynamically create span elements on the page
    const appendSpanEl = (elSelector, text, classStr = 'error-alert', selectorType = 'id') => {
        const element = document.createElement('span');
        element.textContent = text;
        element.className = classStr;
        if (selectorType == 'id') {
            document.getElementById(elSelector).previousElementSibling.appendChild(element);
        } else {
            document.querySelector(elSelector).appendChild(element);
        }
    }
    // Dynamically create span elements on the page
    const insertSpanEl = (text, classStr, node, existingNode) => {
        const element = document.createElement('span');
        element.textContent = text;
        element.className = classStr;
        node.insertBefore(element, existingNode);
    }

    return {

        // Create and return custom CSS classes and rules
        customCSS: function () {
            dynamicCSS('total-fee', 'color:#000;font-weight:bold;');
            dynamicCSS('overlap', 'color:gray;font-weight:bold;');
            dynamicCSS('input-error', 'border:2px solid red;');
            dynamicCSS('email-prompt', 'display:block;text-align:center;color:red;margin-bottom:18px;');
            dynamicCSS('select-activity', 'display:block;text-align:center;color:red;margin-bottom:18px;');
            dynamicCSS('input-prompt', 'display:inline-block;text-align:center;color:red;margin-left:5px;');
            dynamicCSS('error-alert', 'display:inline-block;text-align:center;color:red;margin-left:5px;');
            dynamicCSS('cc-alert', 'display:block;text-align:center;color:red;margin-bottom:18px;');
        },

        // Initial Presets
        initialPresets: function () {
            // Set focus on the first text field
            document.querySelectorAll(DOMStrings.inputStr)[0].focus();
            // Hide the email prompt message 
            document.querySelector(DOMStrings.emailPromptClass).style.display = 'none';
            // Hide the input field for job role: other
            document.querySelector(DOMStrings.otherTitleId).style.display = 'none';
            // Disable the 'Select Theme' option 
            document.getElementById(DOMStrings.designStr).children[0].disabled = true;
            // Hide all error messages on the page
            document.querySelectorAll(DOMStrings.errAlClass).forEach(item => item.style.display = 'none');
            // Hide the #colors-js-puns
            document.getElementById(DOMStrings.colJsPunsStr).style.display = 'none';
            // Hide error message for activities
            document.querySelector(DOMStrings.chooseActClass).style.display = 'none';     
            // Hide the total cost unless any checkbox is checked
            document.querySelector(DOMStrings.totalFeeClass).style.display = 'none';
            // Initially hide paypal/bitcoin containers 
            document.querySelector(DOMStrings.paypalClass).style.display = 'none';
            document.querySelector(DOMStrings.bitcoinClass).style.display = 'none';
            // Disable the "Select Payment Method" option
            document.getElementById(DOMStrings.paymentStr).children[0].disabled = true;
            // Select the "Credit Card" option by default
            document.getElementById(DOMStrings.paymentStr).children[1].selected = true;
            // Hide the error message for Credit Card validation
            document.querySelector(DOMStrings.ccAlClass).style.display = 'none';
        },

        // Handler for the overlapping checkbox activities  
        activityOverlap: (ChkBoxA, ChkBoxB) => {
            if (ChkBoxA.checked) {
                ChkBoxB.parentNode.className = 'overlap';
                ChkBoxB.disabled = true;
                ChkBoxB.checked = false;
            } else if (ChkBoxB.checked) {
                ChkBoxA.parentNode.className = 'overlap';
                ChkBoxA.disabled = true;
                ChkBoxA.checked = false;
            } else {
                ChkBoxA.parentNode.className = '';
                ChkBoxB.parentNode.className = '';
                ChkBoxA.disabled = false;
                ChkBoxB.disabled = false;
            }
        },

        // DOM strings 
        getDOMStrings: () => {
            return DOMStrings;
        },

        // Alert strings
        getAlertStrings: () => {
            return alertStrings;
        },

        // Participant's total fee calculator
        calculateFee: (name, value, total = fee.total) => {
            if (value) {
                name !== 'all' ? total.push(100) : total.push(200);
                total = total.reduce((cur, prev) => prev + cur, 0);
            } else {
                if (name !== 'all') {
                    total.splice(total.indexOf(100), 1);
                } else {
                    total.splice(total.indexOf(200), 1);
                }
                total = total.reduce((cur, prev) => prev + cur, 0);
            }
            return total;
        },

        // Create and append elements to the DOM
        appendElements: function () {
            const firstFieldset = document.getElementsByTagName('fieldset')[0];
            const other = document.getElementById(DOMStrings.otherTitleStr);
            const ccNode = document.querySelector(DOMStrings.creditCardClass);
            const div6col = document.querySelector(DOMStrings.col6col);
            const activityNode = document.querySelector(DOMStrings.activitiesClass);
            const activityExNode = document.querySelector(DOMStrings.activitiesClass).firstElementChild;
            const emailExNode = document.getElementById(DOMStrings.mailStr).nextElementSibling;

            appendSpanEl(DOMStrings.activitiesClass, '', 'total-fee', selectorType = 'class');
            appendSpanEl(DOMStrings.nameStr, alertStrings.emptyAlert);
            appendSpanEl(DOMStrings.mailStr, alertStrings.emptyAlert);
            appendSpanEl(DOMStrings.ccNumStr, alertStrings.ccAlert);
            appendSpanEl(DOMStrings.zipStr, alertStrings.zipAlert);
            appendSpanEl(DOMStrings.cvvStr, alertStrings.cvvAlert);
            insertSpanEl(alertStrings.emptyAlert, 'error-alert', firstFieldset, other);
            insertSpanEl(alertStrings.emptyAlert2, 'cc-alert', ccNode, div6col);
            insertSpanEl(alertStrings.selectActivity, 'select-activity', activityNode, activityExNode);    
            insertSpanEl(alertStrings.mailAlert, 'email-prompt', firstFieldset, emailExNode);
            
            // Assign class names (paypal, bitcoin)
            document.querySelector(DOMStrings.creditCardClass).nextElementSibling.className = 'paypal';
            document.querySelector(DOMStrings.paypalClass).nextElementSibling.className = 'bitcoin';
        },

        // Filter names based on each theme
        filterDesignThemes: function (selectColor, theme) {
            selectColor.forEach(item => {
                if (theme.value.includes('js puns')) {
                    checkTheme = 'js puns';
                    setOptionBoxPos(item, 'cornflowerblue');
                }
                if (theme.value.includes('heart js')) {
                    checkTheme = 'I ♥ JS';
                    setOptionBoxPos(item, 'tomato');
                }
                const logicFlag = item.textContent.toUpperCase().includes(checkTheme.toUpperCase());
                if (logicFlag) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                    if (theme[theme.selectedIndex].textContent === 'Select Theme') {
                        setOptionBoxPos(item, 'cornflowerblue');
                        item.style.display = 'block';
                    }
                }
            });
        },

        // Show/hide payment options
        renderPaymentOpt: function (cc, payP, bitC, e) {
            if (e.target.value == 'credit card') {
                cc.style.display = 'block';
                payP.style.display = 'none';
                bitC.style.display = 'none';
            }
            if (e.target.value == 'paypal') {
                cc.style.display = 'none';
                payP.style.display = 'block';
                bitC.style.display = 'none';
            }
            if (e.target.value == 'bitcoin') {
                cc.style.display = 'none';
                payP.style.display = 'none';
                bitC.style.display = 'block';
            }
        },
    }

})();
////////////////////////////////////////////////////////



/////////////// Global Controller Module ///////////////
const globalController = (function (validatorCtrl, UICtrl) {

    // Get the DOMStrings from UIController
    const DOM = UICtrl.getDOMStrings();

    // Setting up variables
    const otherTitle = document.getElementById(DOM.otherTitleStr);
    const colorSelector = Array.from(document.getElementById(DOM.colorStr));
    const jsFrameworksChkd = document.getElementsByName(DOM.jsFrameworkStr)[0];
    const expressChkd = document.getElementsByName(DOM.expressStr)[0];
    const jsLibsChkd = document.getElementsByName(DOM.jsLibsStr)[0];
    const nodeChkd = document.getElementsByName(DOM.nodeStr)[0];
    const inputs = document.getElementsByTagName(DOM.inputStr);
    const activityBoxes = document.querySelector(DOM.activitiesClass).querySelectorAll(DOM.inputStr);
    const ccNumField = document.getElementById(DOM.ccNumStr);
    const zipField = document.getElementById(DOM.zipStr);
    const cvvField = document.getElementById(DOM.cvvStr);


    // Function to store all event listeners
    const setupEventListeners = () => {

        // Event listener for the "Job Role" options
        document.getElementById(DOM.titleStr).addEventListener('change', (e) => {
            // Show the input field for the "Other" option
            if(e.target.value === 'other'){
                otherTitle.style.display = 'block';
            } else {
                otherTitle.style.display = 'none';
                otherTitle.previousElementSibling.style.display = 'none';
            }
        });

        // Event listener for the Design themes
        document.getElementById(DOM.designStr).addEventListener('change', (e) => {
            const themes = e.target;
            document.getElementById(DOM.colorStr).style.display = 'block';
            document.getElementById(DOM.colJsPunsStr).style.display = 'block';
            // Filter colors based on a theme
            UICtrl.filterDesignThemes(colorSelector, themes);
        });

        // Event handler for Activities
        document.querySelector(DOM.activitiesClass).addEventListener('change', (e) => {
            const totalCost = document.querySelector(DOM.totalFeeClass);
            totalCost.style.display = 'block';
            // Show a total cost for all selected activities
            totalCost.textContent = `Total: $${UICtrl.calculateFee(e.target.name, e.target.checked)}`;
            // Grey out overlapped activities
            UICtrl.activityOverlap(jsFrameworksChkd, expressChkd);
            UICtrl.activityOverlap(jsLibsChkd, nodeChkd);
            // Hide an error message if at least one activity is selected
            if (validatorCtrl.activitiesValid(activityBoxes)) {
                document.querySelector(DOM.chooseActClass).style.display = 'none';
            } 
        });

        // Event handler for Payment options 
        document.getElementById(DOM.paymentStr).addEventListener('change', (e) => {
            const creditCard = document.querySelector(DOM.creditCardClass);
            const paypal = document.querySelector(DOM.paypalClass);
            const bitcoin = document.querySelector(DOM.bitcoinClass);
            UICtrl.renderPaymentOpt(creditCard, paypal, bitcoin, e);
        });

        // Email validation
        document.getElementById(DOM.mailStr).addEventListener('input', validatorCtrl.createListener(validatorCtrl.getMailValidation));
        
        // Events handlers for error messages
        document.getElementById(DOM.nameStr).addEventListener('keyup', () => {
            validatorCtrl.errorAlert(DOM.nameStr);
        });
        document.getElementById(DOM.mailStr).addEventListener('keyup', () => {
            validatorCtrl.errorAlert(DOM.mailStr);
        });
        document.getElementById(DOM.otherTitleStr).addEventListener('keyup', () => {
            validatorCtrl.jobAlert(DOM.otherTitleStr);
        });
        document.getElementById(DOM.ccNumStr).addEventListener('keyup', () => {
            validatorCtrl.ccAlert(DOM.ccNumStr);
        });
        document.getElementById(DOM.zipStr).addEventListener('keyup', () => {
            validatorCtrl.ccAlert(DOM.zipStr);
        });
        document.getElementById(DOM.cvvStr).addEventListener('keyup', () => {
            validatorCtrl.ccAlert(DOM.cvvStr);
        });

        // Submit form validation
        document.querySelector(DOM.formStr).addEventListener('submit', (e) => {
            let submitForm = false;
            let basicInfo = false;
            let email = false;
            let activities = false;
            let cc = false;
            let otherPayment = false;
            // Validation for all input fields, highlights and shows error messages for all empty fields
            validatorCtrl.inputValidation(inputs);
            // Validation for input fields in the "Basic Info" section. Returns true/false
            basicInfo = validatorCtrl.bInfoValidation(inputs);
            // Email validation. Returns true/false
            email = validatorCtrl.getMailValidation(document.getElementById(DOM.mailStr).value);
            // Validation for all activity boxes. Returns true/false
            activities = validatorCtrl.activitiesValid(activityBoxes);
            // If not a single activity box is checked, display an error message 
            if (!validatorCtrl.activitiesValid(activityBoxes)){
                document.querySelector(DOM.chooseActClass).style.display = 'block'; 
            } 
            // If the Credit Card payment option is selected, return true, else - another payment is used
            if (document.getElementById(DOM.paymentStr).children[1].selected) {
                cc = validatorCtrl.ccValidation(ccNumField.value, zipField.value, cvvField.value);
            } else {
                otherPayment = true;
            }          
            // If all conditions are partially true, return true/false  
            basicInfo && email && activities && (cc || otherPayment) ? submitForm = true : submitForm = false;
            // Form is submitted only when the submitForm variable returns true
            if(!submitForm)
               e.preventDefault();
        });
    }

    return {
        // Public init function
        init: function () {
            // Initialize some custom CSS styles
            UICtrl.customCSS();

            // <-- Please select a T-shirt theme
            UICtrl.appendElements();

            // Initial presets
            UICtrl.initialPresets();

            // Initialize all event listeners
            setupEventListeners();
        }
    }
})(validatorController, UIController);
////////////////////////////////////////////////////////

globalController.init();

