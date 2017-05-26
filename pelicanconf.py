#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals


# Basic settings
PATH = 'content'
SITENAME = '/dev/alapshin'
SITEURL = ''
TYPOGRIFY = True
USE_FOLDER_AS_CATEGORY = False

# URL settings
# Uncomment following line if you want document-relative URLs when developing
ARTICLE_URL = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = 'posts/{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
PAGE_URL = 'pages/{slug}/'
PAGE_SAVE_AS = 'pages/{slug}/index.html'
ARCHIVES_URL = 'archives/'
ARCHIVES_SAVE_AS = 'archives/index.html'

# Time and date settings
TIMEZONE = 'Europe/Moscow'
# DEFAULT_DATE_FORMAT = '%Y-%m-%d %H:%M:%S'

# Metadata settings
AUTHOR = 'alapshin'

# Feed settings
# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Pagination settings
DEFAULT_PAGINATION = 10

# Translation settings
DEFAULT_LANG = 'en'

# Theme settings
THEME = 'themes/bootstrap4'
# Blogroll
LINKS = (
    ('Blog', '/'),
    ('Archives', '/archives/'),
    ('About', '/pages/about/'),
    ('Contact', '/pages/contact/'),
)

# Social widget
SOCIAL = (
    ('GitHub', 'https://github.com/alapshin'),
    ('Twitter', 'https://twitter.com/alapshindev'),
)
