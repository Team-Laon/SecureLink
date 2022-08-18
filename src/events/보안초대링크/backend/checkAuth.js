module.exports = async (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    req.session.backURL = req.url;
    let redirectUri = req.session.backURL;
    res.redirect(`/callback`);
}