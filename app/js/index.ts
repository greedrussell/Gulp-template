import { App } from './app';
import { ValidationService } from './validation.service';

const validationService = new ValidationService();
const app = new App(
  validationService
);

app.init();
