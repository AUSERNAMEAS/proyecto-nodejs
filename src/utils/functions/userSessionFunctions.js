function saveUserSession(req, email)
{
    req.session.user={
        email,
        logged: true
    };

    req.session.save(()=>{
        console.log('User session saved:', req.session.user);
    });
}

module.exports = {
    saveUserSession
}