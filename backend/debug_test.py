import os
import sys
from api.math_solver import MathSolver

def test_solver():
    print("=== Start Testing Math Solver ===")
    
    # 1. Initialize solver
    print("Initializing solver...")
    solver = MathSolver()
    
    # 2. Check model loading status
    print(f"Model loading status: {'Success' if solver.model is not None else 'Failed'}")
    print(f"Tokenizer loading status: {'Success' if solver.tokenizer is not None else 'Failed'}")
    
    # 3. Test different types of input
    test_cases = [
        "2+2",
        "x^2-4=0",
        "simplify (x+1)^2"
    ]
    
    for i, test_input in enumerate(test_cases):
        print(f"\nTest {i+1}: {test_input}")
        print(f"Input type: {type(test_input)}")
        
        try:
            # 4. Check AI model call
            print("Calling AI model...")
            prompt = solver._create_prompt(test_input)
            print(f"Generated prompt: {prompt[:100]}...")
            
            # If model loaded successfully, test generation
            if solver.model and solver.tokenizer:
                try:
                    print("Start generating answer...")
                    response = solver._generate_answer(prompt)
                    print(f"AI original response: {response[:100]}...")
                    
                    # Parse response
                    print("Parsing AI response...")
                    result = solver._parse_response(response, test_input)
                    print(f"Parsed result: {result}")
                    
                    # Validate result
                    print(f"Result validity: {solver._validate_result(result)}")
                except Exception as e:
                    print(f"AI processing error: {str(e)}")
            else:
                print("Model not loaded, skipping generation test")
            
            # 5. Test complete solving process
            print("\nTesting complete solving process...")
            result = solver.solve(test_input)
            print(f"Result source: {result.get('source', 'Unknown')}")
            print(f"Final result: {result}")
            
        except Exception as e:
            print(f"Test failed: {str(e)}")
            
    print("\n=== Testing Complete ===")

if __name__ == "__main__":
    test_solver() 