# sort-algorithm-visualizer

An interactive web application that visually demonstrates how various sorting algorithms work. Watch as data is rearranged step-by-step, helping you understand the mechanics and efficiency of different sorting methods.

## 📦 Features

- Visualize sorting algorithms in action
- Adjustable array size and sorting speed
- Step-by-step progression or full animation
- Clean UI built with ShadcnUI

## 📊 Available Algorithms

| Algorithm   | Type              | Avg. Time Complexity | Worst Case |
|-------------|-------------------|----------------------|------------|
| **Bitonic** | Parallel, Divide & Conquer | O(n log² n) | O(n log² n) |
| **Bogo**    | Randomized        | O(n·n!)              | Unbounded  |
| **Bubble**  | Comparison-based  | O(n²)                | O(n²)      |
| **Cocktail**| Comparison-based  | O(n²)                | O(n²)      |
| **Cycle**   | Comparison-based  | O(n²)                | O(n²)      |
| **Exchange**| Comparison-based  | O(n²)                | O(n²)      |
| **Gnome**   | Comparison-based  | O(n²)                | O(n²)      |
| **Heap**    | Comparison-based  | O(n log n)           | O(n log n) |
| **Insertion**| Comparison-based | O(n²)                | O(n²)      |
| **Merge**   | Divide & Conquer  | O(n log n)           | O(n log n) |
| **Odd-Even**| Comparison-based  | O(n²)                | O(n²)      |
| **Pancake** | Comparison-based  | O(n) flips           | O(n) flips |
| **Quick**   | Divide & Conquer  | O(n log n)           | O(n²)      |
| **Radix LSD** | Non-comparison  | O(n·k)               | O(n·k)     |
| **Radix MSD** | Non-comparison  | O(n·k)               | O(n·k)     |
| **Selection**| Comparison-based | O(n²)                | O(n²)      |
| **Shell**   | Comparison-based  | O(n log² n)          | O(n²)      |
| **Stooge**  | Recursive joke    | O(n^(2.7095))        | O(n^(2.7095)) |
| **Tim**     | Hybrid (Merge + Insertion) | O(n log n) | O(n log n) |


## 🚀 Getting Started

### Installation & Running

## ⚡ Prerequisites

Make sure you have the following installed:

- Node.js
- pnpm

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tspaja2025/sort-algorithm-visualizer.git
    cd sort-algorithm-visualizer
    pnpm install
    pnpm dev
    ```

2.  **Open it in your browser:**
    *  `http://localhost:3000`

## 🛠️ Technology Stack

*   **Framework:** Next.js
*   **Visualization:** HTML5 Canvas
*   **Styling:** ShadcnUI

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

*   Inspiration from other visualizers like [visualgo.net](https://visualgo.net/en/sorting) and  [sortvisualizer.com](https://www.sortvisualizer.com/)
*   Algorithms and pseudocode from various educational resources (e.g., CLRS, Wikipedia)
