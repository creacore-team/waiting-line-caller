# Waiting line caller (with voices)

## Description

Basic queue manager to call a number sequence with NodeJS. You can connect multiple clients (desk) for calling numbers and run a counter state viewer. Every number will be announced with a TTS voice using a predefined random sentence.

## Usage

Install dependencies with

    npm i

After that you can run the main.js script with

    node main.js

The server will start and open two access (default port: 8080)

- http://<IP>:8080/client
- http://<IP>:8080/viewer

### Client

Enter your username and click on the "connect" button. Then you will able to call the next number or to set the counter at a custom value.

### Viewer

Display the last 5 numbers called.

When a new number is called, a Google TTS voice will start.

You can customize the sentences used in the main.js file (sentences_callNext)


Enjoy !