from flask import request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource
from marshmallow import ValidationError

from app.exceptions.article_exceptions import (
    ArticleAlreadyExistsError,
    ArticleNotFoundError,
    ArticlePermissionDeniedError, EmptyArticleUpdateError,
    InvalidArticleTopicError,
)
from app.schemas.article_schema import (
    ArticleCreateSchema,
    ArticleResponseSchema,
    ArticlePatchSchema,
)
from app.services.article_service import ArticleService
from app.repositories.user_repository import UserRepository
from app.exceptions.user_exceptions import UserNotFoundError


class ArticleListResource(Resource):

    def get(self):
        topic = request.args.get('topic')

        if topic:
            articles = ArticleService.get_by_topic(topic)
        else:
            articles = ArticleService.get_all()

        return (
            ArticleResponseSchema(
                many=True,
            ).dump(articles),
            200,
        )

    @jwt_required()
    def post(self):
        try:
            data = ArticleCreateSchema().load(
                request.get_json()
            )

            article = ArticleService.create(
                data,
                int(get_jwt_identity()),
            )

            return (
                ArticleResponseSchema().dump(article),
                201,
            )

        except ValidationError as error:
            return {
                "message": "Validation failed.",
                "errors": error.messages,
            }, 400

        except ArticleAlreadyExistsError as error:
            return {
                "message": str(error),
            }, 409

        except InvalidArticleTopicError as error:
            return {
                "message": str(error),
            }, 400


class ArticleDetailResource(Resource):

    def get(self, slug):
        try:
            article = ArticleService.get_by_slug(slug)

            return (
                ArticleResponseSchema().dump(article),
                200,
            )

        except ArticleNotFoundError as error:
            return {
                "message": str(error),
            }, 404

    @jwt_required()
    def patch(self, slug):
        try:
            data = ArticlePatchSchema().load(
                request.get_json()
            )

            article = ArticleService.patch_by_slug(
                slug,
                int(get_jwt_identity()),
                data,
            )

            return (
                ArticleResponseSchema().dump(article),
                200,
            )

        except ValidationError as error:
            return {
                "message": "Validation failed.",
                "errors": error.messages,
            }, 400

        except ArticleAlreadyExistsError as error:
            return {
                "message": str(error),
            }, 409

        except ArticleNotFoundError as error:
            return {
                "message": str(error),
            }, 404

        except ArticlePermissionDeniedError as error:
            return {
                "message": str(error),
            }, 403

        except EmptyArticleUpdateError as error:
            return {
                "message": str(error),
            }, 400

        except InvalidArticleTopicError as error:
            return {
                "message": str(error),
            }, 400

    @jwt_required()
    def delete(self, slug):
        try:
            ArticleService.delete_by_slug(
                slug,
                int(get_jwt_identity()),
            )

            return "", 204

        except ArticleNotFoundError as error:
            return {
                "message": str(error),
            }, 404

        except ArticlePermissionDeniedError as error:
            return {
                "message": str(error),
            }, 403


class AuthorArticleListResource(Resource):

    def get(self):
        username = request.args.get('username')
        if not username:
            return {
                "message": "username query parameter is required",
            }, 400

        try:
            user = UserRepository.get_by_username(username)
            if not user:
                raise UserNotFoundError("User not found.")

            articles = ArticleService.get_by_author(user.id)

            return {
                "author": {
                    "name": f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
                    "description": user.bio or "",
                    "image": user.image_url or "",
                },
                "articles": ArticleResponseSchema(many=True).dump(articles),
            }, 200

        except UserNotFoundError as error:
            return {
                "message": str(error),
            }, 404


class ArticleManageResource(Resource):

    @jwt_required()
    def patch(self, slug):
        try:
            data = ArticlePatchSchema().load(
                request.get_json()
            )

            article = ArticleService.patch_by_slug(
                slug,
                int(get_jwt_identity()),
                data,
            )

            return (
                ArticleResponseSchema().dump(article),
                200,
            )

        except ValidationError as error:
            return {
                "message": "Validation failed.",
                "errors": error.messages,
            }, 400

        except ArticleAlreadyExistsError as error:
            return {
                "message": str(error),
            }, 409

        except ArticleNotFoundError as error:
            return {
                "message": str(error),
            }, 404

        except ArticlePermissionDeniedError as error:
            return {
                "message": str(error),
            }, 403

        except EmptyArticleUpdateError as error:
            return {
                "message": str(error),
            }, 400

        except InvalidArticleTopicError as error:
            return {
                "message": str(error),
            }, 400

    @jwt_required()
    def delete(self, slug):
        try:
            ArticleService.delete_by_slug(
                slug,
                int(get_jwt_identity()),
            )

            return "", 204

        except ArticleNotFoundError as error:
            return {
                "message": str(error),
            }, 404

        except ArticlePermissionDeniedError as error:
            return {
                "message": str(error),
            }, 403


class ArticleClapResource(Resource):
    @jwt_required()
    def post(self, slug):
        try:
            claps = ArticleService.clap(slug)

            return claps, 200

        except ArticleNotFoundError as error:
            return {
                "message": str(error),
            }, 404

        except ArticlePermissionDeniedError as error:
            return {
                "message": str(error),
            }, 404
