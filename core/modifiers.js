const _ = require('lodash');


const state = {
  name: undefined,
  type: undefined
}
const modifiers =  {
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
  capitalize: function(str){
    return _.kebabCase(str)
  },
  
  type: function(str){
    return str + state.type
  },

  
  process: function(str){
    return str.replace(/\{\{[\s\S]+?\}\}/gm, function(match){
    
      let out =  match.replace(/[\{\}]/gm, '').split('|').map(function(it){
        return it.trim()
      }).reduce(function(_out, modifier){
        
        return modifiers[modifier](_out)
      }, '')
      
      
      return out
      
      
    }) 
  }
}

module.exports =modifiers