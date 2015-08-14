var app = app || {};

(function () {
    'use strict';

    app.controller = function() {

        this.list = []
		var that = this;
		
		watch(this.list, function(t){
			console.log(JSON.stringify(that.list[t]));
			m.redraw()
		});
		
		self = this;
		
		new app.TodoList().then(function(d) { d.forEach( function (t){
			self.list.push(new app.Todo(t))
			//console.log(t)
			}) 
		})// Todo collection

		//console.log(new app.TodoList())
		this._id =   m.prop(''); 
        this.title = m.prop('');        // Temp title placeholder
		this.activated = m.prop(true);
		this.completed = m.prop(false);
        this.filter = m.prop(m.route.param('filter') || '');       // TodoList filter

        // Add a Todo 
        this.add = function(title, _id, filter, activated, completed) {
            if(this.title()) {
				var id = _id(PouchDB.utils.uuid());
				var _todo = new app.Todo({title: title(), _id: id,  filter: filter(), activated: activated(), completed:  completed() })
                this.list.push(_todo);
				//console.log(_todo._id())
				app.db.put({title: _todo.title(), _id: id,  filter: _todo.filter(), activated: _todo.activated(), completed:  _todo.completed()})
                this.title('');
				//this._id('');
            }
        };

		 this.update = function(task) {
			if ( task.completed() == true ) {
				task.completed(false)
			}
			else {
				task.completed(true)
			}
			//m.withAttr('checked', task.completed)
			console.log(task._id(), task.title(), task.activated(), task.completed(), task.filter())
			app.db.get(task._id()).then(function(doc) {
			  return app.db.put({
				_id: task._id(),
				_rev: doc._rev,
				title: task.title(),
				activated:  task.activated(),
				completed: task.completed(),
				filter : task.filter(),
			  });
			}).then(function(response) {
			 console.log(response)
			}).catch(function (err) {
			  console.log(err);
			});
		 }
		
        //check whether a todo is visible
        this.isVisible = function(todo) {
			//console.log(JSON.stringify(this))
            if(this.filter() == '')
                return true;
            if (this.filter() == 'active')
                return !todo.completed();
            if (this.filter() == 'completed')
                return todo.completed();
			//m.redraw()
        }
        
        this.clearTitle = function() {
            this.title('')
        }

        // Removing a Todo from the list
        this.remove = function(key) {
			var obj = this.list[key];
            this.list.splice(key, 1)
			//console.log(key)
			//console.log( this.list)
			app.db.get(obj._id()).then(function (doc) {
				return app.db.remove(doc).then(m.redraw());
			});
        }

        // Remove all Todos where Completed == true
        this.clearCompleted = function() {
            for(var i = this.list.length - 1; i >= 0; i--) {
                if (this.list[i].completed()) {
                    this.list.splice(i, 1);
                }
            }
        }

        // Total amount of Todos completed
        this.amountCompleted = function() {
            var amount = 0;
            
            for(var i = 0; i < this.list.length; i++)
                if(this.list[i].completed())
                    amount++;

            return amount;
        }
    };
    
})();
