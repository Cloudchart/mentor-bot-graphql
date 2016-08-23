module.exports = function(shipit) {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace     : '/tmp/mentor-graphql/workspace',
      deployTo      : '/home/app/mentor-bot-graphql',
      ignores       : ['.git', 'node_modules'],
      shallowClone  : true,
    },

    staging: {
      servers: 'mentor-staging.cochart.net'
    }
  })



}
