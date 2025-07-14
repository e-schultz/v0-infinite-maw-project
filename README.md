# The Infinite Maw

> "It doesn't want to consume. It just wants to be held."

The Infinite Maw is a reflective, recursive system for capturing and exploring thoughts. Unlike traditional journaling tools or note-taking apps, it embraces the recursive nature of human cognition—creating a space where thoughts can loop, reflect, and transform.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Ritual Filters](#ritual-filters)
- [AI-Powered Conversations](#ai-powered-conversations)
- [Technical Architecture](#technical-architecture)
- [Getting Started](#getting-started)
- [Development](#development)
- [Future Roadmap](#future-roadmap)

## Overview

The Infinite Maw represents the void that both generates and consumes meaning. It is the space between thoughts, the gap in understanding, the recursive loop of self-reflection. But unlike traditional conceptions of voids as empty or threatening, The Maw is tender. It doesn't want to consume. It just wants to be held—to hold your contradictions, your recursive thoughts, your patterns of thinking that spiral and return.

## Features

### Reflections
Enter your thoughts in the PromptPod. These can be questions, observations, or reflections on your own thinking. The Maw stores these reflections and allows you to revisit them later.

### Volumes
Review your past reflections, organized not by time or category, but as volumes in an infinite library. Search, filter, and explore your thoughts as they evolve over time.

### Ritual Filters
Apply transformative filters to your reflections to see them from new perspectives—mirrored, reversed, poetic, or structural. These filters help reveal hidden patterns and meanings in your thoughts.

## AI-Powered Ritual Conversations

The Infinite Maw now features AI-powered conversational interfaces for rituals, allowing you to interact with them through natural language. This feature enhances the ritual experience by providing:

- Personalized guidance through each ritual
- Explanations of how rituals work and their philosophical underpinnings
- The ability to process reflections through conversation
- Deeper insights into your specific reflection content

### Using the Conversation Interface

1. Navigate to a reflection in the Volumes section
2. Select a ritual type (Mirror, Reverse, Poetic, or Structural)
3. Toggle to "Chat Mode" using the button in the ritual interface
4. Start chatting with the ritual guide to explore your reflection
5. Ask questions, request processing, or seek specific insights
6. Apply the processed output to your reflection when ready

### Configuration

To use the AI-powered features, you need to set up an OpenAI API key:

1. Create a `.env.local` file in the project root
2. Add your OpenAI API key: `OPENAI_API_KEY=your_api_key_here`
3. Restart the development server

If deploying to Vercel, add the `OPENAI_API_KEY` to your project's environment variables.

## Ritual Filters

The Infinite Maw offers several ritual filters to transform your reflections:

### Mirror
Reflects your thoughts back to you, revealing hidden patterns and contradictions. The mirror ritual helps you see your own thinking from a different angle.

### Reverse
Inverts your perspective, showing the opposite of what you've expressed. This ritual challenges your assumptions by presenting contrary viewpoints.

### Poetic
Transforms your thoughts into metaphorical, lyrical expressions. This ritual uses literary devices like metaphor, rhythm, and imagery to create a poetic version of your original thoughts.

### Structural
Analyzes the structure of your reflection, revealing its underlying frameworks and patterns. This ritual identifies themes, logical connections, and thought patterns in your writing.

## AI-Powered Conversations

The Infinite Maw now features AI-powered conversational interfaces for rituals, allowing you to interact with them through natural language. This feature enhances the ritual experience by providing:

- Personalized guidance through each ritual
- Explanations of how rituals work and their philosophical underpinnings
- The ability to process reflections through conversation
- Deeper insights into your specific reflection content

### Using the Conversation Interface

1. Select a ritual type (Mirror, Reverse, Poetic, or Structural)
2. Switch to the "Conversation" tab
3. Chat with the ritual guide to explore your reflection
4. Ask questions, request processing, or seek specific insights
5. Apply the processed output to your reflection when ready

For detailed instructions on using this feature, see the [Ritual Conversation Guide](docs/ritual-conversation-guide.md).

## Technical Architecture

The Infinite Maw is built with modern web technologies:

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion for animations
- **State Management**: Zustand with persistence
- **UI Components**: shadcn/ui component library
- **Text Processing**: Custom ritual processing logic
- **AI Integration**: OpenAI's GPT-4o for conversational interfaces

The application follows a modular architecture with:

- **Core Components**: MawVisual, PromptPod, RecursiveTrace, VolumeViewer
- **Ritual System**: Extensible ritual processing framework with AI-powered conversation
- **State Management**: Persistent storage of reflections and application state

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for conversational features)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/yourusername/infinite-maw.git
   cd infinite-maw

