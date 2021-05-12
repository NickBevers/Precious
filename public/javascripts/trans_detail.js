let data = JSON.parse(localStorage.getItem("transactionID"));
localStorage.removeItem("transactionID")
console.log(data);
let from_to = document.querySelector(".recipient");
let amount = document.querySelector(".amount");
let reason = document.querySelector(".reason");
let message = document.querySelector(".message");

window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");
    if (!tokencheck) {
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{
        fetch(`http://localhost:3000/api/v1/transfers/id=${data}`, {
        method:"get",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${tokencheck}`
        }
        }).then(response => {
            return response.json();
        }).then(json => {
            if(json.status === "succes"){
                console.log(json.data);
                console.log(json.user);
                user_email = json.user.email;

                if (json.data.recipient == data.user){
                    from_to.innerHTML = json.data.sender
                }
                else{
                    from_to.innerHTML = json.data.recipient
                }

                amount.innerHTML = json.data.amount;
                reason.innerHTML = json.data.reason;
                message.innerHTML = json.data.message;
            }
        })
    }
});


