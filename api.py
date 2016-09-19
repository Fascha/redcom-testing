from flask import Flask, jsonify, render_template
from flask_restful import reqparse, abort, Api, Resource
from reddit_api_controller import *
import json


app = Flask(__name__)
api = Api(app)

TODOS = {
    'todo1': {'task': 'build an API'},
    'todo2': {'task': '?????'},
    'todo3': {'task': 'profit!'},
}


def abort_if_todo_doesnt_exist(todo_id):
    if todo_id not in TODOS:
        abort(404, message="Todo {} doesn't exist".format(todo_id))

parser = reqparse.RequestParser()
parser.add_argument('task')


# Todo
# shows a single todo item and lets you delete a todo item
class Todo(Resource):
    def get(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        return TODOS[todo_id]

    def delete(self, todo_id):
        abort_if_todo_doesnt_exist(todo_id)
        del TODOS[todo_id]
        return '', 204

    def put(self, todo_id):
        args = parser.parse_args()
        task = {'task': args['task']}
        TODOS[todo_id] = task
        return task, 201


# TodoList
# shows a list of all todos, and lets you POST to add new tasks
class TodoList(Resource):
    def get(self):
        return TODOS

    def post(self):
        args = parser.parse_args()
        todo_id = int(max(TODOS.keys()).lstrip('todo')) + 1
        todo_id = 'todo%i' % todo_id
        TODOS[todo_id] = {'task': args['task']}
        return TODOS[todo_id], 201


class GetThread(Resource):
    def get(self, id):
        return get_thread_by_id(id)


class GetCommentsTree(Resource):
    def get(self, id, chart):
        print(chart)
        thread = get_thread_by_id(id)

        def build_json_for_tree(comments, curr_lvl):
            # dict_key = "level: " + str(curr_lvl)
            if curr_lvl in lvl_dict.keys():
                lvl_dict[curr_lvl] += 1
            else:
                lvl_dict[curr_lvl] = 1

            result = []
            for comment in comments:
                children = build_json_for_tree(comment.replies, (curr_lvl+1))
                if len(children) > 0:
                    result.append({"children": children, "name": str(comment.author), "level": curr_lvl})
                else:

                    result.append({"name": str(comment.author), "size": len(comment.body), "level": curr_lvl})

            return result

        lvl_dict = {}
        json_result = {}
        json_result['name'] = "SUBMISSION"
        json_result['children'] = build_json_for_tree(thread.comments, 0)
        json_result['level'] = 0

        lvl_list = []
        for key in lvl_dict.keys():
            lvl_list.append({'level': key, 'value': lvl_dict[key]})

        if chart == "tree":
            return jsonify(json_result)
        elif chart == "pie":
            return jsonify(lvl_list)
        else:
            return None

##
## Actually setup the Api resource routing here
##
api.add_resource(TodoList, '/todos')
api.add_resource(GetCommentsTree, '/get_thread_by_id/<id>/<chart>')


@app.route("/")
def hello():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)