let signup = document.querySelector(".submitBtn").addEventListener("click", function(){
    let firstname = document.querySelector(".firstname").value;
    let lastname = document.querySelector(".lastname").value;
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;
    
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
    }).then(response => {
        return response.json();
    }).then(json => {
        if(json.status === "success"){
            console.log("Signup complete!");

            let token = json.data.token;
            localStorage.setItem("token", token);
            window.location.href = "register.html"; // deze locatie waarschijnlijk nog aanpassen
        }
    })
});