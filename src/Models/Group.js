const FriendShip = require("./Database/Friend");

class Group{
    /**
     * List of members within the group.
     * @type {Array<{Id: String, LastUpdate: Number}>}
     */
    Users = [];

    /**
     * @type {Number}
     */
    Experience = 0;

    /**
     * 
     * @param {Array<{Id: String, LastUpdate: Number}>} users 
     * @param {Number} experience 
     */
    constructor(users = [], experience){
        this.Users = users;
        this.Experience = experience;
    }

    /**
     * Adds user to group.
     * @param {String} id 
     */
    addUser(id){
        this.updateUsers();
        this.Users.push({
            Id: id,
            LastUpdate: Date.now()
        })
    }

    /**
     * Removes the user from the group.
     * @param {String} id 
     */
    removeUser(id){
        this.updateUsers();
        let index = this.Users.findIndex((value) => value.Id == id);
        this.Users.splice(index, 1);
    }

    /**
     * Get the user from the group.
     * @param {String} id 
     */
    checkUser(id){
        return this.Users.some((value) => value.Id == id);
    }

    /**
     * Allows to repeat users in the group.
     */
    updateUsers(){
        if(this.Users.length <= 0) return;
        let giveExperience = this.Experience / this.Users.length;

        this.Users.forEach((user, index) => {
            let list = [...this.Users];
            list.splice(index, 1);
            if(list.length <= 0) return;
            let incList = {};
            for (let index = 0; index < list.length; index++) {
                let item = list[index];
                let experience = giveExperience * ((Date.now() - item.LastUpdate) / (1000 * 60));
                incList[`Friends.${item.Id}`] = experience;
                incList["TotalExperience"] = experience;
            }

            FriendShip.updateOne({Id: user.Id}, {$inc: incList}, {upsert: true}).exec((err, res) => {
                if(err) console.error(err);
            });
        });
        this.Users.forEach(user => {
            user.LastUpdate = Date.now();
        })
    }

    updateUser(id){
        let item = this.Users.find(e => e.Id == id);
        item.LastUpdate = Date.now();
    }

}

module.exports = Group;