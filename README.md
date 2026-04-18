# OpenEduCat ERP - Modern Architecture

A next-generation Educational ERP built with a decoupling of concerns.

## 🏗️ Architecture
- **Backend**: Django (Python 3.13) + Django REST Framework.
- **Frontend**: React 19 + Vite 6 (TypeScript).
- **Styling**: Vanilla CSS & Framer Motion for premium animations.
- **Security**: SLSA Level 3 Build Provenance.
- **Quality**: Pylint & ESLint.

## 📁 Repository Structure
```text
├── backend/            # Django Source Code
│   ├── api/           # DRF API Views & Logic
│   └── backend/       # Project Settings
├── frontend/           # React 19 / Vite Source
│   ├── src/           # Frontend Logic
│   └── public/        # Static Assets
├── .github/workflows/  # SLSA Build Workflows
└── .pylintrc          # Python Linting Rules
```

## 🚀 Getting Started

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛡️ Security & Quality
- **SLSA**: Build provenance is generated automatically via GitHub Actions in `.github/workflows/slsa.yml`.
- **Pylint**: Run `pylint backend/` to ensure Python code quality.
