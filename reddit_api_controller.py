import praw

crawler = praw.Reddit(user_agent='ur_ba_scf_crawler')

crawler.config.log_requests = 1
crawler.config.store_json_result = True


def get_thread_by_id(thread_id):
	thread = crawler.get_submission(submission_id=thread_id)
	return thread


def get_thread_by_url(url, flat=False):
	thread = crawler.get_submission(url=url)
	# thread_id = url.split("/")[6]
	# thread = crawler.get_submission(submission_id=thread_id)
	# thread.replace_more_comments(limit=None, threshold=0)
	flat_comments = praw.helpers.flatten_tree(thread.comments)
	if flat == True:
		return flat_comments
	else:
		return thread


def get_subreddit():
	subreddit = crawler.get_subreddit('diablo')
	return subreddit


