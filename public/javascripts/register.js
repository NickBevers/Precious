let signup = document.querySelector(".button").addEventListener("click", function(){
    let firstname = document.querySelector(".firstname").value;
    let lastname = document.querySelector(".lastname").value;
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;
    let confirmpassword = document.querySelector(".confirmpassword").value;

    let regex = /[A-Za-z\.]+@(student\.thomasmore\.be)/g;
    let result = email.match(regex);
    
    let checkbox = document.querySelector(".custom-checkbox__input");

    document.querySelector(".firstname").classList.remove("form__input--error");
    document.querySelector(".lastname").classList.remove("form__input--error");
    document.querySelector(".email").classList.remove("form__input--error");
    document.querySelector(".custom-checkbox").classList.remove("custom-checkbox__label--error");
    document.querySelector(".password").classList.remove("form__input--error");
    document.querySelector(".confirmpassword").classList.remove("form__input--error");

    if(firstname === ""){
        document.querySelector(".firstname").classList.add("form__input--error");
    }
    else if(lastname === ""){
        document.querySelector(".lastname").classList.add("form__input--error");
    }
    else if(!result){
        console.log("Incorrect email");
        document.querySelector(".email").classList.add("form__input--error");
    }
    else if(password === "" || password !== confirmpassword){
        console.log("password confirm is incorrect");
        document.querySelector(".password").classList.add("form__input--error");
        document.querySelector(".confirmpassword").classList.add("form__input--error");
    }
    else if(checkbox.checked === false){
        console.log("check the checkbox");
        document.querySelector(".custom-checkbox").classList.add("custom-checkbox__label--error");
    }  
    else{
        fetch("/users/mail", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email
            }) 
        }).then(response => {
            return response.json();
        }).then(json => {
            if(json.status === "Error"){
                alert("email alreadt exists!")
            }
            else{
                fetch("/users/signup", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "firstname": firstname,
                        "lastname": lastname,
                        "email": email,
                        "password": password
                    })
                }).then(result => {
                    return result.json();                    
                }).then(answer => {
                    if(answer.status === "Success"){
                        //console.log("Signup complete!");
        
                        let token = answer.data.token;
                        localStorage.setItem("token", token);
                        alert("please confirm your email");
                        // window.location.replace("home.html"); // deze locatie waarschijnlijk nog aanpassen
                    }
                })
            }
        })       
    }
});