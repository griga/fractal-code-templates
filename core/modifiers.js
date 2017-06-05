const _ = require('lodash');


const state = {
  name: undefined,
  prefix: undefined,
  type: undefined
}
const modifiers =  {
  setup: function(options){
    state.name = options.name
    state.prefix = options.prefix
    state.type = options.type
  },
  name: function(str){
    return state.name
  },
  snake: function(str){
    return _.snakeCase(str)
  },
  camel: function(str){
    return _.camelCase(str)
  },
  kebab: function(str){
    return _.kebabCase(str)
  },
  upper: function(str){
    return str.toUpperCase()
  },
  
  upperFirst: function(str){
    return _.upperFirst(str)
  },
  
  type: function(str){
    return str + state.type
  },
  
  prefix: function(str){
    return  state.prefix ? state.prefix + str : str
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