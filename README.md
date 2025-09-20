An AI-powered code review system that helps developers automatically review their code, suggest improvements, and provide feedback based on best practices.

The project is built with FastAPI, integrates with AI models, and uses PostgreSQL for data storage.

🚀 Features

🤖 AI-Powered Code Review – Analyze submitted code and generate intelligent review comments.

🛠 FastAPI Backend – Provides REST APIs for frontend interaction.

💾 PostgreSQL Database – Stores user submissions, review history, and feedback.

🎨 Frontend UI – User-friendly interface for uploading and reviewing code.

🔍 Smart Suggestions – Detects potential bugs, optimizations, and code improvements.

📊 Analytics Dashboard (future enhancement) – Track code quality over time.

⚙️ Tech Stack

Backend: FastAPI (Python)

Database: PostgreSQL

Frontend: HTML, CSS, JavaScript (basic, can be extended to React)

AI: OpenAI API (or any custom LLM)

Other Tools: SQLAlchemy, Pydantic, Alembic

📦 Installation & Setup
1. Clone the Repository
git clone https://github.com/your-username/AI-Code-Reviewer.git
cd AI-Code-Reviewer

2. Setup Virtual Environment
python -m venv venv
source venv/bin/activate   # For Linux/Mac
venv\Scripts\activate      # For Windows

3. Install Dependencies
pip install -r requirements.txt

4. Setup Database

Update your PostgreSQL credentials in backend/config.py, then run:

alembic upgrade head

5. Run Backend
cd backend
uvicorn main:app --reload


API will run at: http://127.0.0.1:8000

6. Run Frontend

Open frontend/index.html in your browser (or serve via any static server).

🔮 Future Enhancements

✅ Add support for multiple programming languages

✅ Implement real-time feedback while typing

✅ Add auth system (login/signup with JWT)

✅ Enhance AI with fine-tuned models

✅ Add team collaboration features

🤝 Contributing

Contributions are welcome!

Fork the repo

Create a new branch (feature-xyz)

Commit changes

Open a Pull Request