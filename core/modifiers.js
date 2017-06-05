const _ = require('lodash');


const state = {
  name: undefined,
  type: undefined
}
module.exports =  {
  setup: function(options){
    state.name = options.name
    state.type = options.type
  },
  name: function(str){
    return state.name
  },
  snake: function(str){
    return _.snakeCase(str)
  },
  kebab: function(str){
    return _.kebabCase(str)
  },
  
  type: function(str){
    return str + state.type
  }

}