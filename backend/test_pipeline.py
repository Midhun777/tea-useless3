import os
import sys

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.detection.estimator import run_pipeline

def test():
    img_path = os.path.join(os.path.dirname(__file__), "test_chai.jpg")
    if not os.path.exists(img_path):
        print("test_chai.jpg not found")
        return

    with open(img_path, "rb") as f:
        img_bytes = f.read()

    print("Running multi-scale bubble detection pipeline on test_chai.jpg...")
    result = run_pipeline(img_bytes, sensitivity=5, debug=True)

    print("\n--- Pipeline Detection Results ---")
    print(f"Success: {result.get('success')}")
    print(f"Total Count: {result['count']['total']}")
    print(f"  - Small:  {result['count']['small']}")
    print(f"  - Medium: {result['count']['medium']}")
    print(f"  - Large:  {result['count']['large']}")
    
    print("\n--- Detection Statistics ---")
    for k, v in result['stats'].items():
        print(f"  {k}: {v}")

    if "debug_candidates" in result:
        print("\n--- Debug Candidate Counts ---")
        for k, v in result["debug_candidates"].items():
            print(f"  {k}: {len(v)}")

if __name__ == "__main__":
    test()
