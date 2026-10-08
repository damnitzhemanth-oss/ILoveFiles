import {convertCore} from  './conversion-core.js';
self.addEventListener('message',async (e) => {
    const{id,file,settings,name} = e.data;
    try{
        const result = await convertCore(file,settings,name);
        self.postMessage({id,ok:true,result});
    } catch (err) {
        self.postMessage({id,ok:false,error:err?.message || 'Conversion Failed'});
    }
});