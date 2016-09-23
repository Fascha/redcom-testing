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



class GetThread(Resource):
	def get(self, id):
		return get_thread_by_id(id)

data_to_return = {}


class GetCommentsTree(Resource):
	def get(self, id, chart):

		def parse_comments(comments, curr_lvl):
			result = []
			for comment in comments:
				if type(comment).__name__ == "Comment":
					children = parse_comments(comment.replies, (curr_lvl + 1))
					if len(children) > 0:
						result.append({"children": children, "name": str(comment.author), "level": curr_lvl})
					else:
						result.append({"name": str(comment.author), "size": len(comment.body), "level": curr_lvl})

				elif type(comment).__name__ == "MoreComments":
					load_more_comments = comment.comments()
					if len(load_more_comments) > 0:
						more_comments = parse_comments(load_more_comments, curr_lvl)
					for com in more_comments:
						result.append(com)

			return result



##
## Actually setup the Api resource routing here
##

api.add_resource(GetCommentsTree, '/get_thread_by_id/<id>/<chart>')


@app.route("/")
def hello():
	return render_template("index.html")

if __name__ == '__main__':
	app.run(debug=True)