# Syncsafe

**Syncsafe** is a decentralized, privacy-preserving calendar matching system built on the Internet Computer Protocol (ICP). It allows users to schedule meetings securely by finding optimal time slots without exposing individual calendars. Syncsafe leverages a privacy-focused algorithm for scheduling and is powered by Next.js on the frontend and Motoko on the backend.

---

## Features

- **Privacy-First Scheduling**: Compute optimal meeting times without revealing individual availability.
- **Decentralized Authentication**: Secure login using Internet Identity, ensuring privacy and security.
- **User-Friendly Interface**: Intuitive dashboard for managing meetings and preferences.
- **Scalable & Secure Backend**: ICP canisters enable privacy-preserving computations at scale.
- **Optimized Matching Algorithm**: Determines the best available meeting slot using efficient aggregation and preference scoring.
- **Decentralized Hosting**: Built on ICP, ensuring censorship resistance and high availability.

---

## Project Structure

```
syncsafe/
├── app/                  # Next.js application directory
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Main dashboard page
├── components/           # Reusable React components
│   ├── availability-selector.tsx  # Time slot selection UI
│   ├── calendar.tsx      # Calendar visualization
│   ├── header.tsx        # Navigation bar
│   └── meeting-form.tsx  # Meeting creation form
├── hooks/                # Custom React hooks
│   └── use-auth.tsx      # Internet Identity authentication
├── backend/              # ICP canister code
│   ├── main.mo           # Core canister logic
│   ├── types.mo          # Data type definitions
│   ├── utils.mo          # Helper functions
│   └── dfx.json          # ICP configuration file
└── README.md             # Project documentation
```

---

## How It Works

1. **Sign In:** Authenticate securely using Internet Identity.
2. **Create a Meeting:** Organizers invite participants by their principal IDs.
3. **Set Availability:** Participants rate time slots (0 for unavailable; 1–5 for preference level).
4. **Privacy-Preserving Matching:** The ICP canister:
   - Encodes availability as preference vectors.
   - Aggregates preferences, ignoring slots with any "0" ratings.
   - Selects the slot with the highest total preference score.
5. **Finalize:** The organizer confirms the meeting, and all participants are notified automatically.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [DFX](https://internetcomputer.org/docs/current/developer-tools/install-upgrade-remove) (Internet Computer SDK)
- [IC Wallet](https://internetcomputer.org/docs/current/developer-tools/deploy/ledger-quickstart) (for deployment)

### Local Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/syncsafe.git
   cd syncsafe
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Start the Local ICP Replica:**
   ```bash
   dfx start --background
   ```
4. **Deploy the Canister:**
   ```bash
   dfx deploy
   ```
5. **Run the Frontend:**
   ```bash
   npm run dev
   ```
6. **Open the App:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment to Production

1. **Build the Frontend:**
   ```bash
   npm run build
   ```
2. **Deploy to ICP Mainnet:**
   ```bash
   dfx deploy --network ic
   ```
3. **Configure Environment:**
   - Create a `.env.local` file with the following variables:
     ```plaintext
     NEXT_PUBLIC_CANISTER_ID=your-canister-id
     NEXT_PUBLIC_IC_HOST=https://ic0.app
     ```

---

## Technical Highlights

### Privacy Algorithm

- **Preference Encoding:** Users rate time slots (0 = unavailable; 1–5 = preference level).
- **Aggregation:** The canister sums preferences per slot, nullifying any slot where a participant has marked "0."
- **Optimization:** The highest aggregate score determines the selected slot using an efficient log-depth algorithm.

### ICP Integration

- **Canisters:** Securely host and execute the scheduling logic.
- **Internet Identity:** Provides decentralized, anonymous authentication.
- **State Persistence:** Ensures data continuity across canister upgrades.

---

## Roadmap

- **Calendar Sync:** Integrate with external calendars (Google, Outlook, etc.).
- **Enhanced Privacy:** Implement secure multi-party computation.
- **Mobile Support:** Develop a companion mobile application.
- **Decentralized Coordination:** Fully on-chain meeting coordination.
- **Custom Preferences:** Advanced scheduling settings for teams and groups.


---

**Made with ❤️ by the Syncsafe Team**
