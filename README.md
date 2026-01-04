### Installation & Setup

1.  **Clone the Repository:**
    First, clone the project from your GitHub repository.
    ```bash
    git clone https://github.com/Ox50R0U5H/FashNex.git
    ```

2.  **Navigate to the Project Directory:**
    ```bash
    cd FashNex
    ```

3.  **Create and Activate a Virtual Environment:**
    It is highly recommended to use a virtual environment to isolate project dependencies.
    ```bash
    # Create the virtual environment
    python -m venv venv

    # Activate on Windows
    .\venv\Scripts\activate

    # Activate on macOS/Linux
    source venv/bin/activate
    ```

4.  **Install Required Packages:**
    Install all project dependencies listed in the `requirements.txt` file.
    ```bash
    pip install -r requirements.txt
    ```
    > **Note:** If you don't have a `requirements.txt` file yet, you can create one in your local project (after installing Django and other packages) using the command: `pip freeze > requirements.txt`.

5.  **Apply Database Migrations:**
    This command creates the necessary tables in your database according to the models defined in the project.
    ```bash
    cd backend
    python manage.py migrate
    ```

6.  **Create a Superuser:**
    To access the Django admin panel, you need to create a superuser account.
    ```bash
    python manage.py createsuperuser
    ```
    Follow the prompts to set up your admin username, email, and password.

7.  **Run the Development Server:**
    You're all set! Start the development server.
    ```bash
    python manage.py runserver
    ```
    The project will be available at `http://127.0.0.1:8000/`.

