import { Config, configSchema } from '../types/config';
import Ajv from 'ajv';

const ajv = new Ajv({
  strict: false,
});
const validate = (input: any): input is Config => {
  const validateFn = ajv.compile(configSchema);
  const valid = validateFn(input);
  if (!valid) {
    console.error(validateFn.errors);
    return false;
  }
  return true;
};

export { validate };
