from app.resources.article import (
    ArticleDetailResource,
    ArticleListResource, AuthorArticleListResource, ArticleClapResource,
)
from app.resources.auth import (
    LoginResource,
    MeResource,
    RegisterResource,
)
from app.resources.health import HealthResource
from app.resources.upload import (
    ArticleImageUploadResource,
    UserImageUploadResource,
)
from app.resources.topic import TopicListResource


def register_routes(api):
    api.add_resource(
        HealthResource,
        "/api/health",
    )

    api.add_resource(
        RegisterResource,
        "/api/auth/register",
    )

    api.add_resource(
        LoginResource,
        "/api/auth/login",
    )

    api.add_resource(
        MeResource,
        "/api/auth/me",
    )

    api.add_resource(
        ArticleListResource,
        "/api/articles",
    )

    api.add_resource(
        ArticleDetailResource,
        "/api/articles/<string:slug>",
    )

    api.add_resource(
        AuthorArticleListResource,
        "/api/author",
    )

    api.add_resource(
        ArticleImageUploadResource,
        "/api/uploads/articles",
    )

    api.add_resource(
        UserImageUploadResource,
        "/api/uploads/users",
    )

    api.add_resource(
        TopicListResource,
        "/api/topics",
    )

    api.add_resource(
        ArticleClapResource,
        "/api/articles/<string:slug>/clap",
    )
