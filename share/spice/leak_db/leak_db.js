(function(env){
    "use strict";
    env.ddg_spice_leak_db = function(api_result){

        if (!api_result || !api_result.found || !api_result.hashes) {
            return Spice.failed('leak_db');
        }

        var query = DDG.get_query()
                    .replace(/^(leakdb|hashme)\s+|\s+(leakdb|hashme)$/i, '');
        var type = api_result.type == 'plaintext' ?
                        query : api_result.type + ' hash';

        api_result.hashes = api_result.hashes[0];
        delete api_result.hashes.plaintext;

        Spice.add({
            id: 'leak_db',
            name: 'Leaks',
            data: {
                record_data: api_result.hashes
            },
            meta: {
                sourceUrl: 'http://leakdb.abusix.com/?q='+ encodeURIComponent(query),
                sourceName: 'Abusix'
            },
            normalize: function(item) {
                return {
                    title: 'hashes for "' + api_result.query + '"'
                };
            },
            templates: {
                group: 'list',
                options:{
                    content: 'record',
                    moreAt: true,
                    rowHighlight: true
                }
            }
        });
    }
}(this));
