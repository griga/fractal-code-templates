const argv = require('yargs').argv;
const path = require('path');
const fs  =require('fs');
const _  =require('lodash');


console.log(argv._);

const group = argv._[0]
const type = argv._[1]
const name = argv._[2]
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
if(!groupFctConf.types[type]){
  throw new Error('Cannot find ' + type + ' type for ' + group + ' group')
}



const outputDir = (!outputDirArg || !fs.existsSync(outputDirArg)) ? 
  (argv.flat ? __dirname  : path.resolve(__dirname, name) ) : 
  (argv.flat ? outputDirArg : path.resolve(outputDirArg, name)) 
   
if(!fs.existsSync(outputDir)){
  fs.mkdirSync(outputDir)
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