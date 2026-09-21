from marshmallow import Schema, fields, validate
from app.validators import NotOnlyWhitespace, SlugFormat


class ArticleCreateSchema(Schema):
    title = fields.Str(
        required=True,
        validate=[validate.Length(min=5, max=150), NotOnlyWhitespace()],
    )

    slug = fields.Str(
        required=True,
        validate=[validate.Length(min=5, max=150), SlugFormat()],
    )

    content = fields.Str(
        required=True,
        validate=[validate.Length(min=20), NotOnlyWhitespace()],
    )

    topic = fields.Str(
        required=False,  # Made optional as we're using topics array
        validate=validate.Length(min=2, max=100),
    )

    topics = fields.List(
        fields.Str(validate=validate.Length(min=1, max=100)),
        required=True,
        validate=validate.Length(min=1),
    )

    image_url = fields.Str(
        allow_none=True,
    )


class ArticlePatchSchema(Schema):
    title = fields.Str(required=False, validate=NotOnlyWhitespace())
    slug = fields.Str(required=False, validate=SlugFormat())
    content = fields.Str(required=False, validate=NotOnlyWhitespace())
    topic = fields.Str(
        required=False,
        validate=validate.Length(min=2, max=100),
    )
    topics = fields.List(
        fields.Str(validate=validate.Length(min=1, max=100)),
        required=False,
        validate=validate.Length(min=1),
    )
    image_url = fields.Str(required=False, allow_none=True)


class AuthorSchema(Schema):
    id = fields.Int()

    username = fields.Str()

    first_name = fields.Str(
        allow_none=True,
    )

    last_name = fields.Str(
        allow_none=True,
    )

    image = fields.Str(
        attribute="image_url",
        allow_none=True,
    )


class ArticleResponseSchema(Schema):
    id = fields.Int()
    title = fields.Str()
    slug = fields.Str()
    content = fields.Str()
    topic = fields.Str()
    topics = fields.Method('get_topics')

    image = fields.Str(
        attribute="image_url",
        allow_none=True,
    )

    claps = fields.Int()

    readTime = fields.Int(
        attribute="read_time",
    )

    createdAt = fields.DateTime(
        attribute="created_at",
    )

    author = fields.Nested(
        AuthorSchema
    )

    # Flattened author fields for frontend compatibility
    author_id = fields.Int()
    authorName = fields.Method('get_author_name')
    authorImage = fields.Method('get_author_image')
    authorSlug = fields.Method('get_author_slug')

    def get_author_name(self, obj):
        if obj.author:
            return f"{obj.author.first_name or ''} {obj.author.last_name or ''}".strip() or obj.author.username
        return ''

    def get_author_image(self, obj):
        return obj.author.image_url if obj.author else None

    def get_author_slug(self, obj):
        return obj.author.username if obj.author else ''

    def get_topics(self, obj):
        """Return topic names as array"""
        if obj.topics:
            return [topic.name for topic in obj.topics]
        return []
