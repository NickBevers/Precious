let transactionData, user_email;
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
