window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");
    console.log(tokencheck);
    if(!tokencheck){
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{
        //primus live feature /get frontend
        alert("hello beautiful!");
    }
});



// fetch("http://localhost:3000/api/v1/", {
//     "headers": {
//         "Authorization": "Bearer " + localStorage.getItem("token")
//     }
// }).then(result => {
//     return result.json();
// }).then(json =>{
//     console.log(json);
// }).catch(err => {
//     //redirect naar login scherm
//     window.location.replace("login.html");
// });
