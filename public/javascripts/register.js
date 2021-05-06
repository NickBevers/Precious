let signup = document.querySelector(".button--submit").addEventListener("click", function(){
    let firstname = document.querySelector(".firstname").value;
    let lastname = document.querySelector(".lastname").value;
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;
    let confirmpassword = document.querySelector(".confirmpassword").value;

    let emailrestriction = email.indexOf("@student.thomasmore.be");
    let checkbox = document.querySelector(".custom-checkbox__input");

    //regex check for email -> not r-mail but full name

    if(emailrestriction === -1){
        console.log("Incorrect email");
    }
    else if(checkbox.checked === false){
        console.log("check the checkbox");
    }
    else if(password !== confirmpassword){
        console.log("password confirm is incorrect");
    }
    else{
        fetch("http://localhost:3000/users/mail", {
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
            if(json.status === "error"){
                alert("email alreadt exists!")
            }
            else{
                fetch("http://localhost:3000/users/signup", {
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
                    if(answer.status === "success"){
                        console.log("Signup complete!");
        
                        let token = answer.data.token;
                        localStorage.setItem("token", token);
                        window.location.replace("home.html"); // deze locatie waarschijnlijk nog aanpassen
                    }
                })
            }
        })       
    }
});