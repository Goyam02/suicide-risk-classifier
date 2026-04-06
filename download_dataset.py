import kagglehub
import shutil
import os

# Define your project root (current directory)
project_root = os.getcwd()

# Download dataset (goes to kagglehub cache)
cache_path = kagglehub.dataset_download("nikhileswarkomati/suicide-watch")

# Move dataset to project root
dataset_path = os.path.join(project_root, "suicide-watch")

# Remove existing folder if needed (optional)
if os.path.exists(dataset_path):
    shutil.rmtree(dataset_path)

shutil.move(cache_path, dataset_path)

print("Dataset moved to:", dataset_path)