async function GetUser (id) {
    try {
        return await client.users.fetch(id);
    } catch (error) {
        return undefined;
    }
};

module.exports = {
    GetUser
}