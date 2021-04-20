module.exports.isLoggedIn = async(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}
