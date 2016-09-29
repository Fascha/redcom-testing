from flask import Flask, jsonify, render_template
from flask_restful import reqparse, abort, Api, Resource
from reddit_api_controller import *



app = Flask(__name__)
api = Api(app)

TODOS = {
    'todo1': {'task': 'build an API'},
    'todo2': {'task': '?????'},
    'todo3': {'task': 'profit!'},
}

#
# def abort_if_todo_doesnt_exist(todo_id):
#     if todo_id not in TODOS:
#         abort(404, message="Todo {} doesn't exist".format(todo_id))

parser = reqparse.RequestParser()
parser.add_argument('task')


# Todo
# shows a single todo item and lets you delete a todo item
# class Todo(Resource):
#     def get(self, todo_id):
#         abort_if_todo_doesnt_exist(todo_id)
#         return TODOS[todo_id]
#
#     def delete(self, todo_id):
#         abort_if_todo_doesnt_exist(todo_id)
#         del TODOS[todo_id]
#         return '', 204
#
#     def put(self, todo_id):
#         args = parser.parse_args()
#         task = {'task': args['task']}
#         TODOS[todo_id] = task
#         return task, 201


# TodoList
# shows a list of all todos, and lets you POST to add new tasks
# class TodoList(Resource):
#     def get(self):
#         return TODOS
#
#     def post(self):
#         args = parser.parse_args()
#         todo_id = int(max(TODOS.keys()).lstrip('todo')) + 1
#         todo_id = 'todo%i' % todo_id
#         TODOS[todo_id] = {'task': args['task']}
#         return TODOS[todo_id], 201
#
#
# class GetThread(Resource):
#     def get(self, id):
#         return get_thread_by_id(id)

data_to_return = {}
thread_data = {}

class GetCommentsTree(Resource):

    def get(self, id, chart):
        print(chart)

        global thread_data
        if id in thread_data:
            if chart == "tree":
                return thread_data[id]["tree"]
            elif chart == "pie":
                return thread_data[id]["pie"]
            elif chart == "timeseries":
                return thread_data[id]["timeseries"]
            else:
                return None

        thread = get_thread_by_id(id)

        def parse_comments(comments, curr_lvl):
            if curr_lvl in lvl_dict.keys():
                lvl_dict[curr_lvl] += 1
            else:
                lvl_dict[curr_lvl] = 1

            result = []
            for comment in comments:
                if type(comment).__name__ == "Comment":
                    children = parse_comments(comment.replies, (curr_lvl + 1))
                    if len(children) > 0:
                        result.append({"children": children, "name": str(comment.author), "level": curr_lvl})
                    else:
                        result.append({"name": str(comment.author), "size": len(comment.body), "level": curr_lvl})

                elif type(comment).__name__ == "MoreComments":
                    print("More Comments")
                    # try:
                    #     load_more_comments = comment.comments()
                    #     if len(load_more_comments) > 0:
                    #         more_comments = parse_comments(load_more_comments, curr_lvl)
                    #         for com in more_comments:
                    #             result.append(com)
                    # except:
                    #     print("loading more comments failed")

            return result

        lvl_dict = {}
        tree_data_result = {}
        tree_data_result['name'] = "SUBMISSION"
        # tree_data_result['children'] = build_json_for_tree(thread.comments, 0)
        tree_data_result['children'] = parse_comments(thread.comments, 0)
        tree_data_result['level'] = 0

        lvl_list = []
        lvl_gt9 = 0
        for key in lvl_dict.keys():
            if key > 0 and key < 9:
                lvl_list.append({'level': key, 'value': lvl_dict[key]})
            elif key >= 9:
                lvl_gt9 += lvl_dict[key]
        print(lvl_gt9)
        if lvl_gt9 > 0:
            lvl_list.append({'level': '>=9', 'value': lvl_gt9})

        timeseries_data = []

        for comment in praw.helpers.flatten_tree(thread.comments):
            timeseries_data.append({
                'created_utc': comment.created_utc,
                'body': comment.body,
                'author': str(comment.author),
                'permalink': comment.permalink,
                'ups': comment.ups,
                'downs': comment.downs,
                'score': comment.score
            })
        thread_data[id] = {"tree": jsonify(tree_data_result), "pie": jsonify(lvl_list), "timeseries": jsonify(timeseries_data)}
        if chart == "tree":
            return thread_data[id]["tree"]
        elif chart == "pie":
            return thread_data[id]["pie"]
        elif chart == "timeseries":
            return thread_data[id]["timeseries"]
        else:
            return None

##
## Actually setup the Api resource routing here
##
# api.add_resource(TodoList, '/todos')
api.add_resource(GetCommentsTree, '/get_thread_by_id/<id>/<chart>')


@app.route("/")
def hello():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True)