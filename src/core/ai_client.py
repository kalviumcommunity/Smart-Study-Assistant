"""
Main AI Client for Smart Study Assistant
Handles all OpenAI API interactions with parameter tuning capabilities
"""
import openai
from typing import List, Dict, Any, Optional, Union
from loguru import logger
import json
import time
from config.config import get_settings

settings = get_settings()


class AIClient:
    """
    Main AI client with comprehensive parameter control and token logging
    """
    
    def __init__(self):
        """Initialize the AI client with OpenAI configuration"""
        openai.api_key = settings.openai_api_key
        self.model = settings.openai_model
        self.embedding_model = settings.embedding_model
        self.token_usage = {"total_tokens": 0, "prompt_tokens": 0, "completion_tokens": 0}
        
        logger.info(f"🤖 AI Client initialized with model: {self.model}")
    
    def generate_response(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        top_p: Optional[float] = None,
        stop_sequences: Optional[List[str]] = None,
        functions: Optional[List[Dict]] = None,
        function_call: Optional[Union[str, Dict]] = None
    ) -> Dict[str, Any]:
        """
        Generate AI response with full parameter control
        
        Args:
            messages: List of message dictionaries
            temperature: Controls randomness (0.0 to 2.0)
            max_tokens: Maximum tokens to generate
            top_p: Nucleus sampling parameter
            stop_sequences: Sequences where generation should stop
            functions: Available functions for function calling
            function_call: Function calling configuration
            
        Returns:
            Dictionary containing response and metadata
        """
        # Use settings defaults if parameters not provided
        temperature = temperature or settings.temperature
        max_tokens = max_tokens or settings.max_tokens
        top_p = top_p or settings.top_p
        
        try:
            start_time = time.time()
            
            # Prepare API call parameters
            api_params = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "top_p": top_p,
            }
            
            # Add optional parameters
            if stop_sequences:
                api_params["stop"] = stop_sequences
            if functions and settings.enable_function_calling:
                api_params["functions"] = functions
                if function_call:
                    api_params["function_call"] = function_call
            
            # Make API call
            response = openai.ChatCompletion.create(**api_params)
            
            # Calculate response time
            response_time = time.time() - start_time
            
            # Log token usage
            if settings.enable_token_logging:
                self._log_token_usage(response.usage, response_time)
            
            # Extract response content
            message = response.choices[0].message
            
            result = {
                "content": message.get("content", ""),
                "function_call": message.get("function_call"),
                "usage": response.usage,
                "response_time": response_time,
                "model": self.model,
                "parameters": {
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "top_p": top_p,
                    "stop_sequences": stop_sequences
                }
            }
            
            logger.info(f"✅ Generated response in {response_time:.2f}s")
            return result
            
        except Exception as e:
            logger.error(f"❌ Error generating response: {str(e)}")
            raise
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for given text
        
        Args:
            text: Input text to embed
            
        Returns:
            List of embedding values
        """
        try:
            response = openai.Embedding.create(
                model=self.embedding_model,
                input=text
            )
            
            embedding = response['data'][0]['embedding']
            
            # Log token usage for embeddings
            if settings.enable_token_logging:
                self.token_usage["total_tokens"] += response.usage.total_tokens
                logger.debug(f"📊 Embedding tokens used: {response.usage.total_tokens}")
            
            return embedding
            
        except Exception as e:
            logger.error(f"❌ Error generating embedding: {str(e)}")
            raise
    
    def _log_token_usage(self, usage: Any, response_time: float):
        """Log token usage statistics"""
        self.token_usage["total_tokens"] += usage.total_tokens
        self.token_usage["prompt_tokens"] += usage.prompt_tokens
        self.token_usage["completion_tokens"] += usage.completion_tokens
        
        logger.info(
            f"📊 Token Usage - "
            f"Prompt: {usage.prompt_tokens}, "
            f"Completion: {usage.completion_tokens}, "
            f"Total: {usage.total_tokens}, "
            f"Time: {response_time:.2f}s"
        )
    
    def get_token_usage_summary(self) -> Dict[str, int]:
        """Get cumulative token usage summary"""
        return self.token_usage.copy()
    
    def reset_token_usage(self):
        """Reset token usage counters"""
        self.token_usage = {"total_tokens": 0, "prompt_tokens": 0, "completion_tokens": 0}
        logger.info("🔄 Token usage counters reset")


# Global AI client instance
ai_client = AIClient()


def get_ai_client() -> AIClient:
    """Get the global AI client instance"""
    return ai_client
