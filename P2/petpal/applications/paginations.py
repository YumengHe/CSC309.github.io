from rest_framework import pagination


# Pagination made easy with Django Rest Framework
# https://www.sankalpjonna.com/learn-django/pagination-made-easy-with-django-rest-framework
class BasePageNumberPagination(pagination.PageNumberPagination):
    # Default page size
    page_size = 2
    page_size_query_param = "page_size"
    max_page_size = 50
    page_query_param = "page"
