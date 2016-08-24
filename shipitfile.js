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


  shipit.blTask('pm2:restart', function() {
    return shipit.remote(`cd /home/app/mentor-bot-graphql/current && pm2 startOrRestart /home/app/mentor-bot-graphql/shared/ecosystem.json`)
  })

  shipit.on('cleaned', function() {
    return shipit.start('pm2:restart')
  })

}
