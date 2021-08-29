const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, 'Tes_Test_Cool_Qwerty');
            if (req.params.userId && payload.userId === +req.params.userId) {
                next();
            } else {
                res.status(403).send('Unauthrorized : pas les droits pour accéder à la ressource')
            }
    
        } else {
            
            res.status(401).send('Forbidden request')
            
        }

    } catch (err) {
        if (err) {
            console.log(err);
        }
        res.status(401).send(`Forbidden request : bad token`)
    }
} 