var app = app || {};

(function () {
    'use strict';

    // Todo Model
    app.Todo = function(data) {
		//console.log(this._id)
		this._id = m.prop(data._id);
        this.title = m.prop(data.title);
		this.filter = m.prop(data.filter);
        this.completed = m.prop(data.completed);
		this.activated = m.prop(data.activated)
    };
    
    // List of Todos
	app.db = new PouchDB('todo');
	app.TodoList = function() {
		var deferred = m.deferred();
		deferred.resolve(app.db.allDocs({
			include_docs: true,
			attachments: true
		}).then(function (res) {
			return res.rows.map(function (row) { return row.doc; })
		}).catch(function (err) {
			console.log(err);
		}));
		return deferred.promise;
	}

    /*app.TodoList = 	function() {
		
		deferred.resolve(list)
		return deferred.promise
		}
*/
})();
