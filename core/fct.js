const mkdirp = require('mkdirp');
const path = require('path');
const fs  =require('fs');
const _  =require('lodash');

const modifiers = require('./modifiers');



// 'ng1' 'ng2' 'phz'  
// 'component' 'c' 'service' 's'
// 'vieport' 'cool-button' 'map/services/zoom'

// full path to the desired output dir (optional)
// default current working die

module.exports.run = function(
options
  ){

// 'ng1' 'ng2' 'phz'
const group = options.group

// 'component' 'c' 'service' 's'
const typeAlias = options.typeAlias






// detect prefix path in `name` arg 
// "service map/services/viewport" => "map/services" "vieport"
// "service viewport" => "" "vieport"
const nameArgMatch = options.nameArg.match(/([\s\S]+?)\/([^/]+?)$/)

// @const prefix directory
const subDir = nameArgMatch && nameArgMatch.length == 3 ? nameArgMatch[1]  : ''

// @field Subject Name
const name = options.name = nameArgMatch   && nameArgMatch.length == 3  ? nameArgMatch[2]  : options.nameArg



const templatesDir = path.resolve(__dirname, '../fractal-code-templates');
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

const type = options.type = _.keys(types).find(function(t){
  return t == typeAlias || types[t].aliases.indexOf(typeAlias)>-1
})

if(!types[type]){
  throw new Error('Cannot find ' + type + ' type for ' + group + ' group')
}


const cwd = process.cwd()
console.log('cwd:  ', cwd);


const outputDir = (!options.outputDirArg || !fs.existsSync(options.outputDirArg)) ? 
  (options.flat ?  path.resolve(cwd, subDir) : path.resolve(cwd, subDir,  name) ) : 
  (options.flat ? path.resolve(options.outputDirArg, subDir) : path.resolve(options.outputDirArg, subDir, name)) 
   
if(!fs.existsSync(outputDir)){
  mkdirp.sync(outputDir)
}

modifiers.setup(options)


groupFctConf.types[type].files.forEach(function(filename){
  
  
  let outname =  modifiers.process(filename);

  let filepath = path.resolve(outputDir, outname)
  console.log('outname', filepath);


  let ext  = outname.match(/(.[\w]+?)$/)[1]
  let templatePath = path.resolve(groupDir, type + ext);

  let rawContent = (fs.existsSync(templatePath)) ? fs.readFileSync(templatePath, 'utf8') : ''
  let content =  modifiers.process(rawContent);
 
   
  if(fs.existsSync(filepath)){
    if(options.force){
      fs.unlinkSync(filepath)
      fs.writeFileSync(filepath, content)  
    } else {
      console.log('[do nothing] file already exists. use --force ')
    }
  } else {
    fs.writeFileSync(filepath, content)
  } 
  
  
})


}