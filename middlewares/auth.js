const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if(req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            const payload = jwt.verify(token, 'Tes_Test_Cool_Qwerty');
            next();
    
        } else {
            
            res.status(401).send('Forbidden request')
            
        }

    } catch (err) {
       if(err) {console.log(err);}
        res.status(401).send(`Forbidden request : bad token`)
    }
} 