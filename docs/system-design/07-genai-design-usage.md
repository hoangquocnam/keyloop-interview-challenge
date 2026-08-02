# 07. Use of Generative AI in the Design Phase

## Purpose

This section explains how Generative AI was used to support the design phase of the project.

The intent of this section is not to claim that Generative AI designed the system automatically.

Instead, it documents how Generative AI was used as an assistant during planning, scoping, documentation, and early UX direction.

## AI tools used

The design phase used a small set of Generative AI tools for different purposes:

- `Gemini` for ideation, requirement framing, and alternative thinking during early planning
- `Stitch` for design exploration and UI direction support
- `Codex` for implementation-oriented planning, architecture drafting, documentation structuring, and technical tradeoff discussion

## Design-phase use cases

Generative AI was used in the design phase for the following tasks:

- clarifying the product scope
- reducing the initial solution space
- structuring the MVP around the required user workflow
- outlining the system design document sections
- drafting the project brief and early architecture notes
- refining the UI direction for the main workflow screens
- comparing lightweight implementation options for the frontend and backend stack
- identifying what should remain out of scope for the first version

## Specific ways GenAI assisted this project

### 1. Scope clarification

Generative AI helped convert the original challenge statement into a more concrete MVP definition.

This included:

- identifying the primary user as the salesperson
- narrowing the product to inbox, detail, activity logging, and status updates
- separating must-have features from optional future additions

### 2. Architecture framing

Generative AI helped turn a broad fullstack idea into a simple architecture that remained appropriate for an interview challenge.

This included:

- keeping the system as a single frontend plus single backend plus single database
- avoiding unnecessary distributed-system complexity
- clarifying the responsibilities of the client, API, ORM, and database layers

### 3. Documentation drafting

Generative AI assisted with producing first-pass documentation artifacts that were then refined manually.

This included drafting or structuring:

- the project brief
- the design direction document
- the system design sections for architecture, components, data flow, technology decisions, and observability

### 4. UI and design-system direction

Generative AI helped shape the initial design direction for the frontend.

This included:

- emphasizing an internal-tool visual language rather than a marketing style
- prioritizing lead inbox and lead detail pages
- defining a monochrome theme with semantic status colors
- identifying the main UI states and component patterns that should be present in the MVP

### 5. Technology tradeoff exploration

Generative AI was used to compare implementation options while keeping the solution lightweight.

Examples include:

- choosing a lightweight monorepo setup
- evaluating UI library options such as Ant Design versus alternative component libraries
- discussing client-state direction and frontend architecture boundaries

## Outputs influenced by GenAI

Generative AI contributed to the early drafting or refinement of the following design-phase outputs:

- `PROJECT_BRIEF.md`
- `DESIGN.md`
- `docs/system-design/01-overview.md`
- `docs/system-design/02-architecture-diagram.md`
- `docs/system-design/03-components.md`
- `docs/system-design/04-data-flow.md`
- `docs/system-design/05-technology-decisions.md`
- `docs/system-design/06-observability.md`
- this `GenAI Design Usage` section itself

## What remained a human decision

Generative AI did not replace engineering judgment or ownership of the final design.

The final decisions still required manual review and explicit choice for:

- the actual MVP boundary
- which features were deferred
- stack selection and architectural simplicity
- the decision to use Ant Design for UI and MobX for client or business state
- the choice to keep the backend lightweight rather than artificially overengineering it
- how much observability to include in the MVP

## Review and validation process

Generative AI suggestions were treated as draft proposals rather than final decisions.

Each significant suggestion was reviewed against:

- the interview challenge requirements
- the intended scope and time budget
- maintainability
- implementation realism
- appropriateness for a dealership sales workflow

Only suggestions that matched those constraints were kept.

## Practical benefit of using Generative AI

Using Generative AI helped accelerate:

- project framing
- MVP scoping
- documentation drafting
- tradeoff comparison
- UI direction definition
- first-pass system design structure

## Limitations

Generative AI outputs were useful for acceleration, but they were not accepted blindly.

Potential risks included:

- suggesting more complexity than the challenge needed
- producing generic architecture language without enough project specificity
- proposing tools or patterns that were not justified by the MVP scope

For that reason, all outputs were filtered through manual review before being included in the final design documentation.

## Review note

Generative AI should be understood here as a design assistant that improved speed and structure during planning.

The final architecture, scope, and technical direction remain deliberate engineering choices rather than direct tool output.
