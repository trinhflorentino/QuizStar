import os
import subprocess
import shutil
import stat

def obfuscate_js_files(src_directory, dest_directory):
    # Ensure the destination directory exists
    if not os.path.exists(dest_directory):
        os.makedirs(dest_directory)

    for root, dirs, files in os.walk(src_directory):
        # Skip node_modules directory
        if 'node_modules' in root:
            continue

        # Create the corresponding directory structure in the destination directory
        relative_path = os.path.relpath(root, src_directory)
        dest_root = os.path.join(dest_directory, relative_path)
        if not os.path.exists(dest_root):
            os.makedirs(dest_root)
        
        for file in files:
            src_file_path = os.path.join(root, file)
            dest_file_path = os.path.join(dest_root, file)
            
            if file.endswith('.js'):
                # Obfuscate JavaScript file
                obfuscated_path = dest_file_path.replace('.js', '.obf.js')
                subprocess.run(['C:\\Users\\anhkh\\AppData\\Roaming\\npm\\javascript-obfuscator.cmd', src_file_path, '--output', obfuscated_path])
                os.rename(obfuscated_path, dest_file_path)
            else:
                # Copy other files
                shutil.copy2(src_file_path, dest_file_path)

def deploy_to_firebase():
    firebase_path = 'C:\\Users\\anhkh\\AppData\\Roaming\\npm\\firebase.cmd'
    try:
        subprocess.run([firebase_path, 'use', 'the-olympus-online'], check=True)
        subprocess.run([firebase_path, 'deploy', '--only', 'hosting'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred during Firebase deployment: {e}")
        raise

def remove_readonly(func, path, excinfo):
    os.chmod(path, stat.S_IWRITE)
    func(path)

def main():
    project_directory = 'D:\\sub\\theolympusonline'
    deployment_directory = 'D:\\sub\\theolympusonline-deployment'

    # Check if the deployment directory already exists
    if os.path.exists(deployment_directory):
        print(f'Deployment directory {deployment_directory} already exists.')
        
        # Change directory to the deployment directory for Firebase deployment
        os.chdir(deployment_directory)

        # Deploy to Firebase
        deploy_to_firebase()

        # Change directory back to the original
        os.chdir(project_directory)

        # Delete the deployment directory
        shutil.rmtree(deployment_directory, onerror=remove_readonly)
        print(f'Deployment directory {deployment_directory} has been deleted.')
    else:
        # Obfuscate JavaScript files and copy the project to the deployment directory
        obfuscate_js_files(project_directory, deployment_directory)
        print(f'Project obfuscated and copied to {deployment_directory}')

        # Change directory to the deployment directory for Firebase deployment
        os.chdir(deployment_directory)

        # Deploy to Firebase
        deploy_to_firebase()

        # Change directory back to the original
        os.chdir(project_directory)

        # Delete the deployment directory
        shutil.rmtree(deployment_directory, onerror=remove_readonly)
        print(f'Deployment directory {deployment_directory} has been deleted.')

if __name__ == '__main__':
    main()