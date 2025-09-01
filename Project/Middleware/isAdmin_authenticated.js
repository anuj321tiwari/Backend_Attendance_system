export default function isAdmin(req, res, next){
    if (req.user && req.user.role === "admin") {
        return next()
    }else{
        return res.status(404).json({messgae:"Access denied. Admins only."})
    }
}