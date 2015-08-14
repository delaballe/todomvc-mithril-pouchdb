var app = app || {};

(function () {
    'use strict';

    // Single todo view
    app.single = function(ctrl, task, index) {
        return m('li', { class: task.completed() ? 'completed' : ''}, [
            m('.view', [
                m('input.toggle[type=checkbox]', {
                    onclick: function() { m.withAttr('checked', task.completed); task.update() },
                    checked: task.completed()
                }),
                m('label', task.title()),
                m('button.destroy', { onclick: ctrl.remove.bind(ctrl, index)})
            ]),
            m('input.edit')
        ]);
    };

})();
