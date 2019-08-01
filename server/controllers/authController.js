const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        // set up db to access database
        // deconstruct each key for later use
        const { username, password, isAdmin } = req.body
        // access get_user at username
        const result = await db.get_user([username])
        // check to see if username is in use
        if (result.length > 0) {
            return res.status(409).send({ message: 'Username in use' })
        }
        // setup salt and hash(for password and salt)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        // set into array for register_user database
        const resigterUser = await db.register_user([isAdmin, username, hash])

        res.status(201).send(resigterUser)
    },
    login: async (req, res) => {
        const db = req.app.get('db')

        const { username, password, isAdmin } = req.body
        // another option for one line app.get(db):
        // const foundUser = await req.app.get('db').get_user([username]);

        const foundUser = await db.get_user([username])
        // set user to foundUser first instance
        const user = foundUser[0]
        // if user does not exist than send error
        if (!user) {
            res.status(403).send('User not found. Please register as a new user before logging in')
        }
        // check if the password is correct compared to the saved one in database
        // use bcrypt for this
        const isAuthenicated = bcrypt.compareSync(password, user.hash)
        if (!isAuthenicated) {
            res.status(403).send('Incorrect Password')
        }
        // save elements correctly as an object
        req.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username }
        return res.send(req.session.user)
    },
    logout: async (req, res) => {
        const db = req.app.get('db')
        // req.session.destory with end current session(destroy user session object) 
        // and revert to previous status
        req.session.destroy()
        // always return a sendStatus() arguement
        return res.sendStatus(200)
    }
}

// module.exports = {
//     register: async (req, res) => {
//         /* 1. CHECK TO SEE if the email is already in use
//                a. if so, send appropriate Response
//          2. hash and salt the passwor, and create new user in db
//          3. put new user on session 
//          4. respond with user info */
//         const db = req.app.get('db')
//         const { email, password } = req.body

//         // check if email is already in use
//         const user = await db.find_user({ email })
//         if (user.length > 0) {
//             return res.status(200).send({ message: ' already in use!' })
//         }

//         // hash and salt password
//         const salt = bcrypt.genSaltSync(10)
//         const hast = bcrypt.hashSync(password, salt)
//         const newUSer = await db.create_cust({ email, hash_value: hash })

//         console.log(user)
//         res.status(200).send('it worked')
//     }
// }