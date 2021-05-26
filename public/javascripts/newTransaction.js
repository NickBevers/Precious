let recipient;
window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");

    if(!tokencheck){
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{
        let primus = Primus.connect("/", {
            reconnect: {
                max: Infinity,
                min: 500,
                retries: 10
            }
        });

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
            
            console.log(reason);
            
            if (recipient == undefined || recipient == null){
                document.querySelector(".recipient").classList.add("form__input--error");
            } 
            if(amount == undefined|| amount == null || amount === ""){
                document.querySelector(".amount").classList.add("form__input--error");
            } 
            if(reason == undefined || reason == null || reason === ""){
                document.querySelector(".custom-dropdown").classList.add("form__input--error");
                // Message with "Please fill in all fields (message is optional)"
                this.alert("Fill in everything")
                console.log(reason);
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
                        clearForm("hi");
                        window.location.replace("home.html");
                    }
                    
                    if(json.status === "Error"){
                        //console.log(`${json.message}`)
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