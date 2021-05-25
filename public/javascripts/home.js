let transactionData, user_email;
/*let primus = Primus.connect("/", {
    reconnect: {
        max: Infinity,
        min: 500,
        retries: 10
    }
});*/

window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");
    if(!tokencheck){
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{
        //primus live feature /get frontend
        

        

        
        fetch("/api/v1/transfers", {
        method:"get",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${tokencheck}`
        }
        }).then(response => {
            return response.json();
        }).then(json => {
            if(json.status === "Success"){
                document.querySelector(".coins").innerHTML += json.coins
                
                transactionData = json.data;
                user_email = json.user.email;

                json.data.forEach(element => {
                    if(element.recipient == json.user.email || element.recipient == "all@student.thomasmore.be"){
                        let sender = splitEmail(element.sender);

                        if(element.message == ""){
                            let transaction = `<li class="list__item">
                                <p class="list__item--amount">+${element.amount}P</p>
                                <p class="list__item--from-to">${sender[0] + " " + sender[1]}</p>
                                <p class="list__item--message" style="cursor:default"> </p>
                            </li>
                            <hr class="list__hr">`
                            document.querySelector(".list").innerHTML += transaction;
                        }

                        else{
                            let transaction = `<li class="list__item">
                                <p class="list__item--amount">+${element.amount}P</p>
                                <p class="list__item--from-to">${sender[0] + " " + sender[1]}</p>
                                <i class="fas fa-envelope list__item--message"></i>
                            </li>
                            <hr class="list__hr">`
                            document.querySelector(".list").innerHTML += transaction;
                        }
                    }
                    else{
                        let recipient = splitEmail(element.recipient);
                        if(element.message == ""){
                            let transaction = `<li class="list__item">
                                <p class="list__item--amount--sent">-${element.amount}P</p>
                                <p class="list__item--from-to">${recipient[0] + " " + recipient[1]}</p>
                                <p class="list__item--message" style="cursor:default"> </p>
                            </li>
                            <hr class="list__hr">`
                            document.querySelector(".list").innerHTML += transaction;
                        }
                        else{
                            let transaction = `<li class="list__item">
                                <p class="list__item--amount--sent">-${element.amount}P</p>
                                <p class="list__item--from-to">${recipient[0] + " " + recipient[1]}</p>
                                <i class="fas fa-envelope list__item--message"></i>
                            </li>
                            <hr class="list__hr">`
                            document.querySelector(".list").innerHTML += transaction;
                        }
                    }
                });
            }
        })

        let userInput = document.querySelector(".recipient");
        let possibleRecipient = document.querySelector(".recipientList");
        
        clearForm();

        const searchUser = async (textToSearch) => {
            possibleRecipient.innerHTML = "";
            let res = await fetch("/users/getdata", {
                method: "get",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const resJson = await res.json();
            let users = resJson.data;

            let matches = users.filter(user =>{
                const regex = new RegExp(`^${textToSearch}`, 'gi');
                return user.firstname.match(regex) || user.lastname.match(regex);
            });

            if (userInput.value.length == 0){
                matches = [];
                possibleRecipient.style.visibility = "hidden";
            }
            
            if (userInput.value.length > 0){
                possibleRecipient.style.visibility = "visible";
            }


            if(matches.length > 0){
                matches.forEach(element => {
                    let userItem = `<div class="recipientList__item" data-email = "${element.email}">${element.firstname} ${element.lastname}</div>`
                    possibleRecipient.innerHTML += userItem;
                });

                possibleRecipient.childNodes.forEach(child => {
                    child.addEventListener("click", () => {                  
                        userInput.value = child.innerHTML;
                        possibleRecipient.style.visibility = 'hidden';
                        recipient = child.dataset.email;
                    })
                })
            }
        }

        userInput.addEventListener("input", () =>{
            searchUser(userInput.value);
        });

        document.querySelector(".button--form").addEventListener("click", async () => {
            let amount = document.querySelector(".amount").value;
            let reason = document.querySelector(".custom-dropdown").value;
            let message = document.querySelector(".message").value;
            let tokencheck = localStorage.getItem("token");

            if (recipient == undefined || recipient == null || amount == undefined || reason == undefined || reason == ""){
                // Message with "Please fill in all fields (message is optional)"
                this.alert("Fill in everything")
            }

            
            fetch("/api/v1/transfers", {
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
                if(json.status === "Success"){
                    //console.log("SUCCES - Transaction sent")
                    clearForm();
                    window.location.replace("home.html");
                }
                
                if(json.status === "Error"){
                    //console.log(`${json.message}`)
                }

            })
        });
        

        function clearForm(){
            userInput.value = "";
            document.querySelector(".amount").value = "";
            document.querySelector(".custom-dropdown").value = "Reason";
            document.querySelector(".message").value = "";
        }
    }
});

/*primus.on("data", (data) => {
    console.log(data);
});*/

function splitEmail(mail){
    if (mail == undefined || mail == null || mail == ""){
        return " "
    }
    else{
        let name = mail.split('@')[0];
        name = name.split(".");
        if(!name[0]){name[0] = " ";}
        if(!name[1]){name[1] = " ";}
        
        return name
    }
}

let list = document.querySelector(".list");
list.addEventListener("click", (e) => {
    let index = [... list.childNodes].indexOf(e.target.parentElement) /3 -1;
    if(index < 0){index = null}
    if(index != null){
        localStorage.setItem("transactionID", JSON.stringify(transactionData[index]._id));
        window.location.replace("trans_detail.html");
    }
});
