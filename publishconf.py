#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

import os
import sys
sys.path.append(os.curdir)

from pelicanconf import *


# Basic settings
SITEURL = 'https://www.alapshin.com'

# URL settings
RELATIVE_URLS = False

# Feed settings
FEED_ALL_ATOM = 'feeds/all.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/{slug}.atom.xml'

DELETE_OUTPUT_DIRECTORY = True

# Theme settings
GOOGLE_ANALYTICS = 'UA-96373687-1'

#DISQUS_SITENAME = ""
