let leaderboardData;
window.addEventListener("load", function(){
    let tokencheck = localStorage.getItem("token");
    if(!tokencheck){
        alert("wrong page");
        window.location.replace("login.html");
    }
    else{        
        fetch("/api/v1/leaderboard", {
            method:"get",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${tokencheck}`
            }
            }).then(response => {
                console.log("yess");
                return response.json();
            }).then(json => {
                if(json.status === "Success"){
                    leaderboardData = json.data;
                    // console.log(leaderboardData);                    
                    // console.log("yess");
                    // let leader = leaderboardData.splice(0);
                    // console.log(leader[0].coins);
                    let elementrank = 1;

                    json.data.forEach(function(element){
                        // console.log("i'm in");
                        // console.log(element);
                        // let i = 0;    
                        let firstname = element.firstname;
                        let lastname = element.lastname;
                        
                        let elementamount = element.coins;
                        
                        let leaderboard = `<li class="list__item">
                            <p class="list__item--ranking">${elementrank}</p>
                            <p class="list__item--amount">${elementamount}P</p>
                            <p class="list__item--from-to">${firstname + " " + lastname}</p>
                        </li>
                        <hr class="list__hr">`
                        document.querySelector(".list").innerHTML += leaderboard;
                        elementrank++;
                        // i++;
                        // console.log(leader[i]);
                    });
                    
                }
        })
    
    }
});
