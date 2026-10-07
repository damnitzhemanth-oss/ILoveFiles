import { setupViews} from './views.js';
import { setupTheme } from './theme.js';
import {setupDropzone} from './dropzone.js'
import {setupFileList} from './filelist.js'
import { state} from './state.js';

setupViews();
setupTheme();
setupFileList();
setupDropzone();

console.log('I Love Files read. State:' , state);