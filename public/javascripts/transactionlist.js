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
                    transactionData = json.data;
                    user_email = json.user.email;
    
                    json.data.forEach(element => {
                        if(element.recipient == json.user.email){
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

    }
}

function getUser(token){
    const tokenParts = token.split('.');
    const encodedPayload = tokenParts[1];
    const rawPayload = atob(encodedPayload);// atob zet versleutelde data om te zetten naar leesbare tekst
    const user = JSON.parse(rawPayload); // user uit token halen zonder dat je code nodig hebt.
    return user;
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
    let index = ([... list.childNodes].indexOf(e.target.parentElement) -1)/3;
    console.log(index);
    if(index < 0){index = null}
    if(index != null){
        localStorage.setItem("transactionID", JSON.stringify(transactionData[index]._id));
        window.location.replace("trans_detail.html");
    }
});