module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')
        // get database dragon treasure and pass 1 as a peramiter
        // due to async data use await to access database
        const treasure = await db.get_dragon_treasure(1)
        // return treasure for use else where
        return res.status(200).send(treasure[0])
    },
    getUserTreasure: async (req, res) => {
        const userTreasure = req.app.get('db').get_user_treasure([req.session.user.id])
        return res.status(200).send(userTreasure)
    },
    addUserTreasure: async (req, res) => {
        const { treasureURL } = req.body;
        const { id } = req.session.user;
        const userTreasure = await req.app.get('db').add_user_treasure([treasureURL, id])
        return res.status(200).send(userTreasure)
    },
    getAllTreasure: async (req, res) => {
        const allTreasure = await req.app.get('db').get_all_treasure();
        return res.status(200).send(allTreasure)
      }
}