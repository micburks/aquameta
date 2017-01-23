/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Field = /*function( row, name ) {};
            AQ.Field = */function Field(row, name, pk) {
    this.row = row;
    this.column = new AQ.Column(row.relation, name);
    this.is_primary_key = pk;
    this.name = name;
    this.value = row.get(name);
    this.id = { row_id: this.row.id, column_id: this.column.id };
    this.to_url = function (id_only) {
        if (this.row.pk_value == null) {
            console.error('You must call a row with "meta_data: true" in order to use the to_url function');
            throw 'Datum.js: Programming Error';
        }
        return id_only ? '/field/' + this.row.relation.schema.name + '/' + this.row.relation.name + '/' + /*JSON.stringify(this.row.pk_value)*/this.row.pk_value + '/' + this.column.name : this.row.relation.schema.database.endpoint.url + '/field/' + this.row.relation.schema.name + '/' + this.row.relation.name + '/' + /*JSON.stringify(this.row.pk_value)*/this.row.pk_value + '/' + this.column.name;
    };
};
Field.prototype = {
    get: function get() {
        return this.row.get(this.name);
    },
    set: function set(value) {
        this.value = value;return this.row.set(this.name, value);
    },
    update: function update() {
        return this.row.update();
    } // TODO: This is wrong
};

module.exports = Field;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var QueryOptions = __webpack_require__(3);

