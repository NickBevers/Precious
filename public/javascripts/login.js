let login = document.querySelector(".button").addEventListener("click", function(){
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;

    document.querySelector(".email").classList.remove("form__input--error");
    document.querySelector(".password").classList.remove("form__input--error");

    if(email === ""){
        console.log("Incorrect email");
        document.querySelector(".email").classList.add("form__input--error");
    }
    else if(password === ""){
        console.log("password confirm is incorrect");
        document.querySelector(".password").classList.add("form__input--error");
    }
    else{
            fetch("/users/login", {
            method:"post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            }) 
        }).then(response => {
            return response.json();
        }).then(json => {
            if(json.status === "Success"){
                let token = json.data.token;
                localStorage.setItem("token", token);
                window.location.replace("home.html"); //route naar home pages
            }

            if(json.status == "NotVerified"){
                alert(`${json.message}`);
            }

            if(json.status == "Error"){
                console.log(json.message);
            }
        })
    }
    
});

let signup = document.querySelector(".button--link").addEventListener("click", function(){
    //console.log("to signup");
})