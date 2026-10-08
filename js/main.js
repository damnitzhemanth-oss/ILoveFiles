import {setupViews} from './views.js';
import {setupTheme} from './theme.js';
import {setupDropzone} from './dropzone.js';
import {setupFileList} from './filelist.js';
import {setupSettings} from './settings.js';
import {setupActions} from './action.js';
import {state} from './state.js';

setupViews();
setupTheme();
setupFileList();
setupSettings();
setupDropzone();
setupActions();

console.log('I Love Files ready. State:', state);