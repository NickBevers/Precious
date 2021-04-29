let btnSendTransaction = document.querySelector(".sendTransaction").addEventListener("click", () => {
    let recipient = document.querySelector(".recipient").value;
    let amount = document.querySelector(".amount").value;
    let reason = document.querySelector("#reason").value;
    let message = document.querySelector(".message").value;

    fetch("http://localhost:3000/api/v1/transfers", {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
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

});