Task Board
A simple Task Board application with a VanillaJS frontend and a Django backend.

Features
Create, update, and delete tasks
Track task progress
User authentication with token-based login

Tech Stack
Frontend: VanillaJS, HTML, CSS
Backend: Django, Django REST Framework
Database: SQLite (default)

Setup Instructions
Backend Setup (Django)


git clone <repo-link>
cd backend
virtualenv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
The API runs at http://127.0.0.1:8000/api/.

Frontend Setup (VanillaJS)

Open index.html in a browser. Or Get the Live Server plugin.
Free to use and modify. 🚀
