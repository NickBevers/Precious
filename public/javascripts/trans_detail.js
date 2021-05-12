let data = JSON.parse(localStorage.getItem("transaction"));
console.log(data);
let from_to = document.querySelector(".recipient");
let amount = document.querySelector(".amount");
let reason = document.querySelector(".reason");
let message = document.querySelector(".message");

if (data.recipient == data.user){
    from_to.innerHTML = data.sender
}
else{
    from_to.innerHTML = data.recipient
}

amount.innerHTML = data.amount;
reason.innerHTML = data.reason;
message.innerHTML = data.message;

localStorage.removeItem("transaction");
localStorage.removeItem("user");


