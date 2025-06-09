import jwt from 'jsonwebtoken'

export function AuthorizationJWT(req, res, next){
    const AuthHeader = req.headers['authorization']
    const token = AuthHeader && AuthHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({message: "Access token missing"})
    }

    jwt.verify(token, process.env.TOKEN_SECRETE, ((err, user) => {
        if(err) return res.status(403).json({ message: 'Invalid or expired token' });
        req.user = user
        next()
    }))
}
