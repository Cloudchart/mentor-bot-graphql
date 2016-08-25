module.exports = function(shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)
  require('shipit-npm')(shipit)

  const HOME = '/home/app/mentorbot/graphql'

  shipit.initConfig({
    default: {
      workspace     : '/tmp/mentorbot/graphql/workspace',
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
    },

    production: {
      servers: 'app@mentor1.cochart.net'
    }
  })


  shipit.blTask('reload', function() {
    return shipit.remote(`cd ${HOME} && pm2 reload ${HOME}/shared/process.json`)
  })

  shipit.on('cleaned', function() {
    return shipit.start('reload')
  })

}
