let transactionData, recipient, currentUser;

window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");
    if(!tokencheck){
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{
        currentUser = getUser(tokencheck);
        //primus live feature /get frontend
        let primus = Primus.connect("/", {
            reconnect: {
                max: Infinity,
                min: 500,
                retries: 10
            }
        });

        primus.on("data", (json) => {
            if(json.action == "add_transaction"){
                addTransaction(json.data);
                //console.log(json);
            }
            
            
        });
        
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
                this.alert("Fill in everything");
                return
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
                console.log(json);
                if(json.status === "Success"){
                    
                    primus.write({
                        "action": "add_transaction",
                        "data": json
                    })

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

function addTransaction(trans){
    console.log(trans.data);
    let json = trans.data;
    console.log(json.recipient);
    console.log(currentUser);
    
    if(json.recipient == currentUser.email){
        let sender = splitEmail(json.sender);
        if(json.message == ""){
            let transaction = `<li class="list__item">
                <p class="list__item--amount">+${json.amount}P</p>
                <p class="list__item--from-to">${sender[0] + " " + sender[1]}</p>
                <p class="list__item--message" style="cursor:default"> </p>
            </li>
            <hr class="list__hr">`
            document.querySelector(".list").innerHTML += transaction;
        }
        else{
            let transaction = `<li class="list__item">
                <p class="list__item--amount">+${json.amount}P</p>
                <p class="list__item--from-to">${sender[0] + " " + sender[1]}</p>
                <i class="fas fa-envelope list__item--message"></i>
            </li>
            <hr class="list__hr">`
            document.querySelector(".list").insertAdjacentHTML('afterbegin', transaction) //insertAdjacentHTML('afterend', transaction);
        }

        let coins = document.querySelector(".coins").innerHTML.split(" ")[1];
        let tempcoin = parseInt(coins);
        console.log(tempcoin);

        tempcoin += json.amount;
        console.log(tempcoin);
        document.querySelector(".coins").innerHTML = tempcoin;
    }
}


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

function getUser(token){
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);// atob zet versleutelde data om te zetten naar leesbare tekst
    const user = JSON.parse(rawPayload); // user uit token halen zonder dat je code nodig hebt.
    return user;
}
