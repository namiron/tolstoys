
## Tolstoy

## Description

This application accepts three arbitrary URLs, sends a request to the HTML page, and extracts the following metadata:

- **URL**: The entered URL.
- **Title**: The page title.
- **Description**: The page description.
- **Image**: The page image (usually taken from the `og:image` meta tag).

## Installation and Setup

### 1. Clone the Repository

Clone the repository to your local machine using the following command:

    git clone <repository-url>


### 2. Install Dependencies

Navigate to the project directory and install the necessary dependencies:

      cd <project-directory>
      npm install

### 3. Running the Application

Open two terminal windows and run the following commands in each:

- Frontend: Start the frontend application using Vite:

         npm run dev
  

- Backend: Start the backend server:

      npm run dev
  

Ensure that both applications are running and functioning correctly.

## Usage

After the server is running, you can send POST requests to `/urls/fetch-metadata`, passing a JSON object with the URLs. Example request:

      json
      {
        "urls": {
          "url1": "https://example.com",
          "url2": "https://another-ex.com",
          "url3": "https://yetanother-ex.com"
        }
      }

The response will be an array of objects with metadata for each URL:

        json
      [
        {
          "url": "https://example.com",
          "title": "Example Title",
          "description": "Example Description",
          "image": "example-image.png"
        },
      ]
  

## Testing

### Running Tests

To run the tests, use the following command:

      npm test


The tests check for the correct retrieval of metadata and compliance with CORS rules.

## Additional Information

- **Development Environment**: Vite is used for frontend development.

## Contact

If you have any questions or suggestions, you can contact me via email: [alexandersam.dev@gmail.com].
