module.exports = function(shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)
  require('shipit-npm')(shipit)

  const HOME = '/home/app/mentor-bot-graphql'

  shipit.initConfig({
    default: {
      workspace     : '/tmp/mentor-bot-graphql/workspace',
      deployTo      : HOME,
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
    return shipit.remote(`cd ${HOME} && pm2 reload ${HOME}/shared/ecosystem.json`)
  })

  shipit.on('cleaned', function() {
    return shipit.start('pm2:restart')
  })

}
