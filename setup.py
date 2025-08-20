"""
Setup script for Smart Study Assistant
"""
import os
import sys
import subprocess
from pathlib import Path


def create_directories():
    """Create necessary project directories"""
    directories = [
        "src/core",
        "src/features", 
        "src/evaluation",
        "src/utils",
        "config",
        "data/sample_documents",
        "data/evaluation_data",
        "data/vector_db",
        "tests",
        "logs",
        "videos",
        "docs"
    ]
    
    print("📁 Creating project directories...")
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        print(f"   ✅ {directory}")


def create_init_files():
    """Create __init__.py files for Python packages"""
    init_files = [
        "src/__init__.py",
        "src/core/__init__.py",
        "src/features/__init__.py",
        "src/evaluation/__init__.py",
        "src/utils/__init__.py",
        "config/__init__.py",
        "tests/__init__.py"
    ]
    
    print("\n🐍 Creating Python package files...")
    for init_file in init_files:
        Path(init_file).touch()
        print(f"   ✅ {init_file}")


def create_env_file():
    """Create .env file from template"""
    env_content = """# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Model Configuration
OPENAI_MODEL=gpt-3.5-turbo
EMBEDDING_MODEL=text-embedding-ada-002

# Vector Database Configuration
VECTOR_DB_TYPE=chroma
VECTOR_DB_PATH=./data/vector_db

# Application Configuration
MAX_TOKENS=2000
TEMPERATURE=0.7
TOP_P=1.0
TOP_K=50

# Document Processing
CHUNK_SIZE=500
CHUNK_OVERLAP=50

# Logging Configuration
LOG_LEVEL=INFO
LOG_FILE=./logs/app.log

# Feature Flags
ENABLE_FUNCTION_CALLING=true
ENABLE_STRUCTURED_OUTPUT=true
ENABLE_TOKEN_LOGGING=true

# RAG Configuration
RETRIEVAL_TOP_K=5
SIMILARITY_THRESHOLD=0.7
"""
    
    print("\n🔐 Creating environment configuration...")
    with open(".env", "w") as f:
        f.write(env_content)
    print("   ✅ .env file created")
    print("   ⚠️  Remember to add your OpenAI API key!")


def install_dependencies():
    """Install Python dependencies"""
    print("\n📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("   ✅ Dependencies installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"   ❌ Error installing dependencies: {e}")
        return False
    return True


def create_sample_files():
    """Create sample files for testing"""
    print("\n📄 Creating sample files...")
    
    # Sample document
    sample_doc = """# Sample Study Material

## Introduction to Machine Learning

Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed.

### Key Concepts:
1. **Supervised Learning**: Learning with labeled data
2. **Unsupervised Learning**: Finding patterns in unlabeled data  
3. **Reinforcement Learning**: Learning through interaction and feedback

### Applications:
- Image recognition
- Natural language processing
- Recommendation systems
- Autonomous vehicles

This is a sample document for testing the Smart Study Assistant.
"""
    
    with open("data/sample_documents/sample_ml_notes.md", "w") as f:
        f.write(sample_doc)
    print("   ✅ Sample document created")


def main():
    """Main setup function"""
    print("🚀 Setting up Smart Study Assistant...")
    print("=" * 50)
    
    # Create directories
    create_directories()
    
    # Create Python package files
    create_init_files()
    
    # Create environment file
    create_env_file()
    
    # Create sample files
    create_sample_files()
    
    # Install dependencies
    if install_dependencies():
        print("\n" + "=" * 50)
        print("✅ Setup completed successfully!")
        print("\n📋 Next steps:")
        print("1. Add your OpenAI API key to the .env file")
        print("2. Run: python -c 'from config.config import create_directories; create_directories()'")
        print("3. Test the setup: python src/core/ai_client.py")
        print("\n🎯 Ready to start implementing AI features!")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")


if __name__ == "__main__":
    main()
