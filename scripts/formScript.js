// Input Elements
const form = document.getElementById("form");
const inputFirstName = document.getElementById("inputFirstName");
const inputLastName = document.getElementById("inputLastName");
const inputPhone = document.getElementById("inputPhone");
const inputEmail = document.getElementById("inputEmail");
const inputDescription = document.getElementById("inputDescription");

// Error message elements
const firstNameErrorMessage = document.getElementById("firstNameErrorMessage");
const lastNameErrorMessage = document.getElementById("lastNameErrorMessage");
const phoneErrorMessage = document.getElementById("phoneErrorMessage");
const emailErrorMessage = document.getElementById("emailErrorMessage");
const descriptionErrorMessage = document.getElementById("descriptionErrorMessage");

// Gets the error message element related to a given input element
// Parameters: element - Html input element
// Return: The html element containing the error message for the given input element  
function getErrorMessageElement(inputElement){
    let errorMessageElement;
    switch(inputElement.id){
        case "inputFirstName":
            errorMessageElement = firstNameErrorMessage;
            break;
        case "inputLastName":
            errorMessageElement = lastNameErrorMessage;
            break;
        case "inputPhone":
            errorMessageElement = phoneErrorMessage;
            break;
        case "inputEmail":
            errorMessageElement = emailErrorMessage;
            break;
        case "inputDescription":
            errorMessageElement = descriptionErrorMessage;
            break;
        default:
            console.log("getErrorMessageElement(element) - error fetching errorMessage element");
    }
    return errorMessageElement;
}

// Enables/disables the company name input element based on customer type radio button selection
function enableCompanyNameInput(){
    let isPrivateCustomer = document.getElementById("customerTypeRadio1").checked;
    let isBusinessCustomer = document.getElementById("customerTypeRadio2").checked;
    if(!isPrivateCustomer && isBusinessCustomer){ 
        document.getElementById("inputCompany").removeAttribute("disabled");
    }else{
        document.getElementById("inputCompany").setAttribute("disabled","disabled");
    }
}

// FORM VALIDATION
// Event listener to control submit button behaviour
form.addEventListener("submit", (e) =>{
    let isValidForm = validateForm();
    if(!isValidForm){
        // form is not valid, prevent submission
        e.preventDefault();
    }else{
        alert("Thank you for your query, " + inputFirstName.value + ".\nWe'll contact you shortly at " + inputEmail.value + ".");
    }  
})

function validateForm(){   
    let isFirstNameValid = validateName(inputFirstName);
    let isLastNameValid = validateName(inputLastName);
    let isPhoneValid = validatePhone(inputPhone);
    let isEmailValid = validateEmail(inputEmail);
    let isDescriptionValid = validateDescription(inputDescription);

    return(isFirstNameValid && isLastNameValid && isPhoneValid && isEmailValid && isDescriptionValid);
}

function validateName(element){
    let name = element.value;
    let errorMessage = "";
    let isValid = true;

    if(name == null || name.length == 0){
        errorMessage = "First name cannot be empty!";
        isValid = false;
    }else if(name.length >= 50){
        errorMessage = "First name cannot be longer than 50 characters!";
        isValid = false;
    }

    if(isValid){
        styleValidInput(element);
    }else{
        styleInvalidInput(element, errorMessage);
    }

    return isValid; 
}

function validatePhone(element){
    let phoneNumber = element.value;
    let errorMessage = "";
    let isValid = true;

    if(phoneNumber == null || phoneNumber.length == 0){
        errorMessage = "Phone number cannot be empty!";
        isValid = false;
    }else if(phoneNumber.length >= 12){
        errorMessage = "Phone number cannot be longer than 12 characters!";
        isValid = false;
    }else if(containsLettersOrSpaces(phoneNumber)){
        errorMessage = "Phone number can only contain digits!";
        isValid = false;
    }

    if(isValid){
        styleValidInput(element);
    }else{
        styleInvalidInput(element, errorMessage);
    }

    return isValid; 
}

function validateEmail(element){
    let email = element.value;
    let errorMessage = "";
    let isValid = true;
    if(email == null || email.length == 0){
        errorMessage = "Email address cannot be empty!";
        isValid = false;
    }else if(email.length >= 254){
        errorMessage = "Email address cannot be longer than 254 characters!";
        isValid = false;
    }else if(email.length < 6 || 
            email.indexOf('@') < 1 || 
            email.indexOf(' ') > -1 || 
            email.substring(email.length - 4) != ".com"){
        errorMessage = "Incorrect email address format!";
        isValid = false;
    }

    if(isValid){
        styleValidInput(element);
    }else{
        styleInvalidInput(element, errorMessage);
    }

    return isValid; 
}

function validateDescription(element){
    let description = element.value;
    let errorMessage = "";
    let isValid = true;

    if(description == null || description.length == 0){
        errorMessage = "Description cannot be blank!";
        isValid = false;
    }

    if(isValid){
        styleValidInput(element);
    }else{
        styleInvalidInput(element, errorMessage);
    }

    return isValid; 
}

function styleValidInput(inputElement){
    inputElement.style.border = "1px solid green";
    getErrorMessageElement(inputElement).style.visibility = "hidden";
}

function styleInvalidInput(inputElement, errorMessage){
    inputElement.style.border = "1px solid red";
    let errorMessageElement = getErrorMessageElement(inputElement);
    errorMessageElement.innerHTML = errorMessage;
    errorMessageElement.style.visibility = "visible";
}

function resetInputStyle(inputElement){
    inputElement.style.border = "initial";
    getErrorMessageElement(inputElement).style.visibility = "hidden";
}

// Determines if a value contains non digit caraters
// Return: true if the value contains non digit characters, false otherwise
function containsLettersOrSpaces(str){
    let result = false;
    for(i = 0; i < str.length; i++){
        // codePointAt(index) returns unicode character code
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        // digits have codes between 48 (zero) and 57 (nine)
        if(str.codePointAt(i) < 48 || str.codePointAt(i) > 57){
            result = true;
            break;
        }
    }
    return result;
}