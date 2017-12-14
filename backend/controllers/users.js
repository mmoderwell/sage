module.exports = {
    login(req, res, next) {
        let body = req.body;
        console.log(body);
        res.send(body);
    }
}