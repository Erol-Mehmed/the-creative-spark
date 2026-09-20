import sys
from pathlib import Path

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from flask import Flask
from app.extensions import db as _db, jwt, bcrypt, migrate
from flask_cors import CORS
from flask_restful import Api


@pytest.fixture
def app():
    """Create a fresh Flask app for each test to avoid route conflicts."""
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['JWT_SECRET_KEY'] = 'test-secret-key-32-chars-minimum!'  # 32+ chars
    app.config['SECRET_KEY'] = 'test-secret-key-32-chars-minimum!'

    CORS(app, resources={r"/api/*": {"origins": "http://localhost:4200"}})

    _db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, _db)

    # Create fresh API and register routes
    api = Api(app)
    from app.routes import register_routes
    register_routes(api)

    with app.app_context():
        _db.create_all()
        yield app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def db(app):
    return _db
