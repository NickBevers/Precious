let login = document.querySelector(".submitBtn").addEventListener("click", function(){
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;

    fetch("http://localhost:3000/users/login", {
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
        if(json.status === "success"){
            console.log("Login complete!");
        }
    })
});

let signup = document.querySelector(".signup").addEventListener("click", function(){
    console.log("to signup");
})