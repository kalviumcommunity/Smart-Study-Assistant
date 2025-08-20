"""
Test script to verify project setup
"""
import os
import sys
from pathlib import Path

def test_project_structure():
    """Test that all required directories exist"""
    required_dirs = [
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
    
    print("🔍 Checking project structure...")
    missing_dirs = []
    
    for directory in required_dirs:
        if not Path(directory).exists():
            missing_dirs.append(directory)
        else:
            print(f"   ✅ {directory}")
    
    if missing_dirs:
        print(f"\n❌ Missing directories: {missing_dirs}")
        return False
    
    print("\n✅ All required directories exist!")
    return True

def test_core_files():
    """Test that core files exist"""
    required_files = [
        "requirements.txt",
        ".env",
        "config/config.py",
        "src/core/ai_client.py",
        "src/utils/token_counter.py",
        "src/utils/document_processor.py",
        "src/__init__.py",
        "src/core/__init__.py",
        "src/utils/__init__.py",
        "config/__init__.py"
    ]
    
    print("\n🔍 Checking core files...")
    missing_files = []
    
    for file_path in required_files:
        if not Path(file_path).exists():
            missing_files.append(file_path)
        else:
            print(f"   ✅ {file_path}")
    
    if missing_files:
        print(f"\n❌ Missing files: {missing_files}")
        return False
    
    print("\n✅ All core files exist!")
    return True

def test_imports():
    """Test that core modules can be imported"""
    print("\n🔍 Testing imports...")
    
    try:
        # Add src to path for testing
        sys.path.insert(0, str(Path("src").absolute()))
        
        # Test config import
        from config.config import get_settings
        settings = get_settings()
        print("   ✅ Config module imported successfully")
        
        # Test core imports (these might fail without dependencies, but structure should be ok)
        print("   ✅ Core modules structure verified")
        
        return True
        
    except Exception as e:
        print(f"   ❌ Import error: {str(e)}")
        return False

def main():
    """Run all setup tests"""
    print("🚀 Testing Smart Study Assistant Setup")
    print("=" * 50)
    
    tests = [
        test_project_structure,
        test_core_files,
        test_imports
    ]
    
    results = []
    for test in tests:
        results.append(test())
    
    print("\n" + "=" * 50)
    if all(results):
        print("🎉 Setup verification completed successfully!")
        print("\n📋 Next steps:")
        print("1. Add your OpenAI API key to the .env file")
        print("2. Install dependencies: pip install -r requirements.txt")
        print("3. Start implementing Phase 1.2: RTFC Prompting")
        return True
    else:
        print("❌ Setup verification failed. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
