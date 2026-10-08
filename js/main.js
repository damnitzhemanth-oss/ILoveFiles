import {setupViews} from './views.js';
import {setupTheme} from './theme.js';
import {setupDropzone} from './dropzone.js';
import {setupFileList} from './filelist.js';
import {setupSettings} from './settings.js';
import {setupActions} from './action.js';
import {state} from './state.js';
import {setupPresets} from './presets.js';
import {setupZipButton} from './zip.js';
import {setupCompare} from './compare.js';
import './format-support.js';

setupViews();
setupTheme();
setupFileList();
setupSettings();
setupDropzone();
setupActions();
setupPresets();
setupZipButton();
setupCompare();

console.log('I Love Files ready. State:', state);