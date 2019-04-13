from endpoint.auth import AuthMiddleware
from endpoint.data import application as data_app
from endpoint.events import application as events_app
from endpoint.page import application as page_app
from os import environ
from sys import exit
from werkzeug.wsgi import DispatcherMiddleware

import logging

logging.basicConfig(level=logging.INFO)


try:
    base_url = environ['BASE_URL']

except KeyError as err:
    logging.error("You'll need to specify a %s environment variable." % str(err))
    exit(2)

else:
    application = AuthMiddleware(DispatcherMiddleware(page_app, {
        '%s' % base_url: data_app,
        '%s/0.1/event' % base_url: events_app
    }))