module.exports = function () {

    var config = {
        url: '/endpoint/',
        version: '/v1/'
    };

    var query = function query(method) {

        // TODO combine args and data
        return function (metaId, args, data) {

            var queryOptions = new QueryOptions(args);
            // args = args || {};

            var baseUrl = ('/' + config.url + '/' + config.version).replace(/\/\//g, '/');
            console.log(baseUrl);

            // URLs
            var idUrl = metaId.toUrl(); //true); // ID part of the URL only
            var urlWithoutQuery = baseUrl + idUrl;
            var urlWithQuery = urlWithoutQuery + queryOptions.queryString;

            // If query string is too long, upgrade GET method to POST
            if (method === 'GET' && (location.host + urlWithQuery).length > 1000) {
                method = 'POST';
            }

            // This makes the uWSGI server send back json errors
            var headers = new Headers();
            headers.append('Content-Type', 'application/json');

            // Settings object to send with 'fetch' method
            var initObject = {
                method: method,
                headers: headers,
                credentials: 'same-origin'
            };

            // Don't add data on GET requests
            if (method !== 'GET') {
                initObject.body = JSON.stringify(data);
            }

            return fetch(method === 'GET' ? urlWithQuery : urlWithoutQuery, initObject).then(function (response) {

                // JSON was returned from WebSocket
                if (typeof response.json === 'undefined') {
                    // TODO: ? Unfortunately this has no HTTP status like the result of fetch
                    //console.log('i am the response', response);
                    return response;
                }

                // Request object was returned from fetch

                // Read json stream
                var json = response.json();

                if (response.status >= 200 && response.status < 300) {
                    return json;
                }

                // If bad request (code 300 or higher), reject promise
                return json.then(Promise.reject.bind(Promise));
            }).catch(function (error) {

                // Log error in collapsed group
                console.groupCollapsed(method, error.statusCode, error.title);
                // console.error(url_without_query);
                if ('message' in error) {
                    console.error(error.message);
                }
                console.groupEnd();
                throw error.title;
            });
        };
    };

    return {
        get: query('GET'),
        post: query('POST'),
        patch: query('PATCH'),
        delete: query('DELETE')
    };
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Relation = __webpack_require__(5);
var Fn = __webpack_require__(4);

var Schema = function Schema(endpoint, name) {
    this.endpoint = endpoint;
    this.name = name;
    this.id = { name: this.name };
};
Schema.prototype.relation = function (name) {
    return new Relation(this, name);
};
//Schema.prototype.function = function( name, options ) { return new Fn(this, name, options); };

Schema.prototype.function = function (identifier, args, options) {

    // Function identifier (name and parameter list)
    if ((typeof identifier === 'undefined' ? 'undefined' : _typeof(identifier)) == 'object') {
        var name = identifier.name;
        var parameter_type_list = identifier.parameters;
    }
    // Selecting a function without specifying the parameters
    else {
            var name = identifier;
        }

    options = options || {};

    // Arguments
    options.args = {};

    // `args = undefined` will pass no arguments into the server-side function
    if (typeof args != 'undefined') {

        // some_function?args={ kwargs: {} } -- Key/value object
        if (!(args instanceof Array) && args instanceof Object) {
            options.args.kwargs = args;
        }
        // some_function?args={ vals: [] } -- Array
        else {
                if (!(args instanceof Array)) {
                    // Regular value is placed into array
                    args = [args];
                }
                options.args.vals = args;
            }
    }

    var fn = new Fn(this, name, parameter_type_list);

    return this.database.endpoint.get(fn, options).then(function (response) {

        if (!response) {
            throw 'Empty response';
        } else if (!response.result.length) {
            throw 'Result set empty';
        }
        if (response.result.length > 1) {
            return new FnResultSet(fn, response);
        }
        return new FnResult(fn, response);
    }.bind(this)).catch(function (err) {
        throw 'Function call request failed: ' + err;
    });
};

module.exports = Schema;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var QueryOptions = function QueryOptions(options) {
    var _this = this;

    options = options || {};
    options.metaData = options.hasOwnProperty('metaData') ? options.metaData : true;

    // Map the keys of the options object to an array of encoded url components
    this.queryString = Object.keys(options).sort().map(function (keyName) {

        _this[keyName] = options[keyName];
        var key = options[keyName];

        switch (keyName) {

            case 'where':
                // where: { name: 'column_name', op: '=', value: 'value' }
                // where: [{ name: 'column_name', op: '=', value: 'value' }]
                key = !key.length ? [key] : key;

                return key.map(function (w) {
                    return 'where=' + encodeURIComponent(JSON.stringify(w));
                }).join('&');

            case 'order_by':
                // So many possibilities...
                // order_by: '-?column_name'
                // order_by: ['-?column_name']
                // order_by: { 'column_name': 'asc|desc' }
                // order_by: [{ 'column_name': 'asc|desc' }]
                // order_by: { column: 'column_name', direction: 'asc|desc' }
                // order_by: [{ column: 'column_name', direction: 'asc|desc' }]
                key = !key.length ? [key] : key;

                return keyName + '=' + encodeURIComponent(key.map(function (o, i) {
                    return (o.direction !== 'asc' ? '-' : '') + o.column;
                }).join(','));

            case 'limit':
            // limit: number
            case 'offset':
                // offset: number
                var parsedNum = parseInt(key);
                if (!isNaN(parsedNum)) {
                    return keyName + '=' + parsedNum;
                }
                return;

            case 'evented':
                return 'session_id=' + encodeURIComponent(JSON.stringify(key));

            case 'metaData':
            case 'args':
            case 'exclude':
            case 'include':
                return keyName + '=' + encodeURIComponent(JSON.stringify(key));
        }
    }).join('&').replace(/^/, '?').replace(/&&/g, '&');

    console.log(this);
};

module.exports = QueryOptions;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Function = function Function(schema, name, args) {
    this.schema = schema;
    this.name = name;

    if (args instanceof Array) {
        this.args = '{' + args.join(',') + '}';
    } else {
        this.args = args;
    }

    this.id = { schema_id: this.schema.id, name: this.name, args: this.args };
    this.to_url = function (id_only) {
        var base_url = id_only ? '' : this.schema.database.endpoint.url;
        if (typeof this.args != 'undefined') {
            return base_url + '/function/' + this.schema.name + '/' + this.name + '/' + this.args;
        }
        return base_url + '/function/' + this.schema.name + '/' + this.name;
    };
};

module.exports = Function;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Rowset = __webpack_require__(7);
var Row = __webpack_require__(6);

var Relation = function Relation(schema, name) {
	this.schema = schema;
	this.name = name;
	//console.log('Relation', schema.endpoint.connectionForRequest, name);
	this.id = { schema_id: this.schema.id, name: this.name };
};
Relation.prototype.toUrl = function () {
	return '/' + this.schema.name + '/' + this.name + '/';
	/* idOnly param
 	return id_only ? '/relation/' + this.schema.name + '/' + this.name :
 		this.schema.database.endpoint.url + '/relation/' + this.schema.name + '/' + this.name;
 */
};
Relation.prototype.column = function (name) {
	return new AQ.Column(this, name);
};
Relation.prototype.rows = function (options) {
	var _this = this;

	this.schema.endpoint.get(this, options).then(function (result) {
		return new Rowset(_this, result);
	});
	/*
 		.then(function(rows) {
 
 			if (rows == null) {
 				throw 'Empty response';
 			}/*
 				else if (rows.result.length < 1) {
 				throw 'No rows returned';
 				}*/
	/*
 			return new AQ.Rowset(this, rows, options);
 
 		}.bind(this)).catch(function(err) {
 			throw 'Rows request failed: ' + err;
 		});
 */
};
Relation.prototype.row = function (options) {
	var _this2 = this;

	this.schema.endpoint.get(this, options).then(function (result) {
		return new Row(_this2, result);
	});

	/*
 	// Multiple different ways to call 'row' function
 
 	// 1. Calling with Options object
 	if (typeof arguments[0] == 'object') {
 
 		var obj = arguments[0];
 		var args = arguments[1] || {};
 
 		// AQ.Relation.row({ where: { column_name: 'column_name', op: '=', value: 'value' } })
 		// Maybe it should be this one: AQ.Relation.row({ where: { column_name: value } })
 		if (typeof obj.where != 'undefined') {
 			args.where = obj.where;
 		}
 		// AQ.Relation.row({ column_name: 'column_name', op: '=', value: 'value' })
 		// Maybe it should be this one: AQ.Relation.row({ column_name: value })
 		else {
 			args.where = obj;
 		}
 
 	}
 	// 2. Calling with column_name and value
 	else if (typeof arguments[0] == 'string') {
 
 		// AQ.Relation.row(column_name, value [, options_obj])
 		var name = arguments[0];
 		var value = arguments[1];
 		var args = arguments[2] || {};
 
 		args.where = { name: name, op: '=', value: value };
 
 	}
 	// 3. Calling AQ.Relation.row() without arguments
 	else {
 		var args = {};
 	}
 
 	return this.schema.database.endpoint.get(this, args)
 		.then(function(row) {
 
 			if (row == null) {
 				throw 'Empty response';
 			}
 			else if (row.result.length == 0) {
 				throw 'No row returned';
 			}
 			else if (row.result.length > 1) {
 				throw 'Multiple rows returned';
 			}
 			return new AQ.Row(this, row);
 
 		}.bind(this)).catch(function(err) {
 			throw 'Row request failed: ' + err;
 		});
 */
};
Relation.prototype.insert = function (data, options) {
	return this.schema.endpoint.post(this, options); /*.then(result => {
                                                  if(!result.length) {
                                                  throw 'no rows inserted';
                                                  }
                                                  if(result.length === 1) {
                                                  return new Row(this, result);
                                                  }
                                                  return new Rowset(this, result);
                                                  });
                                                  */

	/*
 	if (typeof data == 'undefined') {
 		// table.insert({}) is equivalent to table.insert()
 		// both will insert default values
 		data = {};
 	}
 
 	// Return inserted row promise
 	return this.schema.database.endpoint.patch(this, data)
 		.then(function(inserted_row) {
 
 			if (inserted_row == null) {
 				throw 'Empty response';
 			}
 			if (typeof data.length != 'undefined' && data.length > 1) {
 				return new AQ.Rowset(this, inserted_row, null);
 			}
 			return new AQ.Row(this, inserted_row);
 
 		}.bind(this)).catch(function(err) {
 			throw 'Insert failed: ' + err;
 		});
 */
};

module.exports = Relation;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Field = __webpack_require__(0);

var Row = function Row(relation, options) {

	this.relation = relation;
	this.schema = relation.schema;
	this.row_data = response.result[0].row;

	this.cached_fields = {};
	this.columns = response.columns || null;
	this.pk_column_name = null;
	this.pk_value = null;
	this.id = null;
	this.to_url = function () {
		console.error('You must call a row with "meta_data: true" in order to use the to_url function');
		throw 'Datum.js: Programming Error';
	};

	if (typeof response.pk != 'undefined') {
		this.pk_column_name = response.pk;
		this.pk_value = this.get(this.pk_column_name);
		// this.id = {"pk_column_id":{"relation_id":{"schema_id":{"name":this.schema.name},"name":this.relation.name},"name":this.pk_column_name},"pk_value": this.pk_value}
		this.id = {
			pk_column_id: {
				relation_id: this.relation.id,
				name: this.pk_column_name
			},
			pk_value: this.pk_value
		};

		this.to_url = function (id_only) {
			return id_only ? '/row/' + this.relation.schema.name + '/' + this.relation.name + '/' + /*JSON.stringify(this.pk_value)*/this.pk_value : this.relation.schema.database.endpoint.url + '/row/' + this.relation.schema.name + '/' + this.relation.name + '/' + /*JSON.stringify(this.pk_value)*/this.pk_value;
		};
	}
};
/*
// get/set field
Row.prototype.update = function() {};
Row.prototype.delete = function() {};
*/

Row.prototype = {
	constructor: Row,
	get: function get(name) {
		return this.row_data[name];
	},
	set: function set(name, value) {
		this.row_data[name] = value;return this;
	},
	toString: function toString() {
		return JSON.stringify(this.row_data);
	},
	clone: function clone() {
		return new AQ.Row(this.relation, { columns: this.columns, pk: this.pk_column_name, result: [{ row: this.row_data }] });
	},
	field: function field(name) {
		if (typeof this.cached_fields[name] == 'undefined') {
			this.cached_fields[name] = new AQ.Field(this, name, name === this.pk_column_name);
		}
		return this.cached_fields[name];
	},
	fields: function fields() {
		if (this.columns != null) {
			return this.columns.map(function (c) {
				return this.field(c.name);
			}.bind(this));
		}
		return null;
	}
};

Row.prototype.update = function () {
	return this.relation.schema.database.endpoint.patch(this, this.row_data).then(function (response) {

		if (response == null) {
			throw 'Empty response';
		}
		return this;
	}.bind(this)).catch(function (err) {
		throw 'Update failed: ' + err;
	});
};

Row.prototype.delete = function () {
	return this.relation.schema.database.endpoint.delete(this).then(function (response) {

		if (response == null) {
			throw 'Empty response';
		}
	}).catch(function (err) {
		throw 'Delete failed: ' + err;
	});
};

Row.prototype.relatedRows = function (self_column_name, related_relation_name, related_column_name, options) {

	var relation_parts = related_relation_name.split('.');
	if (relation_parts.length < 2) {
		console.error("Related relation name must be schema qualified (schema_name.relation_name)");
		// throw "Related relation name must be schema qualified (schema_name.relation_name)";
	}

	var schema_name = relation_parts[0];
	var relation_name = relation_parts[1];
	var db = this.relation.schema.database;

	options = options || {};
	options.where = options.where instanceof Array ? options.where : typeof options.where == 'undefined' ? [] : [options.where];
	options.where.push({
		name: related_column_name,
		op: '=',
		value: this.get(self_column_name)
	});

	return db.schema(schema_name).relation(relation_name).rows(options);
};

Row.prototype.relatedRow = function (self_column_name, related_relation_name, related_column_name, options) {

	var relation_parts = related_relation_name.split('.');
	if (relation_parts.length < 2) {
		console.error("Related relation name must be schema qualified (schema_name.relation_name)");
		// throw "Related relation name must be schema qualified (schema_name.relation_name)";
	}

	var schema_name = relation_parts[0];
	var relation_name = relation_parts[1];
	var db = this.relation.schema.database;

	options = options || {};
	options.where = options.where instanceof Array ? options.where : typeof options.where == 'undefined' ? [] : [options.where];
	options.where.push({
		name: related_column_name,
		op: '=',
		value: this.get(self_column_name)
	});

	return db.schema(schema_name).relation(relation_name).row(options);
};

module.exports = Row;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var Field = __webpack_require__(0);
var Rowset = /*function( relation, options ) {};
             Rowset = */function Rowset(relation, response, server_arguments) {
	this.relation = relation;
	this.schema = relation.schema;
	this.columns = response.columns || null;
	this.pk_column_name = response.pk || null;
	this.rows = response.result;
	this.length = response.result.length;
	this.server_arguments = server_arguments || {};
};

// get/set field
Rowset.prototype.update = function () {};
Rowset.prototype.delete = function () {};

Rowset.prototype.map = function (fn) {
	return this.rows.map(function (row) {
		return new Row(this.relation, { columns: this.columns, pk: this.pk_column_name, result: [row] });
	}.bind(this)).map(fn);
};
Rowset.prototype.forEach = function (fn) {
	return this.rows.map(function (row) {
		return new Row(this.relation, { columns: this.columns, pk: this.pk_column_name, result: [row] });
	}.bind(this)).forEach(fn);
};
Rowset.prototype.reload = function () {
	return this.relation.rows(this.server_arguments);
};

/**
 * Call AQ.Rowset.where with (where_obj) or use shorthand notation (field, value) - filter results programmatically
 *
 * @param {Object} where_obj
 * @param {[Boolean]} return_first
 * @param {[Boolean]} async
 *
 * OR
 *
 * @param {String} field
 * @param {Any} value
 * @param {[Boolean]} return_first
 * @param {[Boolean]} async
 *
 * @returns {Promise}
 */
Rowset.prototype.where = function () {

	var first = false,
	    async = true,
	    where_obj = {};
	if (_typeof(arguments[0]) == 'object') {
		// AQ.Rowset.where(where_obj [, return_first] [, async]);
		where_obj = arguments[0];
		var field = where_obj.field;
		var value = where_obj.value;
		if (arguments.length > 1) first = arguments[1];
		if (arguments.length > 2) async = arguments[2];
	} else if (typeof arguments[0] == 'string' && arguments.length > 1) {
		// AQ.Rowset.where(field, value [, return_first] [, async]);
		var field = arguments[0];
		var value = arguments[1];
		if (arguments.length > 2) first = arguments[2];
		if (arguments.length > 3) async = arguments[3];
	}

	return new Promise(function (resolve, reject) {

		// TODO lots of logic here
		// The new rowset that is returned must be in the same format as the response from the server

		if (first) {
			for (var i = 0; i < this.rows.length; i++) {
				if (this.rows[i].row[field] == value) {
					resolve(new AQ.Row(this.relation, { columns: this.columns, result: [this.rows[i]] }));
				}
			}
			reject('could not find ' + field + ' ' + value);
		} else {
			var return_rowset = [];
			for (var i = 0; i < this.rows.length; i++) {
				if (this.rows[i].row[field] == value) {
					return_rowset.push(this.rows[i]);
				}
			}
			resolve(new AQ.Rowset(this.relation, { columns: this.columns, result: return_rowset }));
		}

		// 2

		// maybe we don't need to search the entire row and instead we return the first item found
		/*
     var new_rowset = _.filter(this.rows, function(el) {
  //return AQ.equals.call(this, el[field], val);
  });
  */
		if (new_rowset.length == 1) {
			return new AQ.Row(this.relation, new_rowset);
		} else if (new_rowset.length > 1) {
			throw 'Multiple Rows Returned';
		}

		// if row does not exist
		return null;
	}.bind(this));
};

Rowset.prototype.orderBy = function (column, direction) {
	/*
    var ordered = _.sortBy(this.rows, function(el) {
    return el.row[column];
    });
    */
	if (direction !== 'asc') {
		ordered.reverse();
	}
	return new AQ.Rowset(this.relation, { columns: this.columns, result: ordered });
};

Rowset.prototype.limit = function (lim) {
	if (lim <= 0) {
		throw 'Bad limit';
	}
	return new AQ.Rowset(this.relation, { columns: this.columns, result: this.rows.slice(0, lim) });
};

Rowset.prototype.relatedRows = function (self_column_name, related_relation_name, related_column_name, options) {

	var relation_parts = related_relation_name.split('.');
	if (relation_parts.length < 2) {
		console.error("Related relation name must be schema qualified (schema_name.relation_name)");
		// throw "Related relation name must be schema qualified (schema_name.relation_name)";
	}

	var schema_name = relation_parts[0];
	var relation_name = relation_parts[1];
	var db = this.relation.schema.database;

	var values = this.map(function (row) {
		return row.get(self_column_name);
	});

	options = options || {};
	options.where = options.where instanceof Array ? options.where : typeof options.where == 'undefined' ? [] : [options.where];
	options.where.push({
		name: related_column_name,
		op: 'in',
		value: values
	});

	return db.schema(schema_name).relation(relation_name).rows(options);
};

Rowset.prototype.relatedRow = function (self_column_name, related_relation_name, related_column_name, options) {

	var relation_parts = related_relation_name.split('.');
	if (relation_parts.length < 2) {
		console.error("Related relation name must be schema qualified (schema_name.relation_name)");
		// throw "Related relation name must be schema qualified (schema_name.relation_name)";
	}

	var schema_name = relation_parts[0];
	var relation_name = relation_parts[1];
	var db = this.relation.schema.database;

	var values = this.map(function (row) {
		return row.get(self_column_name);
	});

	options = options || {};
	options.where = options.where instanceof Array ? options.where : typeof options.where == 'undefined' ? [] : [options.where];
	options.where.push({
		name: related_column_name,
		op: 'in',
		value: values
	});

	return db.schema(schema_name).relation(relation_name).row(options);
};

module.exports = Rowset;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Endpoint = __webpack_require__(1);
var Schema = __webpack_require__(2);

var datum = {
    schema: function schema(name) {
        return new Schema(Endpoint, name);
    }
};

window.datum = datum;

/*
module.exports = ( app, config ) => {

    const datum = {
        schema: name => new Schema(new Endpoint(), name)
    };

    return datum;

};
*/

/***/ })
/******/ ]);