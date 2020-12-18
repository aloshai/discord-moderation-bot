const { VoiceChannel } = require("discord.js");
const { update } = require("../Schemas/FriendShip");
const FriendShip = require("../Schemas/FriendShip");

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
        console.log("Called To AddUser Function.");
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
        console.log("Called To RemoveUser Function.");
        let index = this.Users.findIndex((value) => value.Id == id);
        this.Users.splice(index, 1);
    }

    /**
     * Get the user from the group.
     * @param {String} id 
     */
    checkUser(id){
        console.log("Called To CheckUser Function.");
        return this.Users.some((value) => value.Id == id);
    }

    /**
     * Allows to repeat users in the group.
     */
    updateUsers(){
        console.log("Called To UpdateUsers Function.");
        let giveExperience = this.Experience / this.Users.length;
        let orList = this.Users.map(item => ({Id: item.Id}));
        let incList = {};
        for (let index = 0; index < this.Users.length; index++) {
            let user = this.Users[index];
            let experience = giveExperience * (user.LastUpdate / (1000 * 60));
            incList[`Friends.${user.Id}`] = experience;
            incList["TotalExperience"] = experience;
            user.LastUpdate = Date.now();
        }
        console.log(giveExperience, orList, incList);
        FriendShip.updateMany({$or: orList}, {$inc: incList}, {upsert: true, setDefaultsOnInsert: true}).exec((err, response) => {
            if(err) console.error(err);
            else console.log(response);
        });
    }
}

module.exports = Group;