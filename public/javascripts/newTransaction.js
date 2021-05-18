let userCoins;
window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");

    if(!tokencheck){
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{
        document.querySelector(".button").addEventListener("click", async () => {
            let recipient = document.querySelector(".recipient").value;
            let amount = document.querySelector(".amount").value;
            let reason = document.querySelector(".custom-dropdown").value;
            let message = document.querySelector(".message").value;
            let tokencheck = localStorage.getItem("token");

            // Get #coins from user
            // Get user from db
            

            await fetch("http://localhost:3000/users/getuserdata", {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokencheck}`
                }
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.status == "success"){
                    console.log(json);
                    userCoins = json.data[0].coins;
                }
            });

            // check if amount <= #coins


            if (userCoins >= amount){
                fetch("http://localhost:3000/api/v1/transfers", {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokencheck}`
                    },
                    body: JSON.stringify({
                        "recipient": recipient,
                        "amount": amount,
                        "reason": reason,
                        "message": message
                    })
                }).then(response => {
                    return response.json();
                }).then(json => {
                    if(json.status === "Succes"){
                        console.log("SUCCES - Transaction sent")
                    }
                })
            }
            else{
                console.log("TOOO FAST")
            }
        });

    }
});