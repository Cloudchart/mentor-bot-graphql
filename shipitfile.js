module.exports = function(shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)
  require('shipit-npm')(shipit)

  shipit.initConfig({
    default: {
      workspace     : '/tmp/mentor-graphql/workspace',
      deployTo      : '/home/app/mentor-bot-graphql',
      ignores       : ['.git', 'node_modules'],
      repositoryUrl : 'git@github.com:Cloudchart/mentor-bot-graphql.git',
      shallowClone  : true,

      shared        : {
        overwrite   : true,
        files       : ['.env'],
      }
  },

    staging: {
      servers: 'app@mentor-staging.cochart.net'
    }
  })


  shipit.blTask('foreman:start', function() {
    return shipit.remote(`NODE_ENV=production /home/app/mentor-bot-graphql/shared/start`)
  })

  shipit.on('cleaned', function() {
    return shipit.start('foreman:start')
  })

}
