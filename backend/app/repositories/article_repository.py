from sqlalchemy import or_, select

from app.extensions import db
from app.models.article import Article
from app.models.topic import Topic


class ArticleRepository:

    @staticmethod
    def get_all() -> list[Article]:
        statement = select(Article).order_by(
            Article.created_at.desc()
        )

        return db.session.execute(statement).scalars().all()

    @staticmethod
    def get_by_id(article_id: int) -> Article | None:
        return db.session.get(
            Article,
            article_id,
        )

    @staticmethod
    def get_by_slug(slug: str) -> Article | None:
        statement = select(Article).where(
            Article.slug == slug
        )

        return db.session.execute(statement).scalar_one_or_none()

    @staticmethod
    def get_by_author(author_id: int) -> list[Article]:
        statement = select(Article).where(
            Article.author_id == author_id
        ).order_by(Article.created_at.desc())

        return db.session.execute(statement).scalars().all()

    @staticmethod
    def get_by_topic(topic: str) -> list[Article]:
        statement = (
            select(Article)
            .outerjoin(Article.topics)
            .where(
                or_(
                    Article.topic.ilike(topic),
                    Topic.name.ilike(topic),
                )
            )
            .order_by(Article.created_at.desc())
            .distinct()
        )

        return db.session.execute(statement).scalars().all()

    @staticmethod
    def create(article: Article) -> Article:
        db.session.add(article)
        db.session.commit()

        return article

    @staticmethod
    def patch(article: Article) -> Article:
        db.session.commit()

        return article

    @staticmethod
    def delete(article: Article) -> None:
        db.session.delete(article)
        db.session.commit()

    @staticmethod
    def clap(article):
        article.claps += 1
        db.session.commit()

        return article.claps
