let loginForm, inputLoginEmail, inputLoginPassword, btnLogin;
let registerForm, inputRegEmail, inputRegPassword, inputRegPasswordR, btnReg;

function initiate(){
    loginForm = document.querySelector("#loginForm");
    inputLoginEmail = document.querySelector("#inputLoginEmail");
    inputLoginPassword = document.querySelector("#inputLoginPassword");
    btnLogin = document.querySelector("#btnLogin");

    registerForm = document.querySelector("#registerForm");
    inputRegEmail = document.querySelector("#inputRegisterEmail");
    inputRegPassword = document.querySelector("#inputRegisterPassword");
    inputRegPasswordR = document.querySelector("#inputRegisterPasswordR");
    btnReg = document.querySelector("#btnRegister");
}

function login(){
    let email = inputLoginEmail.value;
    let password = inputLoginPassword.value;
    btnLogin.disable = true;
    sendHttpGetRequest("/api/login?email="+email+"&password="+password, (res)=>{
        alert(res);
        btnLogin.disable = false;
    });
}

function showRegister(){
    loginForm.classList.add("hideLogin");
    registerForm.classList.add("showRegister");
}
function hideRegister(){
    loginForm.classList.remove("hideLogin");
    registerForm.classList.remove("showRegister");
}

function register(){
    btnReg.disable =true;
    if(emailRestriction(inputRegEmail.value)){
        if(passwordRestriction(inputRegPassword.value)){
            if(inputRegPassword.value == inputRegPasswordR.value){
                //matching passwords
                console.log("trying to register");
                let email = inputRegEmail.value;
                let password = inputRegPassword.value;
                sendHttpGetRequest("/api/register?email="+email+"&password="+password, (res)=>{
                    alert(res);
                    hideRegister();
                });
            }
            else{
                //repeated wrongly 
                alert("passwords dont match")
            }
        }
        else{
            //bad password
            alert("password doesn't align with the policy");
        }
    }
    else{
        //bad email
        alert("email doesn't align with the policy");
    }
    btnReg.disable=false;
}

function emailRestriction(email){
    if(email.includes("@") && email.endsWith(".com")){
        return true;
    }
    else{
        return false;
    }
}

function passwordRestriction(password){
    return true;
}

function checkEmail(){
    if(!emailRestriction(inputRegEmail.value)){
        inputRegEmail.classList.add("redOutline");
    }
    else{
        if(inputRegEmail.classList.contains("redOutline")){
            inputRegEmail.classList.remove("redOutline");
        }
    }
}
function checkPassword(){
    if(!passwordRestriction(inputRegPassword.value)){
        inputRegPassword.classList.add("redOutline");
    }
    else{
        if(inputRegPassword.classList.contains("redOutline")){
            inputRegPassword.classList.remove("redOutline");
        }
    }
}
function checkkSecondPassword(){
    if(inputRegPassword.value != inputRegPasswordR.value){
        inputRegPasswordR.classList.add("redOutline");
    }
    else{
        if(inputRegPasswordR.classList.contains("redOutline")){
            inputRegPasswordR.classList.remove("redOutline");
        }
    }
}


function sendHttpGetRequest(url, action){
    let httpRequet = new XMLHttpRequest();
    httpRequet.onreadystatechange = ()=>{
        if(httpRequet.readyState == 4){
            //resopnse is ready
            if(httpRequet.status == 200){
                //all is clear
                action(httpRequet.responseText);
            }
            else{
                console.log("something went wrong and the response status is not 200");
            }
        }
    }

    httpRequet.open("GET", url);
    httpRequet.send();
}