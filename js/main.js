import { setupViews} from './views.js';
import { setupTheme } from './theme.js';
import { state} from './state.js';

setupViews();
setupTheme();

console.log('I Love Files read. State:' , state);