const getAll = (req, res) => {
    res.json({
        "status": "success",
        "user": "Gollum"
    })
}

const login =  (req, res) => {
    res.json({
        "status": "success",
        "user": "Smeagol"
    })
}

const signup = (req, res) => {
    res.json({
        "status": "success",
        "user": "Precious!"
    });
}

module.exports.getAll = getAll;
module.exports.login = login;
module.exports.signup = signup;