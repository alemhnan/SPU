const Ajv = require('ajv');
const ajv = new Ajv();

const loadJsonFile = require('load-json-file');

const workingSchema = loadJsonFile.sync('./manifestSchema.json');
const workingJSON = loadJsonFile.sync('./manifest.json');


const validate = ajv.compile(workingSchema);
const valid = validate(workingJSON);

if (!valid) {
  console.log(ajv.errors);
} else {
  console.log('Manifest valid');
}