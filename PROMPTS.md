# AI Prompts Used in Development

This document contains the AI prompts used during the development of this project.

## Project Setup

**Prompt 1:**
> "create a new nextjs 16 project with typescript. include a README.md and an empty PROMPTS.md file. use node 24. set up the folder struture with an app/ directory, a components/ folder, a hooks/ folder, and a lib/ folder"

## Styling

**Prompt 2:**
> "add global css that sets google sans flex as the default font. keep the design minimal, black text on white background, no extra styilng"

## Components

**Prompt 3:**
> "create a simple chat interface with react components. a MessageList that displays an array of messages, a Message component that renders diferently for user vs assistant messages, a ChatInput with a text field and send button, and a CodeBlock component that displays code with a copy button"

## State Management

**Prompt 4:**
> "create a useChat hook that manages conversation state, sends messages to an api endpoint, and handles streaming responses. it should store messages in state and generate a sesion id on first load"

## API Client

**Prompt 5:**
> "create an api client in lib/api.ts that calls my cloudflare worker endpoints. it should have functions for sending chat messages and fetching robots.txt from a url. the worker url should come from an enviornment variable NEXT_PUBLIC_WORKER_URL"

## System Prompt

**Prompt 6:**
> "write a system prompt that tells the ai how to help with robots.txt files. it should know about syntax like user-agent and disallow, and also know about ai crawlers like gptbot and claudebot"

## README

**Prompt 7:**
> "write a readme that explains what this project is, how to set it up locally, and how to deploy it. include sections for the frontend and the worker"

## Chat History

**Prompt 8:**
> "add a sidebar on the left that shows previous chat sessions. clicking on one should load that conversation and there should be a button to start a new chat"

## Documentation

**Prompt 9:**
> "add all the prompts i gave you during this project to the PROMPTS.md file, formatted with descriptions of what each prompt was for"
