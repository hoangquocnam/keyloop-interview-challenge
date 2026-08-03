# 07. Use of Generative AI in the Design Phase

## Purpose

This section explains how Generative AI was used to support the design phase of the project.

Generative AI was used as a design assistant rather than as a decision-maker.

## How Generative AI assisted

- clarifying the product scope
- structuring the MVP around the required user workflow
- drafting and organizing the first-pass design documentation
- refining the UI direction for the main screens
- comparing lightweight implementation options for the frontend and backend
- identifying what should remain out of scope for the first version

The tools used during this phase included `Gemini`, `Stitch`, and `Codex`.

### Tool usage by design activity

| Tool | Primary use in the design phase |
| --- | --- |
| `Gemini` | early ideation, requirement framing, and exploring alternative ways to scope the MVP |
| `Stitch` | UI and design exploration, especially for the overall look and direction of the main workflow screens |
| `Codex` | architecture planning, documentation drafting, technical tradeoff discussion, and structuring the system design artifacts |

## What remained a human decision

Generative AI did not replace engineering judgment.

Final decisions still required manual review and explicit choice for:

- the actual MVP boundary
- which features were deferred
- stack selection and architectural simplicity
- the decision to use Ant Design for UI and MobX for client or business state
- the choice to keep the backend lightweight rather than artificially overengineering it
- how much observability to include in the MVP

Human implementation responsibility remained essential.

The final application code, implementation structure, and engineering decisions were still written, reviewed, and owned by a human developer rather than being delegated entirely to AI.

## Practical benefit

Using Generative AI helped accelerate:

- project framing
- MVP scoping
- documentation drafting
- tradeoff comparison
- UI direction definition
- first-pass system design structure

## Note

Generative AI was used to support planning and design efficiency, but the final architecture, scope, and technical direction remained deliberate engineering decisions.
