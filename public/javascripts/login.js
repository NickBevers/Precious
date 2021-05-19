let login = document.querySelector(".button").addEventListener("click", function(){
    let email = document.querySelector(".email").value;
    let password = document.querySelector(".password").value;

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
        if(json.status === "success"){
            window.location.replace("home.html"); //route naar home pages
        }
    })
});

let signup = document.querySelector(".button--link").addEventListener("click", function(){
    //console.log("to signup");
})