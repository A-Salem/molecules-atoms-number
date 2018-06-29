const yargs = require('yargs');
const _ = require('underscore');

// Some Molecules Examples
// H2O
// Mg(OH)2
// C2H2(COOH)2
// (C5H5)Fe(CO)2CH3
// K4[ON(SO3)2]2
// (C5H5)Fe(CO)2CH3
// (C6H12O6)

const argv = yargs
  .command("get", "Get Molecules' Atoms Number", {
    mol: {
      describe: 'molecule',
      demand: true,
      alias: 'm'
    }
  })
  .help()
  .argv;

let text = argv.mol.trim();
// let text = 'Mg(OH)2';
text = text.replace(/\(/g, '[').replace(/\)/g, ']').replace(/\{/g, '[').replace(/\}/g, ']');

let start = [];
let end = [];

for(let i=0; i<text.length; i++){
	let char = text[i];
	if(char == '['){
    start.push({start: true, ind: i});
  }

  let endVal = Number(text[i+1]);
  let oneAfter = Number(text[i+2]);
  endVal = _.isNaN(endVal)? 1: endVal;
  if(!_.isNaN(Number(text[i+1])) && oneAfter){
    endVal = _.isNaN(oneAfter)? endVal: Number(String(endVal) + String(oneAfter));
  }
  if(char == ']'){
    end.push({end: true, ind: i, val: endVal});
  }

}

let startEnd = start.concat(end);
let sortedStartEnd = _.sortBy(startEnd, 'ind');
// console.log(sortedStartEnd);

let finalStartEnd = [];
for (let i=0; i<sortedStartEnd.length; i++){
  let arr = sortedStartEnd[i]
  if(arr.start){
    finalStartEnd.push({start: arr.ind})
  }
  if(arr.end){
    for(let j=finalStartEnd.length; j>0; j--){
      let field = finalStartEnd[j-1];
      // console.log(field)
      if(field.hasOwnProperty('start') && !field.end){
        finalStartEnd[j-1].end = arr.ind
        finalStartEnd[j-1].val = arr.val
        break;
      }
    }
  }
};

// console.log(finalStartEnd);

let finalResult = {};

for(let i=0; i<text.length; i++){
  let char = text[i];
  let value = 1;
  let nextChar = text[i+1];
  let afterNextChar = text[i+2];
  if(!_.contains(['[', ']'], char) && _.isNaN(Number(char)) && char == char.toUpperCase()){
    if(nextChar && !_.contains(['[', ']'], nextChar) && _.isNaN(Number(nextChar)) && nextChar == nextChar.toLowerCase()){
      char = text[i] + text[i+1];
      if(afterNextChar && !_.contains(['[', ']'], afterNextChar) && !_.isNaN(Number(afterNextChar))){
        value = Number(afterNextChar);
      }
    } else if(!_.isNaN(Number(nextChar))){
      value = Number(nextChar);
    }

    _.each(finalStartEnd, (multi) => {
      if(i>multi.start && i<multi.end){
        value *= multi.val;
      }
    });

    if(finalResult[char]){
      finalResult[char] = finalResult[char] + value;
    } else {
      finalResult[char] = value;
    }

  }

}

console.log(finalResult);
