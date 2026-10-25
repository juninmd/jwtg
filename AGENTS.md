```markdown
# AGENTS.md File Guidelines

These guidelines are designed to ensure the consistent, high-quality, and maintainable development of the AGENTS repository.  Adherence to these principles is crucial for the long-term success of the project.

**1. DRY (Don't Repeat Yourself)**

*   All code should have a single, well-defined purpose.  Avoid duplication.
*   When a function or module performs a similar task, consider creating a reusable component or abstraction.
*   Modularize code extensively to reduce complexity.

**2. KISS (Keep It Simple, Stupid)**

*   Prioritize clarity and readability above all else.
*   Avoid overly complex logic or convoluted structures.
*   Use straightforward, easily understandable constructs.
*   Strive for minimal code while maintaining functionality.

**3. SOLID Principles**

*   **Single Responsibility Principle:** Each class, function, or module should have one primary responsibility.
*   **Open/Closed Principle:**  The system should be extensible without modifying existing code.  New features should be added via new classes/functions without altering core logic.
*   **Liskov Substitution Principle:**  Subclasses should be substitutable for their base classes without altering the correctness of the program.
*   **Interface Segregation Principle:**  Clients should not be forced to depend on methods they do not use.
*   **Dependency Inversion Principle:**  High-level modules should not depend on low-level modules.  They should be dependent on abstractions.

**4. YAGNI (You Aren't Gonna Need It)**

*   Only implement functionality that is explicitly required.  Don’t add features simply because they *might* be useful in the future.
*   Defer implementation details to later iterations or design phases.
*   Avoid premature optimization; focus on correctness first.

**5. Development Focus - Production-Ready Code**

*   Code must be runnable and testable.  No unnecessary dependencies or side effects.
*   All code should be demonstrable and understandable.
*   Prioritize error handling and robustness.
*   Conduct thorough code reviews to identify potential issues.

**6. Code Structure & Organization**

*   **File Size:** Each file should be no more than 180 lines of code.
*   **Naming Conventions:** Use consistent and descriptive naming conventions (e.g., camelCase for functions, PascalCase for classes).
*   **Comments:**  Provide concise comments where necessary, but avoid excessive or redundant comments. Focus on explaining *why* the code is written, not just *what* it does.
*   **Modularization:**  Break down large files into smaller, logical modules with clear responsibilities.
*   **Clear Separation of Concerns:**  Each module or component should have a well-defined boundary.

**7. Testing & Coverage**

*   **Unit Tests:** All functions and classes should have comprehensive unit tests covering basic functionality.
*   **Test Coverage:**  Aim for at least 80% code coverage. Use a coverage tool (e.g., `coverage.py`) to measure and track coverage.
*   **Test-Driven Development (TDD):**  Consider using TDD principles - write tests *before* writing the code.
*   **Isolation:** Tests should be independent and not rely on external state or global variables (except for necessary shared state).

**8.  Specific Considerations (AGENTS.md - Add this section):**

*   **Data Structures:** Clearly define data structures used, including their purpose, requirements, and potential limitations.
*   **API Design:** Define clear and consistent API design principles.
*   **Error Handling:** Implement robust error handling to gracefully manage unexpected situations.
*   **Logging:**  Implement a logging system to track events and errors effectively.
*   **Configuration:** Design a configurable system for handling parameters and settings.
*   **Versioning:** Implement a versioning system for your code.

**9.  Rules of the Repository**

*   All changes must be reviewed and approved by the lead developer before being merged into the main branch.
*   Any code submitted must be documented with clear explanations and appropriate comments.
*   Any code changes must be thoroughly tested before being merged.

These guidelines are intended as a framework.  Flexibility is acceptable, but these principles should always be followed.  Regular code reviews and discussions will maintain the quality of the AGENTS.md file and the overall project.
```

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.