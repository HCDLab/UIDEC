# UIDEC - UI Design Exploration under Constraints

UIDEC is a GenAI-powered creativity support tool that helps UI/UX designers explore design ideas while working within real-world constraints like brand identity, industry standards, and design systems.

Built on [tldraw](https://tldraw.com), UIDEC generates diverse design examples based on project parameters with minimal need for prompt writing.

## Features

- **Constraint-Based Generation**: Specify project details (purpose, target audience, industry, design styles) and generate designs that adhere to these constraints
- **Canvas-Based Exploration**: Organize and arrange generated design ideas on an infinite canvas
- **Element Refinement**: Refine or regenerate specific UI elements within designs
- **Version History**: Navigate through different generated versions
- **Favorites & Collections**: Save and organize design examples for later reference
- **Theme Support**: Apply consistent design themes across generations
- **Lock/Unlock Controls**: Lock colors and fonts to maintain consistency during generation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker (for PocketBase)
- OpenAI API key (Tier 1+ for GPT-4 Vision access) or Anthropic API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HCDLab/UIDEC.git
   cd UIDEC
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start PocketBase:
   ```bash
   docker compose up -d
   ```

4. Set up PocketBase admin:
   - Open http://localhost:8090/_/
   - Create an admin account
   - Collections and seed data are created automatically via migrations

5. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your API keys:
   ```
   OPENAI_API_KEY=your_openai_key
   # or
   ANTHROPIC_API_KEY=your_anthropic_key
   NEXT_PUBLIC_POCKETBASE_URL=http://localhost:8090
   ```

6. Run the development server:
   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### PocketBase Setup

PocketBase migrations run automatically when the container starts. The migrations will:
- Create all required collections
- Seed the `industries` and `screen_types` dropdown data

After starting PocketBase:

1. Open http://localhost:8090/_/ and create an admin account

2. **(Optional)** Populate the `ui_screens` collection with UI screenshot dataset for design references. This dataset contains curated UI screenshots used to provide design inspiration during generation. **To request access to the UI screens dataset, please contact the [HCD Lab](mailto:jinghui.cheng@polymtl.ca).**

#### Required Collections

| Collection | Purpose |
|------------|---------|
| `users` | User authentication (built-in) |
| `industries` | Industry dropdown options |
| `screen_types` | UI screen type options |
| `ui_screens` | UI screenshot dataset for references |
| `favorites` | User's saved favorite designs |
| `saved_canvas` | Saved canvas states |
| `logos` | User uploaded logos |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Canvas**: tldraw
- **Database**: PocketBase
- **Styling**: Tailwind CSS, Radix UI
- **Data Fetching**: React Query
- **AI**: OpenAI GPT-4 Vision / Anthropic Claude

## Citation

If you use UIDEC in your research, please cite our CHI 2025 paper:

```bibtex
@inproceedings{shokrizadeh2025dancing,
  title={Dancing With Chains: Ideating Under Constraints With UIDEC in UI/UX Design},
  author={Shokrizadeh, Atefeh and Tadjuidje, Boniface Bahati and Kumar, Shivam and Kamble, Sohan and Cheng, Jinghui},
  booktitle={Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems},
  year={2025},
  publisher={ACM},
  address={Yokohama, Japan},
  doi={10.1145/3706598.3713785}
}
```

**Paper**: [Dancing With Chains: Ideating Under Constraints With UIDEC in UI/UX Design](https://dl.acm.org/doi/10.1145/3706598.3713785)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [tldraw](https://tldraw.com) by Steve Ruiz and contributors