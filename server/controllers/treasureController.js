module.exports = {
    dragonTreasure: async (req, res) => {
        const db = req.app.get('db')
        // get database dragon treasure and pass 1 as a peramiter
        // due to async data use await to access database
        const treasure = await db.get_dragon_treasure(1)
        // return treasure for use else where
        return res.status(200).send(treasure[0])
    }
}