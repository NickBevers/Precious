let recipient;
const SLACKTOKEN = "xoxb-2126898775153-2107515768182-QApgPncVIRcjJW2RchF6CMap";
window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");

    if(!tokencheck){
        alert("Please log in");
        window.location.href = "login.html";
    }
    else{
        let primus = Primus.connect("/", {
            reconnect: {
                max: Infinity,
                min: 500,
                retries: 10
            }
        });

        console.log(this.document.querySelector(".custom-checkbox__input"))
        if(document.querySelector(".custom-checkbox__input").checked){
            console.log("CHECKED");
            const payload = {
                channel: "random-channel",
                attachments: [{
                    title: "My first Slack Message",
                    text: "Random example message text",
                    author_name: "try_bot",
                    color: "#00FF00",
                }],
              };
            
            try{
                fetch("https://slack.com/api/chat.postMessage", {
                    method: "POST",
                    body: JSON.stringify(payload),
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        "Content-Length": payload.length,
                        "Authorization": `Bearer ${SLACKTOKEN}`,
                    },
                }).then(res =>{
                    if(!res.ok){
                        throw new Error(`SERVER ERROR ${res.status}`)
                    }

                    return res.json();
                })
            }catch(e){console.log("Error: " + e)}
        }

        let userInput = document.querySelector(".recipient");
        let possibleRecipient = document.querySelector(".recipientList");
        
        clearForm();
        document.querySelector(".recipient").classList.remove("form__input--error");
        document.querySelector(".amount").classList.remove("form__input--error");
        document.querySelector(".custom-dropdown").classList.remove("form__input--error");
         
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
                recipient = null;
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

        document.querySelector(".button").addEventListener("click", async (event) => {
            event.preventDefault();
            let amount = document.querySelector(".amount").value;
            let reason = document.querySelector(".custom-dropdown").value;
            let message = document.querySelector(".message").value;
            let tokencheck = localStorage.getItem("token");
            
            // console.log(userInput.value);
            // console.log(typeof userInput.value);
            
            if(userInput.value == undefined || userInput.value == null || userInput.value == ""){
                document.querySelector(".recipient").classList.add("form__input--error");
                return
            }
            if (recipient == undefined || recipient == null || recipient == ""){
                document.querySelector(".recipient").classList.add("form__input--error");
                return
            } 
            if(amount == undefined|| amount == null || amount === ""){
                document.querySelector(".amount").classList.add("form__input--error");
            } 
            if(reason == undefined || reason == null || reason === ""){
                document.querySelector(".custom-dropdown").classList.add("form__input--error");
                // Message with "Please fill in all fields (message is optional)"
                // this.alert("Fill in everything")
                // console.log(reason);
                return
            }            
            else {
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
                        primus.write({
                            "action": "add_transaction",
                            "data": json
                        });

                        // if(document.querySelector("custom-checkbox__input").checked){
                        //     console.log("CHECKED");
        
                        //     const payload = {
                        //         channel: "precious-coin",
                        //         attachments: [
                        //           {
                        //             title: "New Transfer",
                        //             text: `${json.sender} send ${json.amount} coins to ${json.recipient}. \nThe reason is: ${json.reason}`,
                        //             author_name: "Gollum",
                        //             color: "#00FF00",
                        //           },
                        //         ],
                        //       };
        
                        //     fetch("https://hooks.slack.com/services/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", {
                        //         method: "POST",
                        //         body: JSON.stringify(payload),
                        //         headers: {
                        //           "Content-Type": "application/json; charset=utf-8",
                        //           "Content-Length": payload.length,
                        //           Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
                        //           Accept: "application/json",
                        //         },
                        //     })
                            
                        // }
                        // else{
                        //     console.log("NOOOOOOOO IT DOESN'T WORK")
                        // }
                        
                        clearForm("hi");
                        window.location.replace("home.html");
                    }
                    
                    if(json.status === "Error"){
                        //console.log(`${json.message}`)
                        document.querySelector(".amount").classList.add("form__input--error");
                        document.querySelector(".amount").insertAdjacentHTML("beforebegin",`<p class="errormes">${json.message}</p>`);
                        this.setTimeout(()=>{
                            document.querySelector(".errormes").remove();
                            document.querySelector(".amount").classList.remove("form__input--error");
                        }, 5000)
                    }

                });
            }
        });

        function clearForm(reason){
            if(reason){
                userInput.value = "";
                document.querySelector(".amount").value = "";
                document.querySelector(".custom-dropdown").value = "Reason";
                document.querySelector(".message").value = "";
            }
            else{
                userInput.value = "";
                document.querySelector(".amount").value = "";
                document.querySelector(".message").value = "";
            }
        }

    }
});

function signout(){
    localStorage.removeItem("token");
}