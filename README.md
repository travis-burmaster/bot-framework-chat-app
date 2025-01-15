# Bot Framework Chat Application

A React-based chat application that integrates with the Microsoft Bot Framework using Direct Line API. This application includes token authentication and real-time message updates.

## Features

- Real-time chat interface
- Token-based authentication
- Direct Line API integration
- Automatic token passing to bot
- Clean, responsive UI with Tailwind CSS

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or later)
- npm or yarn
- A Bot Framework bot with Direct Line channel enabled
- Direct Line secret
- User authentication token (if required by your bot)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/travis-burmaster/bot-framework-chat-app.git
   cd bot-framework-chat-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your credentials:
   ```env
   DIRECT_LINE_SECRET=your_directline_secret_here
   USER_TOKEN=your_user_token_here
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
  ├── components/
  │   └── ChatApp.js       # Main chat component
  ├── App.js              # Root component
  ├── index.js            # Entry point
  └── index.css           # Global styles
```

## Configuration

### Direct Line Secret

To get your Direct Line secret:

1. Go to the Azure Portal
2. Navigate to your bot resource
3. Click on 'Channels'
4. Add or configure the Direct Line channel
5. Copy one of the secret keys

### User Token

If your bot requires user authentication:

1. Implement the necessary authentication flow in your application
2. Store the user token in the environment variable
3. The application will automatically pass this token to the bot

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details