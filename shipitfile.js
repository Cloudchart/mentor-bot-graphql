module.exports = function(shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-npm')(shipit)

  shipit.initConfig({
    default: {
      workspace     : '/tmp/mentor-graphql/workspace',
      deployTo      : '/home/app/mentor-bot-graphql',
      ignores       : ['.git', 'node_modules'],
      repositoryUrl : 'git@github.com:Cloudchart/mentor-bot-graphql.git',
      shallowClone  : true,
    },

    staging: {
      servers: 'app@mentor-staging.cochart.net'
    }
  })

}
