"""
Token counting and logging utilities
"""
import tiktoken
from typing import List, Dict, Any
from loguru import logger
from datetime import datetime
import json
import os


class TokenCounter:
    """
    Advanced token counting and logging system
    """
    
    def __init__(self, model_name: str = "gpt-3.5-turbo"):
        """Initialize token counter with specific model encoding"""
        self.model_name = model_name
        try:
            self.encoding = tiktoken.encoding_for_model(model_name)
        except KeyError:
            # Fallback to cl100k_base encoding for newer models
            self.encoding = tiktoken.get_encoding("cl100k_base")
        
        self.session_log = []
        logger.info(f"🔢 Token counter initialized for model: {model_name}")
    
    def count_tokens(self, text: str) -> int:
        """
        Count tokens in a text string
        
        Args:
            text: Input text to count tokens for
            
        Returns:
            Number of tokens
        """
        if not text:
            return 0
        
        try:
            tokens = len(self.encoding.encode(text))
            return tokens
        except Exception as e:
            logger.error(f"❌ Error counting tokens: {str(e)}")
            # Fallback: rough estimation (1 token ≈ 4 characters)
            return len(text) // 4
    
    def count_messages_tokens(self, messages: List[Dict[str, str]]) -> int:
        """
        Count tokens in a list of messages (ChatML format)
        
        Args:
            messages: List of message dictionaries
            
        Returns:
            Total number of tokens
        """
        total_tokens = 0
        
        for message in messages:
            # Count tokens for role and content
            total_tokens += 4  # Every message has overhead tokens
            for key, value in message.items():
                total_tokens += self.count_tokens(str(value))
                if key == "name":  # Name field has additional overhead
                    total_tokens += 1
        
        total_tokens += 2  # Every conversation has 2 additional tokens
        return total_tokens
    
    def estimate_cost(self, prompt_tokens: int, completion_tokens: int) -> Dict[str, float]:
        """
        Estimate cost based on token usage
        
        Args:
            prompt_tokens: Number of prompt tokens
            completion_tokens: Number of completion tokens
            
        Returns:
            Dictionary with cost breakdown
        """
        # Pricing as of 2024 (update as needed)
        pricing = {
            "gpt-3.5-turbo": {"prompt": 0.0015, "completion": 0.002},  # per 1K tokens
            "gpt-4": {"prompt": 0.03, "completion": 0.06},
            "gpt-4-turbo": {"prompt": 0.01, "completion": 0.03},
        }
        
        model_pricing = pricing.get(self.model_name, pricing["gpt-3.5-turbo"])
        
        prompt_cost = (prompt_tokens / 1000) * model_pricing["prompt"]
        completion_cost = (completion_tokens / 1000) * model_pricing["completion"]
        total_cost = prompt_cost + completion_cost
        
        return {
            "prompt_cost": prompt_cost,
            "completion_cost": completion_cost,
            "total_cost": total_cost,
            "currency": "USD"
        }
    
    def log_usage(
        self,
        operation: str,
        prompt_tokens: int,
        completion_tokens: int,
        total_tokens: int,
        response_time: float,
        metadata: Dict[str, Any] = None
    ):
        """
        Log token usage for an operation
        
        Args:
            operation: Name of the operation
            prompt_tokens: Number of prompt tokens
            completion_tokens: Number of completion tokens
            total_tokens: Total number of tokens
            response_time: Response time in seconds
            metadata: Additional metadata
        """
        cost_info = self.estimate_cost(prompt_tokens, completion_tokens)
        
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "operation": operation,
            "model": self.model_name,
            "tokens": {
                "prompt": prompt_tokens,
                "completion": completion_tokens,
                "total": total_tokens
            },
            "cost": cost_info,
            "response_time": response_time,
            "metadata": metadata or {}
        }
        
        self.session_log.append(log_entry)
        
        logger.info(
            f"📊 {operation} - "
            f"Tokens: {total_tokens} "
            f"(P:{prompt_tokens}, C:{completion_tokens}) | "
            f"Cost: ${cost_info['total_cost']:.4f} | "
            f"Time: {response_time:.2f}s"
        )
    
    def get_session_summary(self) -> Dict[str, Any]:
        """Get summary of current session token usage"""
        if not self.session_log:
            return {"total_operations": 0, "total_tokens": 0, "total_cost": 0.0}
        
        total_tokens = sum(entry["tokens"]["total"] for entry in self.session_log)
        total_cost = sum(entry["cost"]["total_cost"] for entry in self.session_log)
        total_operations = len(self.session_log)
        
        return {
            "total_operations": total_operations,
            "total_tokens": total_tokens,
            "total_cost": total_cost,
            "average_tokens_per_operation": total_tokens / total_operations,
            "average_cost_per_operation": total_cost / total_operations,
            "model": self.model_name
        }
    
    def save_session_log(self, filepath: str = None):
        """Save session log to file"""
        if not filepath:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filepath = f"logs/token_usage_{timestamp}.json"
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w') as f:
            json.dump({
                "session_summary": self.get_session_summary(),
                "detailed_log": self.session_log
            }, f, indent=2)
        
        logger.info(f"💾 Token usage log saved to: {filepath}")
    
    def clear_session_log(self):
        """Clear the current session log"""
        self.session_log = []
        logger.info("🗑️ Session log cleared")


# Global token counter instance
token_counter = TokenCounter()


def get_token_counter() -> TokenCounter:
    """Get the global token counter instance"""
    return token_counter
