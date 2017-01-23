const QueryOptions = function( options ) {

    options = options || {};
    options.metaData = options.hasOwnProperty('metaData') ? options.metaData : true;

    // Map the keys of the options object to an array of encoded url components
    this.queryString = Object.keys(options).sort().map(keyName => {

        this[keyName] = options[keyName];
        let key = options[keyName];

        switch(keyName) {

            case 'where':
                // where: { name: 'column_name', op: '=', value: 'value' }
                // where: [{ name: 'column_name', op: '=', value: 'value' }]
                key = !key.length ? [key] : key;

                return key.map(w => `where=${ encodeURIComponent( JSON.stringify(w) ) }` ).join('&');

            case 'order_by':
                // So many possibilities...
                // order_by: '-?column_name'
                // order_by: ['-?column_name']
                // order_by: { 'column_name': 'asc|desc' }
                // order_by: [{ 'column_name': 'asc|desc' }]
                // order_by: { column: 'column_name', direction: 'asc|desc' }
                // order_by: [{ column: 'column_name', direction: 'asc|desc' }]
                key = !key.length ? [key] : key;

                return `${ keyName }=${
                    encodeURIComponent(
                        key.map((o,i) => (o.direction !== 'asc' ? '-' : '') + o.column)
                        .join(',')
                    )
                }`;

            case 'limit':
                // limit: number
            case 'offset':
                // offset: number
                let parsedNum = parseInt(key);
                if (!isNaN(parsedNum)) {
                    return `${keyName}=${parsedNum}`;
                }
                return;

            case 'evented':
                return 'session_id=' + encodeURIComponent(JSON.stringify(key));

            case 'metaData':
            case 'args':
            case 'exclude':
            case 'include':
                return `${keyName}=${ encodeURIComponent( JSON.stringify(key) ) }`;
        }
    })
    .join('&')
    //.replace(/^/, '?')
    .replace(/&&/g, '&');


};

module.exports = QueryOptions;

