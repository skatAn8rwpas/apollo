

module.exports.generateUserModel = ({user}) => ({
  getAll: () => {
    /* fetching/transform logic for all users */
    if(!user || !user.roles.includes('admin')) return null;
    return fetch('http://myurl.com/users');
  },

  getById: (id) => { /* fetching/transform logic for a single user */ },

  getByGroupId: (id) => { /* fetching/transform logic for a group of users */ },
});
