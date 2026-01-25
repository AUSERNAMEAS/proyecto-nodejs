function saveUserSessionFunction(req, email)
{
    req.session.user={
        email,
        logged: true
    };

    req.session.save(()=>{
        console.log('User session saved:', req.session.user);
    });
}

function deleteUserSessionFunction(req,res)
{
    req.session.destroy((err)=>{
        if (err)
        {
            console.log('Error destroying session:', err);
            return res.status(500).json({ success: false, message: 'Error al cerrar sesión.' });
        }

        res.clearCookie('connect.sid');
        console.log('User session destroyed');
        res.redirect('/html/FakeShop.html'); // redirect to home page after session deletion
    });
}

module.exports = {
    saveUserSessionFunction,
    deleteUserSessionFunction
}