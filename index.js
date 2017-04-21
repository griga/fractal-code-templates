#!/usr/bin/env node

const argv = require('yargs').argv;
const mkdirp = require('mkdirp');
const path = require('path');
const fs  =require('fs');
const _  =require('lodash');


console.log('argv:  ', argv._);

const cwd = process.cwd()

console.log('cwd:  ', cwd);


const group = argv._[0]
const typeAlias = argv._[1]

const nameArg = argv._[2]

const nameArgMatch = nameArg.match(/([\s\S]+?)\/([^/]+?)$/)
const subDir = nameArgMatch && nameArgMatch.length == 3 ? nameArgMatch[1]  : ''
const name = nameArgMatch   && nameArgMatch.length == 3  ? nameArgMatch[2]  : nameArg

const outputDirArg = argv._[3]


const templatesDir = path.resolve(__dirname, 'fractal-code-templates');
if(!fs.existsSync(templatesDir)){
  throw new Error('Cannot find templates dir')
}

const groupDir = path.resolve(templatesDir, group)
if(!fs.existsSync(groupDir)){
  throw new Error('Cannot find ' + group + ' group dir')
}

const groupFctFile = path.resolve(groupDir, 'fct.json')
if(!fs.existsSync(groupFctFile)){
  throw new Error('Cannot find ' + group + ' fct.json config file')
}





const groupFctConf = require(groupFctFile)

const types = groupFctConf.types

const type = _.keys(types).find(function(t){
  return t == typeAlias || types[t].aliases.indexOf(typeAlias)>-1
})

if(!types[type]){
  throw new Error('Cannot find ' + type + ' type for ' + group + ' group')
}


const outputDir = (!outputDirArg || !fs.existsSync(outputDirArg)) ? 
  (argv.flat ?  path.resolve(cwd, subDir) : path.resolve(cwd, subDir,  name) ) : 
  (argv.flat ? path.resolve(outputDirArg, subDir) : path.resolve(outputDirArg, subDir, name)) 
   
if(!fs.existsSync(outputDir)){
  mkdirp.sync(outputDir)
}

const modifiers = {
  name: function(str){
    return name
  },
  snake: function(str){
    return _.snakeCase(str)
  },
  kebab: function(str){
    return _.kebabCase(str)
  },
  
  type: function(str){
    return str + type
  }
}

if(!argv.flat && !fs.existsSync()){

}


groupFctConf.types[type].files.forEach(function(filename){
  
  
  let outname =  filename.replace(/\{\{[\s\S]+?\}\}/gm, function(match){
    
    let out =  match.replace(/[\{\}]/gm, '').split('|').map(function(it){
      return it.trim()
    }).reduce(function(_out, modifier){
      
      return modifiers[modifier](_out)
    }, '')
    
    
    return out
    
    
  })  

  let filepath = path.resolve(outputDir, outname)
  if(!fs.existsSync(filepath)){
    fs.writeFileSync(filepath, '')
  }
  
  
  console.log('outname', filepath);
  
})





process.exit(1)